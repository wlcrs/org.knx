'use strict';

const ColorConverter = require('color-convert');

const KNXGenericDevice = require('../../lib/GenericKNXDevice');
const DatapointTypeParser = require('../../lib/DatapointTypeParser');

class KNXRGBW extends KNXGenericDevice {

  onInit() {
    this._KNXToggleEventHandler = this.onKNXToggleEvent.bind(this);
    this._KNXRGBWEventHandler = this.onKNXRGBWEvent.bind(this);

    this._rgbwTimeout = null;
    this._rgbwTimeoutInterval = 500;

    super.onInit();

    this._onOffEventHandlerObject = { r: false, g: false, b: false, w: false };
    this._onOffEventHandlerObject.r = this.getCapabilityValue('onoff') || false;
    this._onOffEventHandlerObject.g = this.getCapabilityValue('onoff') || false;
    this._onOffEventHandlerObject.b = this.getCapabilityValue('onoff') || false;
    this._onOffEventHandlerObject.w = this.getCapabilityValue('onoff') || false;

    this._hsvEventHandlerObject = { h: 0, s: 0, v: 0 };
    this._hsvEventHandlerObject.h = this.getCapabilityValue('light_hue') || 0;
    this._hsvEventHandlerObject.s = this.getCapabilityValue('light_saturation') || 0;
    this._hsvEventHandlerObject.v = this.getCapabilityValue('dim') || 0;

    // Raw RGBW values as received from the KNX bus (used for reverse conversion)
    this._rgbwBusValues = { r: 0, g: 0, b: 0, w: 0 };

    this.registerCapabilityListener('onoff', this.onCapabilityOnOff.bind(this));
    this.registerMultipleCapabilityListener(['dim', 'light_hue', 'light_saturation'], this.onCapabilityHSV.bind(this), 500);
  }

  // Override because of non-shared capabilities
  setKNXInterface(knxInterface) {
    if (knxInterface !== undefined) {
      this.knxInterface = knxInterface;

      // Add the handlers.
      this.knxInterface.onKNXConnectionListener(this.KNXConnectionHandler);

      // On/off event listeners
      this.knxInterface.addKNXEventListener(this.settings.ga_red_toggle_status,
        this._KNXToggleEventHandler);
      this.knxInterface.addKNXEventListener(this.settings.ga_green_toggle_status,
        this._KNXToggleEventHandler);
      this.knxInterface.addKNXEventListener(this.settings.ga_blue_toggle_status,
        this._KNXToggleEventHandler);
      this.knxInterface.addKNXEventListener(this.settings.ga_white_toggle_status,
        this._KNXToggleEventHandler);

      // RGBW value event listeners
      this.knxInterface.addKNXEventListener(this.settings.ga_red_dim_status,
        this._KNXRGBWEventHandler);
      this.knxInterface.addKNXEventListener(this.settings.ga_green_dim_status,
        this._KNXRGBWEventHandler);
      this.knxInterface.addKNXEventListener(this.settings.ga_blue_dim_status,
        this._KNXRGBWEventHandler);
      this.knxInterface.addKNXEventListener(this.settings.ga_white_dim_status,
        this._KNXRGBWEventHandler);

      this.log('Using interface:', this.knxInterface.name, this.knxInterface.getConnectedIPAddress());
      this.setSettings({
        ipAddress: this.knxInterface.getConnectedIPAddress(),
      });

      // Connect the interface. This is safe, because the object is already created and thus verified.
      this.knxInterface._connectKNX();

      // Make the device available since we have a KNX interface
      this.setAvailable();
    }
  }

  /**
   * On init of the device, request the status from the KNX network
   *
   * @param connectionStatus
   */
  onKNXConnection(connectionStatus) {
    super.onKNXConnection(connectionStatus);

    if (connectionStatus === 'connected') {
      this.readSettingAddress([
        'ga_red_toggle_status',
        'ga_green_toggle_status',
        'ga_blue_toggle_status',
        'ga_white_toggle_status',
      ]).catch((readError) => {
        this.log('onKNXConnection error', readError);
      });

      this.readSettingAddress([
        'ga_red_dim_status',
        'ga_green_dim_status',
        'ga_blue_dim_status',
        'ga_white_dim_status',
      ]).catch((readError) => {
        this.log('onKNXConnection error', readError);
      });
    }
  }

