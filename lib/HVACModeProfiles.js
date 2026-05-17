'use strict';

/**
 * HVAC Operating Mode Profiles
 * Different systems use different mode labels for the same numeric values (0-4)
 */

const HVAC_MODE_PROFILES = {
  standard: {
    name: 'standard',
    label: {
      en: 'Standard',
      nl: 'Standaard',
      de: 'Standard',
      fr: 'Standard',
      it: 'Standard',
      sv: 'Standard',
      no: 'Standard',
      es: 'Estándar',
      da: 'Standard',
      ru: 'Стандартный',
      pl: 'Standardowy',
      ko: '표준',
      ar: 'قياسي'
    },
    modes: {
      '0': {
        id: '0',
        title: {
          en: 'Automatic',
          nl: 'Automatisch',
          de: 'Automatisch',
          fr: 'Automatique',
          it: 'Automatica',
          sv: 'Automatiskt',
          no: 'Automatisk',
          es: 'Automático',
          da: 'Automatisk',
          ru: 'Автоматически',
          pl: 'Automatyczny',
          ko: '자동',
          ar: 'تلقائي'
        }
      },
      '1': {
        id: '1',
        title: {
          en: 'Comfort',
          fr: 'Confort',
          nl: 'Comfort',
          da: 'Komfort',
          de: 'Komfort',
          es: 'Confort',
          it: 'Comfort',
          no: 'Komfort',
          sv: 'Komfort',
          pl: 'Komfort',
          ru: 'Комфорт',
          ko: '쾌적',
          ar: 'راحة'
        }
      },
      '2': {
        id: '2',
        title: {
          en: 'Standby / Absence',
          fr: 'Veille / Absence',
          nl: 'Stand-by / Afwezigheid',
          da: 'Standby / Fravær',
          de: 'Standby / Abwesenheit',
          es: 'Espera / Ausencia',
          it: 'Standby / Assenza',
          no: 'Standby / Fravær',
          sv: 'Standby / Frånvaro',
          pl: 'Tryb czuwania / Nieobecność',
          ru: 'Ожидание / Отсутствие',
          ko: '대기 / 부재',
          ar: 'الاستعداد / غياب'
        }
      },
      '3': {
        id: '3',
        title: {
          en: 'Economy / Night',
          fr: 'Economie / Nuit',
          nl: 'Economie / Nacht',
          da: 'Økonomi / Nat',
          de: 'Sparmodus / Nacht',
          es: 'Económico / Noche',
          it: 'Economia / Notte',
          no: 'Økonomi / Natt',
          sv: 'Ekonomi / Natt',
          pl: 'Ekonomia / Noc',
          ru: 'Экономия / Ночь',
          ko: '에코 / 야간',
          ar: 'اقتصاد / ليلي'
        }
      },
      '4': {
        id: '4',
        title: {
          en: 'Building protection',
          fr: 'Protection du bâtiment / Hors gel',
          nl: 'Bescherming van het gebouw',
          da: 'Bygningsbeskyttelse',
          de: 'Gebäudeschutz',
          es: 'Protección del edificio',
          it: 'Protezione dell\'edificio',
          no: 'Bygningsbeskyttelse',
          sv: 'Byggnadsskydd',
          pl: 'Ochrona budynku',
          ru: 'Защита здания',
          ko: '건물 보호',
          ar: 'حماية المبنى'
        }
      }
    }
  },
  heatCoolAutoFan: {
    name: 'heatCoolAutoFan',
    label: {
      en: 'Heat / Cool / Auto / Fan',
      nl: 'Verwarmen / Koelen / Auto / Ventilatie',
      de: 'Heizen / Kühlen / Auto / Lüfter',
      fr: 'Chauffage / Refroidissement / Auto / Ventilateur',
      it: 'Riscaldamento / Raffreddamento / Auto / Ventilatore',
      sv: 'Värmning / Kylning / Auto / Fläkt',
      no: 'Oppvarming / Kjøling / Auto / Vifte',
      es: 'Calefacción / Enfriamiento / Auto / Ventilador',
      da: 'Opvarmning / Køling / Auto / Blæser',
      ru: 'Отопление / Охлаждение / Авто / Вентилятор',
      pl: 'Ogrzewanie / Chłodzenie / Auto / Wentylator',
      ko: '난방 / 냉각 / 자동 / 팬',
      ar: 'تدفئة / تبريد / تلقائي / مروحة'
    },
    modes: {
      '0': {
        id: '0',
        title: {
          en: 'Auto',
          nl: 'Auto',
          de: 'Auto',
          fr: 'Auto',
          it: 'Auto',
          sv: 'Auto',
          no: 'Auto',
          es: 'Auto',
          da: 'Auto',
          ru: 'Авто',
          pl: 'Auto',
          ko: '자동',
          ar: 'تلقائي'
        }
      },
      '1': {
        id: '1',
        title: {
          en: 'Heat',
          nl: 'Verwarmen',
          de: 'Heizen',
          fr: 'Chauffage',
          it: 'Riscaldamento',
          sv: 'Värmning',
          no: 'Oppvarming',
          es: 'Calefacción',
          da: 'Opvarmning',
          ru: 'Отопление',
          pl: 'Ogrzewanie',
          ko: '난방',
          ar: 'تدفئة'
        }
      },
      '2': {
        id: '2',
        title: {
          en: 'Cool',
          nl: 'Koelen',
          de: 'Kühlen',
          fr: 'Refroidissement',
          it: 'Raffreddamento',
          sv: 'Kylning',
          no: 'Kjøling',
          es: 'Enfriamiento',
          da: 'Køling',
          ru: 'Охлаждение',
          pl: 'Chłodzenie',
          ko: '냉각',
          ar: 'تبريد'
        }
      },
      '3': {
        id: '3',
        title: {
          en: 'Fan',
          nl: 'Ventilatie',
          de: 'Lüfter',
          fr: 'Ventilateur',
          it: 'Ventilatore',
          sv: 'Fläkt',
          no: 'Vifte',
          es: 'Ventilador',
          da: 'Blæser',
          ru: 'Вентилятор',
          pl: 'Wentylator',
          ko: '팬',
          ar: 'مروحة'
        }
      },
      '4': {
        id: '4',
        title: {
          en: 'Off',
          nl: 'Uit',
          de: 'Aus',
          fr: 'Arrêt',
          it: 'Spento',
          sv: 'Av',
          no: 'Av',
          es: 'Apagado',
          da: 'Slukket',
          ru: 'Выключено',
          pl: 'Wyłączone',
          ko: '끄기',
          ar: 'إيقاف'
        }
      }
    }
  }
};

