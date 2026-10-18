/* ============================================================================
   VELQORA MOTORS — script.js
   Architecture modulaire par namespaces.
   ============================================================================ */

/* ============================================================================
   1. CONFIGURATION & CONSTANTES
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
    priceMax:    8000000,
    maxCompare:  4,
    toastDelay:  3000,
    searchDebounce: 120,
    views: ['catalog', 'details', 'garage', 'comparator', 'cursor',
            'legal', 'privacy', 'cookies', 'cgv', 'accessibility', 'agec'],
    navViews: ['catalog', 'garage', 'comparator', 'cursor'],
    navClasses: {
        active:   'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-white/10 text-white shadow-inner inline-flex items-center',
        inactive: 'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-zinc-400 inline-flex items-center'
    }
});

/* ============================================================================
   2. DONNÉES STATIQUES (langues, curseurs, énergies)
   ============================================================================ */
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

/* ============================================================================
   3. CATALOGUE VOITURES
   ============================================================================ */
const carsData = [
    { id: "bugatti-tourbillon", name: "Bugatti Tourbillon", brand: "Bugatti", energy: "Hybride", price: 3800000, power: 1800, torque: "900 Nm + Électrique", acceleration: 2.0, topSpeed: 445, range: "60 km (Élec.) / 500 km", engine: "V16 8.3L Atmosphérique + 3 Moteurs", transmission: "DCT 8 rapports", weight: "1 995 kg", image: "VoituresImages/Bugatti Tourbillon/Bugatti-Tourbillon.jpg", gallery: ["VoituresImages/Bugatti Tourbillon/Bugatti-Tourbillon1.jpg","VoituresImages/Bugatti Tourbillon/Bugatti-Tourbillon2.jpg"], description: "Le chef-d'œuvre ultime de Molsheim. Propulsé par un tout nouveau V16 atmosphérique couplé à une architecture hybride de pointe, le Tourbillon redéfinit l'art mécanique de la haute horlogerie automobile." },
    { id: "koenigsegg-jesko", name: "Koenigsegg Jesko", brand: "Koenigsegg", energy: "Thermique", price: 2800000, power: 1600, torque: "1 500 Nm", acceleration: 2.5, topSpeed: 531, range: "450 km (Essence SP98)", engine: "V8 5.0L Biturbo à Vilebrequin Plat", transmission: "LST 9 rapports Light Speed", weight: "1 420 kg", image: "VoituresImages/Koenigsegg Jesko/Koenigsegg-Jesko.jpg", gallery: ["VoituresImages/Koenigsegg Jesko/Koenigsegg-Jesko1.jpg","VoituresImages/Koenigsegg Jesko/Koenigsegg-Jesko2.jpg"], description: "La voiture la plus rapide jamais homologuée par Koenigsegg. Pensée pour flirter avec les 530 km/h grâce à un aérodynamisme ultra-poussé et une puissance brute phénoménale." },
    { id: "rimac-nevera", name: "Rimac Nevera", brand: "Rimac", energy: "Électrique", price: 2300000, power: 1914, torque: "2 360 Nm", acceleration: 1.81, topSpeed: 412, range: "430 km (Électrique)", engine: "Quad-Moteur Électrique Indépendant", transmission: "Mono-rapport par roue", weight: "2 150 kg", image: "VoituresImages/Rimac Nevera/Rimac-Nevera.jpg", gallery: ["VoituresImages/Rimac Nevera/Rimac-Nevera1.jpg","VoituresImages/Rimac Nevera/Rimac-Nevera2.jpg"], description: "La bête électrique ultime. Avec plus de 2100 chevaux et un couple foudroyant, la Nevera R pulvérise tous les records d'accélération sur piste." },
    { id: "ferrari-sf90-xx", name: "Ferrari SF90 XX Stradale", brand: "Ferrari", energy: "Hybride", price: 770000, power: 1030, torque: "804 Nm + Électrique", acceleration: 2.3, topSpeed: 320, range: "500 km (Hybride)", engine: "V8 4.0L Biturbo + 3 Moteurs", transmission: "F1 DCT 8 rapports", weight: "1 560 kg", image: "VoituresImages/Ferrari SF90 XX Stradale/Ferrari-SF90-XX-Stradale.jpg", gallery: ["VoituresImages/Ferrari SF90 XX Stradale/Ferrari-SF90-XX-Stradale1.jpg","VoituresImages/Ferrari SF90 XX Stradale/Ferrari-SF90-XX-Stradale2.jpg"], description: "Issue du programme XX, la SF90 XX Stradale est la première Ferrari de route extrême dotée d'un aileron fixe arrière générant un appui aérodynamique sans précédent." },
    { id: "porsche-911-gt3-rs", name: "Porsche 911 GT3 RS (992)", brand: "Porsche", energy: "Thermique", price: 250000, power: 525, torque: "465 Nm", acceleration: 3.2, topSpeed: 296, range: "600 km (Essence)", engine: "6 cyl. à plat 4.0L Atmosphérique", transmission: "PDK 7 rapports", weight: "1 450 kg", image: "VoituresImages/Porsche 911 GT3 RS (992)/Porsche-911-992.jpg", gallery: ["VoituresImages/Porsche 911 GT3 RS (992)/Porsche-911-9921.jpg","VoituresImages/Porsche 911 GT3 RS (992)/Porsche-911-9922.jpg"], description: "Véritable monoplace homologuée pour la route, la GT3 RS intègre des technologies aérodynamiques issues directement de la compétition en WEC et F1." },
    { id: "lamborghini-revuelto", name: "Lamborghini Revuelto", brand: "Lamborghini", energy: "Hybride", price: 520000, power: 1015, torque: "725 Nm + Électrique", acceleration: 2.5, topSpeed: 350, range: "550 km (Hybride)", engine: "V12 6.5L Atmosphérique + Tri-moteur", transmission: "DCT 8 rapports transversale", weight: "1 772 kg", image: "VoituresImages/Lamborghini Revuelto/Lamborghini-Revuelto.jpg", gallery: ["VoituresImages/Lamborghini Revuelto/Lamborghini-Revuelto1.jpg","VoituresImages/Lamborghini Revuelto/Lamborghini-Revuelto2.jpg"], description: "Le successeur de l'Aventador. La Revuelto inaugure le premier V12 hybride rechargeable de Sant'Agata Bolognese." },
    { id: "tesla-model-s-plaid", name: "Tesla Model S Plaid", brand: "Tesla", energy: "Électrique", price: 129990, power: 1020, torque: "1 420 Nm", acceleration: 2.1, topSpeed: 322, range: "600 km (Électrique)", engine: "Triple Moteur Électrique Vectoriel", transmission: "Automatique mono-rapport", weight: "2 162 kg", image: "VoituresImages/Tesla Model S Plaid/Tesla-Model-S-Plaid.jpg", gallery: ["VoituresImages/Tesla Model S Plaid/Tesla-Model-S-Plaid1.jpg","VoituresImages/Tesla Model S Plaid/Tesla-Model-S-Plaid2.jpg"], description: "La berline électrique de série la plus rapide au monde. Capable d'avaler le 0 à 100 en un éclair avec ses trois moteurs indépendants." },
    { id: "bmw-m4-cs", name: "BMW M4 CS", brand: "BMW", energy: "Thermique", price: 162000, power: 550, torque: "650 Nm", acceleration: 3.4, topSpeed: 302, range: "600 km (Essence)", engine: "6 cyl. en ligne 3.0L M TwinPower Turbo", transmission: "M Steptronic 8 rapports xDrive", weight: "1 765 kg", image: "VoituresImages/BMW M4 CS/BMW-M4-CS.jpg", gallery: ["VoituresImages/BMW M4 CS/BMW-M4-CS1.jpg","VoituresImages/BMW M4 CS/BMW-M4-CS2.jpg"], description: "Plus légère, plus affûtée et dotée d'éléments en carbone exclusifs, la M4 CS offre le parfait compromis entre pistarde radicale et sportive quotidienne." },
    { id: "mclaren-artura-spider", name: "McLaren Artura Spider", brand: "McLaren", energy: "Hybride", price: 233500, power: 700, torque: "720 Nm", acceleration: 3.0, topSpeed: 330, range: "30 km (Élec.) / 600 km", engine: "V6 3.0L Bi-Turbo + Moteur Électrique", transmission: "Propulsion (DCT 8 rapports)", weight: "1 457 kg", image: "VoituresImages/McLaren Artura Spider/McLaren-Artura-Spider.jpg", gallery: ["VoituresImages/McLaren Artura Spider/McLaren-Artura-Spider1.jpg","VoituresImages/McLaren Artura Spider/McLaren-Artura-Spider2.jpg"], description: "La version découvrable de la supercar hybride McLaren. Un V6 bi-turbo électrifié associé à un châssis carbone ultra-léger." },
    { id: "ferrari-296-gtb", name: "Ferrari 296 GTB", brand: "Ferrari", energy: "Hybride", price: 273000, power: 830, torque: "740 Nm", acceleration: 2.9, topSpeed: 330, range: "25 km (Élec.) / 500 km", engine: "V6 3.0L Bi-Turbo + Moteur Électrique", transmission: "Propulsion (DCT 8 rapports)", weight: "1 470 kg", image: "VoituresImages/Ferrari 296 GTB/Ferrari-296-GTB.jpg", gallery: ["VoituresImages/Ferrari 296 GTB/Ferrari-296-GTB1.jpg","VoituresImages/Ferrari 296 GTB/Ferrari-296-GTB2.jpg"], description: "La berlinette hybride rechargeable de Maranello. Un V6 central inédit couplé à un moteur électrique, redéfinissant le plaisir de conduite italien." },
    { id: "aston-martin-valour", name: "Aston Martin Valour", brand: "Aston Martin", energy: "Thermique", price: 1500000, power: 715, torque: "753 Nm", acceleration: 3.4, topSpeed: 322, range: "500 km (Essence)", engine: "V12 5.2L Bi-Turbo", transmission: "Propulsion (Manuelle 6 vitesses)", weight: "1 690 kg", image: "VoituresImages/Aston Martin Valour/Aston-Martin-Valour.jpg", gallery: ["VoituresImages/Aston Martin Valour/Aston-Martin-Valour1.jpg","VoituresImages/Aston Martin Valour/Aston-Martin-Valour2.jpg"], description: "Hommage rétro signé Aston Martin. Boîte manuelle 6 rapports associée à un V12 bi-turbo." },
    { id: "lamborghini-huracan-tecnica", name: "Lamborghini Huracán Tecnica", brand: "Lamborghini", energy: "Thermique", price: 235000, power: 640, torque: "565 Nm", acceleration: 3.2, topSpeed: 325, range: "450 km (Essence)", engine: "V10 5.2L Atmosphérique", transmission: "Propulsion (DCT 7 rapports)", weight: "1 379 kg", image: "VoituresImages/Lamborghini Huracan Tecnica/Lamborghini-Huracan-Tecnica.jpg", gallery: ["VoituresImages/Lamborghini Huracan Tecnica/Lamborghini-Huracan-Tecnica1.jpg","VoituresImages/Lamborghini Huracan Tecnica/Lamborghini-Huracan-Tecnica2.jpg"], description: "La synthèse parfaite entre route et piste. V10 atmosphérique en position centrale, propulsion pure et aérodynamique affûtée." },
    { id: "bugatti-centodieci", name: "Bugatti Centodieci", brand: "Bugatti", energy: "Thermique", price: 8000000, power: 1600, torque: "1 600 Nm", acceleration: 2.4, topSpeed: 380, range: "450 km (Essence)", engine: "W16 8.0L Quadri-Turbo", transmission: "Intégrale (DCT 7 rapports)", weight: "1 976 kg", image: "VoituresImages/Bugatti Centodieci/Bugatti-Centodieci.jpg", gallery: ["VoituresImages/Bugatti Centodieci/Bugatti-Centodieci1.jpg","VoituresImages/Bugatti Centodieci/Bugatti-Centodieci2.jpg"], description: "Édition ultra-limitée (10 exemplaires) célébrant les 110 ans de Bugatti. Un hommage vibrant à l'EB110." },
    { id: "audi-rs6-avant-gt", name: "Audi RS6 Avant GT", brand: "Audi Sport", energy: "Thermique", price: 220000, power: 630, torque: "850 Nm", acceleration: 3.3, topSpeed: 305, range: "600 km (Essence)", engine: "V8 4.0L Bi-Turbo", transmission: "Intégrale quattro (Auto 8 rapports)", weight: "2 075 kg", image: "VoituresImages/Audi RS6 Avant GT/Audi-RS6-Avant-GT.jpg", gallery: ["VoituresImages/Audi RS6 Avant GT/Audi-RS6-Avant-GT1.jpg","VoituresImages/Audi RS6 Avant GT/Audi-RS6-Avant-GT2.jpg"], description: "Le break sportif ultime. Une série limitée inspirée de la RS6 GTO." },
    { id: "aston-martin-db12", name: "Aston Martin DB12", brand: "Aston Martin", energy: "Thermique", price: 225000, power: 680, torque: "800 Nm", acceleration: 3.6, topSpeed: 325, range: "600 km (Essence)", engine: "V8 4.0L Bi-Turbo (AMG)", transmission: "Propulsion (Auto 8 rapports)", weight: "1 685 kg", image: "VoituresImages/Aston Martin DB12/Aston-Martin-DB12.jpg", gallery: ["VoituresImages/Aston Martin DB12/Aston-Martin-DB121.jpg","VoituresImages/Aston Martin DB12/Aston-Martin-DB122.jpg"], description: "La super tourer britannique par excellence. Châssis rigide, V8 AMG retravaillé et luxe intérieur intemporel." },
    { id: "lotus-emira", name: "Lotus Emira", brand: "Lotus", energy: "Thermique", price: 102990, power: 405, torque: "420 Nm", acceleration: 4.2, topSpeed: 290, range: "550 km (Essence)", engine: "V6 3.5L Compresseur (Toyota)", transmission: "Propulsion (Manuelle ou Auto 6 rapports)", weight: "1 405 kg", image: "VoituresImages/Lotus Emira/Lotus-Emira.jpg", gallery: ["VoituresImages/Lotus Emira/Lotus-Emira1.jpg","VoituresImages/Lotus Emira/Lotus-Emira2.jpg"], description: "La dernière Lotus thermique. Un châssis en aluminium collé, un V6 compressé et un équilibre de conduite légendaire." },
    { id: "maserati-mc20-cielo", name: "Maserati MC20 Cielo", brand: "Maserati", energy: "Thermique", price: 265000, power: 630, torque: "730 Nm", acceleration: 3.0, topSpeed: 320, range: "550 km (Essence)", engine: "V6 3.0L Nettuno Bi-Turbo", transmission: "Propulsion (DCT 8 rapports)", weight: "1 540 kg", image: "VoituresImages/Maserati MC20 Cielo/Maserati-MC20-Cielo.jpg", gallery: ["VoituresImages/Maserati MC20 Cielo/Maserati-MC20-Cielo1.jpg","VoituresImages/Maserati MC20 Cielo/Maserati-MC20-Cielo2.jpg"], description: "La version découvrable de la supercar Maserati. Toit en verre électrochrome et V6 Nettuno innovant." },
    { id: "aston-martin-valhalla", name: "Aston Martin Valhalla", brand: "Aston Martin", energy: "Hybride", price: 800000, power: 828, torque: "800 Nm + Électrique", acceleration: 2.5, topSpeed: 350, range: "60 km (Élec.) / 600 km", engine: "V8 4.0L Bi-Turbo + 3 Moteurs Électriques", transmission: "Intégrale (DCT 8 rapports)", weight: "1 655 kg", image: "VoituresImages/Aston Martin Valhalla/Aston-Martin-Valhalla.jpg", gallery: ["VoituresImages/Aston Martin Valhalla/Aston-Martin-Valhalla1.jpg","VoituresImages/Aston Martin Valhalla/Aston-Martin-Valhalla2.jpg"], description: "La supercar hybride d'Aston Martin. V8 biturbo central arrière et trois moteurs électriques." },
    { id: "ferrari-f8-tributo", name: "Ferrari F8 Tributo", brand: "Ferrari", energy: "Thermique", price: 232000, power: 720, torque: "770 Nm", acceleration: 2.9, topSpeed: 340, range: "500 km (Essence)", engine: "V8 3.9L Bi-Turbo", transmission: "Propulsion (DCT 7 rapports)", weight: "1 330 kg", image: "VoituresImages/Ferrari F8 Tributo/Ferrari-F8-Tributo.jpg", gallery: ["VoituresImages/Ferrari F8 Tributo/Ferrari-F8-Tributo1.jpg","VoituresImages/Ferrari F8 Tributo/Ferrari-F8-Tributo2.jpg"], description: "Hommage au V8 Ferrari le plus puissant jamais produit." },
    { id: "mclaren-720s", name: "McLaren 720S", brand: "McLaren", energy: "Thermique", price: 252600, power: 720, torque: "770 Nm", acceleration: 2.9, topSpeed: 341, range: "550 km (Essence)", engine: "V8 4.0L Bi-Turbo", transmission: "Propulsion (SSG 7 rapports)", weight: "1 419 kg", image: "VoituresImages/McLaren 720S/Mclaren-720S.jpg", gallery: ["VoituresImages/McLaren 720S/Mclaren-720S1.jpg","VoituresImages/McLaren 720S/Mclaren-720S2.jpg"], description: "La supercar McLaren qui a redéfini la catégorie. Châssis carbone et aérodynamique active de pointe." },
    { id: "lamborghini-aventador-svj", name: "Lamborghini Aventador SVJ", brand: "Lamborghini", energy: "Thermique", price: 350000, power: 770, torque: "720 Nm", acceleration: 2.8, topSpeed: 350, range: "450 km (Essence)", engine: "V12 6.5L Atmosphérique", transmission: "Intégrale (ISR 7 rapports)", weight: "1 525 kg", image: "VoituresImages/Lamborghini Aventador SVJ/Lamborghini-Aventador-SVJ.jpg", gallery: ["VoituresImages/Lamborghini Aventador SVJ/Lamborghini-Aventador-SVJ1.jpg","VoituresImages/Lamborghini Aventador SVJ/Lamborghini-Aventador-SVJ2.jpg"], description: "La version la plus radicale de l'Aventador. V12 atmosphérique et aérodynamique ALA 2.0." },
    { id: "aston-martin-vantage", name: "Aston Martin Vantage", brand: "Aston Martin", energy: "Thermique", price: 195000, power: 665, torque: "800 Nm", acceleration: 3.4, topSpeed: 325, range: "550 km (Essence)", engine: "V8 4.0L Bi-Turbo (AMG)", transmission: "Propulsion (Auto 8 rapports)", weight: "1 665 kg", image: "VoituresImages/Aston Martin Vantage/Aston-Martin-Vantage.jpg", gallery: ["VoituresImages/Aston Martin Vantage/Aston-Martin-Vantage1.jpg","VoituresImages/Aston Martin Vantage/Aston-Martin-Vantage2.jpg"], description: "La sportive la plus accessible d'Aston Martin." },
    { id: "mercedes-amg-gt-black-series", name: "Mercedes-AMG GT Black Series", brand: "Mercedes-AMG", energy: "Thermique", price: 359759, power: 730, torque: "800 Nm", acceleration: 3.2, topSpeed: 325, range: "500 km (Essence)", engine: "V8 4.0L Bi-Turbo (Vilebrequin à plan plat)", transmission: "Propulsion (DCT 7 rapports)", weight: "1 615 kg", image: "VoituresImages/Mercedes-AMG GT Black Series/Mercedes-AMG-GT-Black-Series.jpg", gallery: ["VoituresImages/Mercedes-AMG GT Black Series/Mercedes-AMG-GT-Black-Series1.jpg","VoituresImages/Mercedes-AMG GT Black Series/Mercedes-AMG-GT-Black-Series2.jpg"], description: "L'AMG la plus extrême jamais produite. V8 au vilebrequin plat et aérodynamique active." },
    { id: "audi-r8-v10-performance", name: "Audi R8 V10 Performance", brand: "Audi Sport", energy: "Thermique", price: 208000, power: 620, torque: "580 Nm", acceleration: 3.1, topSpeed: 331, range: "550 km (Essence)", engine: "V10 5.2L Atmosphérique", transmission: "Intégrale quattro (DCT 7 rapports)", weight: "1 595 kg", image: "VoituresImages/Audi R8 V10 Performance/Audi-R8-V10-Performance.jpg", gallery: ["VoituresImages/Audi R8 V10 Performance/Audi-R8-V10-Performance1.jpg","VoituresImages/Audi R8 V10 Performance/Audi-R8-V10-Performance2.jpg"], description: "Le dernier R8. V10 atmosphérique et transmission intégrale quattro." },
    { id: "pininfarina-battista", name: "Automobili Pininfarina Battista", brand: "Automobili Pininfarina", energy: "Électrique", price: 2200000, power: 1900, torque: "2 300 Nm", acceleration: 1.86, topSpeed: 350, range: "500 km (Électrique)", engine: "4 Moteurs Électriques Indépendants", transmission: "Intégrale (Boîtes séparées)", weight: "2 068 kg", image: "VoituresImages/Automobili Pininfarina Battista/Automobili-Pininfarina-Battista.jpg", gallery: ["VoituresImages/Automobili Pininfarina Battista/Automobili-Pininfarina-Battista1.jpg","VoituresImages/Automobili Pininfarina Battista/Automobili-Pininfarina-Battista2.jpg"], description: "L'hypercar électrique du légendaire studio Pininfarina. 1900 chevaux et 4 moteurs indépendants." },
    { id: "ssc-tuatara", name: "SSC Tuatara", brand: "SSC", energy: "Thermique", price: 1900000, power: 1750, torque: "1 735 Nm", acceleration: 2.5, topSpeed: 475, range: "480 km (E85)", engine: "V8 5.9L Bi-Turbo", transmission: "Propulsion (Seq 7 rapports)", weight: "1 247 kg", image: "VoituresImages/SSC Tuatara/SSC-Tuatara.jpg", gallery: ["VoituresImages/SSC Tuatara/SSC-Tuatara1.jpg","VoituresImages/SSC Tuatara/SSC-Tuatara2.jpg"], description: "L'hypercar américaine record. V8 5.9L bi-turbo et aérodynamique extrême." }
];