  /**
   * Toggle event handler
   *
   * @param groupAddress
   * @param data
   * @returns {Promise<void>}
   */
  async onKNXToggleEvent(groupAddress, data) {
    if (data) {
      const value = DatapointTypeParser.bitFormat(data);

      if (groupAddress === this.settings.ga_red_toggle_status) {
        this._onOffEventHandlerObject.r = value;
      }
      if (groupAddress === this.settings.ga_green_toggle_status) {
        this._onOffEventHandlerObject.g = value;
      }
      if (groupAddress === this.settings.ga_blue_toggle_status) {
        this._onOffEventHandlerObject.b = value;
      }
      if (groupAddress === this.settings.ga_white_toggle_status) {
        this._onOffEventHandlerObject.w = value;
      }
      this._setOnOffCapability();
    }
  }

  /**
   * Set onoff to false only if r, g, b and w are all off
   *
   * @private
   */
  _setOnOffCapability() {
    if (this._onOffEventHandlerObject) {
      if (!this._onOffEventHandlerObject.r
        && !this._onOffEventHandlerObject.g
        && !this._onOffEventHandlerObject.b
        && !this._onOffEventHandlerObject.w) {
        this.setCapabilityValue('onoff', false)
          .catch((knxerror) => {
            this.log('Set onoff error', knxerror);
          });
      } else {
        this.setCapabilityValue('onoff', true)
          .catch((knxerror) => {
            this.log('Set onoff error', knxerror);
          });
      }
    }
  }

  /**
   * Writes the on/off state to the KNX network
   *
   * @param value
   * @param opts
   * @returns {null|Promise<void>}
   */
  onCapabilityOnOff(value, opts) {
    const dim = value ? this.getCapabilityValue('dim') : 0;
    return this.onCapabilityHSV({ dim });
  }

  /**
   * RGBW event handler — receives individual channel values from the KNX bus
   *
   * @param groupAddress
   * @param data
   */
  onKNXRGBWEvent(groupAddress, data) {
    if (groupAddress === this.settings.ga_red_dim_status) {
      this._rgbwBusValues.r = DatapointTypeParser.colorChannel(data);
    }
    if (groupAddress === this.settings.ga_green_dim_status) {
      this._rgbwBusValues.g = DatapointTypeParser.colorChannel(data);
    }
    if (groupAddress === this.settings.ga_blue_dim_status) {
      this._rgbwBusValues.b = DatapointTypeParser.colorChannel(data);
    }
    if (groupAddress === this.settings.ga_white_dim_status) {
      this._rgbwBusValues.w = DatapointTypeParser.colorChannel(data);
    }

    if (this._rgbwTimeout) {
      clearTimeout(this._rgbwTimeout);
    }
    this._rgbwTimeout = setTimeout(this._setHSVCapability.bind(this), this._rgbwTimeoutInterval);
  }

  /**
   * Triggered by _rgbwTimeout to debounce values received from KNX bus.
   * Reconstructs full RGB from RGBW (reverse of min-subtraction) then converts to HSV.
   *
   * @private
   */
  _setHSVCapability() {
    const { r, g, b, w } = this._rgbwBusValues;

    // Reverse min-subtraction: reconstruct full RGB
    const rFull = r + w;
    const gFull = g + w;
    const bFull = b + w;

    const hsvValues = ColorConverter.rgb.hsv(rFull, gFull, bFull);

    this._hsvEventHandlerObject = {
      h: hsvValues[0] / 360,
      s: hsvValues[1] / 100,
      v: hsvValues[2] / 100,
    };

    if (this._hsvEventHandlerObject.h !== 0) {
      this.setCapabilityValue('light_hue', this._hsvEventHandlerObject.h)
        .catch((knxerror) => {
          this.log('Set light_hue error', knxerror);
        });
    }
    if (this._hsvEventHandlerObject.s !== 0) {
      this.setCapabilityValue('light_saturation', this._hsvEventHandlerObject.s)
        .catch((knxerror) => {
          this.log('Set light_saturation error', knxerror);
        });
    }
    if (this._hsvEventHandlerObject.v !== 0) {
      this.setCapabilityValue('dim', this._hsvEventHandlerObject.v)
        .catch((knxerror) => {
          this.log('Set dim error', knxerror);
        });
    }
  }

