/* =====================================================================
   app.js — Orquestador principal: inicialización y event wiring
   ===================================================================== */
window.VN = window.VN || {};

VN.App = (function () {
  'use strict';

  function init() {
    /* Initialize all modules */
    VN.Diagram.init();
    VN.Animations.init();
    VN.UI.init();
    VN.Theory.init();

    /* Listen to simulation events */
    VN.Simulation.on(function (event, data) {
      switch (event) {
        case 'example-changed':
          onExampleChanged(data);
          break;
        case 'step-changed':
          onStepChanged(data);
          break;
        case 'play-state-changed':
          VN.UI.updatePlayState(data.playing);
          break;
      }
    });

    /* Load first example */
    VN.Simulation.setExample(0);
  }

  function onExampleChanged(data) {
    var example = data.example;
    var snap = data.step;

    VN.Animations.cancelAll();
    VN.Diagram.resetAll();
    VN.UI.showNote(example.note);
    VN.UI.renderSnapshot(snap, example, 'none');
  }

  function onStepChanged(data) {
    var snap = data.step;
    var example = VN.Simulation.getExample();
    var direction = data.direction;

    VN.Animations.cancelAll();
    VN.UI.renderSnapshot(snap, example, direction);
  }

  /* Boot on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init: init };
})();
