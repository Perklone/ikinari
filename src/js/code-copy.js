// Copy buttons are created here, not in the markup, so readers without
// JavaScript never see a button that cannot work.
(function () {
  "use strict";

  if (!navigator.clipboard) return;

  var RESET_MS = 1400;

  function label(btn, text, copied) {
    btn.textContent = text;
    if (copied) btn.setAttribute("data-copied", "true");
    else btn.removeAttribute("data-copied");
  }

  function attach(block) {
    var head = block.querySelector(".code-head");
    var code = block.querySelector("pre code");
    if (!head || !code) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");

    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(code.innerText).then(
        function () {
          label(btn, "Copied", true);
          window.setTimeout(function () {
            label(btn, "Copy", false);
          }, RESET_MS);
        },
        function () {
          label(btn, "Failed", false);
          window.setTimeout(function () {
            label(btn, "Copy", false);
          }, RESET_MS);
        }
      );
    });

    head.appendChild(btn);
  }

  function init() {
    var blocks = document.querySelectorAll(".code-block");
    for (var i = 0; i < blocks.length; i++) attach(blocks[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Router swaps bring in fresh code blocks that have no button yet.
  window.addEventListener("ikinari:navigated", init);
})();