const VALID_CAR_IDS = new Set(carsData.map(c => c.id));

/* ============================================================================
   4. TRADUCTIONS i18n
   ============================================================================ */
const TRANSLATIONS = {
    fr: {
        "lang.change": "Changer de langue",
        "nav.showroom": "Showroom", "nav.garage": "Garage", "nav.comparator": "Comparateur", "nav.cursor": "Curseur",
        "nav.openMenu": "Ouvrir le menu de navigation", "nav.main": "Navigation principale",
        "hero.desc": "Entrez dans l'élite de l'automobile d'exception. Analysez les performances extrêmes, comparez les chronos et constituez votre garage de rêve.",
        "hero.explore": "Explorer le Showroom", "hero.compare": "Lancer le Comparateur",
        "search.placeholder": "Rechercher (ex: bug tour, ferrari hybride...)", "search.aria": "Rechercher un véhicule",
        "energy.all": "Tous", "energy.Thermique": "Thermique", "energy.Hybride": "Hybride", "energy.Électrique": "Électrique",
        "filters.show": "Afficher les filtres avancés", "filters.hide": "Masquer les filtres avancés",
        "filters.brand": "Marque", "filters.allBrands": "Toutes les marques",
        "filters.maxPrice": "Prix Max", "filters.sort": "Trier par",
        "sort.featured": "Sélection vedette", "sort.priceDesc": "Prix décroissant", "sort.priceAsc": "Prix croissant",
        "sort.powerDesc": "Puissance maximale", "sort.speedDesc": "Vitesse maximale",
        "card.power": "Puissance", "card.accel": "0-100 km/h", "card.topSpeed": "Vitesse max",
        "card.details": "Fiche détaillée", "card.compare": "Comparer", "card.compared": "Comparé",
        "card.addFav": "Ajouter au garage", "card.removeFav": "Retirer du garage",
        "results.one": "1 véhicule affiché", "results.many": "{n} véhicules affichés",
        "noResults.title": "Aucun véhicule ne correspond",
        "noResults.desc": "Modifiez vos critères ou réinitialisez les filtres pour explorer le catalogue.",
        "noResults.reset": "Réinitialiser",
        "details.back": "Retour au showroom", "details.price": "Prix TTC indicatif",
        "details.inComparator": "Dans le comparateur", "details.presentation": "Présentation du modèle",
        "details.specs": "Fiche Technique & Performances",
        "spec.power": "Puissance Maximale", "spec.torque": "Couple Moteur", "spec.accel": "0 à 100 km/h",
        "spec.topSpeed": "Vitesse Maximale", "spec.range": "Autonomie & Énergie", "spec.weight": "Poids à vide",
        "spec.engine": "Bloc Moteur", "spec.transmission": "Transmission",
        "garage.title": "Mon Garage Personnel", "garage.desc": "Retrouvez l'ensemble de vos véhicules sauvegardés en favoris.",
        "garage.addModels": "Ajouter des modèles", "garage.emptyTitle": "Votre garage est vide",
        "garage.emptyDesc": "Cliquez sur l'icône de favoris (signet) sur n'importe quelle voiture pour l'ajouter ici.",
        "garage.explore": "Explorer le Showroom", "garage.viewCard": "Voir la fiche",
        "comparator.title": "Comparateur de Performances",
        "comparator.desc": "Sélectionnez jusqu'à 4 véhicules pour confronter leurs fiches techniques en temps réel.",
        "comparator.clear": "Vider", "comparator.add": "Ajouter",
        "comparator.matrix": "Matrice Comparative",
        "comparator.matrixHint": "Les meilleures performances sont surlignées automatiquement en vert.",
        "comparator.emptyTitle": "Aucun véhicule sélectionné",
        "comparator.emptyDesc": "Sélectionnez au moins 2 voitures depuis le showroom pour lancer la comparaison.",
        "comparator.emptyExplore": "Explorer le Showroom", "comparator.slotFree": "Emplacement libre",
        "comparator.select": "Sélectionner", "comparator.criterion": "Critère",
        "cmp.price": "Prix TTC", "cmp.power": "Puissance", "cmp.accel": "0 - 100 km/h",
        "cmp.topSpeed": "Vitesse max", "cmp.energy": "Énergie", "cmp.engine": "Motorisation",
        "cmp.transmission": "Transmission", "cmp.weight": "Poids à vide",
        "award.cheapest": "Le moins cher", "award.powerful": "Plus puissant",
        "award.fastest": "Le plus rapide", "award.topSpeed": "Vitesse max supérieure",
        "cursor.title": "Choisir mon curseur",
        "cursor.desc": "Personnalisez votre expérience de navigation en choisissant le style de curseur qui vous correspond. Votre choix est sauvegardé automatiquement.",
        "cursor.active": "Actif",
        "cursor.notice": "Le curseur personnalisé est désactivé automatiquement sur les appareils tactiles.",
        "cursor.reset": "Réinitialiser", "cursor.default": "Défaut", "cursor.defaultDesc": "Curseur par défaut du site",
        "cursor.mercedesDesc": "Curseur Mercedes-Benz", "cursor.audiDesc": "Curseur Audi Sport",
        "toast.favAdded": "Véhicule enregistré dans votre garage !", "toast.favRemoved": "Véhicule retiré de votre garage",
        "toast.cmpAdded": "Véhicule ajouté au comparateur !", "toast.cmpRemoved": "Véhicule retiré du comparateur",
        "toast.cmpMax": "Maximum 4 véhicules dans le comparateur.", "toast.cmpCleared": "Comparateur vidé",
        "toast.cursorSet": "Curseur « {name} » activé ✨", "toast.cookiesReset": "Préférences cookies réinitialisées",
        "cookies.text": "🍪 Cookies pour le fonctionnement du site et la mesure d'audience.",
        "cookies.learnMore": "En savoir plus", "cookies.accept": "Accepter", "cookies.refuse": "Refuser",
        "footer.tagline": "Le showroom digital des hypercars et voitures d'exception. Conçu pour l'excellence et la vitesse.",
        "footer.accessibility": "Accessibilité : partiellement conforme", "footer.accessibilityLink": "Voir la déclaration",
        "footer.legalTitle": "Informations légales", "footer.helpTitle": "Aide & Conformité",
        "footer.legal": "Mentions légales", "footer.privacy": "Politique de confidentialité",
        "footer.cookiesLink": "Gestion des cookies", "footer.cgv": "Conditions d'utilisation",
        "footer.cursor": "Personnaliser le curseur", "footer.accessibilityLink2": "Déclaration d'accessibilité",
        "footer.agec": "Transparence & environnement", "footer.modifyCookies": "Modifier mes préférences cookies",
        "footer.copyright": "© 2026 Velqora Motors SAS — Tous droits réservés.",
        "footer.notice": "Site vitrine informatif — Aucune vente en ligne",
        "backToTop": "Retour en haut de page",
        "lightbox.close": "Fermer", "lightbox.prev": "Image précédente", "lightbox.next": "Image suivante", "lightbox.aria": "Galerie photos",
        "page.catalog.aria": "Showroom", "page.details.aria": "Fiche détaillée", "page.garage.aria": "Mon garage",
        "page.comparator.aria": "Comparateur", "page.cursor.aria": "Personnalisation du curseur",
        "legal.title": "Mentions Légales", "privacy.title": "Politique de Confidentialité",
        "privacy.subtitle": "Conformément au Règlement Général sur la Protection des Données (RGPD)",
        "cookies.pageTitle": "Gestion des Cookies",
        "cookies.subtitle": "Conformément à la directive ePrivacy et aux recommandations de la CNIL",
        "cookies.reset": "Réinitialiser mes préférences",
        "cgv.title": "Conditions Générales d'Utilisation",
        "accessibility.title": "Déclaration d'Accessibilité",
        "agec.title": "Transparence & Environnement",
        "legal.notice": "Le texte juridique détaillé est disponible en français."
    },
    en: {
        "lang.change": "Change language",
        "nav.showroom": "Showroom", "nav.garage": "Garage", "nav.comparator": "Comparator", "nav.cursor": "Cursor",
        "nav.openMenu": "Open navigation menu", "nav.main": "Main navigation",
        "hero.desc": "Enter the elite of exceptional automobiles. Analyze extreme performance, compare lap times and build your dream garage.",
        "hero.explore": "Explore Showroom", "hero.compare": "Start Comparator",
        "search.placeholder": "Search (e.g. bug tour, ferrari hybrid...)", "search.aria": "Search for a vehicle",
        "energy.all": "All", "energy.Thermique": "Combustion", "energy.Hybride": "Hybrid", "energy.Électrique": "Electric",
        "filters.show": "Show advanced filters", "filters.hide": "Hide advanced filters",
        "filters.brand": "Brand", "filters.allBrands": "All brands",
        "filters.maxPrice": "Max Price", "filters.sort": "Sort by",
        "sort.featured": "Featured", "sort.priceDesc": "Price: high to low", "sort.priceAsc": "Price: low to high",
        "sort.powerDesc": "Maximum power", "sort.speedDesc": "Top speed",
        "card.power": "Power", "card.accel": "0-60 mph", "card.topSpeed": "Top speed",
        "card.details": "View details", "card.compare": "Compare", "card.compared": "Compared",
        "card.addFav": "Add to garage", "card.removeFav": "Remove from garage",
        "results.one": "1 vehicle shown", "results.many": "{n} vehicles shown",
        "noResults.title": "No vehicle matches your search",
        "noResults.desc": "Change your criteria or reset the filters to explore the catalog.",
        "noResults.reset": "Reset filters",
        "details.back": "Back to showroom", "details.price": "Indicative price",
        "details.inComparator": "In comparator", "details.presentation": "Model presentation",
        "details.specs": "Specifications & Performance",
        "spec.power": "Maximum Power", "spec.torque": "Torque", "spec.accel": "0 to 60 mph",
        "spec.topSpeed": "Top Speed", "spec.range": "Range & Energy", "spec.weight": "Kerb weight",
        "spec.engine": "Engine", "spec.transmission": "Transmission",
        "garage.title": "My Personal Garage", "garage.desc": "All your saved favourite vehicles in one place.",
        "garage.addModels": "Add models", "garage.emptyTitle": "Your garage is empty",
        "garage.emptyDesc": "Click the bookmark icon on any car to add it here.",
        "garage.explore": "Explore Showroom", "garage.viewCard": "View details",
        "comparator.title": "Performance Comparator",
        "comparator.desc": "Select up to 4 vehicles to compare their specs in real time.",
        "comparator.clear": "Clear", "comparator.add": "Add",
        "comparator.matrix": "Comparison Matrix",
        "comparator.matrixHint": "Best performances are automatically highlighted in green.",
        "comparator.emptyTitle": "No vehicle selected",
        "comparator.emptyDesc": "Select at least 2 cars from the showroom to start comparing.",
        "comparator.emptyExplore": "Explore Showroom", "comparator.slotFree": "Empty slot",
        "comparator.select": "Select", "comparator.criterion": "Criterion",
        "cmp.price": "Price", "cmp.power": "Power", "cmp.accel": "0 - 60 mph",
        "cmp.topSpeed": "Top speed", "cmp.energy": "Energy", "cmp.engine": "Engine",
        "cmp.transmission": "Transmission", "cmp.weight": "Kerb weight",
        "award.cheapest": "Cheapest", "award.powerful": "Most powerful",
        "award.fastest": "Fastest", "award.topSpeed": "Highest top speed",
        "cursor.title": "Choose my cursor",
        "cursor.desc": "Personalize your browsing experience by choosing the cursor style that suits you. Your choice is saved automatically.",
        "cursor.active": "Active",
        "cursor.notice": "Custom cursor is automatically disabled on touch devices.",
        "cursor.reset": "Reset", "cursor.default": "Default", "cursor.defaultDesc": "Default site cursor",
        "cursor.mercedesDesc": "Mercedes-Benz cursor", "cursor.audiDesc": "Audi Sport cursor",
        "toast.favAdded": "Vehicle saved to your garage!", "toast.favRemoved": "Vehicle removed from your garage",
        "toast.cmpAdded": "Vehicle added to comparator!", "toast.cmpRemoved": "Vehicle removed from comparator",
        "toast.cmpMax": "Maximum 4 vehicles in the comparator.", "toast.cmpCleared": "Comparator cleared",
        "toast.cursorSet": "Cursor \"{name}\" activated ✨", "toast.cookiesReset": "Cookie preferences reset",
        "cookies.text": "🍪 Cookies for site operation and audience measurement.",
        "cookies.learnMore": "Learn more", "cookies.accept": "Accept", "cookies.refuse": "Refuse",
        "footer.tagline": "The digital showroom for hypercars and exceptional automobiles. Built for excellence and speed.",
        "footer.accessibility": "Accessibility: partially compliant", "footer.accessibilityLink": "View declaration",
        "footer.legalTitle": "Legal information", "footer.helpTitle": "Help & Compliance",
        "footer.legal": "Legal notice", "footer.privacy": "Privacy policy",
        "footer.cookiesLink": "Cookie management", "footer.cgv": "Terms of use",
        "footer.cursor": "Customize cursor", "footer.accessibilityLink2": "Accessibility declaration",
        "footer.agec": "Transparency & environment", "footer.modifyCookies": "Modify my cookie preferences",
        "footer.copyright": "© 2026 Velqora Motors SAS — All rights reserved.",
        "footer.notice": "Informational showcase — No online sales",
        "backToTop": "Back to top",
        "lightbox.close": "Close", "lightbox.prev": "Previous image", "lightbox.next": "Next image", "lightbox.aria": "Photo gallery",
        "page.catalog.aria": "Showroom", "page.details.aria": "Vehicle details", "page.garage.aria": "My garage",
        "page.comparator.aria": "Comparator", "page.cursor.aria": "Cursor customization",
        "legal.title": "Legal Notice", "privacy.title": "Privacy Policy",
        "privacy.subtitle": "In accordance with the General Data Protection Regulation (GDPR)",
        "cookies.pageTitle": "Cookie Management",
        "cookies.subtitle": "In accordance with the ePrivacy Directive and CNIL guidelines",
        "cookies.reset": "Reset my preferences",
        "cgv.title": "Terms of Use",
        "accessibility.title": "Accessibility Declaration",
        "agec.title": "Transparency & Environment",
        "legal.notice": "The detailed legal text is only available in French."
    },
    es: {
        "lang.change": "Cambiar idioma",
        "nav.showroom": "Showroom", "nav.garage": "Garaje", "nav.comparator": "Comparador", "nav.cursor": "Cursor",
        "nav.openMenu": "Abrir menú de navegación", "nav.main": "Navegación principal",
        "hero.desc": "Entra en la élite del automóvil de excepción. Analiza prestaciones extremas, compara cronos y construye tu garaje soñado.",
        "hero.explore": "Explorar Showroom", "hero.compare": "Iniciar Comparador",
        "search.placeholder": "Buscar (ej: bug tour, ferrari híbrido...)", "search.aria": "Buscar un vehículo",
        "energy.all": "Todos", "energy.Thermique": "Térmico", "energy.Hybride": "Híbrido", "energy.Électrique": "Eléctrico",
        "filters.show": "Mostrar filtros avanzados", "filters.hide": "Ocultar filtros avanzados",
        "filters.brand": "Marca", "filters.allBrands": "Todas las marcas",
        "filters.maxPrice": "Precio máx.", "filters.sort": "Ordenar por",
        "sort.featured": "Destacados", "sort.priceDesc": "Precio descendente", "sort.priceAsc": "Precio ascendente",
        "sort.powerDesc": "Potencia máxima", "sort.speedDesc": "Velocidad máxima",
        "card.power": "Potencia", "card.accel": "0-100 km/h", "card.topSpeed": "Vel. máx.",
        "card.details": "Ficha detallada", "card.compare": "Comparar", "card.compared": "Comparado",
        "card.addFav": "Añadir al garaje", "card.removeFav": "Quitar del garaje",
        "results.one": "1 vehículo mostrado", "results.many": "{n} vehículos mostrados",
        "noResults.title": "Ningún vehículo coincide",
        "noResults.desc": "Modifica tus criterios o reinicia los filtros para explorar el catálogo.",
        "noResults.reset": "Reiniciar",
        "details.back": "Volver al showroom", "details.price": "Precio indicativo",
        "details.inComparator": "En el comparador", "details.presentation": "Presentación del modelo",
        "details.specs": "Ficha Técnica y Prestaciones",
        "spec.power": "Potencia Máxima", "spec.torque": "Par Motor", "spec.accel": "0 a 100 km/h",
        "spec.topSpeed": "Velocidad Máxima", "spec.range": "Autonomía y Energía", "spec.weight": "Peso en vacío",
        "spec.engine": "Motor", "spec.transmission": "Transmisión",
        "garage.title": "Mi Garaje Personal", "garage.desc": "Encuentra todos tus vehículos guardados como favoritos.",
        "garage.addModels": "Añadir modelos", "garage.emptyTitle": "Tu garaje está vacío",
        "garage.emptyDesc": "Haz clic en el icono de marcador en cualquier coche para añadirlo aquí.",
        "garage.explore": "Explorar Showroom", "garage.viewCard": "Ver ficha",
        "comparator.title": "Comparador de Prestaciones",
        "comparator.desc": "Selecciona hasta 4 vehículos para comparar sus fichas técnicas en tiempo real.",
        "comparator.clear": "Vaciar", "comparator.add": "Añadir",
        "comparator.matrix": "Matriz Comparativa",
        "comparator.matrixHint": "Las mejores prestaciones se resaltan automáticamente en verde.",
        "comparator.emptyTitle": "Ningún vehículo seleccionado",
        "comparator.emptyDesc": "Selecciona al menos 2 coches desde el showroom para iniciar la comparación.",
        "comparator.emptyExplore": "Explorar Showroom", "comparator.slotFree": "Espacio libre",
        "comparator.select": "Seleccionar", "comparator.criterion": "Criterio",
        "cmp.price": "Precio", "cmp.power": "Potencia", "cmp.accel": "0 - 100 km/h",
        "cmp.topSpeed": "Vel. máx.", "cmp.energy": "Energía", "cmp.engine": "Motorización",
        "cmp.transmission": "Transmisión", "cmp.weight": "Peso en vacío",
        "award.cheapest": "Más barato", "award.powerful": "Más potente",
        "award.fastest": "Más rápido", "award.topSpeed": "Mayor velocidad",
        "cursor.title": "Elegir mi cursor",
        "cursor.desc": "Personaliza tu experiencia de navegación eligiendo el estilo de cursor que te corresponda. Tu elección se guarda automáticamente.",
        "cursor.active": "Activo",
        "cursor.notice": "El cursor personalizado se desactiva automáticamente en dispositivos táctiles.",
        "cursor.reset": "Reiniciar", "cursor.default": "Predeterminado", "cursor.defaultDesc": "Cursor predeterminado del sitio",
        "cursor.mercedesDesc": "Cursor Mercedes-Benz", "cursor.audiDesc": "Cursor Audi Sport",
        "toast.favAdded": "¡Vehículo guardado en tu garaje!", "toast.favRemoved": "Vehículo eliminado de tu garaje",
        "toast.cmpAdded": "¡Vehículo añadido al comparador!", "toast.cmpRemoved": "Vehículo eliminado del comparador",
        "toast.cmpMax": "Máximo 4 vehículos en el comparador.", "toast.cmpCleared": "Comparador vaciado",
        "toast.cursorSet": "Cursor «{name}» activado ✨", "toast.cookiesReset": "Preferencias de cookies reiniciadas",
        "cookies.text": "🍪 Cookies para el funcionamiento del sitio y la medición de audiencia.",
        "cookies.learnMore": "Más información", "cookies.accept": "Aceptar", "cookies.refuse": "Rechazar",
        "footer.tagline": "El showroom digital de hipercoches y automóviles de excepción. Diseñado para la excelencia y la velocidad.",
        "footer.accessibility": "Accesibilidad: parcialmente conforme", "footer.accessibilityLink": "Ver declaración",
        "footer.legalTitle": "Información legal", "footer.helpTitle": "Ayuda y Conformidad",
        "footer.legal": "Aviso legal", "footer.privacy": "Política de privacidad",
        "footer.cookiesLink": "Gestión de cookies", "footer.cgv": "Condiciones de uso",
        "footer.cursor": "Personalizar cursor", "footer.accessibilityLink2": "Declaración de accesibilidad",
        "footer.agec": "Transparencia y medioambiente", "footer.modifyCookies": "Modificar mis preferencias de cookies",
        "footer.copyright": "© 2026 Velqora Motors SAS — Todos los derechos reservados.",
        "footer.notice": "Sitio informativo — Sin venta online",
        "backToTop": "Volver arriba",
        "lightbox.close": "Cerrar", "lightbox.prev": "Imagen anterior", "lightbox.next": "Imagen siguiente", "lightbox.aria": "Galería de fotos",
        "page.catalog.aria": "Showroom", "page.details.aria": "Ficha detallada", "page.garage.aria": "Mi garaje",
        "page.comparator.aria": "Comparador", "page.cursor.aria": "Personalización del cursor",
        "legal.title": "Aviso Legal", "privacy.title": "Política de Privacidad",
        "privacy.subtitle": "De conformidad con el Reglamento General de Protección de Datos (RGPD)",
        "cookies.pageTitle": "Gestión de Cookies",
        "cookies.subtitle": "De conformidad con la directiva ePrivacy y las recomendaciones de la CNIL",
        "cookies.reset": "Reiniciar mis preferencias",
        "cgv.title": "Condiciones Generales de Uso",
        "accessibility.title": "Declaración de Accesibilidad",
        "agec.title": "Transparencia y Medioambiente",
        "legal.notice": "El texto legal detallado solo está disponible en francés."
    },
    de: {
        "lang.change": "Sprache ändern",
        "nav.showroom": "Showroom", "nav.garage": "Garage", "nav.comparator": "Vergleich", "nav.cursor": "Cursor",
        "nav.openMenu": "Navigationsmenü öffnen", "nav.main": "Hauptnavigation",
        "hero.desc": "Betreten Sie die Elite der außergewöhnlichen Automobile. Analysieren Sie extreme Leistungen, vergleichen Sie Rundenzeiten und stellen Sie Ihre Traumgarage zusammen.",
        "hero.explore": "Showroom entdecken", "hero.compare": "Vergleich starten",
        "search.placeholder": "Suchen (z.B. bug tour, ferrari hybrid...)", "search.aria": "Fahrzeug suchen",
        "energy.all": "Alle", "energy.Thermique": "Verbrenner", "energy.Hybride": "Hybrid", "energy.Électrique": "Elektro",
        "filters.show": "Erweiterte Filter anzeigen", "filters.hide": "Erweiterte Filter ausblenden",
        "filters.brand": "Marke", "filters.allBrands": "Alle Marken",
        "filters.maxPrice": "Max. Preis", "filters.sort": "Sortieren nach",
        "sort.featured": "Empfohlen", "sort.priceDesc": "Preis absteigend", "sort.priceAsc": "Preis aufsteigend",
        "sort.powerDesc": "Maximale Leistung", "sort.speedDesc": "Höchstgeschwindigkeit",
        "card.power": "Leistung", "card.accel": "0-100 km/h", "card.topSpeed": "Höchstgeschw.",
        "card.details": "Details ansehen", "card.compare": "Vergleichen", "card.compared": "Verglichen",
        "card.addFav": "Zur Garage hinzufügen", "card.removeFav": "Aus Garage entfernen",
        "results.one": "1 Fahrzeug angezeigt", "results.many": "{n} Fahrzeuge angezeigt",
        "noResults.title": "Kein Fahrzeug entspricht",
        "noResults.desc": "Ändern Sie Ihre Kriterien oder setzen Sie die Filter zurück.",
        "noResults.reset": "Zurücksetzen",
        "details.back": "Zurück zum Showroom", "details.price": "Richtpreis",
        "details.inComparator": "Im Vergleich", "details.presentation": "Modellvorstellung",
        "details.specs": "Technische Daten & Leistung",
        "spec.power": "Maximale Leistung", "spec.torque": "Drehmoment", "spec.accel": "0 bis 100 km/h",
        "spec.topSpeed": "Höchstgeschwindigkeit", "spec.range": "Reichweite & Energie", "spec.weight": "Leergewicht",
        "spec.engine": "Motor", "spec.transmission": "Getriebe",
        "garage.title": "Meine persönliche Garage", "garage.desc": "Alle Ihre als Favoriten gespeicherten Fahrzeuge.",
        "garage.addModels": "Modelle hinzufügen", "garage.emptyTitle": "Ihre Garage ist leer",
        "garage.emptyDesc": "Klicken Sie auf das Lesezeichen-Symbol eines Fahrzeugs, um es hier hinzuzufügen.",
        "garage.explore": "Showroom entdecken", "garage.viewCard": "Details ansehen",
        "comparator.title": "Leistungsvergleich",
        "comparator.desc": "Wählen Sie bis zu 4 Fahrzeuge, um die technischen Daten in Echtzeit zu vergleichen.",
        "comparator.clear": "Leeren", "comparator.add": "Hinzufügen",
        "comparator.matrix": "Vergleichsmatrix",
        "comparator.matrixHint": "Die besten Leistungen werden automatisch grün hervorgehoben.",
        "comparator.emptyTitle": "Kein Fahrzeug ausgewählt",
        "comparator.emptyDesc": "Wählen Sie mindestens 2 Fahrzeuge aus dem Showroom.",
        "comparator.emptyExplore": "Showroom entdecken", "comparator.slotFree": "Freier Platz",
        "comparator.select": "Auswählen", "comparator.criterion": "Kriterium",
        "cmp.price": "Preis", "cmp.power": "Leistung", "cmp.accel": "0 - 100 km/h",
        "cmp.topSpeed": "Höchstgeschw.", "cmp.energy": "Energie", "cmp.engine": "Motorisierung",
        "cmp.transmission": "Getriebe", "cmp.weight": "Leergewicht",
        "award.cheapest": "Günstigster", "award.powerful": "Stärkster",
        "award.fastest": "Schnellster", "award.topSpeed": "Höchste Geschwindigkeit",
        "cursor.title": "Meinen Cursor wählen",
        "cursor.desc": "Personalisieren Sie Ihr Browsing-Erlebnis mit dem passenden Cursorstil. Ihre Wahl wird automatisch gespeichert.",
        "cursor.active": "Aktiv",
        "cursor.notice": "Der benutzerdefinierte Cursor ist auf Touch-Geräten deaktiviert.",
        "cursor.reset": "Zurücksetzen", "cursor.default": "Standard", "cursor.defaultDesc": "Standard-Seiten-Cursor",
        "cursor.mercedesDesc": "Mercedes-Benz-Cursor", "cursor.audiDesc": "Audi-Sport-Cursor",
        "toast.favAdded": "Fahrzeug in Ihrer Garage gespeichert!", "toast.favRemoved": "Fahrzeug aus Ihrer Garage entfernt",
        "toast.cmpAdded": "Fahrzeug zum Vergleich hinzugefügt!", "toast.cmpRemoved": "Fahrzeug aus dem Vergleich entfernt",
        "toast.cmpMax": "Maximal 4 Fahrzeuge im Vergleich.", "toast.cmpCleared": "Vergleich geleert",
        "toast.cursorSet": "Cursor „{name}“ aktiviert ✨", "toast.cookiesReset": "Cookie-Einstellungen zurückgesetzt",
        "cookies.text": "🍪 Cookies für den Betrieb der Website und die Reichweitenmessung.",
        "cookies.learnMore": "Mehr erfahren", "cookies.accept": "Akzeptieren", "cookies.refuse": "Ablehnen",
        "footer.tagline": "Der digitale Showroom für Hypercars und außergewöhnliche Automobile. Gebaut für Exzellenz und Geschwindigkeit.",
        "footer.accessibility": "Barrierefreiheit: teilweise konform", "footer.accessibilityLink": "Erklärung ansehen",
        "footer.legalTitle": "Rechtliche Informationen", "footer.helpTitle": "Hilfe & Konformität",
        "footer.legal": "Impressum", "footer.privacy": "Datenschutzerklärung",
        "footer.cookiesLink": "Cookie-Verwaltung", "footer.cgv": "Nutzungsbedingungen",
        "footer.cursor": "Cursor anpassen", "footer.accessibilityLink2": "Erklärung zur Barrierefreiheit",
        "footer.agec": "Transparenz & Umwelt", "footer.modifyCookies": "Meine Cookie-Einstellungen ändern",
        "footer.copyright": "© 2026 Velqora Motors SAS — Alle Rechte vorbehalten.",
        "footer.notice": "Informationswebsite — Kein Online-Verkauf",
        "backToTop": "Nach oben",
        "lightbox.close": "Schließen", "lightbox.prev": "Vorheriges Bild", "lightbox.next": "Nächstes Bild", "lightbox.aria": "Fotogalerie",
        "page.catalog.aria": "Showroom", "page.details.aria": "Fahrzeugdetails", "page.garage.aria": "Meine Garage",
        "page.comparator.aria": "Vergleich", "page.cursor.aria": "Cursor-Anpassung",
        "legal.title": "Impressum", "privacy.title": "Datenschutzerklärung",
        "privacy.subtitle": "Gemäß der Datenschutz-Grundverordnung (DSGVO)",
        "cookies.pageTitle": "Cookie-Verwaltung",
        "cookies.subtitle": "Gemäß der ePrivacy-Richtlinie und den CNIL-Empfehlungen",
        "cookies.reset": "Meine Einstellungen zurücksetzen",
        "cgv.title": "Nutzungsbedingungen",
        "accessibility.title": "Erklärung zur Barrierefreiheit",
        "agec.title": "Transparenz & Umwelt",
        "legal.notice": "Der detaillierte Rechtstext ist nur auf Französisch verfügbar."
    },
    it: {
        "lang.change": "Cambia lingua",
        "nav.showroom": "Showroom", "nav.garage": "Garage", "nav.comparator": "Comparatore", "nav.cursor": "Cursore",
        "nav.openMenu": "Apri menu di navigazione", "nav.main": "Navigazione principale",
        "hero.desc": "Entra nell'élite dell'automobile d'eccezione. Analizza prestazioni estreme, confronta i tempi e costruisci il tuo garage da sogno.",
        "hero.explore": "Esplora lo Showroom", "hero.compare": "Avvia il Comparatore",
        "search.placeholder": "Cerca (es: bug tour, ferrari ibrida...)", "search.aria": "Cerca un veicolo",
        "energy.all": "Tutti", "energy.Thermique": "Termico", "energy.Hybride": "Ibrido", "energy.Électrique": "Elettrico",
        "filters.show": "Mostra filtri avanzati", "filters.hide": "Nascondi filtri avanzati",
        "filters.brand": "Marca", "filters.allBrands": "Tutte le marche",
        "filters.maxPrice": "Prezzo max", "filters.sort": "Ordina per",
        "sort.featured": "In evidenza", "sort.priceDesc": "Prezzo decrescente", "sort.priceAsc": "Prezzo crescente",
        "sort.powerDesc": "Potenza massima", "sort.speedDesc": "Velocità massima",
        "card.power": "Potenza", "card.accel": "0-100 km/h", "card.topSpeed": "Vel. max",
        "card.details": "Scheda dettagliata", "card.compare": "Confronta", "card.compared": "Confrontato",
        "card.addFav": "Aggiungi al garage", "card.removeFav": "Rimuovi dal garage",
        "results.one": "1 veicolo mostrato", "results.many": "{n} veicoli mostrati",
        "noResults.title": "Nessun veicolo corrisponde",
        "noResults.desc": "Modifica i criteri o reimposta i filtri per esplorare il catalogo.",
        "noResults.reset": "Reimposta",
        "details.back": "Torna allo showroom", "details.price": "Prezzo indicativo",
        "details.inComparator": "Nel comparatore", "details.presentation": "Presentazione del modello",
        "details.specs": "Scheda Tecnica & Prestazioni",
        "spec.power": "Potenza Massima", "spec.torque": "Coppia Motore", "spec.accel": "0 a 100 km/h",
        "spec.topSpeed": "Velocità Massima", "spec.range": "Autonomia & Energia", "spec.weight": "Peso a vuoto",
        "spec.engine": "Motore", "spec.transmission": "Trasmissione",
        "garage.title": "Il Mio Garage Personale", "garage.desc": "Tutti i tuoi veicoli salvati nei preferiti.",
        "garage.addModels": "Aggiungi modelli", "garage.emptyTitle": "Il tuo garage è vuoto",
        "garage.emptyDesc": "Clicca sull'icona del segnalibro di qualsiasi auto per aggiungerla qui.",
        "garage.explore": "Esplora lo Showroom", "garage.viewCard": "Vedi scheda",
        "comparator.title": "Comparatore di Prestazioni",
        "comparator.desc": "Seleziona fino a 4 veicoli per confrontare le schede tecniche in tempo reale.",
        "comparator.clear": "Svuota", "comparator.add": "Aggiungi",
        "comparator.matrix": "Matrice Comparativa",
        "comparator.matrixHint": "Le migliori prestazioni sono evidenziate automaticamente in verde.",
        "comparator.emptyTitle": "Nessun veicolo selezionato",
        "comparator.emptyDesc": "Seleziona almeno 2 auto dallo showroom per iniziare il confronto.",
        "comparator.emptyExplore": "Esplora lo Showroom", "comparator.slotFree": "Slot libero",
        "comparator.select": "Seleziona", "comparator.criterion": "Criterio",
        "cmp.price": "Prezzo", "cmp.power": "Potenza", "cmp.accel": "0 - 100 km/h",
        "cmp.topSpeed": "Vel. max", "cmp.energy": "Energia", "cmp.engine": "Motorizzazione",
        "cmp.transmission": "Trasmissione", "cmp.weight": "Peso a vuoto",
        "award.cheapest": "Meno caro", "award.powerful": "Più potente",
        "award.fastest": "Più veloce", "award.topSpeed": "Velocità massima superiore",
        "cursor.title": "Scegli il mio cursore",
        "cursor.desc": "Personalizza la tua esperienza di navigazione scegliendo lo stile di cursore che ti si addice. La tua scelta viene salvata automaticamente.",
        "cursor.active": "Attivo",
        "cursor.notice": "Il cursore personalizzato è disattivato automaticamente sui dispositivi touch.",
        "cursor.reset": "Reimposta", "cursor.default": "Predefinito", "cursor.defaultDesc": "Cursore predefinito del sito",
        "cursor.mercedesDesc": "Cursore Mercedes-Benz", "cursor.audiDesc": "Cursore Audi Sport",
        "toast.favAdded": "Veicolo salvato nel tuo garage!", "toast.favRemoved": "Veicolo rimosso dal tuo garage",
        "toast.cmpAdded": "Veicolo aggiunto al comparatore!", "toast.cmpRemoved": "Veicolo rimosso dal comparatore",
        "toast.cmpMax": "Massimo 4 veicoli nel comparatore.", "toast.cmpCleared": "Comparatore svuotato",
        "toast.cursorSet": "Cursore «{name}» attivato ✨", "toast.cookiesReset": "Preferenze cookie reimpostate",
        "cookies.text": "🍪 Cookie per il funzionamento del sito e la misurazione dell'audience.",
        "cookies.learnMore": "Scopri di più", "cookies.accept": "Accetta", "cookies.refuse": "Rifiuta",
        "footer.tagline": "Lo showroom digitale per hypercar e automobili d'eccezione. Costruito per l'eccellenza e la velocità.",
        "footer.accessibility": "Accessibilità: parzialmente conforme", "footer.accessibilityLink": "Vedi dichiarazione",
        "footer.legalTitle": "Informazioni legali", "footer.helpTitle": "Aiuto & Conformità",
        "footer.legal": "Note legali", "footer.privacy": "Informativa sulla privacy",
        "footer.cookiesLink": "Gestione cookie", "footer.cgv": "Condizioni d'uso",
        "footer.cursor": "Personalizza cursore", "footer.accessibilityLink2": "Dichiarazione di accessibilità",
        "footer.agec": "Trasparenza & ambiente", "footer.modifyCookies": "Modifica le mie preferenze cookie",
        "footer.copyright": "© 2026 Velqora Motors SAS — Tutti i diritti riservati.",
        "footer.notice": "Sito informativo — Nessuna vendita online",
        "backToTop": "Torna in alto",
        "lightbox.close": "Chiudi", "lightbox.prev": "Immagine precedente", "lightbox.next": "Immagine successiva", "lightbox.aria": "Galleria fotografica",
        "page.catalog.aria": "Showroom", "page.details.aria": "Scheda dettagliata", "page.garage.aria": "Il mio garage",
        "page.comparator.aria": "Comparatore", "page.cursor.aria": "Personalizzazione cursore",
        "legal.title": "Note Legali", "privacy.title": "Informativa sulla Privacy",
        "privacy.subtitle": "In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR)",
        "cookies.pageTitle": "Gestione dei Cookie",
        "cookies.subtitle": "In conformità con la direttiva ePrivacy e le raccomandazioni CNIL",
        "cookies.reset": "Reimposta le mie preferenze",
        "cgv.title": "Condizioni Generali d'Uso",
        "accessibility.title": "Dichiarazione di Accessibilità",
        "agec.title": "Trasparenza & Ambiente",
        "legal.notice": "Il testo legale dettagliato è disponibile solo in francese."
    }
};

