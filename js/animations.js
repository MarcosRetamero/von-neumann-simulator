/* =====================================================================
   animations.js — Motor de animación de paquetes viajando por los buses
   Secuencial: cada animación de un paso se ejecuta en orden (corrección #3).
   ===================================================================== */
window.VN = window.VN || {};

VN.Animations = (function () {
  'use strict';

  var SVG_NS  = 'http://www.w3.org/2000/svg';
  var animSvg = null;
  var animLayer = null;
  var pathsSvg  = null;
  var cancelled = false;
  var currentAnimations = [];

  /* ---- Packet speed (px per ms) ---- */
  var SPEED = 0.25;

  /* ---- Colors by bus type ---- */
  var BUS_COLORS = {
    data:    '#eab308',
    address: '#22c55e',
    control: '#ef4444',
    internal: '#a78bfa'
  };

  /* ---- Path ID resolution ---- */
  function getPathId(bus, from, to) {
    if (bus === null || bus === 'internal') {
      return 'path-internal-' + from + '-' + to;
    }
    return 'path-' + bus + '-' + from + '-' + to;
  }

  /* ---- Find the SVG path element ---- */
  function getPath(bus, from, to) {
    var id = getPathId(bus, from, to);
    var path = pathsSvg.querySelector('#' + id);
    if (path) return path;

    /* Fallback: try common alias routes */
    var aliases = {
      'path-data-cpu-memory':       'path-data-cpu-memory',
      'path-data-memory-registers': 'path-data-memory-registers',
      'path-data-memory-cpu':       'path-data-memory-cpu',
      'path-address-cpu-memory':    'path-address-cpu-memory',
      'path-control-cpu-memory':    'path-control-cpu-memory',
      'path-data-memory-output':    'path-data-memory-output',
      'path-data-input-memory':     'path-data-input-memory',
    };
    if (aliases[id]) {
      path = pathsSvg.querySelector('#' + aliases[id]);
    }
    return path;
  }

  /* ---- Create a visual data packet ---- */
  function createPacket(value, busType) {
    var color = BUS_COLORS[busType] || BUS_COLORS.data;

    var g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'data-packet');

    /* Background pill */
    var rect = document.createElementNS(SVG_NS, 'rect');
    var textLen = String(value).length;
    var w = Math.max(36, textLen * 9 + 16);
    rect.setAttribute('x', -w / 2);
    rect.setAttribute('y', -12);
    rect.setAttribute('width', w);
    rect.setAttribute('height', 24);
    rect.setAttribute('rx', 12);
    rect.setAttribute('fill', color);
    rect.setAttribute('fill-opacity', '0.85');
    rect.setAttribute('stroke', '#fff');
    rect.setAttribute('stroke-width', '1.5');
    rect.setAttribute('stroke-opacity', '0.5');

    /* Text */
    var text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', '#000');
    text.setAttribute('font-family', "'JetBrains Mono', monospace");
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '700');
    text.textContent = value;

    g.appendChild(rect);
    g.appendChild(text);

    /* Add glow filter based on bus type */
    if (busType === 'data') g.setAttribute('filter', 'url(#glow-data)');
    else if (busType === 'address') g.setAttribute('filter', 'url(#glow-addr)');
    else if (busType === 'control') g.setAttribute('filter', 'url(#glow-ctrl)');

    return g;
  }

  /* ---- Animate a packet along a path ---- */
  function animatePacket(path, packet, speed) {
    return new Promise(function (resolve) {
      if (cancelled) { resolve(); return; }

      var totalLength = path.getTotalLength();
      if (totalLength < 1) { resolve(); return; }

      animLayer.appendChild(packet);
      currentAnimations.push(packet);

      var distance = 0;
      var lastTime = null;
      var spd = speed || SPEED;

      function step(timestamp) {
        if (cancelled) {
          removePacket(packet);
          resolve();
          return;
        }
        if (!lastTime) lastTime = timestamp;
        var dt = timestamp - lastTime;
        lastTime = timestamp;

        distance += spd * dt;
        if (distance >= totalLength) {
          /* Small pause at destination */
          setTimeout(function () {
            removePacket(packet);
            resolve();
          }, 150);
          return;
        }

        var pt = path.getPointAtLength(distance);
        packet.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')');
        requestAnimationFrame(step);
      }

      /* Start at beginning */
      var startPt = path.getPointAtLength(0);
      packet.setAttribute('transform', 'translate(' + startPt.x + ',' + startPt.y + ')');
      requestAnimationFrame(step);
    });
  }

  /* ---- Remove a packet from the DOM ---- */
  function removePacket(packet) {
    if (packet && packet.parentNode) {
      packet.parentNode.removeChild(packet);
    }
    var idx = currentAnimations.indexOf(packet);
    if (idx > -1) currentAnimations.splice(idx, 1);
  }

  /* ---- Play all animations for a step (sequentially) ---- */
  function playStep(animations) {
    cancelled = false;
    if (!animations || animations.length === 0) {
      return Promise.resolve();
    }

    /* Chain promises sequentially */
    var chain = Promise.resolve();
    animations.forEach(function (anim) {
      chain = chain.then(function () {
        if (cancelled) return;
        return playSingle(anim);
      });
    });
    return chain;
  }

  /* ---- Play a single animation ---- */
  function playSingle(anim) {
    return new Promise(function (resolve) {
      if (cancelled) { resolve(); return; }

      var busType = anim.bus || 'internal';
      var path = getPath(anim.bus, anim.from, anim.to);

      if (!path) {
        /* No path found — skip gracefully */
        console.warn('Animation path not found:', getPathId(anim.bus, anim.from, anim.to));
        resolve();
        return;
      }

      /* Highlight the bus line during animation */
      highlightBusLine(busType, true);

      /* Show label */
      showAnimLabel(anim.label, busType);

      var packet = createPacket(anim.value, busType);
      animatePacket(path, packet, SPEED).then(function () {
        highlightBusLine(busType, false);
        hideAnimLabel();
        resolve();
      });
    });
  }

  /* ---- Bus line highlighting during animation ---- */
  function highlightBusLine(busType, active) {
    var lineId = {
      data:    'busline-data',
      address: 'busline-addr',
      control: 'busline-ctrl'
    };
    var el = document.getElementById(lineId[busType]);
    if (el) {
      if (active) el.classList.add('active');
      else el.classList.remove('active');
    }
  }

  /* ---- Animation label (floating text) ---- */
  var labelEl = null;

  function showAnimLabel(text, busType) {
    if (!text) return;
    if (!labelEl) {
      labelEl = document.createElementNS(SVG_NS, 'text');
      labelEl.setAttribute('class', 'anim-label');
      labelEl.setAttribute('x', '450');
      labelEl.setAttribute('y', '270');
      labelEl.setAttribute('text-anchor', 'middle');
      labelEl.setAttribute('font-family', "'Inter', sans-serif");
      labelEl.setAttribute('font-size', '12');
      labelEl.setAttribute('font-weight', '600');
      labelEl.setAttribute('fill-opacity', '0.8');
    }
    var color = BUS_COLORS[busType] || '#fff';
    labelEl.setAttribute('fill', color);
    labelEl.textContent = text;
    if (!labelEl.parentNode) animLayer.appendChild(labelEl);
  }

  function hideAnimLabel() {
    if (labelEl && labelEl.parentNode) {
      labelEl.parentNode.removeChild(labelEl);
    }
  }

  /* ---- Cancel all running animations ---- */
  function cancelAll() {
    cancelled = true;
    currentAnimations.forEach(function (pkt) {
      removePacket(pkt);
    });
    currentAnimations = [];
    hideAnimLabel();

    /* Remove active from all bus lines */
    ['busline-data', 'busline-addr', 'busline-ctrl'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
  }

  /* ---- Init ---- */
  function init() {
    animSvg   = document.getElementById('bus-anim-svg');
    animLayer = document.getElementById('anim-layer');
    pathsSvg  = document.getElementById('bus-paths-svg');
  }

  /* ---- Set speed ---- */
  function setSpeed(pxPerMs) {
    SPEED = pxPerMs;
  }

  return {
    init: init,
    playStep: playStep,
    cancelAll: cancelAll,
    setSpeed: setSpeed
  };
})();
