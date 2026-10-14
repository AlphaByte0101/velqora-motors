/* ============================================================================
   UTILITAIRES — Utils, Storage, Toast
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