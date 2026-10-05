/* Shared page behaviors: scroll-aware header, read-more toggles, quantity steppers, lightbox. */

document.addEventListener("includes:ready", initScrollHeader);
document.addEventListener("DOMContentLoaded", function () {
  initReadMore();
  initQuantitySteppers();
  initLightbox();
});

function initScrollHeader() {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY;
      if (y > lastY && y > 80) header.classList.add("hide-on-scroll");
      else header.classList.remove("hide-on-scroll");
      lastY = y;
    },
    { passive: true }
  );
}

function initReadMore() {
  document.querySelectorAll(".read-more-toggle").forEach(function (btn) {
    var target = document.querySelector(btn.getAttribute("data-target"));
    if (!target) return;
    btn.addEventListener("click", function () {
      var expanded = target.classList.toggle("expanded");
      btn.textContent = expanded ? "Show less" : "Read more";
    });
  });
}

function initQuantitySteppers() {
  document.querySelectorAll(".qty-stepper").forEach(function (stepper) {
    var input = stepper.querySelector("input");
    var dec = stepper.querySelector('[data-step="-1"]');
    var inc = stepper.querySelector('[data-step="1"]');
    if (dec) dec.addEventListener("click", function () {
      input.value = Math.max(1, parseInt(input.value || "1", 10) - 1);
    });
    if (inc) inc.addEventListener("click", function () {
      input.value = parseInt(input.value || "1", 10) + 1;
    });
  });
}

function initLightbox() {
  var triggers = Array.prototype.slice.call(document.querySelectorAll(".lightbox-trigger"));
  var overlay = document.getElementById("lightbox");
  if (!triggers.length || !overlay) return;

  var imgEl = overlay.querySelector(".lightbox-image");
  var titleEl = overlay.querySelector(".lightbox-title");
  var infoEl = overlay.querySelector(".lightbox-info");
  var index = 0;

  function render() {
    var t = triggers[index];
    imgEl.style.background = t.getAttribute("data-bg") || "";
    titleEl.textContent = t.getAttribute("data-title") || "";
    infoEl.textContent = t.getAttribute("data-info") || "";
  }
  function open(i) {
    index = i;
    render();
    overlay.classList.add("open");
  }
  function close() {
    overlay.classList.remove("open");
  }
  function next() {
    index = (index + 1) % triggers.length;
    render();
  }
  function prev() {
    index = (index - 1 + triggers.length) % triggers.length;
    render();
  }

  triggers.forEach(function (t, i) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      open(i);
    });
  });
  overlay.querySelector(".lightbox-close").addEventListener("click", close);
  overlay.querySelector(".lightbox-next").addEventListener("click", next);
  overlay.querySelector(".lightbox-prev").addEventListener("click", prev);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
}
