/* Injects shared header/footer partials into any page with a [data-include] element.
   Requires the page to be served over http (Live Server or GitHub Pages) — fetch() of a
   local file is blocked by the browser under file://. Fires 'includes:ready' on <body> once
   every include on the page has resolved, so other scripts can safely wire up header behavior. */
(function () {
  // Sub-pages underline their parent menu item, going by file name: original-*.html and
  // shop-*.html pages belong to Shop, collection-*.html pages to Works.
  function sectionOf(page) {
    if (/^(original-|shop-)/.test(page)) return "shop";
    if (/^collection-/.test(page)) return "works";
    return page;
  }

  function markActiveNav(container) {
    // GitHub Pages also serves pages without ".html", so compare names with it stripped
    var current = sectionOf((location.pathname.split("/").pop() || "index.html").replace(/\.html$/, ""));
    container.querySelectorAll(".nav-links a").forEach(function (a) {
      if (a.getAttribute("href").replace(/\.html$/, "") === current) a.classList.add("active");
    });
  }

  function hydrate() {
    var nodes = document.querySelectorAll("[data-include]");
    var pending = nodes.length;
    if (!pending) {
      document.dispatchEvent(new Event("includes:ready"));
      return;
    }
    nodes.forEach(function (el) {
      fetch(el.getAttribute("data-include"))
        .then(function (r) { return r.text(); })
        .then(function (html) {
          el.innerHTML = html;
          markActiveNav(el);
        })
        .catch(function () {
          el.innerHTML = "<!-- include failed to load — open this page via Live Server, not file:// -->";
        })
        .finally(function () {
          pending -= 1;
          if (pending === 0) document.dispatchEvent(new Event("includes:ready"));
        });
    });
  }

  document.addEventListener("DOMContentLoaded", hydrate);
})();
