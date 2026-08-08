/* =====================================================================
   ui.js — Controles de UI, panel de estado, indicador de ciclo
   ===================================================================== */
window.VN = window.VN || {};

VN.UI = (function () {
  'use strict';

  /* ---- DOM refs ---- */
  var dom = {};

  /* ---- Init ---- */
  function init() {
    dom.btnReset  = document.getElementById('btn-reset');
    dom.btnPrev   = document.getElementById('btn-prev');
    dom.btnPlay   = document.getElementById('btn-play');
    dom.btnNext   = document.getElementById('btn-next');
    dom.playIcon  = document.getElementById('play-icon');
    dom.playText  = document.getElementById('play-text');
    dom.stepCurrent = document.getElementById('step-current');
    dom.stepTotal   = document.getElementById('step-total');
    dom.descMain    = document.getElementById('step-desc-main');
    dom.descDetail  = document.getElementById('step-desc-detail');

    /* In-diagram displays */
    dom.inputValue  = document.getElementById('input-value');
    dom.outputValue = document.getElementById('output-value');
    dom.ucPc        = document.getElementById('uc-pc');
    dom.ucIr        = document.getElementById('uc-ir');
    dom.aluDisplay  = document.getElementById('alu-display');
    dom.regR1       = document.getElementById('reg-r1');
    dom.regR2       = document.getElementById('reg-r2');
    dom.regR3       = document.getElementById('reg-r3');
    dom.memTbody    = document.getElementById('memory-tbody');

    /* State panel displays */
    dom.statePc     = document.getElementById('state-pc');
    dom.stateIr     = document.getElementById('state-ir');
    dom.stateR1     = document.getElementById('state-r1');
    dom.stateR2     = document.getElementById('state-r2');
    dom.stateR3     = document.getElementById('state-r3');
    dom.stateMemTbody = document.getElementById('state-memory-tbody');
    dom.stateAlu    = document.getElementById('state-alu-display');

    /* Cycle indicator */
    dom.cycleSteps = document.querySelectorAll('.cycle-step');

    /* Note banner */
    dom.noteBanner = document.getElementById('simplification-note');
    dom.noteText   = document.getElementById('note-text');

    /* Example buttons */
    dom.exampleBtns = document.querySelectorAll('.example-btn');

    /* Bind control events */
    bindControls();
  }

  /* ---- Bind control buttons ---- */
  function bindControls() {
    dom.btnReset.addEventListener('click', function () {
      VN.Animations.cancelAll();
      VN.Simulation.reset();
    });

    dom.btnPrev.addEventListener('click', function () {
      VN.Animations.cancelAll();
      VN.Simulation.prevStep();
    });

    dom.btnPlay.addEventListener('click', function () {
      VN.Simulation.togglePlay();
    });

    dom.btnNext.addEventListener('click', function () {
      VN.Animations.cancelAll();
      VN.Simulation.nextStep();
    });

    /* Example selector buttons */
    dom.exampleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-example'), 10);
        dom.exampleBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        VN.Animations.cancelAll();
        VN.Simulation.setExample(idx);
      });
    });
  }

  /* ---- Render a snapshot ---- */
  function renderSnapshot(snap, example, direction) {
    if (!snap) return;

    /* Update step counter */
    var total = VN.Simulation.getTotalSteps();
    dom.stepCurrent.textContent = snap.stepIndex;
    dom.stepTotal.textContent = total - 1;

    /* Update button states */
    dom.btnPrev.disabled = snap.stepIndex <= 0;
    dom.btnNext.disabled = snap.stepIndex >= total - 1;

    /* Update description */
    dom.descMain.textContent = snap.description;
    dom.descMain.classList.remove('animate');
    void dom.descMain.offsetWidth; /* force reflow */
    dom.descMain.classList.add('animate');

    if (snap.detail) {
      dom.descDetail.textContent = snap.detail;
      dom.descDetail.classList.add('visible');
    } else {
      dom.descDetail.classList.remove('visible');
    }

    /* Update cycle indicator */
    updateCycle(snap.cycle);

    /* Update component highlights */
    VN.Diagram.highlightComponents(snap.activeComponents);

    /* Update bus highlights */
    var busTypes = VN.Diagram.getBusTypes(snap.animations);
    VN.Diagram.highlightBuses(busTypes);

    /* Update in-diagram displays */
    updateInputOutput(snap);
    updateUC(snap);
    updateALU(snap);
    updateRegisters(snap);
    updateMemory(snap, example);

    /* Update state panel */
    updateStatePanel(snap, example);

    /* Play animations only when going forward */
    if (direction === 'forward' && snap.animations && snap.animations.length > 0) {
      VN.Simulation.setAnimating(true);
      VN.Animations.playStep(snap.animations).then(function () {
        VN.Simulation.setAnimating(false);
      });
    }
  }

  /* ---- Cycle indicator ---- */
  function updateCycle(cycle) {
    dom.cycleSteps.forEach(function (el) {
      el.classList.remove('active');
      if (cycle && el.getAttribute('data-cycle') === cycle) {
        el.classList.add('active');
      }
    });
  }

  /* ---- Input / Output devices ---- */
  function updateInputOutput(snap) {
    dom.inputValue.textContent = snap.inputVal || '—';
    dom.inputValue.style.opacity = snap.inputVal ? '1' : '0.4';
    dom.outputValue.textContent = snap.outputVal || '—';
    dom.outputValue.style.opacity = snap.outputVal ? '1' : '0.4';
  }

  /* ---- UC (PC + IR) ---- */
  function updateUC(snap) {
    var pcVal = snap.pc !== null ? snap.pc : '—';
    var irVal = snap.ir !== null ? snap.ir : '—';

    updateRegDisplay(dom.ucPc, pcVal);
    updateRegDisplay(dom.ucIr, irVal);
    updateRegDisplay(dom.statePc, pcVal);
    updateRegDisplay(dom.stateIr, irVal);
  }

  /* ---- ALU ---- */
  function updateALU(snap) {
    var alu = snap.alu;
    if (!alu || !alu.op) {
      dom.aluDisplay.innerHTML = '<span class="alu-idle">Inactiva</span>';
      dom.stateAlu.innerHTML = '<span class="alu-idle-state">Inactiva</span>';
    } else {
      dom.aluDisplay.innerHTML =
        '<span class="alu-operation">' + alu.a + ' ' + alu.op + ' ' + alu.b + '</span>' +
        '<br><span class="alu-result">= ' + alu.result + '</span>';

      dom.stateAlu.innerHTML =
        '<span class="alu-op-name">' + getOpName(alu.op) + '</span>' +
        '<span class="alu-expression">' + alu.a + ' ' + alu.op + ' ' + alu.b + '</span>' +
        '<span class="alu-answer">= ' + alu.result + '</span>';
    }
  }

  function getOpName(op) {
    var names = { '+': 'SUMA', '−': 'RESTA', '×': 'MULTIPLICACIÓN', '=': 'COMPARACIÓN' };
    return names[op] || op;
  }

  /* ---- Registers ---- */
  function updateRegisters(snap) {
    var r = snap.registers;
    updateRegDisplay(dom.regR1, r.R1);
    updateRegDisplay(dom.regR2, r.R2);
    updateRegDisplay(dom.regR3, r.R3);
    updateRegDisplay(dom.stateR1, r.R1);
    updateRegDisplay(dom.stateR2, r.R2);
    updateRegDisplay(dom.stateR3, r.R3);
  }

  function updateRegDisplay(el, value) {
    if (!el) return;
    var display = (value !== null && value !== undefined) ? String(value) : '—';
    var changed = el.textContent !== display && display !== '—';
    el.textContent = display;
    el.classList.toggle('changed', changed);
  }

  /* ---- Memory (in-diagram) ---- */
  function updateMemory(snap, example) {
    var mem = snap.memory;
    var html = '';
    var addresses = Object.keys(mem).sort(function (a, b) { return Number(a) - Number(b); });

    addresses.forEach(function (addr) {
      var val = mem[addr];
      var isActive = snap.pc !== null && Number(addr) === snap.pc;
      html += '<tr class="' + (isActive ? 'mem-active' : '') + '">' +
        '<td class="mem-addr">' + addr + '</td>' +
        '<td class="mem-val">' + (val !== null ? val : '—') + '</td>' +
        '</tr>';
    });

    dom.memTbody.innerHTML = html;
  }

  /* ---- State panel memory ---- */
  function updateStatePanel(snap, example) {
    var mem = snap.memory;
    var html = '';
    var addresses = Object.keys(mem).sort(function (a, b) { return Number(a) - Number(b); });

    addresses.forEach(function (addr) {
      var val = mem[addr];
      var isActive = snap.pc !== null && Number(addr) === snap.pc;
      html += '<tr class="' + (isActive ? 'highlighted' : '') + '">' +
        '<td>' + addr + '</td>' +
        '<td>' + (val !== null ? val : '—') + '</td>' +
        '</tr>';
    });

    dom.stateMemTbody.innerHTML = html;
  }

  /* ---- Play state UI ---- */
  function updatePlayState(playing) {
    if (playing) {
      dom.playIcon.textContent = '⏸';
      dom.playText.textContent = 'Pausar';
      dom.btnPlay.classList.add('playing');
    } else {
      dom.playIcon.textContent = '▶';
      dom.playText.textContent = 'Ejecutar';
      dom.btnPlay.classList.remove('playing');
    }
  }

  /* ---- Show simplification note ---- */
  function showNote(text) {
    if (text) {
      dom.noteText.textContent = text;
      dom.noteBanner.classList.add('visible');
    } else {
      dom.noteBanner.classList.remove('visible');
    }
  }

  /* ---- Reset UI to clean state ---- */
  function resetUI() {
    dom.stepCurrent.textContent = '0';
    dom.stepTotal.textContent = '0';
    dom.descMain.innerHTML = 'Seleccioná un ejemplo y presioná <strong>"Siguiente"</strong> o <strong>"Ejecutar"</strong> para comenzar.';
    dom.descDetail.classList.remove('visible');
    dom.descDetail.textContent = '';
    updateCycle(null);
    dom.inputValue.textContent = '—';
    dom.outputValue.textContent = '—';
    dom.ucPc.textContent = '—';
    dom.ucIr.textContent = '—';
    dom.aluDisplay.innerHTML = '<span class="alu-idle">Inactiva</span>';
    dom.regR1.textContent = '—';
    dom.regR2.textContent = '—';
    dom.regR3.textContent = '—';
    dom.memTbody.innerHTML = '';
    dom.stateMemTbody.innerHTML = '';
    dom.stateAlu.innerHTML = '<span class="alu-idle-state">Inactiva</span>';
    dom.statePc.textContent = '—';
    dom.stateIr.textContent = '—';
    dom.stateR1.textContent = '—';
    dom.stateR2.textContent = '—';
    dom.stateR3.textContent = '—';
  }

  return {
    init: init,
    renderSnapshot: renderSnapshot,
    updatePlayState: updatePlayState,
    showNote: showNote,
    resetUI: resetUI
  };
})();
