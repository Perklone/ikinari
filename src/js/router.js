// Same-origin navigation without swapping documents.
//
// Only .pane-content is replaced. The rail, the seam, the masthead and the
// persisted width state are never touched — they are the same DOM nodes for
// the whole session, so they cannot flash, re-decode, or be re-snapshotted.
//
// Every link remains a real href. Without JS, or if anything here throws,
// navigation falls back to an ordinary page load.

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — page navigation
 *
 * Read top-to-bottom. Each value is ms after the click.
 * The fetch runs CONCURRENTLY with the fade-out, and the swap
 * waits for whichever finishes last — so a slow network delays
 * the swap but never the feedback.
 *
 *    0ms   click — outgoing pane begins fading out
 *  140ms   fade-out complete  ┐ swap fires when BOTH are ready
 *     ~ms  fetch resolves     ┘
 *  140ms   incoming pane begins fading in
 *  340ms   settled
 *
 * Opacity only — no movement, no scale, per the design system.
 * The tabs, rail and masthead never animate: they do not change.
 * ───────────────────────────────────────────────────────── */

(function () {
  "use strict";

  if (!window.fetch || !window.history.pushState || !document.querySelector) return;

  var TARGET = ".pane-content";

  var TIMING = {
    fadeOut: 140,   // outgoing pane, opacity 1 → 0
    fadeIn:  200,   // incoming pane, opacity 0 → 1
  };

  var EASING = {
    out: "ease-in",    // leaving accelerates away
    in:  "ease-out",   // arriving decelerates into place
  };

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  function animates() {
    return !!document.body.animate && !(reduced && reduced.matches);
  }

  function isPlainLeftClick(e) {
    return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  function routable(a) {
    if (!a || !a.href) return false;
    if (a.origin !== location.origin) return false;          // external
    if (a.hasAttribute("download")) return false;
    if (a.target && a.target !== "_self") return false;
    var raw = a.getAttribute("href") || "";
    if (raw.charAt(0) === "#") return false;                 // in-page anchor
    if (raw.indexOf("mailto:") === 0) return false;
    if (a.pathname === location.pathname) return false;      // already here
    return true;
  }

  function fadeOut(el) {
    if (!animates()) return Promise.resolve();
    return el.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: TIMING.fadeOut, easing: EASING.out, fill: "forwards" }
    ).finished.catch(function () {});
  }

  function fadeIn(el) {
    if (!animates()) return;
    // Set the start state inline first: a WAAPI animation can miss a frame,
    // and that frame would show the new content at full opacity.
    el.style.opacity = "0";
    var a = el.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: TIMING.fadeIn, easing: EASING.in }
    );
    a.finished.then(clear, clear);
    function clear() { el.style.opacity = ""; }
  }

  function render(html, url) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var incoming = doc.querySelector(TARGET);
    var here = document.querySelector(TARGET);
    if (!incoming || !here) { location.href = url; return false; }

    here.replaceWith(incoming);
    fadeIn(incoming);

    // The tab bar is NOT replaced — only which tab is marked. Replacing it
    // would destroy the element the browser is mid-hover on.
    var nextTabs = doc.querySelectorAll(".tabs .tab");
    var thisTabs = document.querySelectorAll(".tabs .tab");
    if (nextTabs.length === thisTabs.length) {
      for (var i = 0; i < thisTabs.length; i++) {
        var on = nextTabs[i].classList.contains("is-active");
        thisTabs[i].classList.toggle("is-active", on);
        // The semantic half of the vermilion rule — must move with it, or a
        // router swap would leave the wrong tab marked current.
        if (on) thisTabs[i].setAttribute("aria-current", "page");
        else thisTabs[i].removeAttribute("aria-current");
      }
    }

    if (doc.title) document.title = doc.title;

    // The pane is the scroll container on desktop; the window is on mobile.
    var pane = document.querySelector(".pane");
    if (pane) pane.scrollTop = 0;
    window.scrollTo(0, 0);

    // Anything that decorates page content re-runs here.
    window.dispatchEvent(new CustomEvent("ikinari:navigated"));
    return true;
  }

  var inflight = null;

  function go(url, push) {
    var token = (inflight = {});
    var here = document.querySelector(TARGET);

    // Both start now. Whichever is slower gates the swap.
    var loaded = fetch(url, { credentials: "same-origin" }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.text();
    });
    var faded = here ? fadeOut(here) : Promise.resolve();

    Promise.all([loaded, faded])
      .then(function (out) {
        if (inflight !== token) return;                      // superseded
        if (render(out[0], url) && push) history.pushState(null, "", url);
      })
      .catch(function () { location.href = url; });
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || !isPlainLeftClick(e)) return;
    var a = e.target.closest && e.target.closest("a");
    if (!routable(a)) return;
    e.preventDefault();
    go(a.href, true);
  });

  window.addEventListener("popstate", function () {
    go(location.href, false);
  });
})();
