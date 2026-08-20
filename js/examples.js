/* =====================================================================
   examples.js — Definición de los 3 ejemplos con snapshots completos
   Patrón Memento: cada paso es una fotografía inmutable del sistema.
   ===================================================================== */
window.VN = window.VN || {};

VN.Examples = (function () {
  'use strict';

  /* ---------- helper para crear un snapshot con defaults ---------- */
  function snap(idx, cycle, opts) {
    return Object.assign(
      {
        stepIndex: idx,
        cycle: cycle,          // 'FETCH'|'DECODE'|'EXECUTE'|'STORE'|null
        pc: null,
        ir: null,
        registers: { MAR: null, MBR: null, AX: null, BX: null },
        memory: {},
        alu: { op: null, a: null, b: null, result: null },
        inputVal: null,
        outputVal: null,
        activeComponents: [],  // IDs: 'input','output','memory','uc','alu','registers'
        animations: [],        // secuenciales — se ejecutan en orden
        description: '',
        detail: ''
      },
      opts
    );
  }

  /* ================================================================
     EJEMPLO 1 — Operación matemática: 3 + 2 × 5 = 13
     ================================================================ */
  const MEM1 = { 100: 'MUL', 101: '2', 102: '5', 103: 'ADD', 104: '3', 105: '—' };

  const example1 = {
    id: 'math',
    name: 'Operación Matemática',
    expression: '3 + 2 × 5',
    result: '13',
    shortLabel: '3 + 2 × 5',
    description: 'Cálculo aritmético con precedencia de operaciones.',
    note: 'Simplificación didáctica: en la realidad, un compilador traduce la expresión a instrucciones de máquina antes de que lleguen a memoria. Aquí mostramos las instrucciones ya compiladas en un formato simplificado.',
    steps: [
      /* --- Paso 0: estado inicial --------------------------------- */
      snap(0, null, {
        inputVal: '3 + 2 × 5',
        activeComponents: ['input'],
        description: 'El programa está listo para ingresar al sistema.',
        detail: 'La expresión "3 + 2 × 5" ha sido previamente compilada en instrucciones atómicas secuenciales: primero MUL 2, 5 (multiplicar 2 por 5) y luego ADD 3 (sumar 3 al resultado de la multiplicación). Estas instrucciones se cargarán en la memoria principal.'
      }),

      /* --- Paso 1: programa se carga en memoria ------------------- */
      snap(1, null, {
        pc: 100,
        memory: Object.assign({}, MEM1),
        inputVal: '3 + 2 × 5',
        activeComponents: ['input', 'memory'],
        animations: [
          { bus: 'data', from: 'input', to: 'memory', value: '📦', label: 'Programa compilado' }
        ],
        description: 'El programa compilado se carga en la Memoria   Principal.',
        detail: 'Las instrucciones y sus operandos se almacenan en celdas consecutivas de memoria: MUL en la dirección 100, el operando 2 en la 101, el operando 5 en la 102, ADD en la 103, el operando 3 en la 104. La dirección 105 se reserva para el resultado final.'
      }),

      /* --- Paso 2: FETCH — UC busca MUL en [100] ------------------- */
      snap(2, 'FETCH', {
        pc: 100,
        ir: 'MUL',
        memory: Object.assign({}, MEM1),
        activeComponents: ['uc', 'memory'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '100', label: 'Dirección 100' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'cpu', value: 'MUL', label: 'Instrucción: MUL (Multiplicar)' }
        ],
        description: 'FETCH — La UC busca la instrucción en la dirección 100.',
        detail: 'El Contador de Programa (PC = 100) indica la siguiente instrucción. La UC envía la dirección 100 por el Bus de Direcciones, activa la señal de LECTURA por el Bus de Control, y la memoria responde enviando "MUL" por el Bus de Datos. La instrucción se almacena en el Registro de Instrucción (IR).'
      }),

      /* --- Paso 3: DECODE — UC interpreta MUL ---------------------- */
      snap(3, 'DECODE', {
        pc: 100,
        ir: 'MUL',
        memory: Object.assign({}, MEM1),
        activeComponents: ['uc'],
        animations: [],
        description: 'DECODE — La UC decodifica la instrucción MUL.',
        detail: 'La Unidad de Control interpreta el código "MUL": necesita obtener dos operandos de las siguientes direcciones de memoria (101 y 102) y enviarlos a la ALU para multiplicarlos.'
      }),

      /* --- Paso 4: FETCH operando — [101] → AX = 2 --------------- */
      snap(4, 'FETCH', {
        pc: 101,
        ir: 'MUL',
        registers: { MAR: null, MBR: null, AX: 2, BX: null },
        memory: Object.assign({}, MEM1),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '101', label: 'Dirección 101' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '2', label: 'Dato: 2 → AX' }
        ],
        description: 'FETCH — Se carga el primer operando (2) en el Registro AX.',
        detail: 'La UC envía la dirección 101 por el Bus de Direcciones y la señal de LECTURA por el Bus de Control. La memoria responde con el valor "2" por el Bus de Datos, que se almacena en el registro AX del procesador.'
      }),

      /* --- Paso 5: FETCH operando — [102] → BX = 5 --------------- */
      snap(5, 'FETCH', {
        pc: 102,
        ir: 'MUL',
        registers: { MAR: null, MBR: null, AX: 2, BX: 5 },
        memory: Object.assign({}, MEM1),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '102', label: 'Dirección 102' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '5', label: 'Dato: 5 → BX' }
        ],
        description: 'FETCH — Se carga el segundo operando (5) en el Registro BX.',
        detail: 'La UC envía la dirección 102 por el Bus de Direcciones. La memoria responde con el valor "5", que se almacena en el registro BX. Ahora la ALU tiene los dos operandos necesarios para la multiplicación.'
      }),

      /* --- Paso 6: EXECUTE — ALU: 2 × 5 = 10 --------------------- */
      snap(6, 'EXECUTE', {
        pc: 102,
        ir: 'MUL',
        registers: { MAR: null, MBR: null, AX: 2, BX: 5 },
        memory: Object.assign({}, MEM1),
        alu: { op: '×', a: 2, b: 5, result: 10 },
        activeComponents: ['alu', 'registers'],
        animations: [
          { bus: null, from: 'registers', to: 'alu', value: 'AX,BX', label: 'Operandos → ALU' }
        ],
        description: 'La ALU terminó de multiplicar los operandos: **2 × 5 = 10**.',
        detail: 'Los valores de AX (2) y BX (5) se envían a la ALU a través de conexiones internas del procesador. La ALU ejecuta la operación de multiplicación y obtiene el resultado: 10.'
      }),

      /* --- Paso 7: STORE — resultado 10 → AX ---------------------- */
      snap(7, 'STORE', {
        pc: 102,
        ir: 'MUL',
        registers: { MAR: null, MBR: null, AX: 10, BX: 5 },
        memory: Object.assign({}, MEM1),
        alu: { op: '×', a: 2, b: 5, result: 10 },
        activeComponents: ['alu', 'registers'],
        animations: [
          { bus: null, from: 'alu', to: 'registers', value: '10', label: 'Resultado → AX' }
        ],
        description: 'El resultado **10** se guarda temporalmente en el Registro AX.',
        detail: 'El resultado de la multiplicación (10) se transfiere desde la ALU al registro AX. Este valor se usará como operando en la próxima instrucción (la suma).'
      }),

      /* --- Paso 8: FETCH — UC busca ADD en [103] ------------------- */
      snap(8, 'FETCH', {
        pc: 103,
        ir: 'ADD',
        registers: { MAR: null, MBR: null, AX: 10, BX: 5 },
        memory: Object.assign({}, MEM1),
        alu: { op: null, a: null, b: null, result: null },
        activeComponents: ['uc', 'memory'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '103', label: 'Dirección 103' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'cpu', value: 'ADD', label: 'Instrucción: ADD (Sumar)' }
        ],
        description: 'FETCH — La UC busca la siguiente instrucción en la dirección 103.',
        detail: 'El PC avanza a la dirección 103. La UC repite el proceso: envía la dirección por el Bus de Direcciones, la señal LECTURA por el Bus de Control, y recibe "ADD" por el Bus de Datos. El IR ahora contiene ADD.'
      }),

      /* --- Paso 9: DECODE — UC interpreta ADD ---------------------- */
      snap(9, 'DECODE', {
        pc: 103,
        ir: 'ADD',
        registers: { MAR: null, MBR: null, AX: 10, BX: 5 },
        memory: Object.assign({}, MEM1),
        activeComponents: ['uc'],
        animations: [],
        description: 'DECODE — La UC decodifica la instrucción ADD.',
        detail: 'La UC interpreta "ADD": necesita sumar el valor en la dirección 104 con el resultado previo almacenado en AX (10).'
      }),

      /* --- Paso 10: FETCH operando — [104] → AX = 3 -------------- */
      snap(10, 'FETCH', {
        pc: 104,
        ir: 'ADD',
        registers: { MAR: null, MBR: null, AX: 10, BX: 5 },
        memory: Object.assign({}, MEM1),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '104', label: 'Dirección 104' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '3', label: 'Dato: 3 → AX' }
        ],
        description: 'FETCH — Se carga el operando (3) en el Registro AX.',
        detail: 'La UC obtiene el valor de la dirección 104 (el número 3) y lo almacena en AX. Los operandos para la suma son ahora AX = 3 y BX = 10.'
      }),

      /* --- Paso 11: EXECUTE — ALU: 3 + 10 = 13 -------------------- */
      snap(11, 'EXECUTE', {
        pc: 104,
        ir: 'ADD',
        registers: { MAR: null, MBR: null, AX: 10, BX: 5 },
        memory: Object.assign({}, MEM1),
        alu: { op: '+', a: 3, b: 10, result: 13 },
        activeComponents: ['alu', 'registers'],
        animations: [
          { bus: null, from: 'registers', to: 'alu', value: 'AX,BX', label: 'Operandos → ALU' }
        ],
        description: 'La ALU terminó de realizar la suma final: **3 + 10 = 13**.',
        detail: 'Los valores de AX (3) y AX (10) se envían a la ALU. Se realiza la operación de suma: 3 + 10 = 13. Este es el resultado final de la expresión 3 + 2 × 5.'
      }),

      /* --- Paso 12: STORE — resultado 13 → Memoria[105] ----------- */
      snap(12, 'STORE', {
        pc: 105,
        ir: 'ADD',
        registers: { MAR: null, MBR: null, AX: 13, BX: 5 },
        memory: { 100: 'MUL', 101: '2', 102: '5', 103: 'ADD', 104: '3', 105: '13' },
        alu: { op: '+', a: 3, b: 10, result: 13 },
        activeComponents: ['registers', 'memory'],
        animations: [
          { bus: null, from: 'alu', to: 'registers', value: '13', label: 'Resultado → AX' },
          { bus: 'address', from: 'cpu', to: 'memory', value: '105', label: 'Dirección 105' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'ESCR', label: 'Señal: ESCRITURA' },
          { bus: 'data', from: 'cpu', to: 'memory', value: '13', label: 'Dato: 13' }
        ],
        description: 'STORE — El resultado (13) se guarda en Memoria[105].',
        detail: 'El resultado 13 se almacena primero en AX y luego se escribe en la dirección 105 de memoria. La UC envía la dirección por el Bus de Direcciones, la señal ESCRITURA por el Bus de Control, y el dato 13 por el Bus de Datos.'
      }),

      /* --- Paso 13: resultado a salida ----------------------------- */
      snap(13, null, {
        pc: 105,
        ir: 'ADD',
        registers: { MAR: null, MBR: null, AX: 13, BX: 5 },
        memory: { 100: 'MUL', 101: '2', 102: '5', 103: 'ADD', 104: '3', 105: '13' },
        alu: { op: '+', a: 3, b: 10, result: 13 },
        outputVal: '13',
        activeComponents: ['memory', 'output'],
        animations: [
          { bus: 'data', from: 'memory', to: 'output', value: '13', label: 'Resultado: 13' }
        ],
        description: '¡Listo! El resultado **13** se envió al dispositivo de Salida.',
        detail: 'El valor almacenado en la dirección 105 se transfiere al dispositivo de salida a través del Bus de Datos. El usuario ve el resultado final: 3 + 2 × 5 = 13. ¡Operación completada! En una PC estándar 2025, esta operación toma como máximo **¡0,000000482 segundos!**'
      })
    ]
  };

  /* ================================================================
     EJEMPLO 2 — Mover datos de X a Y
     ================================================================ */
  var MEM2_INIT = { 100: 'MOV', 101: '200', 102: '300', 200: '📄', 300: '—' };

  var example2 = {
    id: 'move',
    name: 'Movimiento de Datos',
    expression: 'Mover dato de 200 a 300',
    result: '✅ Copiado',
    shortLabel: 'Mover datos',
    description: 'Copia de datos de una dirección de memoria a otra.',
    note: 'Simplificación didáctica: la instrucción MOV en una CPU real es una copia. La celda origen conserva su valor — la RAM no se "vacía". Aquí representamos un bloque de datos como un solo valor para simplificar.',
    steps: [
      /* --- Paso 0: estado inicial --------------------------------- */
      snap(0, null, {
        inputVal: 'Mover 📄 de 200 a 300',
        activeComponents: ['input'],
        description: 'La instrucción de mover datos está lista para ingresar.',
        detail: 'El programa indica: "Copiar el dato almacenado en la dirección X (200) a la dirección Y (300)". La instrucción MOV ya está compilada junto con las direcciones de origen y destino.'
      }),

      /* --- Paso 1: programa se carga en memoria ------------------- */
      snap(1, null, {
        pc: 100,
        memory: Object.assign({}, MEM2_INIT),
        inputVal: 'MOV 200→300',
        activeComponents: ['input', 'memory'],
        animations: [
          { bus: 'data', from: 'input', to: 'memory', value: '📦', label: 'Programa + Datos' }
        ],
        description: 'El programa y los datos se cargan en memoria.',
        detail: 'La instrucción MOV se almacena en la dirección 100, la dirección origen (200) en la 101, la dirección destino (300) en la 102. El dato a mover (📄) ya está en la dirección 200. La dirección 300 está libre.'
      }),

      /* --- Paso 2: FETCH — UC busca MOV en [100] ------------------- */
      snap(2, 'FETCH', {
        pc: 100,
        ir: 'MOV',
        memory: Object.assign({}, MEM2_INIT),
        activeComponents: ['uc', 'memory'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '100', label: 'Dirección 100' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'cpu', value: 'MOV', label: 'Instrucción: MOV' }
        ],
        description: 'FETCH — La UC busca la instrucción en la dirección 100.',
        detail: 'El PC apunta a la dirección 100. La UC envía esta dirección por el Bus de Direcciones, la señal LECTURA por el Bus de Control, y la memoria responde con "MOV" por el Bus de Datos.'
      }),

      /* --- Paso 3: DECODE — UC interpreta MOV ---------------------- */
      snap(3, 'DECODE', {
        pc: 100,
        ir: 'MOV',
        memory: Object.assign({}, MEM2_INIT),
        activeComponents: ['uc'],
        animations: [],
        description: 'DECODE — La UC decodifica la instrucción MOV.',
        detail: 'La UC interpreta "MOV": necesita leer las direcciones de origen y destino de las celdas 101 y 102, luego copiar el dato de la dirección origen a la dirección destino.'
      }),

      /* --- Paso 4: FETCH — dir. origen [101] → AX = 200 ----------- */
      snap(4, 'FETCH', {
        pc: 101,
        ir: 'MOV',
        registers: { MAR: null, MBR: null, AX: 200, BX: null },
        memory: Object.assign({}, MEM2_INIT),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '101', label: 'Dirección 101' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '200', label: 'Origen: dir. 200 → AX' }
        ],
        description: 'FETCH — Se lee la dirección de origen (200) → AX.',
        detail: 'La UC obtiene el contenido de la dirección 101, que es "200" — la dirección donde está almacenado el dato a mover. Este valor se guarda en AX.'
      }),

      /* --- Paso 5: FETCH — dir. destino [102] → BX = 300 ---------- */
      snap(5, 'FETCH', {
        pc: 102,
        ir: 'MOV',
        registers: { MAR: null, MBR: null, AX: 200, BX: 300 },
        memory: Object.assign({}, MEM2_INIT),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '102', label: 'Dirección 102' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '300', label: 'Destino: dir. 300 → BX' }
        ],
        description: 'FETCH — Se lee la dirección de destino (300) → BX.',
        detail: 'La UC obtiene el contenido de la dirección 102, que es "300" — la dirección donde se debe copiar el dato. Este valor se guarda en BX.'
      }),

      /* --- Paso 6: EXECUTE — leer dato de Mem[200] → AX ----------- */
      snap(6, 'EXECUTE', {
        pc: 102,
        ir: 'MOV',
        registers: { MAR: null, MBR: null, AX: '📄', BX: 300 },
        memory: Object.assign({}, MEM2_INIT),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '200', label: 'Dir. origen: 200' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '📄', label: 'Dato → AX' }
        ],
        description: 'EXECUTE — Se lee el dato de la dirección 200 (origen) → AX.',
        detail: 'La UC usa la dirección almacenada en AX (200) para solicitar el dato a la memoria. El dato (📄) viaja por el Bus de Datos y se almacena temporalmente en el registro AX.'
      }),

      /* --- Paso 7: STORE — escribir AX en Mem[300] ----------------- */
      snap(7, 'STORE', {
        pc: 102,
        ir: 'MOV',
        registers: { MAR: null, MBR: null, AX: '📄', BX: 300 },
        memory: { 100: 'MOV', 101: '200', 102: '300', 200: '📄', 300: '📄' },
        activeComponents: ['registers', 'memory'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '300', label: 'Dir. destino: 300' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'ESCR', label: 'Señal: ESCRITURA' },
          { bus: 'data', from: 'cpu', to: 'memory', value: '📄', label: 'Dato → Mem[300]' }
        ],
        description: 'STORE — El dato se copia de AX a la dirección 300 (destino).',
        detail: 'La UC usa la dirección en BX (300) para escribir el dato. Envía 300 por el Bus de Direcciones, ESCRITURA por el Bus de Control, y el dato 📄 por el Bus de Datos. Nota importante: la celda de origen (200) conserva su dato original — MOV es una COPIA, no un borrado.'
      }),

      /* --- Paso 8: confirmación a salida --------------------------- */
      snap(8, null, {
        pc: 102,
        ir: 'MOV',
        registers: { MAR: null, MBR: null, AX: '📄', BX: 300 },
        memory: { 100: 'MOV', 101: '200', 102: '300', 200: '📄', 300: '📄' },
        outputVal: '✅ Datos copiados',
        activeComponents: ['memory', 'output'],
        animations: [
          { bus: 'data', from: 'memory', to: 'output', value: '✅', label: 'Confirmación' }
        ],
        description: 'El dato fue copiado exitosamente de 200 a 300.',
        detail: 'La operación finalizó. El dato 📄 ahora existe en ambas direcciones: la 200 (origen) y la 300 (destino). Esto es correcto: en la memoria RAM, copiar datos no borra el original. La celda origen conserva su valor hasta que algo lo sobrescriba. En una PC estándar 2025, esta operación toma como máximo **¡0,000000401 segundos!**'
      })
    ]
  };

  /* ================================================================
     EJEMPLO 3 — Operación lógica: 2 = 3 - 1 → VERDADERO
     ================================================================ */
  var MEM3 = { 100: 'SUB', 101: '3', 102: '1', 103: 'CMP', 104: '2', 105: '—' };

  var example3 = {
    id: 'logic',
    name: 'Operación Lógica',
    expression: '2 = 3 - 1',
    result: 'VERDADERO',
    shortLabel: '2 = 3 - 1',
    description: 'Resta y comparación lógica con resultado VERDADERO/FALSO.',
    note: 'Simplificación didáctica: la comparación se realiza con una instrucción CMP separada. En una CPU real, el resultado de la comparación se almacena en un registro de flags (banderas), pero aquí lo simplificamos como un valor que se guarda directamente.',
    steps: [
      /* --- Paso 0: estado inicial --------------------------------- */
      snap(0, null, {
        inputVal: '2 = 3 - 1',
        activeComponents: ['input'],
        description: 'El programa está listo para ingresar al sistema.',
        detail: 'La expresión "¿2 = 3 - 1?" se ha compilado en dos instrucciones: primero SUB 3, 1 (restar 1 a 3) y luego CMP 2 (comparar el resultado con 2). El programa determinará si la igualdad es verdadera o falsa.'
      }),

      /* --- Paso 1: programa se carga en memoria ------------------- */
      snap(1, null, {
        pc: 100,
        memory: Object.assign({}, MEM3),
        inputVal: '2 = 3 - 1',
        activeComponents: ['input', 'memory'],
        animations: [
          { bus: 'data', from: 'input', to: 'memory', value: '📦', label: 'Programa compilado' }
        ],
        description: 'El programa compilado se carga en la Memoria Principal.',
        detail: 'Las instrucciones se almacenan en memoria: SUB en la dirección 100, los operandos 3 y 1 en las direcciones 101 y 102, CMP en la 103, el valor de referencia 2 en la 104, y la dirección 105 se reserva para el resultado.'
      }),

      /* --- Paso 2: FETCH — UC busca SUB en [100] ------------------- */
      snap(2, 'FETCH', {
        pc: 100,
        ir: 'SUB',
        memory: Object.assign({}, MEM3),
        activeComponents: ['uc', 'memory'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '100', label: 'Dirección 100' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'cpu', value: 'SUB', label: 'Instrucción: SUB' }
        ],
        description: 'FETCH — La UC busca la instrucción en la dirección 100.',
        detail: 'El PC apunta a la dirección 100. La UC envía la dirección por el Bus de Direcciones, la señal LECTURA por el Bus de Control, y recibe "SUB" (restar) por el Bus de Datos.'
      }),

      /* --- Paso 3: DECODE — UC interpreta SUB ---------------------- */
      snap(3, 'DECODE', {
        pc: 100,
        ir: 'SUB',
        memory: Object.assign({}, MEM3),
        activeComponents: ['uc'],
        animations: [],
        description: 'DECODE — La UC decodifica la instrucción SUB.',
        detail: 'La UC interpreta "SUB": necesita obtener dos operandos de las direcciones 101 y 102 y enviarlos a la ALU para realizar la resta.'
      }),

      /* --- Paso 4: FETCH operando — [101] → AX = 3 --------------- */
      snap(4, 'FETCH', {
        pc: 101,
        ir: 'SUB',
        registers: { MAR: null, MBR: null, AX: 3, BX: null },
        memory: Object.assign({}, MEM3),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '101', label: 'Dirección 101' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '3', label: 'Dato: 3 → AX' }
        ],
        description: 'FETCH — Se carga el primer operando (3) en AX.',
        detail: 'La UC solicita el dato de la dirección 101. La memoria responde con el valor 3, que se almacena en el registro AX.'
      }),

      /* --- Paso 5: FETCH operando — [102] → BX = 1 --------------- */
      snap(5, 'FETCH', {
        pc: 102,
        ir: 'SUB',
        registers: { MAR: null, MBR: null, AX: 3, BX: 1 },
        memory: Object.assign({}, MEM3),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '102', label: 'Dirección 102' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '1', label: 'Dato: 1 → BX' }
        ],
        description: 'FETCH — Se carga el segundo operando (1) en BX.',
        detail: 'La UC solicita el dato de la dirección 102. La memoria responde con el valor 1, que se almacena en el registro BX. La ALU ahora tiene los dos operandos para la resta.'
      }),

      /* --- Paso 6: EXECUTE — ALU: 3 - 1 = 2 ----------------------- */
      snap(6, 'EXECUTE', {
        pc: 102,
        ir: 'SUB',
        registers: { MAR: null, MBR: null, AX: 3, BX: 1 },
        memory: Object.assign({}, MEM3),
        alu: { op: '−', a: 3, b: 1, result: 2 },
        activeComponents: ['alu', 'registers'],
        animations: [
          { bus: null, from: 'registers', to: 'alu', value: 'AX,BX', label: 'Operandos → ALU' }
        ],
        description: 'EXECUTE — La ALU realiza la resta: 3 − 1 = 2.',
        detail: 'Los valores de AX (3) y BX (1) se envían a la ALU. Se ejecuta la resta: 3 − 1 = 2.'
      }),

      /* --- Paso 7: STORE — resultado 2 → AX ----------------------- */
      snap(7, 'STORE', {
        pc: 102,
        ir: 'SUB',
        registers: { MAR: null, MBR: null, AX: 2, BX: 1 },
        memory: Object.assign({}, MEM3),
        alu: { op: '−', a: 3, b: 1, result: 2 },
        activeComponents: ['alu', 'registers'],
        animations: [
          { bus: null, from: 'alu', to: 'registers', value: '2', label: 'Resultado → AX' }
        ],
        description: 'STORE — El resultado (2) se guarda en AX.',
        detail: 'El resultado de la resta (2) se almacena en el registro AX. Ahora falta comparar este valor con el 2 del lado izquierdo de la igualdad.'
      }),

      /* --- Paso 8: FETCH — UC busca CMP en [103] ------------------- */
      snap(8, 'FETCH', {
        pc: 103,
        ir: 'CMP',
        registers: { MAR: null, MBR: null, AX: 2, BX: 1 },
        memory: Object.assign({}, MEM3),
        alu: { op: null, a: null, b: null, result: null },
        activeComponents: ['uc', 'memory'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '103', label: 'Dirección 103' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'cpu', value: 'CMP', label: 'Instrucción: CMP' }
        ],
        description: 'FETCH — La UC busca la instrucción de comparación en la dirección 103.',
        detail: 'El PC avanza a 103. La UC obtiene la instrucción "CMP" (comparar). Ahora necesita obtener el valor de referencia para la comparación.'
      }),

      /* --- Paso 9: DECODE — UC interpreta CMP ---------------------- */
      snap(9, 'DECODE', {
        pc: 103,
        ir: 'CMP',
        registers: { MAR: null, MBR: null, AX: 2, BX: 1 },
        memory: Object.assign({}, MEM3),
        activeComponents: ['uc'],
        animations: [],
        description: 'DECODE — La UC decodifica la instrucción CMP.',
        detail: 'La UC interpreta "CMP": debe comparar el valor de la dirección 104 con el resultado previo en AX. La ALU realizará la comparación.'
      }),

      /* --- Paso 10: FETCH operando — [104] → BX = 2 --------------- */
      snap(10, 'FETCH', {
        pc: 104,
        ir: 'CMP',
        registers: { MAR: null, MBR: null, AX: 2, BX: 2 },
        memory: Object.assign({}, MEM3),
        activeComponents: ['uc', 'memory', 'registers'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '104', label: 'Dirección 104' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'LEER', label: 'Señal: LECTURA' },
          { bus: 'data', from: 'memory', to: 'registers', value: '2', label: 'Dato: 2 → BX' }
        ],
        description: 'FETCH — Se carga el valor de referencia (2) en BX.',
        detail: 'La UC obtiene el valor 2 de la dirección 104 y lo almacena en BX. Ahora comparará AX (2) con BX (2) para verificar la igualdad.'
      }),

      /* --- Paso 11: EXECUTE — ALU: 2 = 2 → VERDADERO -------------- */
      snap(11, 'EXECUTE', {
        pc: 104,
        ir: 'CMP',
        registers: { MAR: null, MBR: null, AX: 2, BX: 2 },
        memory: Object.assign({}, MEM3),
        alu: { op: '=', a: 2, b: 2, result: 'VERDADERO' },
        activeComponents: ['alu', 'registers'],
        animations: [
          { bus: null, from: 'registers', to: 'alu', value: 'AX,BX', label: 'Comparar → ALU' }
        ],
        description: 'EXECUTE — La ALU compara: 2 = 2 → VERDADERO.',
        detail: 'La ALU recibe AX (2) y BX (2). Realiza la comparación de igualdad: ¿2 es igual a 2? Sí. El resultado es VERDADERO.'
      }),

      /* --- Paso 12: STORE — VERDADERO → Memoria[105] --------------- */
      snap(12, 'STORE', {
        pc: 105,
        ir: 'CMP',
        registers: { MAR: null, MBR: null, AX: 2, BX: 2 },
        memory: { 100: 'SUB', 101: '3', 102: '1', 103: 'CMP', 104: '2', 105: 'VERDADERO' },
        alu: { op: '=', a: 2, b: 2, result: 'VERDADERO' },
        activeComponents: ['registers', 'memory'],
        animations: [
          { bus: 'address', from: 'cpu', to: 'memory', value: '105', label: 'Dirección 105' },
          { bus: 'control', from: 'cpu', to: 'memory', value: 'ESCR', label: 'Señal: ESCRITURA' },
          { bus: 'data', from: 'cpu', to: 'memory', value: 'VERD', label: 'Dato: VERDADERO' }
        ],
        description: 'STORE — El resultado "VERDADERO" se guarda en Memoria[105].',
        detail: 'El resultado de la comparación se almacena en la dirección 105 de la memoria. La UC coordina el envío de la dirección, la señal de escritura y el dato a través de los tres buses.'
      }),

      /* --- Paso 13: resultado a salida ----------------------------- */
      snap(13, null, {
        pc: 105,
        ir: 'CMP',
        registers: { MAR: null, MBR: null, AX: 2, BX: 2 },
        memory: { 100: 'SUB', 101: '3', 102: '1', 103: 'CMP', 104: '2', 105: 'VERDADERO' },
        alu: { op: '=', a: 2, b: 2, result: 'VERDADERO' },
        outputVal: 'VERDADERO',
        activeComponents: ['memory', 'output'],
        animations: [
          { bus: 'data', from: 'memory', to: 'output', value: '✓', label: 'VERDADERO' }
        ],
        description: 'El resultado "VERDADERO" se envía a la Salida.',
        detail: 'El valor "VERDADERO" almacenado en la dirección 105 se envía al dispositivo de salida. Conclusión: 2 = 3 − 1 es una afirmación verdadera, ya que 3 − 1 = 2 y 2 = 2. ¡Operación completada! En una PC estándar 2025, esta operación toma como máximo **¡0,000000482 segundos!**'
      })
    ]
  };

  /* ================================================================
     API pública
     ================================================================ */
  var examples = [example1, example2, example3];

  function flattenSteps(steps) {
    var flat = [];
    var flatIdx = 0;
    steps.forEach(function (step) {
      if (!step.animations || step.animations.length <= 1) {
        var s = Object.assign({}, step);
        s.stepIndex = flatIdx++;
        flat.push(s);
      } else {
        step.animations.forEach(function (anim, i) {
          var s = Object.assign({}, step);
          s.stepIndex = flatIdx++;
          s.animations = [anim];
          if (step.animations.length > 1) {
            s.detail = 'Micro-paso ' + (i + 1) + '/' + step.animations.length + ' — ' + anim.label + '. ' + step.detail;
          }
          flat.push(s);
        });
      }
    });
    return flat;
  }

  examples.forEach(function(ex) {
    ex.steps = flattenSteps(ex.steps);
  });

  return {
    getAll: function () { return examples; },
    get: function (index) { return examples[index]; },
    count: function () { return examples.length; }
  };
})();