const HVAC_CONTROLLER_MODES = {
  '0': { id: '0', title: { en: 'Auto', nl: 'Auto' } },
  '1': { id: '1', title: { en: 'Heat', nl: 'Verwarmen' } },
  '2': { id: '2', title: { en: 'Morning warmup', nl: 'Ochtend opwarming' } },
  '3': { id: '3', title: { en: 'Cool', nl: 'Koelen' } },
  '4': { id: '4', title: { en: 'Night purge', nl: 'Nacht ventilatie' } },
  '5': { id: '5', title: { en: 'Precool', nl: 'Voor-koelen' } },
  '6': { id: '6', title: { en: 'Off', nl: 'Uit' } },
  '7': { id: '7', title: { en: 'Test', nl: 'Test' } },
  '8': { id: '8', title: { en: 'Emergency heat', nl: 'Noodverwarming' } },
  '9': { id: '9', title: { en: 'Fan only', nl: 'Alleen ventilator' } },
  '10': { id: '10', title: { en: 'Free cool', nl: 'Vrije koeling' } },
  '11': { id: '11', title: { en: 'Ice', nl: 'IJs' } },
  '12': { id: '12', title: { en: 'Maximum heating mode', nl: 'Maximale verwarmingsmodus' } },
  '13': { id: '13', title: { en: 'Economic heat/cool mode', nl: 'Economische warmte/koelmodus' } },
  '14': { id: '14', title: { en: 'Dehumidification', nl: 'Ontvochtiging' } },
  '15': { id: '15', title: { en: 'Calibration mode', nl: 'Kalibratiemodus' } },
  '16': { id: '16', title: { en: 'Emergency cool mode', nl: 'Noodkoelingsmodus' } },
  '17': { id: '17', title: { en: 'Emergency steam mode', nl: 'Noodstoommodus' } },
  '20': { id: '20', title: { en: 'NoDem', nl: 'NoDem' } }
};

function parseControllerModes(rawModes) {
  if (Array.isArray(rawModes)) {
    return rawModes.map((mode) => String(mode)).filter((mode) => HVAC_CONTROLLER_MODES[mode]);
  }

  if (typeof rawModes !== 'string' || rawModes.trim() === '') {
    return [];
  }

  try {
    const parsed = JSON.parse(rawModes);
    if (Array.isArray(parsed)) {
      return parsed.map((mode) => String(mode)).filter((mode) => HVAC_CONTROLLER_MODES[mode]);
    }
  } catch (error) {
    return [];
  }

  return [];
}

function getOperatingModeValues(settings = {}) {
  return getModeValues(settings.hvac_mode_profile || 'standard');
}

function getControllerModeValues(settings = {}) {
  const selectedModes = parseControllerModes(settings.hvac_controller_modes);
  return selectedModes
    .map((modeId) => HVAC_CONTROLLER_MODES[modeId])
    .filter(Boolean);
}

// Backwards-compatible alias.
function getConfiguredModeValues(settings = {}) {
  return getOperatingModeValues(settings);
}

/**
 * Get a mode profile by name, or return the standard profile if not found
 * @param {string} profileName - The name of the profile
 * @returns {object} The mode profile object
 */
function getModeProfile(profileName) {
  return HVAC_MODE_PROFILES[profileName] || HVAC_MODE_PROFILES.standard;
}

/**
 * Get the mode values array for a profile in the format required by Homey capabilities
 * @param {string} profileName - The name of the profile
 * @returns {array} Array of mode objects with id and title
 */
function getModeValues(profileName) {
  const profile = getModeProfile(profileName);
  return Object.values(profile.modes);
}

/**
 * Get all available profile names
 * @returns {array} Array of profile names
 */
function getAvailableProfiles() {
  return Object.keys(HVAC_MODE_PROFILES);
}

/**
 * Get profile info for dropdown options
 * @param {string} language - Language code (e.g. 'en', 'nl')
 * @returns {array} Array of profile options for dropdown
 */
function getProfileOptions(language = 'en') {
  return Object.entries(HVAC_MODE_PROFILES).map(([key, profile]) => {
    return {
      id: key,
      title: profile.label[language] || profile.label.en
    };
  });
}

module.exports = {
  HVAC_MODE_PROFILES,
  HVAC_CONTROLLER_MODES,
  getModeProfile,
  getModeValues,
  getAvailableProfiles,
  getProfileOptions,
  parseControllerModes,
  getOperatingModeValues,
  getControllerModeValues,
  getConfiguredModeValues,
};
