/* ============================================================================
   COOKIES — Bandeau de consentement
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