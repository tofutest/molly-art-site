// Flying animal easter egg — gallery page only (guard below), purely decorative.
(function () {
    if (!document.querySelector('.gallery')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // pig, duck, cow, chicken, turtle, elephant, snail
    var ANIMALS = ['🐖', '🦆', '🐄', '🐔', '🐢', '🐘', '🐌'];

    // Most flights are left/right; a minority go top-to-bottom instead.
    var VERTICAL_CHANCE = 0.35;

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    // For horizontal flights: keep clear of the footer.
    function randomY() {
        return randomBetween(window.innerHeight * 0.1, window.innerHeight * 0.6);
    }

    // For vertical flights: keep clear of the very edges.
    function randomX() {
        return randomBetween(window.innerWidth * 0.1, window.innerWidth * 0.9);
    }

    function createAnimal() {
        var el = document.createElement('div');
        el.className = 'flying-animal';
        el.setAttribute('aria-hidden', 'true');
        var face = document.createElement('span');
        face.className = 'animal-face';
        face.textContent = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        el.appendChild(face);
        document.body.appendChild(el);
        return el;
    }

    // axis: 'x' (left/right) or 'y' (top/bottom). direction: 1 = forward, -1 = backward.
    function flyOnce(el, axis, direction) {
        var duration = randomBetween(8000, 14000);
        var keyframes;

        if (axis === 'x') {
            var vw = window.innerWidth;
            var fromX = direction === 1 ? -120 : vw + 120;
            var toX = direction === 1 ? vw + 120 : -120;
            var facing = direction; // flip to face the direction of travel
            el.style.top = randomY() + 'px';
            keyframes = [
                { transform: 'translateX(' + fromX + 'px) scaleX(' + facing + ')' },
                { transform: 'translateX(' + toX + 'px) scaleX(' + facing + ')' }
            ];
        } else {
            var vh = window.innerHeight;
            var fromY = direction === 1 ? -120 : vh + 120;
            var toY = direction === 1 ? vh + 120 : -120;
            el.style.left = randomX() + 'px';
            keyframes = [
                { transform: 'translateY(' + fromY + 'px)' },
                { transform: 'translateY(' + toY + 'px)' }
            ];
        }

        var anim = el.animate(keyframes, { duration: duration, easing: 'ease-in-out', fill: 'forwards' });
        return anim.finished;
    }

    function wait(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    // Each appearance gets its own element so flights can overlap — several
    // animals can be airborne at once now that they launch every few seconds.
    function spawnRoundTrip() {
        var el = createAnimal();
        var axis = Math.random() < VERTICAL_CHANCE ? 'y' : 'x';
        flyOnce(el, axis, 1)
            .then(function () { return wait(randomBetween(1000, 2000)); })
            .then(function () { return flyOnce(el, axis, -1); })
            .then(function () { el.remove(); });
    }

    function scheduleNextAppearance() {
        var delay = randomBetween(4000, 6000);
        setTimeout(function () {
            spawnRoundTrip();
            scheduleNextAppearance();
        }, delay);
    }

    scheduleNextAppearance();
})();
