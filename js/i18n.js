/* ============================================================================
   i18n — Système de langues
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