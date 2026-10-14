/* ============================================================================
   COMPARATEUR — Sélection et matrice
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