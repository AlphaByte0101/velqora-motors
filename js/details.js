/* ============================================================================
   DÉTAILS — Fiche détaillée d'un véhicule
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