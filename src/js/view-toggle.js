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

  // Motion is pure CSS — the grid transitions its own columns. A view
  // transition here would cross-fade identical content, which is what made
  // the old version blink. Reduced motion is handled by --toggle-dur.
  function toggle() {
    apply(current() === "full" ? "split" : "full", true);
  }

  // data-view is already set by the inline script in <head>, before first
  // paint. Re-applying it here would be a frame late — all this needs to do
  // is bring the button's pressed state in line with what is already applied.
  apply(current(), false);

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
