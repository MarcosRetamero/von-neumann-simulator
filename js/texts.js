window.VN = window.VN || {};

window.VN.Texts = {
  "comp-input": {
    "title": "Dispositivo de Entrada",
    "description": "Por aquí ingresan los datos y programas al sistema (ej. teclado, ratón, disco). Es el punto de partida de la información antes de procesarse."
  },
  "comp-output": {
    "title": "Dispositivo de Salida",
    "description": "Por aquí salen los resultados procesados hacia el exterior (ej. monitor, impresora, altavoces), permitiendo que el usuario vea el resultado final."
  },
  "comp-memory": {
    "title": "Memoria Principal (RAM)",
    "description": "Almacena temporalmente los programas en ejecución y los datos que la computadora está usando. Es volátil: si se apaga, su contenido se pierde. La CPU accede a ella mediante el MAR y MBR."
  },
  "comp-cpu": {
    "title": "Procesador (CPU)",
    "description": "El cerebro de la computadora. Contiene la Unidad de Control (UC), la Unidad Aritmético-Lógica (ALU) y los Registros."
  },
  "comp-uc": {
    "title": "Unidad de Control (UC)",
    "description": "Actúa como el director de orquesta. No realiza cálculos, sino que extrae las instrucciones de la memoria, las decodifica y coordina qué debe hacer cada componente. Maneja el PC y el IR."
  },
  "comp-alu": {
    "title": "Unidad Aritmético-Lógica (ALU)",
    "description": "Es la calculadora interna del procesador. Se encarga de realizar operaciones matemáticas (suma, resta, multiplicación) y lógicas (comparaciones)."
  },
  "comp-registers": {
    "title": "Registros (MAR, MBR, AX, BX)",
    "description": "Memorias ultrarrápidas de la CPU. MAR y MBR interactúan con los buses externos hacia la memoria. AX y BX guardan datos temporales y operandos que alimentan a la ALU."
  },
  "theory": {
    "content": "<h2>Arquitectura Von Neumann y Flujo RTL</h2>" +
      "<p>La Arquitectura de Von Neumann fundamenta el diseño del hardware en el concepto del <strong>programa almacenado</strong>, donde el código ejecutable y las variables residen en la misma Memoria Principal (RAM).</p>" +
      "<p>Para que la simulación refleje con precisión el comportamiento físico de un procesador, la interacción entre componentes no ocurre de forma abstracta: se rige estrictamente por microoperaciones entre registros internos y señales a través de buses (RTL).</p>" +
      "<h3>Jerarquía de Registros</h3>" +
      "<p><strong>1. Registros de Interfaz con la Memoria (Puertos del Sistema)</strong><br>" +
      "Constituyen la única frontera física entre el interior de la CPU y los buses externos. Ningún otro registro interno puede interactuar directamente con la RAM:</p>" +
      "<ul>" +
      "<li><strong>MAR (Memory Address Register):</strong> Almacena de forma exclusiva la dirección física de la celda de memoria a la que se desea acceder. Está conectado unidireccionalmente al <em>Bus de Direcciones</em>.</li>" +
      "<li><strong>MBR / MDR (Memory Buffer Register):</strong> Actúa como búfer de contención. Retiene temporalmente el dato o instrucción que entra desde la RAM (lectura) o que sale para grabarse (escritura). Está acoplado al <em>Bus de Datos</em>.</li>" +
      "</ul>" +
      "<p><strong>2. Registros de Control y Secuenciamiento</strong></p>" +
      "<ul>" +
      "<li><strong>PC (Program Counter):</strong> Contiene la dirección de la próxima instrucción a ejecutar.</li>" +
      "<li><strong>IR (Instruction Register):</strong> Aloja el código de la instrucción en curso. La UC decodifica su contenido.</li>" +
      "</ul>" +
      "<p><strong>3. Registros de Propósito General</strong></p>" +
      "<ul>" +
      "<li><strong>AX (Acumulador):</strong> Registro principal de trabajo. Contiene uno de los operandos de entrada para la ALU y suele ser el receptor del resultado final.</li>" +
      "<li><strong>BX (Registro Base):</strong> Registro de soporte para retener el segundo operando antes de ingresar a la ALU.</li>" +
      "</ul>" +
      "<h3>Buses del sistema</h3>" +
      "<p>Los componentes se interconectan mediante líneas de transmisión llamadas buses:</p>" +
      "<ul>" +
      "<li><strong>Buses Externos:</strong> Bus de Datos (MBR ↔ RAM), Bus de Direcciones (MAR → RAM) y Bus de Control (UC → RAM).</li>" +
      "<li><strong>Buses Internos:</strong> Conectan internamente la UC, la ALU y los registros dentro de la CPU sin salir a la placa.</li>" +
      "</ul>" +
      "<h3>El Ciclo de Instrucción (RTL)</h3>" +
      "<ul>" +
      "<li><strong>FETCH (Búsqueda):</strong> MAR ← PC (Dirección al Bus); MBR ← Memoria[MAR] (Instrucción leída al MBR); IR ← MBR (La instrucción pasa a ejecución).</li>" +
      "<li><strong>DECODE (Decodificación):</strong> La UC interpreta el código de operación.</li>" +
      "<li><strong>FETCH DE OPERANDOS:</strong> MAR recibe la dirección del dato. MBR recibe el dato de Memoria. AX o BX reciben el dato del MBR.</li>" +
      "<li><strong>EXECUTE (Ejecución):</strong> La ALU recibe AX y BX, calcula, y el resultado va a AX.</li>" +
      "<li><strong>STORE (Almacenamiento):</strong> MAR ← Dirección Destino; MBR ← AX (Dato a guardar); Memoria[MAR] ← MBR.</li>" +
      "</ul>"
  }
};
