/* =====================================================================
   theory.js — Modal de teoría: explicaciones didácticas para principiantes
   ===================================================================== */
window.VN = window.VN || {};

VN.Theory = (function () {
  'use strict';

  var modal  = null;
  var body   = null;
  var btnOpen  = null;
  var btnClose = null;

  function init() {
    modal    = document.getElementById('theory-modal');
    body     = document.getElementById('theory-body');
    btnOpen  = document.getElementById('btn-theory');
    btnClose = document.getElementById('btn-close-theory');

    if (!modal || !body || !btnOpen || !btnClose) return;

    /* Inject content */
    body.innerHTML = getContent();

    /* Events */
    btnOpen.addEventListener('click', open);
    btnClose.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
    });
  }

  function open() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function getContent() {
    if (window.VN && window.VN.Texts && window.VN.Texts.theory) {
      return window.VN.Texts.theory.content;
    }
    return '<p>Error: No se pudo cargar el texto de teoría.</p>';
  }

  return {
    init: init,
    open: open,
    close: close
  };
})();
