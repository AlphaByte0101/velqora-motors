/* ============================================================================
   CONFIGURATION — Constantes globales et état runtime
   ============================================================================ */

const CONFIG = Object.freeze({
    storageKeys: {
        favorites: 'velqora-garage',
        compare:   'velqora-comparator',
        cookies:   'velqora-cookies-consent',
        cursor:    'velqora-cursor',
        lang:      'velqora-lang'
    },
    legacyKeys: {
        favorites: 'apex-garage',
        compare:   'apex-comparator',
        cookies:   'apex-cookies-consent',
        cursor:    'apex-cursor'
    },
    priceMax:       8000000,
    maxCompare:     4,
    toastDelay:     3000,
    searchDebounce: 120,
    views: ['catalog', 'details', 'garage', 'comparator', 'cursor',
            'legal', 'privacy', 'cookies', 'cgv', 'accessibility', 'agec'],
    navViews: ['catalog', 'garage', 'comparator', 'cursor'],
    navClasses: {
        active:   'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-white/10 text-white shadow-inner inline-flex items-center',
        inactive: 'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-zinc-400 inline-flex items-center'
    }
});

const LANGUAGES = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', locale: 'fr-FR' },
    { code: 'en', name: 'English',  flag: '🇬🇧', locale: 'en-GB' },
    { code: 'es', name: 'Español',  flag: '🇪🇸', locale: 'es-ES' },
    { code: 'de', name: 'Deutsch',  flag: '🇩🇪', locale: 'de-DE' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', locale: 'it-IT' }
];
const VALID_LANGS = LANGUAGES.map(l => l.code);

const CURSOR_STYLES = [
    { id: 'ring',     i18nName: 'cursor.default', i18nDesc: 'cursor.defaultDesc',  preview: 'ring' },
    { id: 'mercedes', i18nName: null,             i18nDesc: 'cursor.mercedesDesc', preview: 'mercedes', fixedName: 'Mercedes' },
    { id: 'audi',     i18nName: null,             i18nDesc: 'cursor.audiDesc',     preview: 'audi',     fixedName: 'Audi' }
];
const VALID_CURSOR_IDS = CURSOR_STYLES.map(s => s.id);

const ENERGY_MAP = {
    Thermique:   { fr: 'Thermique',  en: 'Combustion', es: 'Térmico',   de: 'Verbrenner', it: 'Termico'   },
    Hybride:     { fr: 'Hybride',    en: 'Hybrid',     es: 'Híbrido',   de: 'Hybrid',     it: 'Ibrido'    },
    Électrique:  { fr: 'Électrique', en: 'Electric',   es: 'Eléctrico', de: 'Elektro',    it: 'Elettrico' }
};

const VALID_COOKIE_VALUES = ['accepted', 'refused'];

/* État global runtime (partagé entre modules) */
const State = {
    lang: 'fr',
    energy: 'all',
    favorites: [],
    selected: [],
    currentCarId: null,
    currentCursor: 'ring',
    previousView: 'catalog',
    catalogScrollY: 0,
    mobileFiltersOpen: false,
    lightbox: { images: [], index: 0 },
    timers: { toast: null, search: null }
};