/* ============================================================================
   5. STATE GLOBAL
   ============================================================================ */
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

/* ============================================================================
   6. UTILITAIRES
   ============================================================================ */
const Utils = {
    escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    debounce(fn, delay) {
        let id;
        return (...args) => {
            clearTimeout(id);
            id = setTimeout(() => fn(...args), delay);
        };
    },
    isTouchDevice() { return window.matchMedia('(hover: none)').matches; },
    isSmallScreen() { return window.matchMedia('(max-width: 768px)').matches; }
};

/* ============================================================================
   7. STORAGE
   ============================================================================ */
const Storage = {
    parseArray(key, { maxLength = Infinity, validIds = null } = {}) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            let items = parsed.filter(x => typeof x === 'string');
            if (validIds) items = items.filter(id => validIds.has(id));
            items = [...new Set(items)];
            return items.slice(0, maxLength);
        } catch { return []; }
    },
    getString(key, allowedValues = null) {
        try {
            const val = localStorage.getItem(key);
            if (val === null) return null;
            if (allowedValues && !allowedValues.includes(val)) return null;
            return val;
        } catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); return true; } catch { return false; }
    },
    remove(key) { try { localStorage.removeItem(key); } catch {} },
    migrateLegacy() {
        try {
            Object.keys(CONFIG.storageKeys).forEach(k => {
                const oldKey = CONFIG.legacyKeys[k];
                const newKey = CONFIG.storageKeys[k];
                if (oldKey && localStorage.getItem(oldKey) !== null
                    && localStorage.getItem(newKey) === null) {
                    localStorage.setItem(newKey, localStorage.getItem(oldKey));
                    localStorage.removeItem(oldKey);
                }
            });
        } catch {}
    },
    loadUserData() {
        State.favorites = this.parseArray(CONFIG.storageKeys.favorites, { validIds: VALID_CAR_IDS });
        State.selected  = this.parseArray(CONFIG.storageKeys.compare,   { validIds: VALID_CAR_IDS, maxLength: CONFIG.maxCompare });
    },
    saveUserData() {
        this.set(CONFIG.storageKeys.favorites, JSON.stringify(State.favorites));
        this.set(CONFIG.storageKeys.compare,   JSON.stringify(State.selected));
    }
};

