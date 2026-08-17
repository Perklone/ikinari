// Interface sounds, synthesised live — no audio files ship with the site.
//
// Console-kit character: filtered triangle waves, two quick partials. Tuned
// by ear in the sound lab; every number below came from that session.
//
// The rail pair is separated by EVENT COUNT, not by pitch direction. Reversing
// the same two notes reads as identical to the ear — both are "two notes a
// fifth apart" — so leaving is one descending tone and returning is two
// stepping up. Countable, which survives a noisy room and a low volume.
//
// Nothing plays until the listener's own click: browsers block audio before a
// gesture, so the first cue can only ever answer an action they took.
(function () {
  "use strict";

  var KEY = "ikinari:sound";

  var TUNE = {
    pitch:  550,     // Hz
    decay:  0.100,   // s
    bright: 2700,    // Hz, lowpass cutoff
    volume: 0.115,
  };

  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  var ctx = null;
  var master = null;
  var muted = false;

  try { muted = localStorage.getItem(KEY) === "off"; } catch (e) {}

  function wake() {
    if (ctx) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = TUNE.volume;
    master.connect(ctx.destination);
  }

  function envelope(gain, at, peak, dur) {
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), at + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  }

  // One filtered triangle. `bend` ramps the pitch over the note's life;
  // `delay` offsets it so a cue can be built from several.
  function note(freq, dur, peak, bend, delay) {
    var at = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, at);
    if (bend) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(freq * bend, 40), at + dur);
    }

    filter.type = "lowpass";
    filter.frequency.value = TUNE.bright;
    filter.Q.value = 0.7;

    envelope(gain, at, peak, dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(at);
    osc.stop(at + dur + 0.03);
  }

  var P = TUNE.pitch;
  var D = TUNE.decay;

  var CUES = {
    // The rail leaves: one note, falling.
    railOut: function () { note(P, D, 0.75, 0.74); },

    // The rail returns: two notes, rising a fifth.
    railIn: function () {
      note(P, D * 0.7, 0.60);
      note(P * 1.5, D * 0.8, 0.50, 1, 0.048);
    },

    // Shares the rising figure with railIn — both mean "that worked".
    copy: function () {
      note(P * 1.33, D * 0.55, 0.55);
      note(P * 2, D * 0.65, 0.45, 1, 0.05);
    },

    back: function () { note(P * 0.9, D * 0.7, 0.50, 0.92); },
  };

  function play(name) {
    if (muted || !CUES[name]) return;
    try {
      wake();
      if (ctx.state === "suspended") ctx.resume();
      CUES[name]();
    } catch (e) {}
  }

  function paint() {
    var buttons = document.querySelectorAll(".sound-toggle");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", muted ? "false" : "true");
      buttons[i].setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");
    }
  }

  function setMuted(next) {
    muted = next;
    try { localStorage.setItem(KEY, muted ? "off" : "on"); } catch (e) {}
    paint();
    if (!muted) play("railIn");   // confirm audibly that it is back on
  }

  // Other modules ask for a cue by name and never touch the audio graph.
  window.addEventListener("ikinari:cue", function (e) {
    play(e.detail);
  });

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest && e.target.closest(".sound-toggle");
    if (toggle) setMuted(!muted);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paint);
  } else {
    paint();
  }
})();
