// Flying animal easter egg — gallery page only (guard below), purely decorative.
(function () {
    if (!document.querySelector('.gallery')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ANIMALS = ['🐖', '🦆', '🐄']; // pig, duck, cow

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Keep animals within the upper portion of the viewport, clear of the footer.
    function randomY() {
        return randomBetween(window.innerHeight * 0.1, window.innerHeight * 0.6);
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

    function flyOnce(el, direction) {
        var vw = window.innerWidth;
        var fromX = direction === 'right' ? -120 : vw + 120;
        var toX = direction === 'right' ? vw + 120 : -120;
        var facing = direction === 'right' ? 1 : -1;
        var duration = randomBetween(8000, 14000);

        el.style.top = randomY() + 'px';

        var anim = el.animate(
            [
                { transform: 'translateX(' + fromX + 'px) scaleX(' + facing + ')' },
                { transform: 'translateX(' + toX + 'px) scaleX(' + facing + ')' }
            ],
            { duration: duration, easing: 'ease-in-out', fill: 'forwards' }
        );

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
        flyOnce(el, 'right')
            .then(function () { return wait(randomBetween(1000, 2000)); })
            .then(function () { return flyOnce(el, 'left'); })
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