/* ============================================================================
   8. i18n
   ============================================================================ */
const I18n = {
    t(key, params) {
        const dict = TRANSLATIONS[State.lang] || TRANSLATIONS.fr;
        const str = dict[key] ?? TRANSLATIONS.fr[key] ?? key;
        if (!params) return str;
        return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '');
    },
    locale() { return LANGUAGES.find(l => l.code === State.lang)?.locale || 'fr-FR'; },
    formatPrice(value) { return value.toLocaleString(this.locale()) + '\u202F€'; },
    translateEnergy(energyFr) { return ENERGY_MAP[energyFr]?.[State.lang] || energyFr; },
    detect() {
        const saved = Storage.getString(CONFIG.storageKeys.lang, VALID_LANGS);
        if (saved) return saved;
        const navLang = (navigator.language || 'fr').slice(0, 2).toLowerCase();
        return VALID_LANGS.includes(navLang) ? navLang : 'fr';
    },
    apply(code) {
        if (!VALID_LANGS.includes(code)) code = 'fr';
        State.lang = code;
        Storage.set(CONFIG.storageKeys.lang, code);
        document.documentElement.setAttribute('lang', code);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = this.t(key);
            if (translated && translated !== key) el.textContent = translated;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.setAttribute('placeholder', this.t(el.getAttribute('data-i18n-placeholder')));
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            el.setAttribute('aria-label', this.t(el.getAttribute('data-i18n-aria-label')));
        });

        this.updateEnergyButtons();
        this.renderLangMenus();
        document.querySelectorAll('[data-legal-notice]').forEach(el => {
            el.classList.toggle('hidden', code === 'fr');
        });

        Catalog.filter();
        CursorPage.render();
        Garage.renderIfVisible();
        Comparator.renderIfVisible();
        if (State.currentCarId && !Views.isHidden('details')) {
            Details.open(State.currentCarId, { refresh: true });
        }
        Catalog.updatePriceLabel();

        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) ogLocale.setAttribute('content', this.locale().replace('-', '_'));
    },
    updateEnergyButtons() {
        const map = {
            all: 'energy.all', 'Thermique': 'energy.Thermique',
            'Hybride': 'energy.Hybride', 'Électrique': 'energy.Électrique'
        };
        Object.entries(map).forEach(([id, key]) => {
            const btn = document.getElementById('energy-' + id);
            if (btn) btn.textContent = this.t(key);
        });
    },
    renderLangMenus() {
        const menu = document.getElementById('lang-menu');
        if (menu) {
            menu.innerHTML = LANGUAGES.map(l => `
                <button role="option" aria-selected="${l.code === State.lang}"
                        onclick="selectLanguage('${l.code}')" class="lang-item">
                    <span aria-hidden="true">${l.flag}</span>
                    <span>${l.name}</span>
                    <span class="ml-auto text-[10px] font-bold text-zinc-500 tracking-wider">${l.code.toUpperCase()}</span>
                </button>`).join('');
        }
        const current = LANGUAGES.find(l => l.code === State.lang) || LANGUAGES[0];
        const flagEl = document.getElementById('lang-flag-current');
        const codeEl = document.getElementById('lang-code-current');
        if (flagEl) flagEl.textContent = current.flag;
        if (codeEl) codeEl.textContent = current.code.toUpperCase();

        const mobileBox = document.getElementById('lang-flags-mobile');
        if (mobileBox) {
            mobileBox.innerHTML = LANGUAGES.map(l => `
                <button onclick="selectLanguage('${l.code}')" aria-pressed="${l.code === State.lang}"
                        class="px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all
                        ${l.code === State.lang ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-300 border-white/10'}">
                    <span aria-hidden="true">${l.flag}</span>
                    <span>${l.code.toUpperCase()}</span>
                </button>`).join('');
        }
    },
    toggleMenu(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('lang-menu');
        const btn = e?.currentTarget;
        if (!menu) return;
        const willOpen = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    },
    closeMenu() {
        const menu = document.getElementById('lang-menu');
        if (!menu) return;
        menu.classList.add('hidden');
        const btn = document.querySelector('[aria-haspopup="listbox"]');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    },
    select(code) {
        this.apply(code);
        this.closeMenu();
        const mm = document.getElementById('mobile-menu');
        if (mm && !mm.classList.contains('hidden')) mm.classList.add('hidden');
    }
};

