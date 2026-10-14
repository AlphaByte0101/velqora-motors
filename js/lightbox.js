/* ============================================================================
   LIGHTBOX — Galerie photo plein écran
   ============================================================================ */

const Lightbox = {
    open(images, index = 0) {
        if (!images || images.length === 0) return;
        State.lightbox.images = images;
        State.lightbox.index = index;
        this.update();
        const lb = document.getElementById('lightbox');
        lb.classList.remove('hidden'); lb.classList.add('flex');
        document.body.style.overflow = 'hidden';
    },
    openForCar(index) {
        const car = carsData.find(c => c.id === State.currentCarId);
        if (!car) return;
        this.open([car.image, ...car.gallery], index);
    },
    update() {
        const { images, index } = State.lightbox;
        document.getElementById('lightbox-img').src = images[index];
        document.getElementById('lightbox-counter').innerText =
            (index + 1) + ' / ' + images.length;
    },
    close() {
        const lb = document.getElementById('lightbox');
        lb.classList.add('hidden'); lb.classList.remove('flex');
        document.body.style.overflow = '';
    },
    nav(dir) {
        const total = State.lightbox.images.length;
        if (!total) return;
        State.lightbox.index = (State.lightbox.index + dir + total) % total;
        this.update();
    }
};