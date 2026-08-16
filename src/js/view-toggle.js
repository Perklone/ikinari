// The half/full width toggle — the site's one gimmick.
//
// State lives on <html data-view>, is remembered across visits, and is
// reachable from the seam, the keyboard, or neither (the site works fine
// if this file never loads).
(function () {
  "use strict";

  var KEY = "ikinari:view";
  var root = document.documentElement;

  function apply(view, persist) {
    root.setAttribute("data-view", view);
    var seam = document.querySelector(".seam");
    if (seam) seam.setAttribute("aria-pressed", view === "full" ? "true" : "false");
    if (persist) {
      try { localStorage.setItem(KEY, view); } catch (e) {}
    }
  }

  function current() {
    return root.getAttribute("data-view") === "full" ? "full" : "split";
  }

  function toggle() {
    var next = current() === "full" ? "split" : "full";
    // Skip the animation entirely for readers who asked us to.
    if (!document.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(next, true);
      return;
    }
    document.startViewTransition(function () { apply(next, true); });
  }

  var stored;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  apply(stored === "full" ? "full" : "split", false);

  document.addEventListener("click", function (e) {
    if (e.target.closest(".seam")) toggle();
  });

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var el = document.activeElement;
    if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
    if (e.key === "\\") { e.preventDefault(); toggle(); }
  });
})();
