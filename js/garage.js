/* ============================================================================
   GARAGE — Favoris utilisateur
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