/* ============================================================================
   9. TOAST
   ============================================================================ */
const Toast = {
    show(message, type = 'success') {
        const toast = document.getElementById('toast');
        document.getElementById('toast-message').innerText = message;
        document.getElementById('toast-icon').className =
            type === 'success'
                ? 'fa-solid fa-circle-check text-white'
                : 'fa-solid fa-circle-exclamation text-amber-400';
        toast.classList.remove('translate-y-20', 'opacity-0');
        if (State.timers.toast) clearTimeout(State.timers.toast);
        State.timers.toast = setTimeout(
            () => toast.classList.add('translate-y-20', 'opacity-0'),
            CONFIG.toastDelay
        );
    }
};

/* ============================================================================
   10. CUSTOM CURSOR
   ============================================================================ */
const CustomCursor = {
    init() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        this.el   = document.getElementById('custom-cursor');
        this.dot  = document.getElementById('custom-cursor-dot');
        if (!this.el || !this.dot) return;
        this.mouseX = -100; this.mouseY = -100;
        this.currX  = -100; this.currY  = -100;
        this.bindEvents();
        this.animate();
    },
    bindEvents() {
        document.addEventListener('mousemove', e => {
            this.mouseX = e.clientX; this.mouseY = e.clientY;
            this.dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });
        const hide = () => { this.el.style.opacity = '0'; this.dot.style.opacity = '0'; };
        const show = () => { this.el.style.opacity = '1'; this.dot.style.opacity = '1'; };
        document.addEventListener('mouseleave', hide);
        document.addEventListener('mouseenter', show);
        window.addEventListener('blur',  hide);
        window.addEventListener('focus', show);
    },
    animate() {
        this.currX += (this.mouseX - this.currX) * 0.18;
        this.currY += (this.mouseY - this.currY) * 0.18;
        this.el.style.transform = `translate(${this.currX}px, ${this.currY}px) translate(-50%, -50%)`;
        requestAnimationFrame(() => this.animate());
    }
};

