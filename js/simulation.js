/* =====================================================================
   simulation.js — Motor de simulación con patrón Memento (snapshots)
   ===================================================================== */
window.VN = window.VN || {};

VN.Simulation = (function () {
  'use strict';

  var currentExample = null;   // referencia al ejemplo activo
  var currentStep    = 0;      // índice del paso actual
  var isPlaying      = false;  // auto-play activo
  var playTimer      = null;   // timer de auto-play
  var animating      = false;  // si hay una animación en curso
  var playSpeed      = 2800;   // ms entre pasos en auto-play
  var listeners      = [];     // callbacks de eventos

  /* ---------- event system ---------- */
  function emit(event, data) {
    listeners.forEach(function (cb) { cb(event, data); });
  }

  function on(callback) {
    listeners.push(callback);
  }

  /* ---------- public API ---------- */
  function setExample(index) {
    stop();
    currentExample = VN.Examples.get(index);
    currentStep = 0;
    emit('example-changed', { example: currentExample, step: getSnapshot() });
  }

  function getSnapshot() {
    if (!currentExample) return null;
    return currentExample.steps[currentStep];
  }

  function getTotalSteps() {
    if (!currentExample) return 0;
    return currentExample.steps.length;
  }

  function getCurrentStepIndex() {
    return currentStep;
  }

  function getExample() {
    return currentExample;
  }

  function isAtEnd() {
    return currentStep >= getTotalSteps() - 1;
  }

  function isAtStart() {
    return currentStep <= 0;
  }

  /* ---------- navigation ---------- */
  function nextStep() {
    if (!currentExample || animating) return false;
    if (isAtEnd()) {
      stop();
      return false;
    }
    currentStep++;
    var snap = getSnapshot();
    emit('step-changed', { step: snap, direction: 'forward' });
    return true;
  }

  function prevStep() {
    if (!currentExample || animating) return false;
    if (isAtStart()) return false;
    currentStep--;
    var snap = getSnapshot();
    emit('step-changed', { step: snap, direction: 'backward' });
    return true;
  }

  function reset() {
    stop();
    if (!currentExample) return;
    currentStep = 0;
    emit('step-changed', { step: getSnapshot(), direction: 'backward' });
  }

  /* ---------- auto-play ---------- */
  function play() {
    if (!currentExample || isAtEnd()) return;
    isPlaying = true;
    emit('play-state-changed', { playing: true });
    scheduleNext();
  }

  function stop() {
    isPlaying = false;
    if (playTimer) {
      clearTimeout(playTimer);
      playTimer = null;
    }
    emit('play-state-changed', { playing: false });
  }

  function togglePlay() {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }

  function scheduleNext() {
    if (!isPlaying) return;
    playTimer = setTimeout(function () {
      if (!isPlaying) return;
      var advanced = nextStep();
      if (advanced && !isAtEnd()) {
        scheduleNext();
      } else {
        stop();
      }
    }, playSpeed);
  }

  /* ---------- animation lock ---------- */
  function setAnimating(val) {
    animating = val;
  }

  function getAnimating() {
    return animating;
  }

  function setSpeed(ms) {
    playSpeed = ms;
  }

  return {
    on: on,
    setExample: setExample,
    getSnapshot: getSnapshot,
    getTotalSteps: getTotalSteps,
    getCurrentStepIndex: getCurrentStepIndex,
    getExample: getExample,
    isAtEnd: isAtEnd,
    isAtStart: isAtStart,
    nextStep: nextStep,
    prevStep: prevStep,
    reset: reset,
    play: play,
    stop: stop,
    togglePlay: togglePlay,
    setAnimating: setAnimating,
    getAnimating: getAnimating,
    setSpeed: setSpeed
  };
})();
