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
    return '' +
      '<h2>📖 ¿Qué es la Arquitectura de Von Neumann?</h2>' +

      '<p>La <strong>Arquitectura de Von Neumann</strong> es el modelo fundamental que describe cómo funciona internamente una computadora. ' +
      'Fue propuesto por el matemático <strong>John von Neumann</strong> en 1945 y sigue siendo la base de prácticamente todas las computadoras actuales.</p>' +

      '<div class="theory-highlight">' +
        '<strong>La idea principal:</strong> las instrucciones del programa y los datos se almacenan <em>juntos</em> en la misma memoria. ' +
        'El procesador lee las instrucciones una por una, las interpreta y las ejecuta, accediendo a los datos cuando los necesita.' +
      '</div>' +

      '<h3>🧩 Componentes principales</h3>' +
      '<p>Una computadora basada en este modelo tiene los siguientes componentes, que podés ver en el diagrama del simulador:</p>' +

      '<div class="theory-component">' +
        '<span class="tc-icon">📥</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name">Dispositivo de Entrada (E/S)</div>' +
          '<div class="tc-desc">Es el medio por el cual la computadora recibe información del exterior. ' +
          'Ejemplos: teclado, mouse, micrófono, escáner. En el simulador, es por donde ingresa el programa y los datos iniciales.</div>' +
        '</div>' +
      '</div>' +

      '<div class="theory-component">' +
        '<span class="tc-icon">📤</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name">Dispositivo de Salida (E/S)</div>' +
          '<div class="tc-desc">Es el medio por el cual la computadora entrega resultados al usuario. ' +
          'Ejemplos: monitor, impresora, parlantes. En el simulador, es donde aparece el resultado final.</div>' +
        '</div>' +
      '</div>' +

      '<div class="theory-component">' +
        '<span class="tc-icon">💾</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name">Memoria Principal (RAM)</div>' +
          '<div class="tc-desc">Es donde se almacenan <strong>temporalmente</strong> los programas y los datos que la computadora está usando en ese momento. ' +
          'Cada dato se guarda en una <strong>dirección</strong> específica (como un número de casillero). ' +
          'Es más lenta que los registros pero tiene mucha más capacidad. ' +
          'Un punto clave del modelo de Von Neumann es que las instrucciones y los datos comparten la misma memoria.</div>' +
        '</div>' +
      '</div>' +

      '<div class="theory-component">' +
        '<span class="tc-icon">🎯</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name">Unidad de Control (UC)</div>' +
          '<div class="tc-desc">Es el "director de orquesta" del procesador. <strong>No realiza operaciones matemáticas</strong>: ' +
          'su trabajo es coordinar todo. Determina qué instrucción ejecutar, le dice a la memoria qué dato enviar, ' +
          'le indica a la ALU qué operación hacer y cuándo. Contiene dos registros especiales:<br>' +
          '• <strong>PC</strong> (Contador de Programa): almacena la dirección de la próxima instrucción.<br>' +
          '• <strong>IR</strong> (Registro de Instrucción): almacena la instrucción que se está ejecutando.</div>' +
        '</div>' +
      '</div>' +

      '<div class="theory-component">' +
        '<span class="tc-icon">➕</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name">Unidad Aritmético-Lógica (ALU)</div>' +
          '<div class="tc-desc">Es la parte del procesador que <strong>realiza los cálculos</strong>. ' +
          'Puede hacer operaciones aritméticas (suma, resta, multiplicación, división) y operaciones lógicas (comparaciones como "¿es igual?", "¿es mayor?"). ' +
          'La ALU solo trabaja cuando la UC se lo indica.</div>' +
        '</div>' +
      '</div>' +

      '<div class="theory-component">' +
        '<span class="tc-icon">📋</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name">Registros</div>' +
          '<div class="tc-desc">Son pequeños espacios de almacenamiento <strong>ultrarrápidos</strong> ubicados dentro del procesador. ' +
          'Se usan para guardar temporalmente los datos que se están procesando en ese instante. ' +
          'Son mucho más rápidos que la memoria RAM pero su capacidad es muy limitada (generalmente solo pueden guardar un número cada uno). ' +
          'En el simulador usamos R1, R2 y R3 como registros de propósito general.</div>' +
        '</div>' +
      '</div>' +

      '<h3>🔌 Los Buses: los "caminos" de la información</h3>' +
      '<p>Los componentes se comunican entre sí a través de <strong>buses</strong>, que son los caminos por donde viaja la información. Hay tres tipos:</p>' +

      '<div class="theory-component">' +
        '<span class="tc-icon" style="color:#eab308">━━</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name" style="color:#eab308">Bus de Datos</div>' +
          '<div class="tc-desc">Transporta los datos reales: números, instrucciones, resultados. Es bidireccional (la información puede viajar en ambos sentidos).</div>' +
        '</div>' +
      '</div>' +

      '<div class="theory-component">' +
        '<span class="tc-icon" style="color:#22c55e">╌╌</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name" style="color:#22c55e">Bus de Direcciones</div>' +
          '<div class="tc-desc">Indica <strong>dónde</strong> buscar o guardar un dato en la memoria. El procesador envía el número de dirección por este bus.</div>' +
        '</div>' +
      '</div>' +

      '<div class="theory-component">' +
        '<span class="tc-icon" style="color:#ef4444">···</span>' +
        '<div class="tc-content">' +
          '<div class="tc-name" style="color:#ef4444">Bus de Control</div>' +
          '<div class="tc-desc">Envía señales que coordinan las operaciones, como "LEER" o "ESCRIBIR". Le dice a la memoria qué tipo de operación debe realizar.</div>' +
        '</div>' +
      '</div>' +

      '<h3>🔄 El ciclo de instrucción: Fetch → Decode → Execute → Store</h3>' +
      '<p>El procesador ejecuta un <strong>ciclo repetitivo</strong> para cada instrucción del programa. Este ciclo tiene cuatro etapas:</p>' +

      '<div class="theory-cycle">' +
        '<div class="cycle-card cc-fetch">' +
          '<span class="cc-num">1</span>' +
          '<span class="cc-name">FETCH</span>' +
          '<span class="cc-desc">Buscar: la UC obtiene la instrucción desde la memoria, usando el Bus de Direcciones y el Bus de Datos.</span>' +
        '</div>' +
        '<div class="cycle-card cc-decode">' +
          '<span class="cc-num">2</span>' +
          '<span class="cc-name">DECODE</span>' +
          '<span class="cc-desc">Decodificar: la UC interpreta la instrucción para saber qué operación realizar y qué datos necesita.</span>' +
        '</div>' +
        '<div class="cycle-card cc-execute">' +
          '<span class="cc-num">3</span>' +
          '<span class="cc-name">EXECUTE</span>' +
          '<span class="cc-desc">Ejecutar: la ALU realiza la operación indicada (suma, resta, comparación, etc.) con los datos obtenidos.</span>' +
        '</div>' +
        '<div class="cycle-card cc-store">' +
          '<span class="cc-num">4</span>' +
          '<span class="cc-name">STORE</span>' +
          '<span class="cc-desc">Almacenar: el resultado se guarda en un registro o en la memoria principal.</span>' +
        '</div>' +
      '</div>' +

      '<p>Este ciclo se repite para <strong>cada instrucción</strong> del programa, una tras otra, hasta que el programa termina.</p>' +

      '<h3>🔑 Conceptos clave</h3>' +

      '<div class="theory-highlight">' +
        '<strong>¿Cuál es la diferencia entre memoria y registros?</strong><br>' +
        'Los registros son muchísimo más rápidos pero muy pequeños (dentro del procesador). ' +
        'La memoria RAM tiene mucha más capacidad pero es más lenta. ' +
        'Los datos viajan de la memoria a los registros cuando el procesador los necesita para operar, y los resultados vuelven a la memoria para ser almacenados.' +
      '</div>' +

      '<div class="theory-highlight">' +
        '<strong>¿Por qué se almacenan las instrucciones y los datos juntos?</strong><br>' +
        'Esa es justamente la innovación de Von Neumann. Antes de este modelo, las instrucciones del programa se cargaban de forma separada (por ejemplo, con cables). ' +
        'Al almacenar todo en la misma memoria, la computadora puede cambiar de programa sin modificar su hardware físico.' +
      '</div>' +

      '<div class="theory-note">' +
        '⚠️ <strong>Nota sobre simplificaciones:</strong> Este simulador simplifica ciertos aspectos de un procesador real para hacerlos comprensibles. ' +
        'Por ejemplo, un procesador moderno tiene muchos más registros, ejecuta instrucciones en paralelo (pipelining), ' +
        'tiene múltiples niveles de caché, y las instrucciones de máquina son mucho más complejas que las que mostramos aquí (MUL, ADD, SUB, CMP, MOV). ' +
        'Sin embargo, el modelo fundamental de Von Neumann — con su ciclo Fetch/Decode/Execute/Store y la comunicación por buses — ' +
        'sigue siendo la base conceptual de cómo funcionan todas estas arquitecturas más avanzadas.' +
      '</div>';
  }

  return {
    init: init,
    open: open,
    close: close
  };
})();
