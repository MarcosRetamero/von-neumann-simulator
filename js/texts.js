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
    "description": "Almacena temporalmente los programas en ejecución y los datos que la computadora está usando. Es volátil: si se apaga, su contenido se pierde."
  },
  "comp-cpu": {
    "title": "Procesador (CPU)",
    "description": "El cerebro de la computadora. Contiene la Unidad de Control (UC), la Unidad Aritmético-Lógica (ALU) y los Registros."
  },
  "comp-uc": {
    "title": "Unidad de Control (UC)",
    "description": "Actúa como el director de orquesta. No realiza cálculos, sino que extrae las instrucciones de la memoria, las decodifica y coordina qué debe hacer cada componente y en qué momento."
  },
  "comp-alu": {
    "title": "Unidad Aritmético-Lógica (ALU)",
    "description": "Es la calculadora interna del procesador. Se encarga de realizar operaciones matemáticas (suma, resta, multiplicación) y lógicas (comparaciones)."
  },
  "comp-registers": {
    "title": "Registros",
    "description": "Son pequeños espacios de almacenamiento ultrarrápidos dentro del procesador. Sirven para guardar los operandos temporales y los resultados inmediatos de la ALU."
  },
  "theory": {
    "content": "<h2>¿Qué es la Arquitectura de Von Neumann?</h2>" +
      "<p>La Arquitectura de Von Neumann es el modelo conceptual que describe la estructura y el funcionamiento interno de una computadora. Fue propuesto por el matemático John von Neumann en 1945 y constituye la base de la informática moderna.</p>" +
      "<p>La idea central del modelo es que las instrucciones de un programa y los datos sobre los que opera conviven dentro de la misma memoria principal. El procesador lee estas instrucciones de forma secuencial, las interpreta y las ejecuta, accediendo a los datos según sea necesario.</p>" +
      "<h3>Componentes principales del sistema</h3>" +
      "<div class=\"theory-component\"><span class=\"tc-icon\">📥</span><strong>Dispositivo de Entrada (E/S):</strong> Canal por el cual el sistema recibe información del exterior. Permite el ingreso de programas y datos iniciales (ejemplos: teclado, mouse, escáner).</div>" +
      "<div class=\"theory-component\"><span class=\"tc-icon\">📤</span><strong>Dispositivo de Salida (E/S):</strong> Canal mediante el cual la computadora entrega los resultados procesados al usuario (ejemplos: monitor, impresora, parlantes).</div>" +
      "<div class=\"theory-component\"><span class=\"tc-icon\">💾</span><strong>Memoria Principal (RAM):</strong> Almacén volátil de alta velocidad que retiene temporalmente los programas y datos en ejecución. Cada valor se ubica en una dirección de memoria específica. Aunque es más lenta que los registros internos del procesador, ofrece una capacidad mucho mayor. Su rasgo distintivo es almacenar instrucciones y datos en un mismo espacio de direccionamiento.</div>" +
      "<div class=\"theory-component\"><span class=\"tc-icon\">🎯</span><strong>Unidad de Control (UC):</strong> Es el componente encargado de la coordinación y sincronización del procesador. No ejecuta operaciones aritméticas ni lógicas; su función es secuenciar y supervisar las tareas de los demás módulos. Dictamina qué instrucción buscar, ordena el tráfico en los buses e indica a la ALU qué operación realizar y cuándo. Para esto utiliza registros especializados: <ul><li><strong>PC (Contador de Programa):</strong> Almacena la dirección de memoria de la próxima instrucción a ejecutar.</li><li><strong>IR (Registro de Instrucción):</strong> Mantiene la instrucción que se está decodificando y ejecutando en el ciclo actual.</li></ul></div>" +
      "<div class=\"theory-component\"><span class=\"tc-icon\">➕</span><strong>Unidad Aritmético-Lógica (ALU):</strong> Es el núcleo del procesamiento numérico y lógico. Ejecuta operaciones aritméticas (suma, resta, multiplicación, división) y evaluaciones lógicas (comparaciones de igualdad o magnitud). Opera exclusivamente bajo las señales enviadas por la Unidad de Control.</div>" +
      "<div class=\"theory-component\"><span class=\"tc-icon\">📋</span><strong>Registros:</strong> Memorias de tamaño reducido y velocidad extrema integradas dentro del mismo chip de la CPU. Almacenan temporalmente operandos e información de estado de acceso inmediato para las operaciones en curso. Su velocidad evita que el procesador deba recurrir a la memoria RAM para cada cálculo intermedio.</div>" +
      "<h3>Buses del sistema: Los canales de comunicación</h3>" +
      "<p>Los componentes se interconectan mediante líneas de transmisión llamadas buses, clasificadas según el tipo de información que transportan:</p>" +
      "<ul><li><strong>Bus de Datos:</strong> Transporta el contenido real (números, instrucciones o resultados). Es de naturaleza bidireccional.</li>" +
      "<li><strong>Bus de Direcciones:</strong> Unidireccional. Transmite la dirección de memoria a la cual el procesador desea acceder para leer o escribir.</li>" +
      "<li><strong>Bus de Control:</strong> Transmite señales de sincronización y comandos operativos (como lecturas, escrituras e interrupciones) para coordinar el hardware.</li></ul>" +
      "<h3>El ciclo de instrucción (Fetch - Decode - Execute - Store)</h3>" +
      "<p>Para procesar cada instrucción, la CPU ejecuta un ciclo continuo de cuatro etapas:</p>" +
      "<ul><li><strong>FETCH (Búsqueda):</strong> La Unidad de Control lee la instrucción desde la memoria principal utilizando el Bus de Direcciones y el Bus de Datos, basándose en la dirección indicada por el Contador de Programa (PC).</li>" +
      "<li><strong>DECODE (Decodificación):</strong> La UC interpreta el código de operación para determinar qué acción realizar y qué operandos se requieren.</li>" +
      "<li><strong>EXECUTE (Ejecución):</strong> La ALU o los componentes correspondientes ejecutan la operación matemática, lógica o de transferencia solicitada.</li>" +
      "<li><strong>STORE (Almacenamiento):</strong> El resultado de la operación se escribe en un registro interno de la CPU o se envía de vuelta a la memoria RAM.</li></ul>" +
      "<p>Este ciclo se repite de manera secuencial hasta completar la ejecución total del programa.</p>" +
      "<h3>Conceptos clave y simplificaciones</h3>" +
      "<ul><li><strong>Registros vs. Memoria RAM:</strong> Los registros ofrecen velocidad máxima pero con una capacidad sumamente acotada (a nivel de bytes o palabras del procesador). La memoria RAM brinda gigabytes de espacio a menor velocidad. La eficiencia del sistema depende de transferir datos de la RAM a los registros únicamente cuando van a ser procesados.</li>" +
      "<li><strong>Trascendencia del Programa Almacenado:</strong> Antes de este diseño, modificar la tarea de una computadora exigía la reconfiguración física de sus circuitos y cables. Integrar el programa dentro de la memoria permitió que una misma máquina pasara de ejecutar una tarea a otra simplemente cargando un nuevo archivo.</li>" +
      "<li><strong>Nota de alcance pedagógico:</strong> Este modelo constituye una abstracción simplificada orientada a comprender el flujo fundamental del hardware. Los procesadores modernos implementan optimizaciones avanzadas como múltiples niveles de memoria caché (L1, L2, L3), ejecución fuera de orden, segmentación de instrucciones (pipelining) y múltiples núcleos de procesamiento, manteniendo como base lógica el principio ideado por Von Neumann.</li></ul>"
  }
};
