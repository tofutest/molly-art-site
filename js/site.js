// Flying pig easter egg — gallery page only (guard below), purely decorative.
(function () {
    if (!document.querySelector('.gallery')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    var pig = document.createElement('div');
    pig.id = 'flying-pig';
    pig.setAttribute('aria-hidden', 'true');
    var face = document.createElement('span');
    face.className = 'pig-face';
    face.textContent = '🐖'; // 🐖
    pig.appendChild(face);
    document.body.appendChild(pig);

    // Keep the pig within the upper portion of the viewport, clear of the footer.
    function randomY() {
        return randomBetween(window.innerHeight * 0.1, window.innerHeight * 0.6);
    }

    function flyOnce(direction) {
        var vw = window.innerWidth;
        var fromX = direction === 'right' ? -120 : vw + 120;
        var toX = direction === 'right' ? vw + 120 : -120;
        var y = randomY();
        var facing = direction === 'right' ? 1 : -1;
        var duration = randomBetween(8000, 14000);

        pig.style.top = y + 'px';

        var anim = pig.animate(
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

    function flyRoundTrip() {
        pig.style.display = 'block';
        return flyOnce('right')
            .then(function () { return wait(randomBetween(1000, 2000)); })
            .then(function () { return flyOnce('left'); })
            .then(function () { pig.style.display = 'none'; });
    }

    function scheduleNextAppearance() {
        var delay = randomBetween(30000, 120000);
        setTimeout(function () {
            flyRoundTrip().then(scheduleNextAppearance);
        }, delay);
    }

    scheduleNextAppearance();
})();