/* ============================================================================
   11. LIGHTBOX
   ============================================================================ */
const Lightbox = {
    open(images, index = 0) {
        if (!images || images.length === 0) return;
        State.lightbox.images = images;
        State.lightbox.index = index;
        this.update();
        const lb = document.getElementById('lightbox');
        lb.classList.remove('hidden'); lb.classList.add('flex');
        document.body.style.overflow = 'hidden';
    },
    openForCar(index) {
        const car = carsData.find(c => c.id === State.currentCarId);
        if (!car) return;
        this.open([car.image, ...car.gallery], index);
    },
    update() {
        const { images, index } = State.lightbox;
        document.getElementById('lightbox-img').src = images[index];
        document.getElementById('lightbox-counter').innerText =
            (index + 1) + ' / ' + images.length;
    },
    close() {
        const lb = document.getElementById('lightbox');
        lb.classList.add('hidden'); lb.classList.remove('flex');
        document.body.style.overflow = '';
    },
    nav(dir) {
        const total = State.lightbox.images.length;
        if (!total) return;
        State.lightbox.index = (State.lightbox.index + dir + total) % total;
        this.update();
    }
};

/* ============================================================================
   12. COOKIES BANNER
   ============================================================================ */
const Cookies = {
    accept() {
        Storage.set(CONFIG.storageKeys.cookies, 'accepted');
        document.getElementById('cookie-banner').classList.add('hidden');
    },
    refuse() {
        Storage.set(CONFIG.storageKeys.cookies, 'refused');
        document.getElementById('cookie-banner').classList.add('hidden');
    },
    reset() {
        Storage.remove(CONFIG.storageKeys.cookies);
        document.getElementById('cookie-banner').classList.remove('hidden');
        Toast.show(I18n.t('toast.cookiesReset'), 'info');
    },
    initBanner() {
        const consent = Storage.getString(CONFIG.storageKeys.cookies, VALID_COOKIE_VALUES);
        if (!consent) document.getElementById('cookie-banner').classList.remove('hidden');
    }
};

/* ============================================================================
   13. VUES
   ============================================================================ */
