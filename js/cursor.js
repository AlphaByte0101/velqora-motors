/* ============================================================================
   CURSEUR — Effet souris + page de personnalisation
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