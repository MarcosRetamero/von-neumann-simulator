/* =====================================================================
   diagram.js — Gestión del diagrama SVG: escalado, highlighting, buses
   ===================================================================== */
window.VN = window.VN || {};

VN.Diagram = (function () {
  'use strict';

  var container   = null;
  var wrapper     = null;
  var busLinesSvg = null;

  /* ---- Component DOM refs ---- */
  var compEls = {};
  var subCompEls = {};
  var allHighlightable = ['input', 'output', 'memory', 'uc', 'alu', 'registers'];

  /* ---- Bus line DOM refs ---- */
  var busLines = {};

  /* ---- Initialize ---- */
  function init() {
    container   = document.getElementById('diagram-container');
    wrapper     = document.getElementById('diagram-wrapper');
    busLinesSvg = document.getElementById('bus-lines-svg');

    compEls = {
      input:  document.getElementById('comp-input'),
      output: document.getElementById('comp-output'),
      memory: document.getElementById('comp-memory'),
      cpu:    document.getElementById('comp-cpu')
    };

    subCompEls = {
      uc:        document.getElementById('comp-uc'),
      alu:       document.getElementById('comp-alu'),
      registers: document.getElementById('comp-registers')
    };

    busLines = {
      data: document.getElementById('busline-data'),
      addr: document.getElementById('busline-addr'),
      ctrl: document.getElementById('busline-ctrl')
    };

    /* Setup responsive scaling */
    scaleDiagram();
    window.addEventListener('resize', debounce(scaleDiagram, 100));

    /* Setup tooltips */
    setupTooltips();
  }

  /* ---- Responsive scaling ---- */
  function scaleDiagram() {
    if (!wrapper || !container) return;
    var availW = wrapper.clientWidth;
    var baseW = 900;
    var scale = Math.min(availW / baseW, 1);
    container.style.transform = 'scale(' + scale + ')';
    wrapper.style.height = (620 * scale) + 'px';
  }

  /* ---- Component highlighting ---- */
  function highlightComponents(activeList) {
    /* Clear all */
    allHighlightable.forEach(function (id) {
      var el = subCompEls[id] || compEls[id];
      if (el) el.classList.remove('active');
    });
    compEls.cpu.classList.remove('active');

    /* Activate */
    if (!activeList) return;
    var cpuChild = false;
    activeList.forEach(function (id) {
      var el = subCompEls[id] || compEls[id];
      if (el) el.classList.add('active');
      if (id === 'uc' || id === 'alu' || id === 'registers') cpuChild = true;
    });
    if (cpuChild) compEls.cpu.classList.add('active');
  }

  /* ---- Bus highlighting ---- */
  function highlightBuses(activeBusList) {
    var allBusLines = document.querySelectorAll('.bus-line');
    var allBusLabels = document.querySelectorAll('.bus-label');
    var allArrows = document.querySelectorAll('.internal-arrow');

    /* By default, set everything to inactive */
    allBusLines.forEach(function (el) {
      el.classList.remove('bus-active');
      el.classList.add('bus-inactive');
    });
    allBusLabels.forEach(function (el) {
      el.classList.remove('bus-active');
      el.classList.add('bus-inactive');
    });
    allArrows.forEach(function (a) {
      a.classList.remove('active');
    });

    if (!activeBusList || activeBusList.length === 0) {
      return; // All buses stay inactive
    }

    /* Activate specifically requested buses */
    activeBusList.forEach(function (busType) {
      if (busType === 'data') {
        document.querySelectorAll('.bus-line-data, .bus-label-data').forEach(function(el) {
          el.classList.remove('bus-inactive');
          el.classList.add('bus-active');
        });
      }
      if (busType === 'address') {
        document.querySelectorAll('.bus-line-addr, .bus-label-addr').forEach(function(el) {
          el.classList.remove('bus-inactive');
          el.classList.add('bus-active');
        });
      }
      if (busType === 'control') {
        document.querySelectorAll('.bus-line-ctrl, .bus-label-ctrl').forEach(function(el) {
          el.classList.remove('bus-inactive');
          el.classList.add('bus-active');
        });
      }
      if (busType === 'internal') {
        document.querySelectorAll('.bus-line-internal').forEach(function(el) {
          el.classList.remove('bus-inactive');
          el.classList.add('bus-active');
        });
      }
    });
  }

  /* ---- Extract active bus types from animations list ---- */
  function getBusTypes(animations) {
    var types = [];
    var seen = {};
    if (!animations) return types;
    animations.forEach(function (anim) {
      var bt = anim.bus;
      if (bt === null) bt = 'internal';
      if (bt === 'address') bt = 'address';
      if (bt === 'control') bt = 'control';
      if (!seen[bt]) {
        seen[bt] = true;
        types.push(bt);
      }
    });
    return types;
  }

  /* ---- Reset everything ---- */
  function resetAll() {
    highlightComponents([]);
    highlightBuses([]);
  }

  /* ---- Tooltips ---- */
  function setupTooltips() {
    var tooltipEl = document.getElementById('tooltip');
    var elements = document.querySelectorAll('[data-tooltip]');

    elements.forEach(function (el) {
      el.addEventListener('mouseenter', function (e) {
        var text = el.getAttribute('data-tooltip');
        if (!text) return;
        tooltipEl.textContent = text;
        tooltipEl.classList.remove('hidden');
        positionTooltip(e, tooltipEl);
      });
      el.addEventListener('mousemove', function (e) {
        positionTooltip(e, tooltipEl);
      });
      el.addEventListener('mouseleave', function () {
        tooltipEl.classList.add('hidden');
      });
    });
  }

  function positionTooltip(e, tooltipEl) {
    var x = e.clientX + 15;
    var y = e.clientY + 15;
    var rect = tooltipEl.getBoundingClientRect();
    if (x + rect.width > window.innerWidth - 10) {
      x = e.clientX - rect.width - 10;
    }
    if (y + rect.height > window.innerHeight - 10) {
      y = e.clientY - rect.height - 10;
    }
    tooltipEl.style.left = x + 'px';
    tooltipEl.style.top = y + 'px';
  }

  /* ---- Debounce utility ---- */
  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  return {
    init: init,
    highlightComponents: highlightComponents,
    highlightBuses: highlightBuses,
    getBusTypes: getBusTypes,
    resetAll: resetAll,
    scaleDiagram: scaleDiagram
  };
})();