const Views = {
    switch(viewName) {
        if (State.previousView === 'catalog' && viewName !== 'catalog') {
            State.catalogScrollY = window.scrollY;
        }
        CONFIG.views.forEach(v => {
            const el = document.getElementById(`view-${v}`);
            if (!el) return;
            const isHidden = v !== viewName;
            el.classList.toggle('hidden', isHidden);
            el.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
        });
        CONFIG.navViews.forEach(v => {
            const el = document.getElementById(`nav-${v}`);
            if (!el) return;
            el.className = (v === viewName) ? CONFIG.navClasses.active : CONFIG.navClasses.inactive;
            el.setAttribute('aria-current', v === viewName ? 'page' : 'false');
        });
        document.body.style.overflow = '';
        if (viewName === 'garage')     Garage.render();
        if (viewName === 'comparator') Comparator.render();
        if (viewName === 'cursor')     CursorPage.render();

        if (viewName === 'catalog' && State.previousView !== 'catalog' && State.catalogScrollY > 0) {
            requestAnimationFrame(() => window.scrollTo(0, State.catalogScrollY));
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        State.previousView = viewName;
    },
    isHidden(name) {
        const el = document.getElementById(`view-${name}`);
        return !el || el.classList.contains('hidden');
    }
};

/* ============================================================================
   14. CURSOR PAGE
   ============================================================================ */
const CursorPage = {
    init() {
        const saved = Storage.getString(CONFIG.storageKeys.cursor, VALID_CURSOR_IDS) || 'ring';
        this.apply(saved);
    },
    apply(id) {
        if (!VALID_CURSOR_IDS.includes(id)) id = 'ring';
        State.currentCursor = id;
        document.body.setAttribute('data-cursor', id);
    },
    set(id) {
        this.apply(id);
        Storage.set(CONFIG.storageKeys.cursor, id);
        this.render();
        const style = CURSOR_STYLES.find(s => s.id === id);
        const name = style?.fixedName || I18n.t(style?.i18nName || 'cursor.default');
        Toast.show(I18n.t('toast.cursorSet', { name }), 'info');
    },
    reset() { this.set('ring'); },
    render() {
        const grid = document.getElementById('cursor-grid');
        if (!grid) return;
        grid.innerHTML = CURSOR_STYLES.map(s => {
            const active = s.id === State.currentCursor;
            const name = s.fixedName || I18n.t(s.i18nName);
            const desc = I18n.t(s.i18nDesc);
            return `
                <button onclick="setCursor('${s.id}')" aria-pressed="${active}"
                        class="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center
                        ${active ? 'border-white/40 ring-2 ring-white/30' : ''}">
                    <div class="cursor-preview cursor-preview-${s.preview}" aria-hidden="true"></div>
                    <div>
                        <div class="text-sm font-bold text-white">${Utils.escapeHtml(name)}</div>
                        <div class="text-[11px] text-zinc-400 mt-0.5">${Utils.escapeHtml(desc)}</div>
                    </div>
                    ${active ? `<div class="text-[10px] font-black uppercase tracking-widest text-white bg-white/10 px-2.5 py-1 rounded-full">${Utils.escapeHtml(I18n.t('cursor.active'))}</div>` : ''}
                </button>`;
        }).join('');
    }
};

/* ============================================================================
   15. CATALOGUE
   ============================================================================ */
const Catalog = {
    init() {
        this.populateBrands();
        this.filter();
        this.updatePriceLabel();
        this.bindEvents();
    },
    populateBrands() {
        const select = document.getElementById('brand-filter');
        if (!select) return;
        while (select.options.length > 1) select.remove(1);
        const brands = [...new Set(carsData.map(c => c.brand))]
            .sort((a, b) => a.localeCompare(b, State.lang));
        select.insertAdjacentHTML('beforeend',
            brands.map(b => `<option value="${Utils.escapeHtml(b)}">${Utils.escapeHtml(b)}</option>`).join(''));
    },
    bindEvents() {
        const search = document.getElementById('search-input');
        if (search) {
            const debounced = Utils.debounce(() => this.filter(), CONFIG.searchDebounce);
            search.addEventListener('input', debounced);
        }
        const price = document.getElementById('price-filter');
        if (price) price.addEventListener('input', () => {
            this.updatePriceLabel(); this.filter();
        });
        const brand = document.getElementById('brand-filter');
        if (brand) brand.addEventListener('change', () => this.filter());
        const sort = document.getElementById('sort-select');
        if (sort) sort.addEventListener('change', () => this.filter());
    },
    setEnergy(energy) {
        State.energy = energy;
        document.querySelectorAll('.energy-btn').forEach(btn => {
            btn.className = 'energy-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-white/5 text-zinc-400 border border-white/10';
            btn.setAttribute('aria-pressed', 'false');
        });
        const activeBtn = document.getElementById(`energy-${energy}`);
        if (activeBtn) {
            activeBtn.className = 'energy-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-white text-black shadow-lg';
            activeBtn.setAttribute('aria-pressed', 'true');
        }
        this.filter();
    },
    updatePriceLabel() {
        const el = document.getElementById('price-output');
        const range = document.getElementById('price-filter');
        if (!el || !range) return;
        el.innerText = I18n.formatPrice(Number(range.value));
    },
    reset() {
        document.getElementById('search-input').value = '';
        document.getElementById('brand-filter').value = 'all';
        document.getElementById('price-filter').value = CONFIG.priceMax;
        this.updatePriceLabel();
        document.getElementById('sort-select').value = 'featured';
        this.setEnergy('all');
    },
    getFiltered() {
        const query    = document.getElementById('search-input').value.trim().toLowerCase();
        const brand    = document.getElementById('brand-filter').value;
        const maxPrice = Number(document.getElementById('price-filter').value);
        const sortBy   = document.getElementById('sort-select').value;
        const keywords = query.split(/\s+/).filter(Boolean);

        let filtered = carsData.filter(car => {
            const matchEnergy = State.energy === 'all' || car.energy === State.energy;
            const matchBrand  = brand === 'all' || car.brand === brand;
            const energyAll   = Object.values(ENERGY_MAP[car.energy] || {}).join(' ').toLowerCase();
            const haystack    = `${car.name} ${car.brand} ${car.energy} ${energyAll}`.toLowerCase();
            const matchSearch = keywords.length === 0 || keywords.every(kw => haystack.includes(kw));
            return matchEnergy && matchBrand && matchSearch && car.price <= maxPrice;
        });

        const sorters = {
            'price-desc': (a, b) => b.price - a.price,
            'price-asc':  (a, b) => a.price - b.price,
            'power-desc': (a, b) => b.power - a.power,
            'speed-desc': (a, b) => b.topSpeed - a.topSpeed
        };
        if (sorters[sortBy]) filtered.sort(sorters[sortBy]);
        return filtered;
    },
    filter() { this.render(this.getFiltered()); },
    render(cars) {
        const grid      = document.getElementById('cars-grid');
        const noResults = document.getElementById('no-results');
        const counter   = document.getElementById('results-counter');

        if (counter) {
            if (cars.length === 0) counter.textContent = '';
            else if (cars.length === 1) counter.textContent = I18n.t('results.one');
            else counter.textContent = I18n.t('results.many', { n: cars.length });
        }
        if (cars.length === 0) {
            grid.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }
        noResults.classList.add('hidden');
        grid.innerHTML = cars.map(car => this.renderCard(car)).join('');
    },
    renderCard(car) {
        const isFav = State.favorites.includes(car.id);
        const isCmp = State.selected.includes(car.id);
        const favCls = isFav
            ? 'bg-white text-black border-white'
            : 'bg-obsidian/80 text-zinc-400 border-white/10';
        const name  = Utils.escapeHtml(car.name);
        const brand = Utils.escapeHtml(car.brand);
        const desc  = Utils.escapeHtml(car.description);
        const energy = Utils.escapeHtml(I18n.translateEnergy(car.energy));
        const image = Utils.escapeHtml(car.image);

        return `
            <div class="glass-card rounded-3xl overflow-hidden flex flex-col justify-between">
                <div>
                    <div class="relative h-60 overflow-hidden bg-charcoal-900 cursor-pointer" onclick="openCarDetails('${car.id}')">
                        <img src="${image}" alt="${name}" loading="lazy" decoding="async"
                             class="w-full h-full object-cover"
                             onerror="this.src='https://placehold.co/600x400/121318/ffffff?text=Velqora+Motors'">
                        <div class="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent"></div>
                        <div class="absolute top-3 left-3 flex gap-2">
                            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-obsidian/80 backdrop-blur-md text-white border border-white/10">${energy}</span>
                        </div>
                        <button onclick="event.stopPropagation(); toggleFavorite('${car.id}')"
                                aria-label="${Utils.escapeHtml(isFav ? I18n.t('card.removeFav') : I18n.t('card.addFav'))}"
                                aria-pressed="${isFav}"
                                class="absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center text-xs ${favCls}">
                            <i class="fa-${isFav ? 'solid' : 'regular'} fa-bookmark" aria-hidden="true"></i>
                        </button>
                        <div class="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                            <div>
                                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">${brand}</span>
                                <h3 class="text-lg font-bold text-white tracking-tight">${name}</h3>
                            </div>
                            <div class="text-right"><span class="text-sm font-black text-white">${I18n.formatPrice(car.price)}</span></div>
                        </div>
                    </div>
                    <div class="p-5 grid grid-cols-3 gap-2 text-center text-xs border-b border-white/5 bg-charcoal-800/30">
                        <div class="space-y-0.5">
                            <span class="text-[10px] font-bold uppercase text-zinc-500">${Utils.escapeHtml(I18n.t('card.power'))}</span>
                            <span class="font-extrabold text-white block">${car.power}\u202Fch</span>
                        </div>
                        <div class="space-y-0.5 border-x border-white/5">
                            <span class="text-[10px] font-bold uppercase text-zinc-500">${Utils.escapeHtml(I18n.t('card.accel'))}</span>
                            <span class="font-extrabold text-white block">${car.acceleration}\u202Fs</span>
                        </div>
                        <div class="space-y-0.5">
                            <span class="text-[10px] font-bold uppercase text-zinc-500">${Utils.escapeHtml(I18n.t('card.topSpeed'))}</span>
                            <span class="font-extrabold text-white block">${car.topSpeed}\u202Fkm/h</span>
                        </div>
                    </div>
                    <div class="px-5 py-4"><p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">${desc}</p></div>
                </div>
                <div class="px-5 pb-5 pt-0 flex items-center gap-3">
                    <button onclick="openCarDetails('${car.id}')"
                            class="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 font-bold text-xs uppercase tracking-wider transition-colors text-center text-zinc-200">
                        ${Utils.escapeHtml(I18n.t('card.details'))}
                    </button>
                    <button onclick="toggleCompare('${car.id}')" aria-pressed="${isCmp}"
                            class="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center
                            ${isCmp ? 'bg-white text-black shadow-lg' : 'bg-white/5 text-zinc-300 border border-white/10'}">
                        <i class="fa-solid ${isCmp ? 'fa-check' : 'fa-plus'} mr-1.5 text-[10px]" aria-hidden="true"></i>
                        <span>${Utils.escapeHtml(isCmp ? I18n.t('card.compared') : I18n.t('card.compare'))}</span>
                    </button>
                </div>
            </div>`;
    },
    toggleMobileFilters() {
        State.mobileFiltersOpen = !State.mobileFiltersOpen;
        const panel   = document.getElementById('mobile-filters-panel');
        const chevron = document.getElementById('mobile-filter-chevron');
        const label   = document.getElementById('mobile-filter-label');
        panel.classList.toggle('collapsed', !State.mobileFiltersOpen);
        chevron.style.transform = State.mobileFiltersOpen ? 'rotate(180deg)' : '';
        label.textContent = I18n.t(State.mobileFiltersOpen ? 'filters.hide' : 'filters.show');
    }
};

/* ============================================================================
   16. DÉTAILS
   ============================================================================ */
const Details = {
    specCard(label, value, small = false) {
        return `<div class="p-5 rounded-2xl bg-charcoal-800/60 border border-white/5 space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">${Utils.escapeHtml(label)}</span>
            <span class="${small ? 'text-sm' : 'text-xl'} font-black text-white block">${Utils.escapeHtml(value)}</span>
        </div>`;
    },
    engineCard(label, value) {
        return `<div class="p-4 rounded-2xl bg-charcoal-900">
            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">${Utils.escapeHtml(label)}</span>
            <span class="font-bold text-white mt-1 block">${Utils.escapeHtml(value)}</span>
        </div>`;
    },
    open(carId, { refresh = false } = {}) {
        const car = carsData.find(c => c.id === carId);
        if (!car) return;
        State.currentCarId = carId;

        const isFav = State.favorites.includes(car.id);
        const isCmp = State.selected.includes(car.id);
        const name  = Utils.escapeHtml(car.name);
        const brand = Utils.escapeHtml(car.brand);
        const energy = Utils.escapeHtml(I18n.translateEnergy(car.energy));
        const desc  = Utils.escapeHtml(car.description);
        const image = Utils.escapeHtml(car.image);
        const torque = Utils.escapeHtml(car.torque);
        const range  = Utils.escapeHtml(car.range);
        const engine = Utils.escapeHtml(car.engine);
        const trans  = Utils.escapeHtml(car.transmission);
        const weight = Utils.escapeHtml(car.weight);

        document.getElementById('details-content').innerHTML = `
            <div class="space-y-8">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div class="flex items-center space-x-3">
                            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white border border-white/15">${energy}</span>
                            <span class="text-xs font-bold text-zinc-400 uppercase tracking-widest">${brand}</span>
                        </div>
                        <h1 class="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-white">${name}</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="text-right">
                            <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">${Utils.escapeHtml(I18n.t('details.price'))}</span>
                            <span class="text-2xl sm:text-3xl font-black text-white">${I18n.formatPrice(car.price)}</span>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="toggleFavorite('${car.id}')"
                                    aria-label="${Utils.escapeHtml(isFav ? I18n.t('card.removeFav') : I18n.t('card.addFav'))}"
                                    aria-pressed="${isFav}"
                                    class="w-12 h-12 rounded-2xl border flex items-center justify-center text-sm
                                    ${isFav ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-400 border-white/10'}">
                                <i class="fa-${isFav ? 'solid' : 'regular'} fa-bookmark" aria-hidden="true"></i>
                            </button>
                            <button onclick="toggleCompare('${car.id}')" aria-pressed="${isCmp}"
                                    class="px-5 py-3 rounded-2xl ${isCmp ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/15'} font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2">
                                <i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                                <span>${Utils.escapeHtml(isCmp ? I18n.t('details.inComparator') : I18n.t('card.compare'))}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div class="lg:col-span-2 rounded-3xl overflow-hidden h-[380px] sm:h-[480px] bg-charcoal-900 border border-white/10 cursor-pointer" onclick="openCarLightbox(0)">
                        <img src="${image}" alt="${name}" loading="lazy" decoding="async"
                             class="w-full h-full object-cover"
                             onerror="this.onerror=null;this.src='https://placehold.co/1200x800/121318/ffffff?text=${encodeURIComponent(car.name)}'">
                    </div>
                    <div class="flex flex-col gap-4">
                        ${car.gallery.map((img, i) => `
                            <div class="rounded-2xl overflow-hidden h-[180px] sm:h-[232px] bg-charcoal-900 border border-white/10 cursor-pointer" onclick="openCarLightbox(${i + 1})">
                                <img src="${Utils.escapeHtml(img)}" alt="${name}" loading="lazy" decoding="async"
                                     class="w-full h-full object-cover"
                                     onerror="this.onerror=null;this.src='https://placehold.co/800x500/121318/ffffff?text=Photo+indisponible'">
                            </div>`).join('')}
                    </div>
                </div>

                <div class="glass-dark p-8 rounded-3xl space-y-4">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-2">
                        <i class="fa-solid fa-circle-info text-white" aria-hidden="true"></i>
                        <span>${Utils.escapeHtml(I18n.t('details.presentation'))}</span>
                    </h3>
                    <p class="text-zinc-300 text-sm sm:text-base leading-relaxed">${desc}</p>
                </div>

                <div class="glass-dark p-8 rounded-3xl space-y-6">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-2">
                        <i class="fa-solid fa-gauge-high text-white" aria-hidden="true"></i>
                        <span>${Utils.escapeHtml(I18n.t('details.specs'))}</span>
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${this.specCard(I18n.t('spec.power'), `${car.power} ch`)}
                        ${this.specCard(I18n.t('spec.torque'), torque)}
                        ${this.specCard(I18n.t('spec.accel'), `${car.acceleration} s`)}
                        ${this.specCard(I18n.t('spec.topSpeed'), `${car.topSpeed} km/h`)}
                        ${this.specCard(I18n.t('spec.range'), range, true)}
                        ${this.specCard(I18n.t('spec.weight'), weight, true)}
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                        ${this.engineCard(I18n.t('spec.engine'), engine)}
                        ${this.engineCard(I18n.t('spec.transmission'), trans)}
                    </div>
                </div>
            </div>`;

        if (!refresh) Views.switch('details');
    }
};

/* ============================================================================
   17. GARAGE
   ============================================================================ */
const Garage = {
    toggle(carId) {
        if (!VALID_CAR_IDS.has(carId)) return;
        const idx = State.favorites.indexOf(carId);
        if (idx > -1) {
            State.favorites.splice(idx, 1);
            Toast.show(I18n.t('toast.favRemoved'), 'info');
        } else {
            State.favorites.push(carId);
            Toast.show(I18n.t('toast.favAdded'));
        }
        Storage.saveUserData();
        this.updateCount();

        if (!Views.isHidden('catalog'))          Catalog.filter();
        else if (!Views.isHidden('details') && State.currentCarId)
            Details.open(State.currentCarId, { refresh: true });
        else if (!Views.isHidden('garage'))      this.render();
    },
    updateCount() {
        const count = State.favorites.length;
        document.getElementById('garage-count').innerText = count;
        document.getElementById('mobile-garage-count').innerText = count;
    },
    renderIfVisible() { if (!Views.isHidden('garage')) this.render(); },
    render() {
        const grid  = document.getElementById('garage-grid');
        const empty = document.getElementById('garage-empty');
        if (State.favorites.length === 0) {
            grid.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }
        empty.classList.add('hidden');
        const favCars = carsData.filter(car => State.favorites.includes(car.id));
        grid.innerHTML = favCars.map(car => this.renderCard(car)).join('');
    },
    renderCard(car) {
        const name  = Utils.escapeHtml(car.name);
        const brand = Utils.escapeHtml(car.brand);
        const image = Utils.escapeHtml(car.image);
        return `
            <div class="glass-card rounded-3xl overflow-hidden flex flex-col justify-between">
                <div>
                    <div class="relative h-48 overflow-hidden bg-charcoal-900 cursor-pointer" onclick="openCarDetails('${car.id}')">
                        <img src="${image}" alt="${name}" loading="lazy" decoding="async"
                             class="w-full h-full object-cover"
                             onerror="this.onerror=null;this.src='https://placehold.co/600x400/121318/ffffff?text=Velqora+Motors'">
                        <button onclick="event.stopPropagation(); toggleFavorite('${car.id}')"
                                aria-label="${Utils.escapeHtml(I18n.t('card.removeFav'))}"
                                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-obsidian/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-xs text-white">
                            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="p-5 space-y-2">
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">${brand}</span>
                        <h3 class="text-base font-bold text-white">${name}</h3>
                        <span class="text-sm font-black text-white block">${I18n.formatPrice(car.price)}</span>
                    </div>
                </div>
                <div class="px-5 pb-5">
                    <button onclick="openCarDetails('${car.id}')"
                            class="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 font-bold text-xs uppercase tracking-wider text-zinc-200">
                        ${Utils.escapeHtml(I18n.t('garage.viewCard'))}
                    </button>
                </div>
            </div>`;
    }
};

/* ============================================================================
   18. COMPARATEUR
   ============================================================================ */
const Comparator = {
    getRows() {
        return [
            { i18n: 'cmp.price',        cell: c => I18n.formatPrice(c.price), metric: c => c.price,        best: 'min', awardKey: 'award.cheapest' },
            { i18n: 'cmp.power',        cell: c => `${c.power} ch`,           metric: c => c.power,        best: 'max', awardKey: 'award.powerful' },
            { i18n: 'cmp.accel',        cell: c => `${c.acceleration} s`,     metric: c => c.acceleration, best: 'min', awardKey: 'award.fastest' },
            { i18n: 'cmp.topSpeed',     cell: c => `${c.topSpeed} km/h`,      metric: c => c.topSpeed,     best: 'max', awardKey: 'award.topSpeed' },
            { i18n: 'cmp.energy',       cell: c => I18n.translateEnergy(c.energy), plainClass: 'text-white font-medium' },
            { i18n: 'cmp.engine',       cell: c => c.engine,                  plainClass: 'text-zinc-300' },
            { i18n: 'cmp.transmission', cell: c => c.transmission,            plainClass: 'text-zinc-300' },
            { i18n: 'cmp.weight',       cell: c => c.weight,                  plainClass: 'text-zinc-300' }
        ];
    },
    toggle(carId) {
        if (!VALID_CAR_IDS.has(carId)) return;
        const idx = State.selected.indexOf(carId);
        if (idx > -1) {
            State.selected.splice(idx, 1);
            Toast.show(I18n.t('toast.cmpRemoved'), 'info');
        } else {
            if (State.selected.length >= CONFIG.maxCompare) {
                Toast.show(I18n.t('toast.cmpMax'), 'warning');
                return;
            }
            State.selected.push(carId);
            Toast.show(I18n.t('toast.cmpAdded'));
        }
        Storage.saveUserData();
        this.updateBadge();

        if (!Views.isHidden('catalog'))        Catalog.filter();
        else if (!Views.isHidden('details') && State.currentCarId)
            Details.open(State.currentCarId, { refresh: true });
        else if (!Views.isHidden('comparator')) this.render();
    },
    updateBadge() {
        const count = State.selected.length;
        const badge = document.getElementById('compare-badge');
        const mobileCount = document.getElementById('mobile-compare-count');
        if (count > 0) {
            badge.innerText = count;
            badge.classList.remove('hidden');
            mobileCount.innerText = count;
        } else {
            badge.classList.add('hidden');
            mobileCount.innerText = '0';
        }
    },
    clear() {
        State.selected = [];
        Storage.saveUserData();
        this.updateBadge();
        this.render();
        if (!Views.isHidden('catalog')) Catalog.filter();
        Toast.show(I18n.t('toast.cmpCleared'), 'info');
    },
    renderIfVisible() { if (!Views.isHidden('comparator')) this.render(); },
    renderSlot(carId) {
        if (!carId) {
            return `<div class="glass-dark p-6 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
                <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 text-xs">
                    <i class="fa-solid fa-plus" aria-hidden="true"></i>
                </div>
                <span class="text-xs font-bold text-zinc-400">${Utils.escapeHtml(I18n.t('comparator.slotFree'))}</span>
                <button onclick="switchView('catalog')" class="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider">
                    ${Utils.escapeHtml(I18n.t('comparator.select'))}
                </button>
            </div>`;
        }
        const car = carsData.find(c => c.id === carId);
        if (!car) return '';
        const name  = Utils.escapeHtml(car.name);
        const brand = Utils.escapeHtml(car.brand);
        const image = Utils.escapeHtml(car.image);
        return `<div class="glass-dark p-4 rounded-3xl relative flex flex-col justify-between space-y-4 border border-white/10">
            <button onclick="toggleCompare('${car.id}')" aria-label="${Utils.escapeHtml(I18n.t('card.removeFav'))} ${name}"
                    class="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xs z-10">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            <div class="h-32 rounded-2xl overflow-hidden bg-charcoal-900 border border-white/5">
                <img src="${image}" alt="${name}" loading="lazy" decoding="async"
                     class="w-full h-full object-cover"
                     onerror="this.onerror=null;this.src='https://placehold.co/600x400/121318/ffffff?text=Velqora+Motors'">
            </div>
            <div>
                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500">${brand}</span>
                <h4 class="font-bold text-sm text-white line-clamp-1">${name}</h4>
                <span class="text-base font-black text-white mt-0.5 block">${I18n.formatPrice(car.price)}</span>
            </div>
        </div>`;
    },
    render() {
        const slotsContainer = document.getElementById('comparator-slots');
        const tableContainer = document.getElementById('comparator-table-container');
        const emptyContainer = document.getElementById('comparator-empty');
        const matrixTable    = document.getElementById('comparator-matrix');

        slotsContainer.innerHTML = [0, 1, 2, 3]
            .map(i => this.renderSlot(State.selected[i])).join('');

        if (State.selected.length < 2) {
            tableContainer.classList.add('hidden');
            emptyContainer.classList.remove('hidden');
            return;
        }
        emptyContainer.classList.add('hidden');
        tableContainer.classList.remove('hidden');

        const comparedCars = State.selected.map(id => carsData.find(c => c.id === id));

        const headerRow = `<tr class="border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-zinc-400 bg-charcoal-900/60">
            <th class="p-4 w-1/4" scope="col">${Utils.escapeHtml(I18n.t('comparator.criterion'))}</th>
            ${comparedCars.map(car => `<th class="p-4" scope="col">${Utils.escapeHtml(car.name)}</th>`).join('')}
        </tr>`;

        const bodyRows = this.getRows().map(row => {
            let cells;
            if (row.metric) {
                const values = comparedCars.map(row.metric);
                const best = row.best === 'min' ? Math.min(...values) : Math.max(...values);
                cells = comparedCars.map(car => {
                    const isBest = row.metric(car) === best;
                    const cls = isBest ? 'text-emerald-400 bg-emerald-500/10' : 'text-white';
                    const label = Utils.escapeHtml(I18n.t(row.awardKey));
                    const award = isBest ? ` <i class="fa-solid fa-award ml-1" title="${label}" aria-label="${label}"></i>` : '';
                    return `<td class="p-4 font-bold ${cls}">${Utils.escapeHtml(row.cell(car))}${award}</td>`;
                }).join('');
            } else {
                cells = comparedCars.map(car => `<td class="p-4 ${row.plainClass}">${Utils.escapeHtml(row.cell(car))}</td>`).join('');
            }
            return `<tr>
                <th scope="row" class="p-4 font-bold text-zinc-400 uppercase tracking-wider text-left">${Utils.escapeHtml(I18n.t(row.i18n))}</th>
                ${cells}
            </tr>`;
        }).join('');

        matrixTable.innerHTML = `<thead>${headerRow}</thead>
            <tbody class="divide-y divide-white/5 text-xs">${bodyRows}</tbody>`;
    }
};

/* ============================================================================
   19. MOBILE
   ============================================================================ */
const Mobile = {
    detect() {
        const isMobile = Utils.isSmallScreen() || Utils.isTouchDevice();
        document.body.classList.toggle('is-mobile', isMobile);
        return isMobile;
    },
    toggleMenu() { document.getElementById('mobile-menu').classList.toggle('hidden'); },
    closeMenu() {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.add('hidden');
    },
    isMenuOpen() {
        const menu = document.getElementById('mobile-menu');
        return menu && !menu.classList.contains('hidden');
    }
};

/* ============================================================================
   20. BACK TO TOP
   ============================================================================ */
const BackToTop = {
    init() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;
        const toggle = () => btn.classList.toggle('visible', window.scrollY > 500);
        window.addEventListener('scroll', toggle, { passive: true });
        toggle();
    },
    scroll() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
};

