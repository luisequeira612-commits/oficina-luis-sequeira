# Memoria del proyecto

## Identidad y alcance
- Nombre visible y título del documento: **Oficina de Luis Sequeira**.
- Repositorio público: `luisequeira612-commits/oficina-luis-sequeira`.
- Fase A: simulación visual local y gestión de proyectos/personajes; sus estados son simulados y no consulta servicios externos.
- Fase B (aprobada posteriormente): integración opcional e independiente que consulta la API pública de GitHub Actions para mostrar la última ejecución de los repositorios públicos vinculados. No controla los estados de los personajes. Sin token, autenticación, backend, servidor propio ni dependencias externas.
- Mantener la implementación estática, gratuita y sin dependencias.

## Decisiones
- Marca de Guardi: mostrar una sola vez, junto al globo de resumen, con `alt=""` y `aria-hidden="true"`; no duplicar en la cabecera.
- Pie de página de Fase A, literal: `Simulación. En la versión real, los estados vendrán de GitHub.`
- Personajes: plantilla SVG 64 × 70 aprobada por el usuario; sustituir únicamente los marcadores de color del rol. Mantener números, colores fijos y clases.
- Roles y colores: Desarrollo (#534AB7, #3C3489, #AFA9EC), Diseño (#D4537E, #993556, #F4C0D1), Revisión (#1D9E75, #0F6E56, #9FE1CB), Escritor (#BA7517, #854F0B, #FAC775), Community (#D85A30, #993C1D, #F5C4B3).
- Proyectos iniciales: App Guardi (Desarrollo, Revisión, Diseño); Canal de YouTube (Escritor, Diseño); Tema Nova Launcher (Diseño).
- Persistencia: solo proyectos y roles en localStorage bajo `oficina-luis-sequeira-v1`; los estados son efímeros.
- Diseñar primero para móvil, incluidos 360 px; controles táctiles de al menos 44 px; respetar `prefers-reduced-motion`.
- No añadir service worker ni manifest.
- La Fase A debe terminar en PR; no fusionar sin autorización explícita.

## Fuente
- Especificación visual, de comportamiento y SVG facilitada directamente por el usuario en la conversación, 2026-11-09.
- Fase B aprobada e implementada mediante PR #2, 2026-11-09.


## Migración BABYMONSTER Chart — 10 de noviembre de 2026
- Usuario autorizó añadir el proyecto BABYMONSTER Chart a las instalaciones existentes.
- Proyecto vinculado: `luisequeira612-commits/monstie-charts.`.
- La migración debe ejecutarse una sola vez y no volver a añadir el proyecto si el usuario lo elimina posteriormente.
- Mantener el esquema actual `oficina-luis-sequeira-v1`; usar una clave separada de migración `oficina-luis-sequeira-migrations-v1`, sin cambiar la estructura de datos existente.
- Detectar tanto el nombre `BABYMONSTER Chart` como el repositorio antes de añadir para evitar duplicados.
- Autonomía aprobada: agentes preparan PR; no fusionan sin autorización. Diseño híbrido isométrico/explorable. Presupuesto cero.


## Actualización periódica de GitHub Actions — 10 de noviembre de 2026
- Siguiente mejora: consulta automática de la última ejecución de GitHub Actions cada cinco minutos para todos los proyectos vinculados, además de la consulta inicial y el botón manual Actualizar.
- La lectura usa la API pública de GitHub desde el navegador; no añade backend, token, servicio, dependencia ni persistencia.
- La frecuencia de cinco minutos limita el consumo de la cuota pública anónima frente a intervalos cortos. Con varios proyectos vinculados puede seguir alcanzarse el límite si muchas personas abren la página.
- Los estados de personajes siguen siendo simulados; solo los estados del panel GitHub Actions representan ejecuciones reales.
- No se crea aún un esquema de eventos ni se atribuye actividad interna a agentes. Eso requerirá instrumentación específica y aprobación del usuario antes de introducir persistencia o nuevos esquemas.
- Autonomía: PR para revisión, sin merge automático.


## Vista isométrica explorable — 10 de noviembre de 2026
- Primer prototipo visual de la oficina híbrida: mapa CSS con perspectiva ligera, mosaicos por proyecto y navegación táctil/teclado hacia la tarjeta existente.
- El mapa deriva sus datos del DOM renderizado y no introduce campos, claves de localStorage ni esquema de eventos.
- La vista actual de tarjetas se conserva como detalle y alternativa accesible; el prototipo no se presenta como telemetría de agentes ni como motor 3D WebGL.
- Se respetan las preferencias de movimiento reducido y se marca el proyecto seleccionado con estado accesible.
- Rama de trabajo: `feat/isometric-office-overview`; pendiente CI y revisión.


## Diseño futuro de trabajadores y habitaciones — 10 de noviembre de 2026
- El usuario pidió que, más adelante, los trabajadores dejen de ser aves de colores y pasen a ser personas animadas con estética de videojuego Tycoon.
- Distribución solicitada: 50 % mujeres y 50 % hombres en el conjunto de trabajadores; representación visual diversa de personas blancas, morenas y mestizas, sin estereotipos.
- Mantener animaciones asociadas a trabajo, pensamiento, espera y descanso, adaptadas a personajes humanos.
- Esta sustitución es una etapa futura, no debe adelantarse dentro del prototipo actual de habitaciones. La nueva dirección explícita reemplaza la antigua preferencia de conservar permanentemente los avatares de aves; conservar los SVG aprobados hasta que se ejecute la fase de rediseño.
- Antes de diseñar el elenco final, procurar equilibrio global (no redondear 50/50 por habitación de forma independiente cuando el total sea impar) y variedad de peinados, ropa, edades adultas y tonos de piel. No inferir etnias a partir de rasgos; usar paleta diversa y respetuosa.
- Fuente: petición explícita del usuario en conversación, 2026-11-10.

## Prototipo de interiores explorable — 10 de noviembre de 2026
- Siguiente paso incremental: al tocar un bloque del mapa se abre un diálogo accesible con habitación isométrica CSS, suelo, paredes, ventana, planta y puestos de trabajo derivados de los roles existentes.
- El diálogo enlaza con la tarjeta existente para gestión detallada; no modifica datos guardados, agentes, roles ni estados.
- No introduce dependencias, APIs, backend ni esquema de eventos. Es una maqueta 2.5D, no un motor 3D WebGL.


## Primera implementación de trabajadores humanos estilo Tycoon — 10 de noviembre de 2026
- Se inicia la fase aprobada por el usuario para sustituir visualmente las aves por personas animadas, manteniendo intactas las cinco plantillas SVG originales en el HTML como referencia/fallback oculto.
- Los avatares humanos se generan en el navegador con SVG y CSS propios, sin dependencias, imágenes externas, API, almacenamiento nuevo ni cambios al esquema localStorage.
- El elenco se asigna en orden global alternando mujer/hombre; con un número impar, la diferencia inevitable es de una persona. Los tonos de piel recorren tres paletas (clara, media y oscura), junto con variedad de peinados y ropa.
- Los cuatro estados existentes (trabajando, pensando, esperando OK y descansando) tienen animaciones humanas específicas y respetan movimiento reducido.
- La asignación visual depende del orden actual de los trabajadores en pantalla; no se persiste identidad, género ni apariencia en datos de agentes.
- La diversidad visual no pretende certificar etnia ni asociar rasgos a identidades. El estilo es una primera versión 2D tipo Tycoon dentro de la UI existente; la integración de personas 3D/escena WebGL queda fuera de alcance.
- Rama: `feat/human-tycoon-workers`; pendiente de CI y revisión.
- Fuente: decisión explícita del usuario, conversación del 2026-11-10.


## Trabajadores humanos dentro de las habitaciones — 10 de noviembre de 2026
- Continuación de la fase Tycoon: los interiores explorables reutilizan el mismo avatar humano de cada trabajador en su puesto de trabajo, en vez de mostrar escritorios vacíos.
- El avatar se clona desde el personaje ya renderizado en la tarjeta, conservando tono de piel, peinado, ropa y estado animado; no se crean identidades ni datos duplicados.
- Cambio exclusivamente visual: sin cambios de almacenamiento, roles, agentes, proyectos, APIs o dependencias.
- Rama: `feat/human-workers-in-room-scenes`; pendiente de CI y revisión.

 
## Corrección PR #11 — animación de trabajadores en interiores — 10 de noviembre de 2026
- Se detectó que los avatares clonados dentro de las habitaciones conservaban su apariencia, pero no recibían las clases de estado del contenedor original; por ello, las animaciones CSS de las tarjetas no se aplicaban en la escena.
- La corrección copia únicamente la clase efímera de estado (`st-w`, `st-t`, `st-a`, `st-r`) al puesto y aplica las mismas animaciones humanas dentro de la habitación.
- La escena sigue leyendo el estado actual del DOM al abrirse; no añade persistencia ni telemetría. Respeta movimiento reducido.
- Rama: `fix/room-worker-state-animations`; pendiente CI y revisión.


## PR #12 — visibilidad de pull requests reales — 10 de noviembre de 2026
- La Oficina muestra hasta tres PR abiertas recientes por repositorio público vinculado, con título, número, autor, indicador de borrador y enlace directo a GitHub.
- Consulta la API pública `GET /repos/{owner}/{repo}/pulls?state=open&per_page=3&sort=updated&direction=desc` al abrir la página y al pulsar Actualizar; no añade sondeo periódico de PR. El sondeo de GitHub Actions existente continúa cada cinco minutos.
- Los resultados son efímeros en memoria del navegador; no se modifica `localStorage`, el esquema de proyectos/agentes ni se añaden dependencias, tokens, backend o servicios de pago.
- La lista acredita PR reales, pero no atribuye su autoría a agentes IA ni muestra pasos internos. Las animaciones de trabajadores siguen siendo simuladas.
- PR [#12](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/12), rama `feat/github-pull-request-visibility`; pendiente de CI.


## Prototipo de oficina 3D real — 10 de noviembre de 2026
- Cambio de dirección confirmado por el usuario: el objetivo ya no es una cámara isométrica fija; solicita entorno 3D real con rotación de cámara, zoom y exploración desde distintos ángulos.
- Primera fase técnica: renderizador WebGL 2 autocontenido, sin CDN, librería externa, modelos descargados, API ni servicio de pago. Geometría procedural local para sala, escritorios, monitores iluminados, teclados, ratones, torres, sillas, lámparas, plantas y figuras humanas low-poly.
- Controles previstos: arrastre para orbitar, gesto de pellizco/zoom, desplazamiento táctil y controles explícitos de acercar/alejar/restablecer. Reducir pixel ratio para limitar carga GPU y mantener la escena alternativa CSS si WebGL 2 no está disponible.
- La escena obtiene roles y estados efímeros de los trabajadores ya renderizados; no cambia identidad ni datos persistidos. Se conserva localStorage `oficina-luis-sequeira-v1` sin cambios.
- Límite: la compatibilidad WebGL 2 y el rendimiento real en el Tecno Pova 4 todavía deben probarse físicamente; no se afirmará que está validado en ese dispositivo antes de la prueba.
- Fuente: decisión explícita del usuario en conversación, 2026-11-10; documentación oficial Three.js WebGLRenderer (WebGL 2) y Babylon.js capabilities consultada el 2026-11-10. Se opta por un renderer mínimo propio para evitar añadir dependencia/CDN a esta app estática.


## Animación y distribución de trabajadores en la sala 3D — 10 de noviembre de 2026
- Se amplía el prototipo WebGL 2 para que las figuras humanas low-poly tengan movimiento sutil según los estados efímeros existentes: trabajo (brazos/ritmo más activo), pensamiento, espera y descanso. El movimiento se calcula en el buffer de vértices y se limita a unos 30 FPS.
- Se respeta `prefers-reduced-motion` desactivando los movimientos del cuerpo; la cámara continúa siendo interactiva.
- Se ajusta la distribución de hasta seis puestos en un máximo de tres filas para que escritorios y sillas queden dentro del suelo de la habitación. Se añaden sombras de contacto geométricas sencillas bajo los puestos.
- Se mantiene el renderer WebGL 2 propio, sin dependencias/CDN, y no se modifica `localStorage` ni el esquema de proyectos/agentes.
- La animación sigue siendo simulación visual local, no telemetría de agentes reales. Compatibilidad y rendimiento en el Tecno Pova 4 aún pendientes de prueba física.
- Fuente: revisión técnica del prototipo y decisión visual del usuario, 2026-11-10.


## Coherencia de apariencia y estados en trabajadores 3D — 10 de noviembre de 2026
- La escena 3D ahora recibe del avatar existente los metadatos de género, tono de piel, peinado y color de ropa, en vez de regenerar una apariencia genérica independiente. Los modelos low-poly representan esos peinados/colores y conservan la identidad visual entre tarjeta y habitación.
- Se optimiza la decoración de avatares para no reconstruir personas que ya están presentes cuando el observador detecta cambios del DOM.
- Un observador de clases sincroniza los cambios de estado de las tarjetas con las animaciones 3D mientras la habitación permanece abierta; al cerrar la escena se liberan recursos y callbacks.
- No cambia el balance global mujer/hombre, los datos persistentes, `localStorage`, ni se añade dependencia o servicio externo. Los estados continúan siendo simulación visual.
- Fuente: revisión del flujo DOM y renderizador WebGL 2 del repositorio, 2026-11-10.


## Vista general 3D con habitaciones conectadas — 10 de noviembre de 2026
- La vista principal de la Oficina incorpora un edificio 3D compuesto por las habitaciones de los proyectos actuales, dispuestas junto a un pasillo común. Cada habitación reutiliza su escena detallada con escritorios, equipos y trabajadores; el pasillo conecta los frentes abiertos.
- La cámara global permite orbitar, acercar/alejar y desplazar; los controles de entrada permiten abrir directamente cada habitación en su escena individual. La navegación sigue disponible mediante el mapa CSS si WebGL 2 no se inicia.
- La geometría se compone localmente a partir de las habitaciones existentes; no se descargan modelos ni bibliotecas, no se añade dependencia, API o servicio de pago.
- La vista general reutiliza los estados y apariencias actuales de los trabajadores y se reconstruye solo cuando cambia la lista de proyectos; los cambios de estado siguen sincronizándose sin recrear toda la escena.
- No se modifican `localStorage`, `oficina-luis-sequeira-v1`, registros de proyectos/agentes ni esquemas persistentes. La prueba en el Tecno Pova 4 sigue pendiente.
- Fuente: implementación del repositorio y dirección visual confirmada por el usuario, 2026-11-10.
