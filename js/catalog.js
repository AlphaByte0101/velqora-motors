/* ============================================================================
   CATALOGUE — Grille, filtres et tri
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