/* ============================================================================
   21. GLOBAL EVENTS
   ============================================================================ */
const GlobalEvents = {
    init() {
        document.addEventListener('click', e => {
            if (Mobile.isMenuOpen()
                && !document.getElementById('mobile-menu').contains(e.target)
                && !e.target.closest('button[onclick*="toggleMobileMenu"]')) {
                Mobile.closeMenu();
            }
            const langMenu = document.getElementById('lang-menu');
            const langBtn  = document.querySelector('[aria-haspopup="listbox"]');
            if (langMenu && !langMenu.classList.contains('hidden')
                && !langMenu.contains(e.target)
                && langBtn && !langBtn.contains(e.target)) {
                I18n.closeMenu();
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                I18n.closeMenu();
                const lb = document.getElementById('lightbox');
                if (lb && !lb.classList.contains('hidden')) Lightbox.close();
                Mobile.closeMenu();
            }
            const lb = document.getElementById('lightbox');
            if (lb && !lb.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft')  Lightbox.nav(-1);
                if (e.key === 'ArrowRight') Lightbox.nav(1);
            }
        });

        window.addEventListener('resize', () => Mobile.detect());
    }
};

/* ============================================================================
   22. INITIALISATION
   ============================================================================ */
function bootstrap() {
    Mobile.detect();
    Storage.migrateLegacy();
    Storage.loadUserData();

    CustomCursor.init();
    BackToTop.init();
    CursorPage.init();
    Catalog.init();
    Garage.updateCount();
    Comparator.updateBadge();
    Cookies.initBanner();

    I18n.apply(I18n.detect());
    GlobalEvents.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}

/* ============================================================================
   23. API PUBLIQUE — handlers HTML inline
   ============================================================================ */
window.switchView          = (v) => Views.switch(v);
window.selectLanguage      = (c) => I18n.select(c);
window.toggleLangMenu      = (e) => I18n.toggleMenu(e);
window.toggleMobileMenu    = ()  => Mobile.toggleMenu();
window.setCursor           = (id) => CursorPage.set(id);
window.resetCursorChoice   = ()  => CursorPage.reset();
window.setEnergy           = (e) => Catalog.setEnergy(e);
window.resetFilters        = ()  => Catalog.reset();
window.toggleMobileFilters = ()  => Catalog.toggleMobileFilters();
window.openCarDetails      = (id) => Details.open(id);
window.openCarLightbox     = (i)  => Lightbox.openForCar(i);
window.closeLightbox       = ()  => Lightbox.close();
window.lightboxNav         = (d)  => Lightbox.nav(d);
window.toggleFavorite      = (id) => Garage.toggle(id);
window.toggleCompare       = (id) => Comparator.toggle(id);
window.clearComparator     = ()  => Comparator.clear();
window.acceptCookies       = ()  => Cookies.accept();
window.refuseCookies       = ()  => Cookies.refuse();
window.resetCookieConsent  = ()  => Cookies.reset();
window.scrollToTop         = ()  => BackToTop.scroll();