  /**
   * Multiple capability listener for hue/saturation/dim changes from the Homey UI.
   * Converts HSV → RGBW using the min-subtraction algorithm (colour-stable dimming).
   *
   * Algorithm:
   *   1. Convert HSV to RGB (0-255 each)
   *   2. W = min(R, G, B)       ← extract white component
   *   3. R' = R-W, G' = G-W, B' = B-W  ← pure colour remainder
   *
   * This guarantees that when brightness (v) changes, the R':G':B' ratio stays
   * constant, preventing any channel from dominating (e.g. blue creep).
   *
   * @param values
   * @param opts
   * @returns {null|Promise<void>}
   */
  onCapabilityHSV(values, opts) {
    if (typeof (values['light_hue']) === 'undefined') {
      this._hsvEventHandlerObject.h = this.getCapabilityValue('light_hue') || 0;
    } else {
      this._hsvEventHandlerObject.h = values['light_hue'];
    }

    if (typeof (values['light_saturation']) === 'undefined') {
      this._hsvEventHandlerObject.s = this.getCapabilityValue('light_saturation') || 0;
    } else {
      this._hsvEventHandlerObject.s = values['light_saturation'];
    }

    if (typeof (values['dim']) === 'undefined') {
      this._hsvEventHandlerObject.v = this.getCapabilityValue('dim') || 0;
    } else {
      this._hsvEventHandlerObject.v = values['dim'];
    }

    const colors = this._hsvToRGBW(this._hsvEventHandlerObject);

    // Update internal on/off state
    this._onOffEventHandlerObject.r = (colors.r !== 0);
    this._onOffEventHandlerObject.g = (colors.g !== 0);
    this._onOffEventHandlerObject.b = (colors.b !== 0);
    this._onOffEventHandlerObject.w = (colors.w !== 0);

    if (this.knxInterface) {
      const promiseQue = [];
      if (this.settings.ga_red_dim) {
        promiseQue.push(this.knxInterface.writeKNXGroupAddress(this.settings.ga_red_dim, colors.r, 'DPT5'));
      }
      if (this.settings.ga_green_dim) {
        promiseQue.push(this.knxInterface.writeKNXGroupAddress(this.settings.ga_green_dim, colors.g, 'DPT5'));
      }
      if (this.settings.ga_blue_dim) {
        promiseQue.push(this.knxInterface.writeKNXGroupAddress(this.settings.ga_blue_dim, colors.b, 'DPT5'));
      }
      if (this.settings.ga_white_dim) {
        promiseQue.push(this.knxInterface.writeKNXGroupAddress(this.settings.ga_white_dim, colors.w, 'DPT5'));
      }

      return Promise.all(promiseQue)
        .catch((knxerror) => {
          this.log(knxerror);
          throw new Error(this.homey.__('errors.rgb_failed'));
        });
    }
    return null;
  }

  /**
   * Converts HSV to RGBW using the min-subtraction algorithm.
   *
   * @param {number} h  Hue 0-1
   * @param {number} s  Saturation 0-1
   * @param {number} v  Value/brightness 0-1
   * @returns {{r: number, g: number, b: number, w: number}} Values 0-255
   * @private
   */
  _hsvToRGBW({ h, s, v }) {
    const rgb = ColorConverter.hsv.rgb(h * 360, s * 100, v * 100);
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];

    // Extract white: the amount of white light present in all channels
    const w = Math.min(r, g, b);

    return {
      r: r - w,
      g: g - w,
      b: b - w,
      w,
    };
  }

}

module.exports = KNXRGBW;
