/* ============================================================================
   VUES & INTERACTIONS GLOBALES — Views, Mobile, BackToTop, GlobalEvents
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