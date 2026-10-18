/* ============================================================================
   BOOTSTRAP & API PUBLIQUE
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

/* ----------------------------------------------------------------------------
   API PUBLIQUE — Handlers utilisés en attributs HTML inline (onclick="...")
   ---------------------------------------------------------------------------- */
window.switchView          = (v)  => Views.switch(v);
window.selectLanguage      = (c)  => I18n.select(c);
window.toggleLangMenu      = (e)  => I18n.toggleMenu(e);
window.toggleMobileMenu    = ()   => Mobile.toggleMenu();
window.setCursor           = (id) => CursorPage.set(id);
window.resetCursorChoice   = ()   => CursorPage.reset();
window.setEnergy           = (e)  => Catalog.setEnergy(e);
window.resetFilters        = ()   => Catalog.reset();
window.toggleMobileFilters = ()   => Catalog.toggleMobileFilters();
window.openCarDetails      = (id) => Details.open(id);
window.openCarLightbox     = (i)  => Lightbox.openForCar(i);
window.closeLightbox       = ()   => Lightbox.close();
window.lightboxNav         = (d)  => Lightbox.nav(d);
window.toggleFavorite      = (id) => Garage.toggle(id);
window.toggleCompare       = (id) => Comparator.toggle(id);
window.clearComparator     = ()   => Comparator.clear();
window.acceptCookies       = ()   => Cookies.accept();
window.refuseCookies       = ()   => Cookies.refuse();
window.resetCookieConsent  = ()   => Cookies.reset();
window.scrollToTop         = ()   => BackToTop.scroll();