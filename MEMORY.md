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
- Rama: `feat/human-tycoon-workers`; pendiente CI y revisión.
- Fuente: decisión explícita del usuario, conversación del 2026-11-10.


## Trabajadores humanos dentro de las habitaciones — 10 de noviembre de 2026
- Continuación de la fase Tycoon: los interiores explorables reutilizan el mismo avatar humano de cada trabajador en su puesto de trabajo, en vez de mostrar escritorios vacíos.
- El avatar se clona desde el personaje ya renderizado en la tarjeta, conservando tono de piel, peinado, ropa y estado animado; no se crean identidades ni datos duplicados.
- Cambio exclusivamente visual: sin cambios de almacenamiento, roles, agentes, proyectos, APIs o dependencias.
- Rama: `feat/human-workers-in-room-scenes`; pendiente CI y revisión.

 
## Corrección PR #11 — animación de trabajadores en interiores — 10 de noviembre de 2026
- Se detectó que los avatares clonados dentro de las habitaciones conservaban su apariencia, pero no recibían las clases de estado del contenedor original; por ello, las animaciones CSS de las tarjetas no se aplicaban en la escena.
- La corrección copia únicamente la clase efímera de estado (`st-w`, `st-t`, `st-a`, `st-r`) al puesto y aplica la animación humana correspondiente en la habitación.
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


## PR #17 — acabado visual de la vista general 3D — 10 de noviembre de 2026
- Se añade una capa CSS ligera sobre la vista WebGL 2: fondo ambiental, retícula tenue, etiqueta de orientación y controles con acabado coherente.
- La navegación de habitaciones muestra numeración secuencial y acentos de color alternados; conserva desplazamiento horizontal, foco visible y adaptación a pantallas estrechas.
- La capa visual no simula iluminación física ni añade geometría al modelo 3D; es una mejora de presentación de interfaz sobre la escena WebGL existente.
- Se respeta `prefers-reduced-motion`; no se añaden animaciones continuas, dependencias, recursos externos, APIs, backend ni servicios de pago.
- No cambia el renderer, la cámara, los trabajadores, los proyectos, `localStorage` ni el esquema persistente. Compatibilidad y rendimiento WebGL 2 en el Tecno Pova 4 siguen pendientes de prueba física.
- Fuente: implementación de `assets/office-3d-atmosphere.css`, pruebas automatizadas y revisión del repositorio, 2026-11-10.


## Entradas arquitectónicas 3D por proyecto — 10 de noviembre de 2026
- Siguiente mejora de la planta conectada: cada habitación obtiene un marco de entrada físico orientado hacia el pasillo central, con postes, dintel, placa de color y alfombra de acceso.
- Los acentos se asignan de forma determinista por orden de proyecto; las habitaciones de la columna izquierda y derecha se orientan hacia el corredor compartido.
- Se añade geometría procedural al buffer WebGL 2 existente; no se añaden modelos, texturas, recursos externos ni dependencias.
- No se modifica la cámara, los trabajadores, proyectos, estados, localStorage ni esquemas persistentes. La prueba de rendimiento en el Tecno Pova 4 sigue pendiente.
- PR [#18](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/18), rama `feat/3d-room-entrances-and-identity`; fusionado mediante squash en `9e7a20ecb98e68773213522272e0df7f992bcca7`. CI [42781735657](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42781735657): validate success.
- Fuente: implementación del renderer y prueba automatizada, 2026-11-10.


## Identidad visual temática por habitación 3D — 10 de noviembre de 2026
- Cada escena de proyecto recibe el nombre visible de su habitación y genera una instalación mural procedural distinta, tanto en la vista de detalle como en el edificio conectado.
- App Guardi usa un emblema tipo escudo; Canal de YouTube, un símbolo de reproducción y una pequeña línea de edición; Tema Nova Launcher, un teléfono con elementos orbitales; BABYMONSTER Chart, barras de ranking y un motivo musical. Los proyectos creados por el usuario reciben una composición modular neutra.
- Los motivos son iconografía geométrica original y abstracta, no logotipos oficiales ni imágenes descargadas. Se construyen con las primitivas del renderer WebGL 2 existente.
- Sin nuevas dependencias, texturas, recursos externos, APIs, backend o servicios de pago. No cambia la cámara, los trabajadores, datos de proyectos, `localStorage` ni su esquema.
- Prueba de regresión: `tests/verify-project-themed-rooms.test.mjs`. PR [#19](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/19), fusionado mediante squash en `74636403ce0936ddcf05ef0beec4a03c3fbca88c`; CI [42783094539](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42783094539): validate success.
- Compatibilidad y rendimiento en Tecno Pova 4 todavía sin prueba física.
- Fuente: revisión del renderer y nombres de proyectos actuales del repositorio, 2026-11-10.


## Accesorios temáticos en puestos 3D — 10 de noviembre de 2026
- La identidad visual de cada proyecto se extiende desde el mural a los puestos individuales: alfombra con franja del color del proyecto y un objeto pequeño sobre cada escritorio.
- Guardi recibe un accesorio tipo insignia; YouTube, una claqueta/línea de edición; Nova Launcher, un teléfono en miniatura; BABYMONSTER Chart, barras de ranking; proyectos personalizados, un objeto modular neutro.
- La geometría se añade al constructor de la sala WebGL 2 existente y se repite solo por puesto real; no introduce texturas, modelos externos, dependencias ni nuevas APIs.
- No cambia datos, trabajadores, cámara, `localStorage` ni esquema persistente. Aún falta probar compatibilidad y rendimiento físico en el Tecno Pova 4.
- Prueba de regresión: `tests/verify-themed-workstations.test.mjs`; PR [#20](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/20), fusionado mediante squash en `17fdba83c5961587d70bcc4c2345d1a8a5454b94`; CI [42783629251](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42783629251): validate success.
- Fuente: cambios del renderer y pruebas del repositorio, 2026-11-10.


## PR #21 — iluminación arquitectónica y zona de descanso 3D — 10 de noviembre de 2026
- La escena de cada habitación incorpora un modelo de iluminación de color más equilibrado con luz principal, luz de relleno y componente hemisférica en el shader. No se presenta como iluminación global ni como sombras físicas dinámicas.
- Se añaden tres luminarias colgantes con difusores, ventana trasera dividida en paneles con marco y alféizar, y un rincón de descanso con sofá modular, mesa baja y planta.
- Todo se genera con las primitivas geométricas y el renderer WebGL 2 existente; no requiere texturas, modelos externos, dependencias, CDN, API, backend ni servicios de pago.
- No se modifica cámara, lista de proyectos, trabajadores, estados, localStorage ni esquemas persistentes. La alternativa CSS permanece intacta. La prueba física de compatibilidad/rendimiento en el Tecno Pova 4 sigue pendiente.
- Prueba nueva: `tests/verify-3d-lighting-lounge.test.mjs`.
- Fuente: cambios del renderer y validación automatizada del repositorio, 2026-11-10.

- PR [#21](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/21) fusionado mediante squash; commit de merge `048479b6aec0d775f1e49a0e1c224946b75c0a7e`. CI [42784290104](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42784290104): validate success; deploy omitido correctamente en el evento pull_request. El despliegue posterior al merge no se ha verificado.


## PR #22 — recepción y atrio de entrada 3D — 10 de noviembre de 2026
- La vista general añade un atrio al final del pasillo central, con plataforma ensanchada, mostrador de recepción, terminal/monitor visible, muro de bienvenida y señalización, portal de entrada, asientos de visitantes, jardineras y marquesina con luminarias.
- Los elementos son geometría procedural del renderer WebGL 2 existente. La recepción es una representación visual; no implica que exista un recepcionista/agente real.
- No cambia datos de proyectos/personajes, estados, cámara, localStorage ni esquemas persistentes. No se añaden dependencias, texturas, modelos, CDN, APIs, backend ni servicios de pago. Se conserva la alternativa CSS.
- Prueba nueva: `tests/verify-3d-office-reception.test.mjs`. Compatibilidad/rendimiento en el Tecno Pova 4 y despliegue Pages posterior al merge pendientes de confirmación.
- Fuente: cambios del renderer y pruebas del repositorio, 2026-11-10.


## PR #23 — más detalle en trabajadores humanos low-poly — 10 de noviembre de 2026
- La escena de cada habitación añade detalles geométricos discretos a los trabajadores: ojos con pupilas, cejas, nariz, boca, orejas, gafas/accesorios alternados y elementos de ropa (cuello, tapeta, insignia y puños).
- La variación es determinista por índice y reutiliza tono de piel, peinado y camisa existentes; no cambia el reparto mujer/hombre, los datos de personajes ni su persistencia.
- Los nuevos elementos se generan con primitivas del renderer WebGL 2, sin modelos, texturas, dependencias, APIs, backend ni servicios de pago. Los estados siguen siendo simulación local.
- Se añade prueba de regresión para los detalles faciales y de vestuario. Pendiente validar legibilidad y rendimiento en el Tecno Pova 4 real.
- Fuente: cambios del renderer y pruebas del repositorio, 2026-11-10.


## PR #24 — acabado arquitectónico interior 3D — 10 de noviembre de 2026
- Añadidos pilares de esquina con basamento/capitel, vigas superiores, zócalos continuos y bastidores verticales de pared para dar escala y profundidad a las habitaciones.
- Un marco fino delimita el área de trabajo respecto a la zona lounge sin cerrar la vista de corte ni bloquear los puestos.
- Geometría procedural del renderer WebGL 2. Sin modelos, texturas, dependencias, API, backend ni servicios de pago. Sin cambios a personajes, estados, cámara, localStorage o esquemas persistentes.
- Prueba de regresión verifica los elementos arquitectónicos. La legibilidad visual, Pages y el rendimiento en el Tecno Pova 4 siguen pendientes de prueba real.
- Fuente: PR y CI del repositorio, 2026-11-10.


## PR #25 — mobiliario y detalles de oficina 3D — 10 de noviembre de 2026
- Las estaciones incorporan cajoneras de dos niveles, bandeja de cableado bajo escritorio, apoyabrazos y soportes de silla, y detalles frontales de ventilación/estado en las torres de PC.
- Se añade una pizarra mural de planificación con notas geométricas de color en la habitación.
- Todo se genera con las primitivas del renderer WebGL 2 existente. Sin modelos, texturas, dependencias, APIs, backend ni servicios de pago.
- No cambia la cámara, trabajadores, proyectos, estados, almacenamiento local ni esquema persistente; la alternativa CSS permanece intacta.
- Prueba nueva: `tests/verify-3d-workstation-furniture.test.mjs`.
- Fuente: cambios del renderer y pruebas del repositorio, 2026-11-10.


## Corrección de regresión — restaurar vista general 3D — 10 de noviembre de 2026
- Se detectó que `buildOfficeScene()` usaba el identificador `metal` del mostrador de recepción sin declararlo en su propio ámbito. Ese identificador solo existía dentro de `buildScene()`; el error era capturado por el renderer y provocaba que `renderMap()` mostrara silenciosamente el mapa CSS alternativo.
- Se declara el material local dentro de `buildOfficeScene()`, restaurando la construcción de la vista general 3D con recepción.
- Prueba de regresión comprueba el ámbito del material.
- No se modifica cámara, datos, almacenamiento local, habitaciones ni el renderer de interiores.
- Fuente: inspección estática de `assets/office-3d.js`, 2026-11-10.


## PR #27 — diagnóstico visible del arranque 3D — 10 de noviembre de 2026

- Se detectó un defecto en la estrategia de fallback: el renderer insertaba un mensaje cuando WebGL 2 no estaba disponible o la escena fallaba, pero `renderMap()` ocultaba después todo el contenedor `office-3d-overview` al recibir `false`. Por eso el usuario solo veía el mapa/tarjetas y no el motivo del fallo.
- La nueva corrección registra `window.Office3D.lastError` para fallos de contexto WebGL 2 y excepciones de construcción; presenta el diagnóstico en un estado accesible independiente del contenedor oculto. También añade `?v=27` a los scripts 3D para forzar una URL nueva y descartar caché antigua.
- No se fuerza un fallback 3D falso ni se cambia el renderer, el esquema `localStorage`, los proyectos o los trabajadores. El motivo exacto todavía debe observarse en el navegador del usuario.
- Fuente: inspección de `assets/office-3d.js`, `assets/office-view.js` e `index.html` en `main`, 2026-11-10. PR #27 pendiente de CI y revisión.


## PR #28 — animaciones Tycoon más expresivas para trabajadores — 10 de noviembre de 2026

- Se separan los rangos geométricos de cabeza, brazos y manos para que no todos los movimientos dependan de desplazar al trabajador completo.
- El estado de trabajo añade pequeños movimientos repetidos de manos sobre el teclado; pensamiento añade una oscilación lenta de cabeza; espera y descanso tienen movimientos más discretos y diferenciados.
- Las manos y puños se incluyen en la animación de brazos; las actualizaciones siguen usando el buffer geométrico existente y el límite aproximado de 30 FPS.
- Se conserva la preferencia de movimiento reducido; no se añade persistencia, telemetría, dependencias, APIs ni servicios externos. Las animaciones siguen siendo simulación visual local.
- Prueba de regresión añadida a `tests/verify-3d-human-worker-details.test.mjs`.
- Fuente: revisión de `assets/office-3d.js` y decisión de estilo Tycoon del usuario, 2026-11-10. PR #28 pendiente de CI.


## PR en curso — integración adaptativa de GitHub Actions — 10 de noviembre de 2026

- Decisión del usuario: mantener la Oficina estática, móvil, sin servidor, tokens ni dependencias pesadas; una consulta por repositorio a `actions/runs?per_page=5`, serial y escalonada.
- Cada proyecto conserva su `owner/repo` en la configuración existente. La última respuesta (hasta cinco ejecuciones), ETag y hora de consulta se guardan en una clave independiente `oficina-luis-sequeira-github-cache-v1`; no se modifica `oficina-luis-sequeira-v1` ni su esquema.
- Sondeo adaptativo: ciclo inactivo aproximado de cuatro minutos repartido entre repositorios (mínimo 60 s entre solicitudes globales); repos con ejecuciones `queued`/`in_progress` se priorizan a 60 s, siempre serial. Se deduplican repositorios repetidos. Pausa al ocultar pestaña; al volver, prioriza datos con más de dos minutos. Botón manual con enfriamiento de 15 s.
- Se guardan ETag, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, y estado de pausa/retroceso; menos de diez solicitudes pausa hasta reset, 403/429 usan retroceso exponencial, 404 se consulta con menor frecuencia. Respuesta 304 conserva los datos y actualiza la hora de validación; la cuota se decide por los encabezados reales, no por una suposición de consumo cero.
- Los estados visibles Trabajando/Éxito/Falló/Descansando proceden de los workflow runs. Las animaciones ambientales son decoración y no representan ejecución real. Panel de actividad reciente muestra workflow y hora relativa. Se retira la consulta independiente de PR del panel para cumplir una sola petición de datos por repositorio.
- Precisión documental importante: la guía oficial de GitHub especifica que la exención de cuota para 304 condicional requiere solicitud correctamente autenticada con Authorization. Como la implementación no usa token, no se afirma que un 304 anónimo sea gratuito. Fuente: https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api y https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api (consultadas 2026-11-10).
- PR [#29](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/29) fusionado mediante squash el 10 de noviembre de 2026. Merge commit: `758c94429f8312da8db930da070b8c72eee48f5c`. CI del PR [42793190606](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42793190606): validate success. Workflow post-merge [42793239078](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42793239078): validate success; deploy Pages estaba en curso al registrar esta nota.


## PR #30 — resumen honesto para proyectos sin repositorio — 10 de noviembre de 2026

- PR [#30](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/30) en revisión.
- Si hay proyectos sin repositorio vinculado, la Oficina no afirma que todos descansan cuando los repositorios conectados están inactivos; indica que esos proyectos no tienen estado real verificable. Si todos están vinculados y ninguno activo, mantiene «Todos descansan por ahora».
- Cambio limitado a `assets/github-live.js` y su prueba de regresión; README y MEMORY documentan el ajuste.
- Fuente: corrección derivada de la revisión de PR #29, 2026-11-10.


## PR #31 — edad real de la respuesta cacheada — 10 de noviembre de 2026

- PR [#31](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/31) fusionado mediante squash; merge commit `7d6503306dec984b459ab8f5e647e0642ebf2e25`.
- Corrección: el indicador «Datos de hace X min» usa `fetchedAt`, la edad del cuerpo de datos guardado; el indicador «En vivo» / «Desactualizado» sigue usando `checkedAt`, que se actualiza también tras una validación 304. Así, una respuesta 304 no hace parecer que los datos se descargaron de nuevo.
- CI del PR [42793640562](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42793640562): validate success. Workflow Pages post-merge [42793689070](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42793689070): validate success; deploy pendiente al registrar esta nota.
- Fuente: PR #31 y prueba `tests/verify-github-actions-live.test.mjs`, 2026-11-10.


## PR #33 — distinguir ejecuciones en cola de trabajo activo — 10 de noviembre de 2026

- Corrección de precisión de estados: `queued` ahora se presenta como «En cola» y usa la pose de espera; únicamente `in_progress` se muestra como «Trabajando» y activa la animación de tecleo.
- Los repositorios con cualquiera de los dos estados siguen teniendo prioridad de sondeo rápido (60 s). El resumen global incluye proyectos en cola y no los cuenta como trabajo iniciado.
- Cambios limitados al módulo de GitHub Actions, prueba de regresión, README y MEMORY; sin cambios al esquema de proyectos, almacenamiento, API, tokens, servidor ni dependencias.
- Fuente: revisión de la lógica de estados y requisito de precisión de la interfaz, 2026-11-10.


## PR #34 — LEGO Office Tycoon 3D: minifiguras y vista inmersiva — 10 de noviembre de 2026

- Implementa la primera etapa de la dirección visual aprobada: personajes originales de estilo minifigura en la escena WebGL 2 (cabeza cilíndrica con stud, torso bloque, brazos y piernas geométricos, cara impresa, variación de peinados y accesorios), sustituyendo el modelo humano low-poly.
- Los avatares pequeños de las tarjetas también pasan a una silueta SVG brick-built. Se conserva el reparto alternado de género y la variedad existente de tonos de piel, peinados y ropa.
- La vista general pasa a modo inmersivo a pantalla completa. Arrastrar desplaza la cámara dentro de límites, pellizcar acerca/aleja y controles explícitos permiten rotación acotada y recentrado; deja de comportarse como navegación libre tipo mapa.
- Sin dependencias, modelos, texturas, APIs, backend ni pagos. Se preservan WebGL 2, la alternativa CSS, GitHub Actions, el esquema `oficina-luis-sequeira-v1` y la caché independiente.
- Compatibilidad y rendimiento visual en el Tecno Pova 4 aún requieren prueba manual; CI no certifica la apariencia del dispositivo.
- Fuente: aprobación explícita del usuario y cambios de la rama `feat/lego-tycoon-fullscreen-office`, 2026-11-10.


## PR — microanimación Tycoon de minifiguras — 10 de noviembre de 2026
- Se amplían las animaciones de los trabajadores brick-built sin cambiar los estados reales de GitHub Actions ni el almacenamiento persistente.
- Cada trabajador conserva rangos independientes para piernas, torso, cabeza, brazos y manos; los estados Trabajando, Pensando, En espera, Éxito y Fallo producen micro-movimientos distintos: tecleo, balanceo, desplazamiento de cabeza, movimiento de pies y postura de fallo.
- La animación sigue siendo presentación visual: no convierte movimientos ambientales en evidencia de ejecución real. La sincronización de estado continúa viniendo de la integración existente de GitHub Actions.
- No se añaden dependencias, modelos, texturas, APIs, backend ni servicios de pago. Se conserva `oficina-luis-sequeira-v1` y su esquema.
- Se añade `tests/verify-3d-worker-activity.test.mjs` para cubrir los rangos de postura y la diferenciación por estado.
- Fuente: cambios de `assets/office-3d.js` y prueba de regresión, 2026-11-10.


## PR — ciclo de paseo ambiental acotado — 10 de noviembre de 2026
- Los trabajadores en estado de espera/en cola reciben un pequeño ciclo de paseo ambiental dentro de su zona de trabajo, con desplazamiento lateral y frontal muy limitado, balanceo de brazos y pasos sutiles.
- El movimiento es puramente visual y no altera el estado real de GitHub Actions. Los estados Trabajando, Éxito y Fallo conservan sus animaciones anteriores.
- No se añaden dependencias, modelos externos, APIs ni cambios de persistencia. El movimiento sigue desactivado cuando el usuario activa reduced-motion.
- Se añade `tests/verify-3d-idle-walk.test.mjs`.
- Fuente: `assets/office-3d.js` y prueba de regresión, 2026-11-10.


## PR — iluminación y profundidad de la primera sala — 10 de noviembre de 2026

- Se mejora la lectura 3D de la primera sala sin cambiar la arquitectura del renderer ni añadir dependencias.
- El shader incorpora una luz de relleno/rim adicional y un término de cavidad/hemisferio para separar mejor planos, esquinas y volúmenes.
- La sala añade luminarias de techo visibles y bandas de luz alineadas con la zona de trabajo, reforzando escala y profundidad del espacio Tycoon.
- No se modifican GitHub Actions, estados reales, persistencia, APIs, modelos externos, texturas ni servicios de pago.
- Se añade tests/verify-3d-room-lighting.test.mjs.
- Fuente: cambios de assets/office-3d.js y prueba de regresión, 2026-11-10.


## Encuadre adaptable de cámara 3D — 10 de noviembre de 2026
- La cámara calcula una distancia inicial mayor cuando el viewport es vertical/estrecho, para evitar que la sala Tycoon quede recortada en teléfonos.
- El botón de recentrado restaura el encuadre adaptado a la relación de aspecto; el rango de zoom también crece proporcionalmente para conservar el control manual.
- El ajuste se aplica una vez al iniciar la escena y no sobrescribe los gestos de cámara del usuario.
- No cambia la geometría, los estados reales, GitHub Actions ni la persistencia.
- Se añade `tests/verify-3d-portrait-camera.test.mjs`.
- Fuente: `assets/office-3d.js` y prueba de regresión, 2026-11-10.


## PR #39 — sombras de contacto procedurales para la sala Tycoon — 10 de noviembre de 2026

- Añade sombras de contacto discretas bajo cada puesto de trabajo, cada silla y el rincón lounge. Se construyen con anillos geométricos concéntricos y tonos opacos escalonados, para dar sensación de apoyo y separación respecto al suelo sin texturas ni shadow maps.
- El coste geométrico es pequeño y fijo por elemento; no requiere iluminación dinámica, dependencias, modelos, texturas, APIs, backend ni servicios de pago.
- No modifica cámara, personajes, estados reales, integración de GitHub Actions, datos ni almacenamiento persistente. Se conserva la alternativa CSS.
- Se añade `tests/verify-3d-contact-shadows.test.mjs` y se actualiza la versión de caché del renderer a v39.
- Fuente: cambio procedural en `assets/office-3d.js` y prueba de regresión, 2026-11-10.


## PR #40 — oficina abierta Tycoon con nueve empleados identificados — 10 de noviembre de 2026

- Reorganiza la vista general 3D en una única oficina abierta con nueve puestos distribuidos en tres filas de tres, en lugar de mostrar cada proyecto como una mini-habitación aislada. Se conservan los accesos a las habitaciones de proyecto.
- Añade nueve empleados ficticios con nombre propio y metadatos de género, tono de piel, cabello y ropa; reparto 5 mujeres / 4 hombres. Nombres: Valeria, Mateo, Camila, Diego, Aisha, Noah, Mei, Amir y Elena.
- La migración es aditiva y mantiene `oficina-luis-sequeira-v1`, sus claves y versión. No elimina proyectos ni empleados existentes. La plantilla de nueve se asigna entre las cuatro salas iniciales.
- Incorpora una barra inferior desplazable con nombres y roles; tocar una persona abre su habitación/proyecto. Mantiene los estados reales de GitHub Actions y las animaciones decorativas diferenciadas.
- Sin dependencias, modelos/texturas externas, APIs, backend ni servicios de pago. Renderer procedural WebGL 2, fallback CSS y controles móviles preservados.
- Añade comprobaciones de regresión para migración, plantilla, renderizado abierto y barra de empleados.
- Fuente: petición explícita del usuario y referencia visual suministrada, 2026-11-10.


## PR — etiquetas flotantes y selección directa de empleados — 10 de noviembre de 2026

- Añade placas flotantes con nombre visible para cada minifigura en la oficina abierta. Su posición se proyecta cada fotograma desde las coordenadas 3D usando la misma cámara, por lo que acompañan la rotación, el desplazamiento y el zoom; se ocultan al salir del encuadre.
- El indicador de color representa el estado real disponible en la interfaz (trabajando, espera, éxito o fallo), sin inventar actividad.
- Tocar una placa abre el proyecto correspondiente y resalta el puesto/avatar de la persona seleccionada. Los botones mantienen tamaño táctil y foco accesible.
- La lista inferior permanece como alternativa accesible. No se cambian datos guardados, estados GitHub Actions, renderer, APIs ni dependencias.
- Añade prueba de regresión para proyección, selección y resaltado.
- Fuente: petición explícita del usuario, 2026-11-10.


## Ajuste de selección en WebGL — 10 de noviembre de 2026

- Al revisar el flujo de selección de PR #41 se detectó que el resaltado dorado inicial solo se aplicaba a la alternativa CSS; cuando WebGL 2 estaba activo, el fallback quedaba oculto.
- La corrección pasa la identidad seleccionada al renderer y añade un disco/anillo dorado procedural y discreto en el suelo del puesto seleccionado, visible en la escena WebGL 2 real.
- No cambia persistencia, navegación, estados GitHub Actions ni dependencias.
- Fuente: inspección posterior a PR #41, 2026-11-10.


## Corrección urgente de etiquetas no visibles — 10 de noviembre de 2026

- Tras el reporte del usuario de que no veía las etiquetas, la inspección encontró una causa concreta: `index.html` seguía solicitando `assets/office-view.css?v=40`, aunque la hoja con los estilos `.office-worker-tags` y `.office-worker-tag` se había actualizado en PR #41. En móviles/navegadores con caché, podía conservarse la hoja anterior, dejando las etiquetas sin posicionamiento absoluto y fuera del área visible.
- Corrección: invalidar la caché de CSS y ambos scripts con `?v=42` en `index.html`, y añadir una prueba de regresión que exige la versión nueva y las reglas de posicionamiento.
- No se cambia lógica de empleados, almacenamiento, datos, estados ni renderer.
- Fuente: diagnóstico del reporte del usuario y revisión de `main`, 2026-11-10.


Nota de implementación adicional: los chips de proyecto muestran ahora solo el nombre, las placas de empleados se mantienen dentro del viewport con un ajuste vertical básico para evitar colisiones, y el estado `st-t` se distingue en rojo como «Te toca». Fuente: revisión de la petición A/B, 2026-11-10.


## C — rutas seguras, código animado y postura — 10 de noviembre de 2026

- Continúa la implementación directa en <code>main</code> sobre el head <code>3e6cb6a939c143f77d94b0fe24a466d323c9fd53</code>.
- <code>assets/office-3d.js</code> añade una ruta procedural acotada para <code>st-r</code>: cada trabajador usa un corredor seguro según su fila y pasa por puntos de café/reunión antes de regresar a su puesto; la interpolación es suave y la orientación se sugiere mediante pequeños desplazamientos de cabeza/brazos, sin introducir física ni dependencias.
- Los monitores de cada puesto ahora contienen varias líneas geométricas de código que se desplazan horizontalmente durante <code>st-w</code>/<code>st-r</code>; no se usan texturas ni assets externos.
- Se mantiene <code>prefers-reduced-motion</code>; el movimiento ambiental se omite cuando está activo.
- Prueba de regresión añadida en <code>tests/verify-3d-worker-activity.test.mjs</code> para rutas, monitores y animación de código.
- Pendiente de verificación: estado del workflow disparado por estos commits y comprobación visual/rendimiento en el Tecno Pova 4. La herramienta disponible para workflows asociada a commits solo devuelve ejecuciones de pull request, por lo que no se debe interpretar una lista vacía como «CI no ejecutó».
- D sigue pendiente: fuentes <code>data/agentes.json</code>, <code>data/proyectos.json</code>, <code>data/tareas.json</code> y sincronización adicional de commits/workflows; no se modifica todavía el esquema <code>oficina-luis-sequeira-v1</code>.


## D — datos editables y actividad GitHub ampliada — 10 de noviembre de 2026

- Se añadió <code>data/agentes.json</code> con los 9 empleados nombrados, <code>data/proyectos.json</code> con los 4 proyectos y sus repositorios, y <code>data/tareas.json</code> como fuente editable de tareas futuras.
- <code>index.html</code> carga esos JSON como semilla cuando no existe todavía <code>oficina-luis-sequeira-v1</code> en localStorage; si ya existe almacenamiento local, se conserva para no destruir personalizaciones. Esto mantiene la compatibilidad del esquema existente.
- <code>assets/github-live.js</code> conserva ETag/If-None-Match y sondeo adaptativo existente y ahora consulta también los 5 commits recientes por repositorio, guarda su ETag independiente y expone historial reciente para los empleados. No se añadió backend ni credencial.
- <code>assets/office-view.js</code> muestra hasta tres actividades recientes en la ficha de cada empleado cuando GitHub las proporciona.
- Importante: una página GitHub Pages estática no puede escribir cambios de vuelta a <code>data/*.json</code> del repositorio de forma anónima. «Nuevo proyecto» sigue guardándose en localStorage; no se fingió una escritura al repositorio. Para escritura real haría falta autenticación/permiso de GitHub o un servicio intermediario, que queda fuera de las restricciones actuales.
- Prueba añadida: <code>tests/verify-editable-office-data.test.mjs</code>.
- Commits de esta etapa: <code>b704e478</code> (GitHub + commits), <code>333c721a</code>, <code>f8996fe4</code>, <code>859f4fe4</code> (datos), <code>fc2da1e2</code> (carga de datos), <code>ce0085fd</code> (historial), <code>94f9a6db</code> (tests).


## D — asignación por empleado, historial y estado offline — 10 de noviembre de 2026

- <code>assets/github-live.js</code> deja de pintar el estado de GitHub sobre todos los empleados de una sala: cada ejecución activa (<code>queued</code>/<code>in_progress</code>) se asigna determinísticamente a un solo empleado de <code>employeeIds</code>, y la asignación se conserva en la caché independiente <code>oficina-luis-sequeira-github-cache-v1</code> mediante <code>runAssignments</code>.
- Al detectar nuevas ejecuciones completadas se guarda un historial local acotado de hasta 12 entradas, con runId, nombre, conclusión, fecha y agente asignado. La ficha de empleado sigue mostrando como máximo tres actividades recientes y ahora filtra por el empleado que corresponde a la ejecución.
- La consulta de commits <code>commits?per_page=5</code> se ejecuta tanto tras una respuesta nueva de Actions como tras una validación <code>304</code>; conserva su ETag independiente. Esto corrige el hueco anterior donde un 304 de Actions impedía actualizar/validar el historial de commits en ese ciclo.
- Cuando el navegador está offline se muestra «Sin conexión a GitHub. Se conserva la última información disponible.»; no se presenta la caché como actividad recién consultada.
- No cambia <code>oficina-luis-sequeira-v1</code>, no añade backend, autenticación, dependencias ni permisos de escritura. «Nuevo proyecto» continúa siendo local en una instalación estática; no puede escribir anónimamente en <code>data/*.json</code> del repositorio.
- Pruebas: <code>tests/verify-editable-office-data.test.mjs</code> cubre asignación, historial, offline y 304+commits. <code>tests/verify-3d-worker-activity.test.mjs</code> se ajustó a la implementación actual de rutas acotadas (<code>sampleRoute</code>).
- El workflow disparado por el commit <code>db7f0aaa6b961c83e61506635885e51b9e807111</code> falló por una aserción regresiva antigua sobre <code>st-r</code>, no por esta integración D; se corrigió en <code>c6957193c79290676751c7b097813d5abf702798</code>. El siguiente workflow, run <code>42845703644</code>, está en cola al registrar esta memoria y aún no se debe declarar Pages publicado.
- Fuente: inspección de <code>assets/github-live.js</code>, pruebas y workflows GitHub Actions, 2026-11-10.

## D — pulido de conectividad e historial GitHub — 10 de noviembre de 2026

- Se corrigió la asignación explícita de agentId al guardar ejecuciones completadas que no tenían asignación previa. La asignación usa la misma regla determinista de los runs activos y queda persistida en runAssignments, evitando que una tarea completada aparezca en más de una ficha.
- La lectura de commits ahora toma solo la primera línea real del mensaje mediante separación CRLF/LF; se evita que los mensajes multilínea se muestren completos en tarjetas pequeñas.
- El aviso global de conectividad se muestra tanto cuando el navegador declara offline como cuando la consulta falla por error de red aunque navigator.onLine todavía sea true. El texto aclara que se conserva la última información disponible.
- Se ampliaron las regresiones en tests/verify-editable-office-data.test.mjs para historial por empleado, respuesta 304 con commits, aviso offline/red y resumen de commits.
- Commits directos a main: 443a64b6, c019b321, 182fd476, 25c0937f, 0d32571b.
- Verificación: la herramienta GitHub disponible para consultar workflows por SHA solo devuelve ejecuciones asociadas a pull requests; los checks combinados consultados no devolvieron estados. Por tanto, no se afirma que CI haya pasado ni que Pages esté actualizado a estos últimos commits. Requiere comprobar Actions/Pages desde GitHub.
- Restricciones preservadas: sin backend, credenciales, nuevas dependencias, escritura remota de JSON ni cambios al esquema oficina-luis-sequeira-v1.
- Fuente: revisión de assets/github-live.js, tests/verify-editable-office-data.test.mjs y estado consultable de commits, 2026-11-10.

## Corrección de atribución del historial individual — 10 de noviembre de 2026

- Se detectó que los commits recientes del repositorio se añadían artificialmente al historial de cada empleado de la sala. Se retiraron de las fichas individuales: un commit es actividad del repositorio y no demuestra qué personaje lo realizó.
- El historial de empleado ahora incluye solo ejecuciones de Actions con agentId asignado; entradas antiguas sin agentId se distribuyen con la misma regla determinista basada en runId, sin mostrarlas a todos.
- Commits directos a main: 2f3089eb (código) y 121d6769 (regresión). La prueba comprueba que no se incorporen commits generales al historial personal.
- Estado de verificación consultado para 121d6769: checks combinados vacíos y wrapper de workflow sin ejecuciones (este wrapper solo expone runs de pull request). No declarar CI ni Pages confirmados.
- Fuente: assets/github-live.js y tests/verify-editable-office-data.test.mjs, 2026-11-10.


## Incidencia de carga del motor 3D — 10 de noviembre de 2026

- El usuario informó que la página mostraba «no se cargó el archivo del motor 3D». Ese mensaje significa que office-view.js no encontró window.Office3D al renderizar; es distinto de un fallo WebGL dentro de Office3D.open.
- Se confirmó que assets/office-3d.js existe en main (38,691 caracteres) y que index.html referenciaba v46. Se actualizó a v47 para invalidar caché y se añadieron manejadores onerror/onload que distinguen descarga fallida de archivo descargado que no ejecutó el motor.
- Commit directo a main: 5c8ae1b8. Se corrigió y verificó el HTML final de los manejadores inline.
- No se pudo confirmar la publicación de GitHub Pages: los checks combinados consultados están vacíos y el wrapper de workflows solo expone ejecuciones de PR. El despliegue debe comprobarse en Actions/Pages; no afirmar que el arreglo ya está visible en producción.
- Instrucción de comprobación para el usuario cuando la publicación termine: recargar sin caché / abrir en pestaña privada. Si persiste, el mensaje nuevo distinguirá descarga del archivo frente a fallo de ejecución.
- Fuente: index.html, assets/office-3d.js y estado consultable del commit, 2026-11-10.


## Segunda corrección de carga 3D — 10 de noviembre de 2026

- Luis confirmó que el mensaje antiguo persistía después del commit 5c8ae1b8; por tanto, no se dio por resuelta la publicación anterior.
- Nueva hipótesis técnica a corregir: evitar cualquier ambigüedad de orden/caché entre scripts diferidos. `index.html` ahora carga `human-workers.js`, `office-3d.js` y `office-view.js` de forma síncrona y en ese orden al final del documento; referencias cache-busted a human-workers v41, engine v48 y office-view v46. El motor muestra un mensaje propio si falla la descarga.
- Commit de implementación: ede29ecf. Se añadió `tests/verify-3d-script-loading.test.mjs` para proteger el orden y el diagnóstico; commit: 1474e8d3.
- No se pudo consultar un identificador de ejecución push ni confirmar Pages con las acciones disponibles. No afirmar que el sitio publicado ya contiene el arreglo. Comprobar el deployment de `main` en Actions y la publicación de Pages antes de pedir una nueva prueba al usuario.
- Fuente: `index.html`, `tests/verify-3d-script-loading.test.mjs`, 2026-11-10. La causa exacta del comportamiento del navegador sigue sin confirmarse.


## Causa confirmada y corrección publicada del motor 3D — 10 de noviembre de 2026

- Tras la confirmación de Luis de que el error persistía, se inspeccionaron los archivos de `main` y se consultaron los registros reales de GitHub Actions.
- La primera validación sintáctica reveló un paréntesis sobrante en la expresión de desplazamiento de las líneas del monitor. Al corregirlo, el siguiente `node --check` detectó otro cierre sobrante al actualizar las etiquetas de trabajadores: `if(bubble)bubble.hidden=worker.state!=="st-w")})}`. Se corrigió a `if(bubble)bubble.hidden=worker.state!=="st-w"})}`.
- Se añadió `node --check assets/office-3d.js` a la validación del workflow, se actualizó la referencia del motor a `office-3d.js?v=50` y se sincronizó el test de carga de scripts con esa versión.
- Commits directos a `main`: `b1af312c` (primera expresión), `a5128905` (cache bust inicial), `e2cfd7f6` (validación sintáctica), `59aca5db` (cierre de etiqueta), `e52a42a2` (cache bust v50), `a7dcdbf5` (test actualizado).
- Las ejecuciones intermedias fallaron de forma útil: primero por el segundo error de sintaxis y después porque el test todavía esperaba v48. Corregidos ambos, Actions run [42860316534](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42860316534) terminó `completed/success`: validación y despliegue de GitHub Pages exitosos, 2026-11-10 17:00:21 UTC.
- No se ha verificado todavía la experiencia visual en el Tecno Pova 4. El usuario debe volver a probar únicamente ahora que el despliegue está confirmado; si persiste, pedir captura o mensaje exacto y seguir con diagnóstico del navegador publicado.
- Fuente: `assets/office-3d.js`, `index.html`, `tests/verify-3d-script-loading.test.mjs`, `.github/workflows/pages.yml` y logs del workflow, 2026-11-10.

## Error de ejecución workerTags — 10 de noviembre de 2026

- Tras la corrección de sintaxis del motor 3D, el usuario reportó `TypeError: workerTags.forEach is not a function`.
- Causa confirmada en `assets/office-3d.js`: `workerTags` es un elemento DOM (`div.office-worker-tags`), pero `mountWorkerStateBubbles()` lo trataba como un array y llamaba `workerTags.forEach()`. Se cambió a `workerTags.querySelectorAll(".office-worker-tag").forEach(...)`, recorriendo los botones reales dentro del contenedor.
- Commits directos a `main`: [36a1cda2](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/36a1cda22c6fc60669f70d74fbe941e34b79c144) (fix), [6526262c](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/6526262cfe3d243b288954e326aedfe3799cd18d) (cache bust v51), [68e95b29](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/68e95b29bf8f4a91e415bd404477e321d58164a8) (regression test).
- Se añadió prueba para exigir que el código recorra los elementos `.office-worker-tag` del contenedor y rechace el uso de `workerTags.forEach`.
- El primer run del test falló por una expectativa antigua que fijaba `office-3d.js?v=50`; se ajustó el test para aceptar claves de caché versionadas. Run [42861098181](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42861098181): 75 pruebas y validate success; deploy Pages success el 10 de noviembre de 2026 a las 17:04 UTC. El cambio de código está publicado; la prueba real en el Tecno Pova 4 sigue pendiente.
- Fuente: reporte de error del usuario y lectura del motor/test en `main`, 2026-11-10.

## Precisión de tarea actual y estados visuales — 10 de noviembre de 2026

- `assets/github-live.js` ahora escribe `data-current-task` únicamente en el empleado asignado al workflow queued/in_progress, usando el nombre del workflow de GitHub Actions; no confunde el estado genérico con la tarea.
- `assets/office-view.js` vuelve a leer el empleado desde el DOM al abrir la ficha, para mostrar los datos más recientes. La ficha distingue TRABAJANDO, PENSANDO, TE TOCA, ÉXITO, FALLO y DESCANSANDO; si no hay ejecución activa muestra «Sin tarea en curso».
- Se corrigió una rama duplicada `st-a` en `assets/office-3d.js`: el marcador azul de pensamiento ahora corresponde a `st-t`, y el marcador amarillo de decisión pendiente sigue en `st-a`.
- Commits directos a `main`: `fb7c6400`, `2c196020`, `61dbaa05`, `ebf397ed` (tarea/ficha y regresión), `2dfa7f73`, `063bd008`, `22d16afd` (marcador de pensamiento y regresión).
- Publicación del ajuste de ficha: run [42861981257](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42861981257), validate + deploy success. Publicación del marcador: run [42862523325](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42862523325), validate + deploy success.
- Nota: algunos despliegues intermedios fallaron por concurrencia entre despliegues de Pages; los runs anteriores indicados confirman que ambos heads funcionales quedaron publicados. No se modifica el esquema `oficina-luis-sequeira-v1`, ni se añaden backend, dependencias o credenciales.
- Fuente: código, pruebas y logs GitHub Actions, 2026-11-10.


## Exportación manual de datos de proyectos — 10 de noviembre de 2026

- Se añadió un botón «Exportar datos» a la Oficina. Genera una única descarga JSON (oficina-datos-exportados.json) con data/agentes.json y data/proyectos.json reconstruidos desde los proyectos y empleados que están actualmente guardados en la instalación local.
- El formato conserva version: 1 y los campos existentes (id, name, role, gender, skinTone, hair, shirt, repository, employeeIds). Incluye instrucciones para copiar cada objeto exportado al archivo correspondiente en GitHub.
- data/tareas.json se deja explícitamente intacto para no sobrescribir tareas futuras o datos no cargados por la interfaz.
- No cambia oficina-luis-sequeira-v1, no hay escritura remota, autenticación, backend, dependencias ni llamadas adicionales a GitHub. La exportación es manual y el usuario debe actualizar los dos JSON desde GitHub.
- Prueba de regresión añadida en tests/verify-editable-office-data.test.mjs para proteger el formato y la preservación de tareas.json.
- Fuente: cambios en index.html y pruebas, 2026-11-10.


## Refuerzo visual de minifiguras — 10 de noviembre de 2026

- Se reforzó el aspecto de juguete de construcción: paleta de torso más saturada (azul, rojo, verde, amarillo y violeta), brillo especular más marcado, torso trapezoidal con impresión frontal de cuello/costuras, brazos doblados en L y manos con geometría de agarre en C.
- Se aumentó la definición de las cabezas cilíndricas y se hizo visible un stud superior separado del cabello, con altura adaptada a los estilos corto, rizado, largo y recogido. Se mantienen diversidad de tonos de piel, cabello y accesorios originales.
- Se conservan el renderer WebGL2 propio, las geometrías y rangos de animación existentes, el esquema local, la cámara y la interfaz. No se incorporan modelos, texturas, dependencias ni assets externos; no son modelos oficiales LEGO.
- Se añadió regresión para el stud, las manos C, los brazos y el acabado plástico. Cache-bust del motor a v53.
- Fuente: `assets/office-3d.js`, `index.html` y `tests/verify-3d-human-worker-details.test.mjs`, 2026-11-10.


## Caras impresas y piezas articuladas de minifiguras — 10 de noviembre de 2026

- Se reemplazaron las bocas cuadradas por expresiones faciales distintas construidas con geometría de impresión: sonrisa curva segmentada, boca neutra, gesto sorprendido, cejas y guiño; se mantienen ojos pequeños y gafas en personajes seleccionados.
- Los brazos ahora usan segmentos cilíndricos entre hombro, codo y muñeca; las manos forman una pinza C continua con segmentos redondeados, no un círculo de bolitas separadas. Se añadieron accesorios independientes de cabello (adornos laterales, auricular y lazo) a varios personajes.
- Se conserva el renderer WebGL2 propio para no introducir un CDN ni una biblioteca de gran tamaño. Por ello, estas caras son geometría impresa simulada y no una CanvasTexture, y el motor no es Three.js; migrar a Three.js y a textura facial real sigue siendo una diferencia respecto a la especificación literal.
- Cache-bust del motor a v54 y pruebas de regresión para expresiones, articulaciones y accesorios. Sin cambios al esquema local, proyectos, cámara o integración GitHub.
- Fuente: `assets/office-3d.js`, `index.html`, `tests/verify-3d-human-worker-details.test.mjs`, 2026-11-10.

- Corrección de prueba: se actualizó la aserción heredada de la mano segmentada anterior para comprobar el nuevo arco C articulado de seis tramos. El primer CI detectó únicamente esa expectativa antigua; la sintaxis JavaScript pasó. Se vuelve a ejecutar la validación antes del despliegue.

- Segunda corrección de prueba: se sustituyó la expectativa antigua de antebrazo cúbico por la articulación cilíndrica hombro-codo-muñeca. La validación de sintaxis y la prueba anterior de arco C ya pasaron; el runner detectó esta segunda aserción visual obsoleta.


## Silueta moldeada de minifiguras — 10 de noviembre de 2026

- Se sustituyó la cabeza cilíndrica de borde plano por una cabeza con biseles superior e inferior construidos con anillos de geometría compartida en el mismo buffer. Se añadió el poste de cuello que conecta cabeza y torso.
- Se definieron caderas separadas, piernas cortas trapezoidales y suelas oscuras diferenciadas en ambos pies, para reforzar la silueta de minifigura sentada frente al escritorio.
- Se conserva el renderer WebGL2 propio, sin Three.js, CDN, assets ni dependencias nuevas. Las piezas siguen siendo geometría procedural estática que reutiliza el buffer de escena; no se cambia la estructura de localStorage ni el esquema de datos.
- Cache-bust a `office-3d.js?v=55` y regresión para cabeza biselada, cuello, piernas y suelas. Pendiente: textura facial CanvasTexture y migración a Three.js si se decide asumir su coste de descarga/ejecución; no se afirma que la especificación literal de Three.js esté completada.
- Fuente: `assets/office-3d.js`, `index.html`, `tests/verify-3d-human-worker-details.test.mjs`, 2026-11-10.


## Navegación compacta de proyectos y barra circular de equipo — 10 de noviembre de 2026

- La navegación de proyectos en la vista Tycoon pasa a una tira horizontal de chips con desplazamiento táctil, etiquetas breves sin el prefijo repetido «Entrar ·» y altura máxima de 40 px. Cada chip conserva la acción de abrir la habitación/proyecto.
- La barra de equipo se compacta a avatares circulares con inicial, color de camisa real y punto de estado verde/amarillo/rojo. La ficha del empleado y el comportamiento de selección permanecen intactos.
- Se mantiene el botón «Proyectos» que abre la hoja inferior existente con los detalles y la acción ENTRAR; no se cambia la persistencia ni el esquema local.
- Fuente: `assets/office-3d.js`, `assets/office-view.css`, `assets/office-view.js`, 2026-11-10.

- Ajuste de regresión y caché: el test de vista abierta todavía exigía el texto antiguo «Entrar · nombre» en los botones de proyecto. Se actualizó para comprobar chips compactos y su etiqueta abreviada. La hoja `office-view.css` recibió una nueva clave de caché para que los avatares circulares y el carril de chips se actualicen en móvil.

- Se alinearon las dos aserciones de la prueba del HUD móvil con `office-view.css?v=46`; la prueba del carril de chips ya pasa y el runner había detectado solo la versión de caché antigua en estas expectativas.

- Se actualizó también la prueba `verify-3d-room-entrances.test.mjs`: conserva la comprobación de que cada proyecto se puede abrir, ahora mediante el nuevo chip compacto en vez del antiguo botón alto «Entrar ·».


## Corrección de tarjetas y HUD móvil — 10 de noviembre de 2026

- Se eliminó el contenedor HTML `#office-map`, el generador JavaScript de mosaicos `.office-tile` y sus reglas CSS de tarjetas 3D. La hoja inferior «Proyectos» sigue mostrando la lista existente, sus puestos y la acción de entrar; la tira de chips de la escena conserva la navegación directa.
- Se ajustó el encuadre de la cámara de la oficina para calcular la distancia a partir de la relación de aspecto y del ancho de la sala, recalculándola al cambiar orientación/tamaño. El botón de casa restaura el encuadre. El foco de empleado acerca la cámara a la altura de la cabeza.
- Se redujeron las etiquetas flotantes a 11 px con padding pequeño, se anclan sobre la cabeza y usan la posición animada del trabajador durante el paseo. Se distinguen estados trabajando, descansando/en espera y te toca.
- Se recolocó la barra de controles en la esquina inferior derecha, sobre la barra de equipo, con botones de 44 px. Se conservan los controles de zoom, rotación, casa, arrastre con un dedo y pellizco; el botón de ayuda «?» existente mantiene su aviso temporal.
- Al abrir la ficha del empleado, la tira de chips se colapsa; la ficha puede cerrarse con X o tocando fuera. Se conservan nombre, rol, estado, tarea e historial.
- Se aumentó la visibilidad geométrica de ojos y sonrisas, pero el renderer continúa siendo WebGL2 propio: no usa Three.js, `MeshStandardMaterial` ni `CanvasTexture`. La ruta de descanso sigue sin un sistema de detección de colisiones/obstáculos; no afirmar que evita todos los muebles.
- Archivos principales: `index.html`, `assets/office-view.css`, `assets/office-view.js`, `assets/office-3d.js`. Se actualizaron pruebas de regresión y validación de sintaxis para ambos controladores.
- Commits directos a `main`: [5f5ea153](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/5f5ea15319d84798d257c10a341a2fef3b4d75cf), [5e6bfcb4](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/5e6bfcb49522951dc388cf2147943cd0de497846), [88993731](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/88993731a39f69718d7347dcdfb2b7504ae0cfa8), [89ca16b6](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/89ca16b6d361c38f8a87b08fc4b3d2e34d401162), [99863dc5](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/99863dc5ca74979e541e9f5b518eb7ba67d1902b), [7bceb89a](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/7bceb89a2a7b94492eeb77030f740903bea77570), [7800da92](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/7800da92bbf9a4ee27de0fbfd5057e5621058efa).
- El run [42879234529](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42879234529) terminó con validate y deploy en `success`; Pages publicó el head de código y pruebas. No se hizo una prueba visual/táctil real en el Tecno Pova 4, no se midió FPS y no se inspeccionó la consola de un navegador móvil.
- Esta pasada no implementa todavía JSON editables ni modifica el sondeo de GitHub Actions; quedan expresamente fuera de alcance hasta la confirmación del usuario.
- Fuente: código, pruebas y logs de GitHub Actions, 2026-11-10.


## Corrección del comportamiento de descanso y acabado plástico — 10 de noviembre de 2026

- Se separó el movimiento del empleado del equipo de su escritorio: el monitor y sus líneas de código permanecen en el puesto cuando la persona se aleja. La animación de código del monitor solo se ejecuta en estado de trabajo.
- Los empleados en estado de descanso recorren rutas deterministas: salen lateralmente del puesto, usan uno de los tres pasillos entre columnas, llegan a un punto de pausa con máquina de café y regresan por el mismo pasillo. La pausa dura 3,8 segundos; los recorridos se escalonan por empleado.
- Se añadió una transición de postura: al alejarse, piernas, cadera, torso, brazos y cabeza se elevan de forma interpolada para simular levantarse; al regresar, la figura vuelve a su altura de espera en el escritorio. La marcha anima las piernas y reduce la apertura lateral de brazos/manos para ajustarse a los pasillos.
- El foco de la ficha de empleado ahora apunta más bajo para situar la figura más arriba y dejar espacio a la ficha inferior.
- El renderer sigue siendo WebGL2 propio. Se añadió iluminación especular dependiente de la vista para plástico más brillante, pero no se migró a Three.js ni se implementaron MeshStandardMaterial o CanvasTexture.
- Las rutas son pasillos fijos diseñados para la distribución actual de tres columnas; no hay un motor general de colisiones. Si cambia la distribución de muebles, las rutas necesitan revisión. No se midieron FPS ni se hizo prueba táctil/visual en el Tecno Pova 4; no declarar 30+ FPS ni ausencia de errores de consola móvil como verificados.
- Pruebas actualizadas para postura, ruta, monitor fijo, foco y shader: 92/92 pasaron.
- Commit de código y pruebas: [6e78128d](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/6e78128d08fc872e20926397203b9348199a7a6c). GitHub Actions [42884600411](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42884600411): validate y deploy terminaron en success; Pages publicó el head.
- Archivos de implementación: assets/office-3d.js, assets/office-view.css; pruebas: verify-rest-routes.test.mjs, verify-3d-worker-activity.test.mjs, verify-3d-idle-walk.test.mjs, verify-3d-human-worker-details.test.mjs, verify-3d-portrait-camera.test.mjs, verify-nine-worker-open-plan.test.mjs, verify-behavior.test.mjs.
- No se modificó el esquema local ni se inició la fase JSON editable/GitHub Actions en tiempo real.
- Fuente: repositorio y workflow 42884600411, 2026-11-10.


## Corrección de orientación de trabajadores hacia sus monitores — 10 de noviembre de 2026

- Luis observó en el Tecno Pova 4 que la mayoría de los personajes parecían mirar hacia atrás y no hacia sus monitores.
- Causa geométrica: los puestos y las caras se habían construido en lados opuestos; además, invertir solo las caras habría dejado la cámara en el lado incorrecto de la sala abierta. La solución final refleja cada conjunto de puesto completo sobre el eje Z hacia el lado abierto de la oficina, manteniendo la cámara en su ángulo de casa y haciendo que la cara del personaje, las manos, el teclado y la pantalla queden alineados.
- La reflexión actualiza posiciones y normales, e invierte el orden de vértices por triángulo para conservar el descarte de caras y la iluminación WebGL. Se conserva la geometría procedural y no se agregan librerías ni assets.
- Se desplazan el punto de descanso y la máquina de café al pasillo frontal correspondiente; los metadatos de empleados, las rutas de descanso, el foco de retrato y las etiquetas flotantes usan las nuevas coordenadas reflejadas.
- Se conserva el monitor como geometría fija al escritorio; la pantalla queda orientada hacia la persona y el ángulo de cámara sigue mostrando la escena abierta. La selección de empleado y el encuadre del nombre se ajustan al nuevo lado de la cabeza.
- Pruebas de regresión actualizadas en `verify-3d-human-worker-details.test.mjs`, `verify-rest-routes.test.mjs`, `verify-3d-portrait-camera.test.mjs` y `verify-3d-worker-activity.test.mjs`. El workflow [42887271922](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42887271922) terminó con validate y deploy en success para el head final.
- Commit final de código y pruebas: [585137dc](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/585137dc1e8c4562b4799273b6c37ff48128f77c). El cambio de caché del motor está incluido en el head publicado [806c3550](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/806c3550cd621f195a108b9dc8c4dcde75ae9234); commits posteriores de regresión conservan ese motor.
- Límite de verificación: CI confirma sintaxis, pruebas de invariantes y despliegue, pero no sustituye la revisión visual real en el Tecno Pova 4. Falta que Luis confirme en el teléfono que los nueve personajes se ven mirando al monitor, con caras visibles en el ángulo de casa. No se midió FPS ni se inspeccionó la consola del navegador móvil.
- No se modificó el esquema de almacenamiento, ni se inició la siguiente fase de JSON editables o nuevos datos en tiempo real.
- Fuente: reporte visual del usuario, `assets/office-3d.js`, pruebas de regresión y workflow GitHub Actions, 2026-11-10.


## Impresión facial generada en canvas y auditoría móvil — 10 de noviembre de 2026

- Tras la confirmación visual de Luis de que los nueve empleados ya miran hacia sus monitores, se continuó con los puntos pendientes de la lista original 1–9; no se inició la fase posterior de datos JSON editables ni se alteró el esquema local.
- Las expresiones faciales dejaron de construirse como ojos/bocas geométricos aislados. Ahora cada rostro se dibuja en un canvas 2D de 64×48 píxeles (ojos, sonrisa/gesto, cejas y gafas según variante); los píxeles visibles se convierten en pequeños triángulos coloreados y se incorporan al buffer WebGL compartido. Esto evita una dependencia de Three.js/CDN y mantiene una sola pasada de dibujo para la escena. Es una impresión rasterizada derivada de canvas, no una clase Three.js CanvasTexture.
- Se conserva el shader WebGL2 propio con reflejo especular de acabado plástico; no se añadió Three.js ni MeshStandardMaterial porque eso introduciría una dependencia nueva y cambiaría el renderer existente. La geometría de brazos cilíndricos, manos C, torso trapezoidal, cadera, piernas cortas, cabello y accesorios se mantiene.
- Se ampliaron regresiones para la impresión de canvas, encabezado móvil, ayuda «?» que se cierra sola, render a escala móvil y dibujo agrupado. El motor usa un buffer compartido y un único `gl.drawArrays` por frame, con DPR máximo 1.15 y cadencia solicitada de aproximadamente 31 FPS.
- Commit de implementación de rostro: [730e8431](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/730e8431bc1c86700d0037d81d34d6743f19e570). Pruebas: [8f2be0b3](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/8f2be0b394d7fce5c1f8ca00200e524d592be66f), [1390f613](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/1390f613c67cc1bb09cd1b326dd8f83213945604), [39e4c843](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/39e4c843d2797b6f6de2cd6b9820dd995ea75102), [bb640711](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/bb640711542abfab1f061e6a670890895a00031a). Caché del motor: `office-3d.js?v=62`.
- Workflow [42889416686](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42889416686): validate y deploy terminaron en success para el head `bb640711`; Pages quedó publicado.
- Límites que permanecen: no se ha medido el FPS real en el Tecno Pova 4 ni inspeccionado su consola móvil; el cap de 31 FPS y el batching son optimizaciones de código, no una medición de rendimiento. Las rutas de descanso son pasillos fijos para la distribución actual, no un motor general de colisiones. No se afirma una implementación literal de Three.js `MeshStandardMaterial`/ `CanvasTexture`; el canvas se rasteriza al buffer WebGL.
- Estado de la lista: puntos 1–5 y 8 están implementados en el código y cubiertos por pruebas estáticas/interfaz; el punto 6 está mejorado con impresión canvas, pero no implementa MeshStandardMaterial literal; el punto 7 cubre rutas fijas despejadas para la planta actual, sin detección general de colisiones; el punto 9 sigue sin certificación de 30+ FPS ni consola en el teléfono. La confirmación del usuario hasta ahora cubre la orientación de las caras, no la aceptación completa de los nueve puntos.
- Fuente: código, pruebas y workflow GitHub Actions, más confirmación visual de Luis sobre orientación, 2026-11-10.


## Acceso a la máquina de café y cola de descanso — 10 de noviembre de 2026

- En la auditoría del punto 7 se detectó que las rutas acababan en `restZ=3.2`, lejos de la máquina de café; además, los controles de la máquina estaban colocados al otro lado del cuerpo.
- Se alinearon los controles/pantalla frontal de cada máquina en el lado de aproximación y se acercó el destino de descanso al punto de servicio. Cada fila usa ahora una posición de espera escalonada (`2.0 + row * 0.72`) en el pasillo, para que los tres empleados de una columna no ocupen exactamente el mismo punto.
- Los pasillos siguen siendo rutas deterministas para esta distribución de tres columnas; no se implementó un motor genérico de colisiones. Los trayectos recorren los pasillos laterales y vuelven a su puesto, manteniendo monitor y escritorio fijos.
- Pruebas actualizadas: `verify-rest-routes.test.mjs`, `verify-3d-human-worker-details.test.mjs` y `verify-3d-worker-activity.test.mjs`. El workflow [42890087662](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42890087662) terminó validate y deploy en success.
- Commits: [792c46bf](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/792c46bf367cb940294ca5a18475cda959292ebe) (rutas y máquina), [006d3c85](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/006d3c8531ee51098448101d39b6ddf5360eaa2c), [1c4e026d](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/1c4e026d31602a206ba48495c9a2417e9b8e2ab4), [846b7156](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/846b7156c64be1e70f49f18cf0dea8479c3edefc) (regresiones), y [dd3fe549](https://github.com/luisequeira612-commits/oficina-luis-sequeira/commit/dd3fe5497a0d06f7b0610ec1da8387ed54e9b825) (cache-bust v63).
- Fuente: inspección de la geometría, rutas, pruebas y workflow, 2026-11-10.


## Medidor de rendimiento real en pantalla — 10 de noviembre de 2026

- Se añadió un indicador discreto de FPS en la vista 3D. Cuenta los frames efectivamente renderizados en ventanas de aproximadamente un segundo y presenta el resultado medido; no reutiliza el límite de 32 ms ni lo presenta como rendimiento real.
- El indicador cambia de tono según el resultado: verde desde 30 FPS, amarillo entre 24 y 29, rojo por debajo de 24. La etiqueta no interrumpe tecnologías de asistencia (aria-live=off).
- Se conserva el renderer WebGL2, el buffer compartido, los controles y el límite de cadencia existentes. No se añadieron dependencias, servicios, APIs, backend ni cambios de almacenamiento.
- Se añadió prueba de regresión para el cálculo y los umbrales; el motor cambia a office-3d.js?v=64 para evitar caché antigua.
- Fuente: assets/office-3d.js, assets/office-view.css, index.html y tests/verify-3d-human-worker-details.test.mjs, 2026-11-10.


## Corrección de visibilidad FPS y movimiento de empleados — 10 de noviembre de 2026

- Luis informó que el medidor de FPS no aparecía y que los personajes parecían inmóviles. La inspección encontró que el indicador estaba ubicado en la esquina superior derecha, debajo del HUD de pantalla completa (z-index del HUD superior), y que la hoja de estilos no tenía una nueva versión de caché. Se reubicó el medidor a la parte inferior izquierda del HUD en el modo general, por encima de la barra de equipo y con z-index 10; en la vista individual permanece arriba a la derecha. Se incrementó la versión de caché de `office-view.css` a v49 y de `office-3d.js` a v65.
- La causa directa del congelamiento era la condición `if(!reducedMotion)`: cuando Android/navegador informa `prefers-reduced-motion: reduce`, el motor saltaba por completo la actualización de geometría y dejaba los personajes inmóviles. Ahora respeta esa preferencia ralentizando las animaciones al 72% en vez de anularlas. También se hicieron más perceptibles los movimientos de manos, brazos, cabeza y torso al trabajar, y se elevó moderadamente la velocidad de las rutas de descanso y la zancada.
- Se añadieron pruebas de regresión para comprobar que la preferencia de movimiento reducido no congela el motor y que el medidor queda en una posición visible con la caché renovada.
- No se cambió la clave ni el esquema local, ni se inició la fase de datos editables/tiempo real. No se migró hosting.
- Fuente: revisión del renderer, CSS, HTML y pruebas del repositorio; reporte del usuario, 2026-11-10.


### Cierre y verificación de la corrección de movimiento/FPS — 10 de noviembre de 2026

- La primera CI tras la mejora encontró aserciones antiguas que esperaban amplitudes/velocidades previas y la versión v48 de CSS. Se actualizaron únicamente las expectativas de pruebas; no se revirtió la mejora de movimiento ni la caché nueva.
- Workflow final [42894125763](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42894125763): validate y deploy success. Suite Node: 97/97 pruebas aprobadas, 0 fallos. Pages publicado en el head `54c5e07a7f05540b9ad4d650e0bc101fec3d954d`.
- La confirmación final es de CI y despliegue, no de interacción física en el Tecno Pova 4. El medidor debe comprobarse visualmente en el móvil; no afirmar 30+ FPS hasta leer el valor real. No se inspeccionó la consola móvil.
- Fuente: GitHub Actions run 42894125763 y logs de validate, 2026-11-10.


## Rutas de paseo multidireccionales y orientación al caminar — 10 de noviembre de 2026

- Luis confirmó en el Tecno Pova 4 que los FPS ya aparecen (30 FPS) y que los personajes se mueven, pero observó que el desplazamiento parecía limitarse a izquierda/derecha.
- Causa localizada: las nueve rutas usaban el mismo lado de salida de cada columna (laneX), por lo que todos los trabajadores se desplazaban primero hacia la derecha antes de llegar al punto de descanso.
- Se alterna el pasillo de aproximación por fila: algunos empleados salen por el lado izquierdo de su mesa y otros por el derecho. La ruta ahora contiene cuatro puntos: salida del puesto, pasillo lateral, pasillo frontal y máquina de café; regresan por el mismo trayecto. Los destinos siguen siendo las tres estaciones ya existentes y no se añade un sistema general de colisiones.
- El cuerpo completo del minifigurín gira para mirar en la dirección de marcha. La rotación transforma también las normales a partir de una copia base, manteniendo iluminación coherente y evitando acumulación de errores entre frames. Monitores y escritorios permanecen fijos.
- Se actualizan pruebas de rutas, orientación y normalización de caché; office-3d.js pasa a v66. No se modifica localStorage, el esquema de datos, los proyectos, la integración de GitHub Actions ni el hosting.
- Fuente: observación de Luis en conversación y revisión de assets/office-3d.js y pruebas, 2026-11-10. Pendiente CI y confirmación visual de Luis de los nuevos recorridos.


### Cierre de rutas multidireccionales — 10 de noviembre de 2026

- La primera ejecución de CI encontró tres aserciones de pruebas que aún esperaban la declaración anterior de la ruta y la ubicación de la constante speed; el motor pasó la comprobación de sintaxis. Se actualizaron las expectativas y una prueba adicional que aún esperaba la variable route declarada como const.
- Corrección de naturalidad: el personaje conserva la orientación frontal mientras permanece en el escritorio y solo gira cuando realmente inicia el desplazamiento. En la pausa de café conserva la orientación de llegada; al regresar gira hacia el puesto.
- Validación final [42895621448](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42895621448): validate y deploy success. La suite completa de Node pasó en validate; GitHub Pages publicó el commit de código/pruebas `b6fd0791da547eede61a083cb21fd0dc32802add`.
- El cambio de movimiento queda desplegado, pero la nueva ruta y el giro aún necesitan confirmación visual de Luis en el Tecno Pova 4. Los 30 FPS confirmados corresponden a la versión anterior; no atribuir esa medición a esta nueva versión hasta que se vuelva a comprobar en el dispositivo.
- Fuente: GitHub Actions run 42895621448 y confirmación del usuario sobre 30 FPS en la versión anterior, 2026-11-10.


## Estado sentado coherente con actividad real de GitHub — 10 de noviembre de 2026

- La animación 3D mantiene a los empleados sentados: la actividad real de GitHub Actions se refleja con el estado de trabajo y la animación de teclado, sin desplazar el personaje fuera del escritorio.
- Se eliminó la clase obsoleta `is-walking` del puente de actividad de GitHub, que ya no correspondía al diseño sentado.
- Se amplió `tests/verify-3d-idle-walk.test.mjs` para comprobar que una ejecución real activa `st-w` y nunca introduce el estado de caminar.
- No se modifican repositorios vinculados, localStorage, esquema, dependencias, APIs, backend ni presupuesto. Las animaciones siguen siendo simulaciones visuales; la ejecución de GitHub Actions es la señal real.
- Fuente: cambios y pruebas del PR de corrección, 2026-11-10.


### Corrección de CI en PR #44 — 10 de noviembre de 2026

- La primera ejecución [42898945765](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42898945765) falló por comprobaciones heredadas que aún esperaban coordenadas de caminata, y por expresiones regulares inválidas o desactualizadas en las pruebas. No indicó un error de sintaxis en los archivos de aplicación.
- Se actualizaron las pruebas de trabajadores humanos, animación en reposo, actividad, planta abierta y rutas de descanso para comprobar la postura sentada y la cámara/selección existentes.
- La nueva ejecución para el head actualizado todavía no aparece en los resultados consultados; PR #44 sigue abierto y sin fusionar. No declarar CI aprobado hasta confirmarlo.


## Detalle de reloj mural en la oficina 3D — 10 de noviembre de 2026

- Se añade un reloj analógico decorativo a la pared del fondo, construido con la geometría compartida del renderer WebGL2. Incluye marco, esfera, doce marcas y manecillas fijas a las 10:10.
- La hora es solo un elemento decorativo fijo; no se presenta como hora local ni como dato en vivo.
- Se mantiene el buffer compartido; no se añaden texturas, dependencias, animaciones, APIs, almacenamiento ni servicios de pago.
- Se invalida la caché de office-3d.js a v68 y se añade tests/verify-3d-office-wall-clock.test.mjs.
- Fuente: cambio del renderer y prueba de regresión, 2026-11-10. Requiere CI y comprobación visual en el Tecno Pova 4.


## PR #46 — trabajadores sentados y detalle de reloj mural (10 de noviembre de 2026)

- PR #46 reúne el cambio de coherencia de actividad real con trabajadores sentados y el reloj mural decorativo en un solo cambio basado en main. PR #44 se cerró como supersedido, sin fusionarse por separado; PR #45 se cerró como intento apilado sustituido.
- La validación de la corrección de trabajadores había pasado previamente en [42900787830](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42900787830): 92/92 pruebas, cero fallos. PR #46 necesita su propia ejecución completa contra main.
- No fusionar sin autorización; el modo de autonomía continúa en review.


## PR #47 — consolidación y validación final (10 de noviembre de 2026)

- PR vigente: [#47](https://github.com/luisequeira612-commits/oficina-luis-sequeira/pull/47), base main. Reúne la corrección de actividad sentada y el reloj mural decorativo.
- Primera CI [42901154869](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42901154869): una única prueba todavía esperaba caché v67; se actualizó la aserción a v68.
- Validación final [42901434888](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42901434888): validate success, 93/93 pruebas, cero fallos. Deploy se omitió correctamente en pull_request.
- Sin merge ni publicación: autonomía review. Pendiente revisión visual/FPS en Tecno Pova 4.


## Ajuste ambiental ligero de la oficina 3D — 10 de noviembre de 2026

- Sobre la rama del PR #47 se añadió profundidad ambiental al fondo de la vista: dos halos radiales suaves (frío y cálido) y una viñeta interior inferior.
- Es un cambio exclusivamente CSS; no añade geometría WebGL, filtros por píxel, animaciones, bucles, dependencias, almacenamiento ni peticiones de red.
- Se versionó la importación de `office-3d-atmosphere.css?v=2` y la hoja principal `office-view.css?v=50` para evitar caché obsoleta.
- Se añadió `tests/verify-3d-office-atmosphere.test.mjs` para comprobar capas ambientales, caché y ausencia de keyframes.
- Estado: añadido al PR #47. La ejecución [42902364325](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42902364325) terminó con validate success y chequeo de contenido success; deploy se omitió correctamente en pull_request. No afirmar mejora visual ni impacto FPS hasta revisar en Tecno Pova 4.
- Fuente: código, prueba añadida y commits de la rama `feat/office-seated-clock-main`, 2026-11-10.


### Corrección de pruebas de caché del ajuste ambiental — 10 de noviembre de 2026

- La primera CI posterior al ajuste ambiental [42902144982](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42902144982) detectó aserciones heredadas que todavía esperaban `office-view.css?v=49` y la importación ambiental sin versión. La sintaxis JavaScript pasó; falló el conjunto de invariantes por esas expectativas antiguas.
- Se actualizaron las pruebas `verify-3d-atmosphere`, `verify-3d-human-worker-details` y `verify-nine-worker-open-plan` para exigir las nuevas referencias versionadas (`office-view.css?v=50` y `office-3d-atmosphere.css?v=2`).
- No se revirtió el cambio CSS ni se alteró el motor WebGL. La nueva CI debe confirmar el resultado final.


## Detalle de periféricos en los puestos 3D — 10 de noviembre de 2026

- Se refinó el teclado de cada estación: las diez teclas que antes se representaban como barras largas ahora forman dos filas compactas de cinco teclas. Se añadió una pequeña rueda central visible en el ratón.
- Se reutiliza el mismo número de cajas de teclas por puesto (10); el único incremento geométrico es una pieza pequeña por ratón. No hay texturas, nuevos materiales, animaciones, draw calls, dependencias, APIs, backend ni cambios de almacenamiento.
- Renderer actualizado a `assets/office-3d.js?v=69`. Pruebas actualizadas para el teclado, rueda del ratón y versión de caché; prueba del reloj también exige v69.
- Cambio en PR #47, rama `feat/office-seated-clock-main`. La ejecución [42902848275](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42902848275) terminó con validate success y chequeo de contenido success; deploy se omitió correctamente en pull_request.
- La inspección en el Tecno Pova 4 sigue pendiente; no afirmar impacto FPS ni legibilidad visual definitiva sin la prueba en dispositivo.
- Fuente: renderer, HTML, pruebas y commits de la rama, 2026-11-10.


## Interfaz compacta de monitores en PR #47 — 10 de noviembre de 2026

- Se refinó el área de pantalla de cada estación con una barra superior oscura y una barra lateral turquesa; las siete líneas de código animadas se desplazaron para dejar espacio a la interfaz.
- Son dos primitivas geométricas adicionales por monitor (18 en la oficina de nueve puestos), dentro del mismo buffer compartido y del único draw call existente. No se añadieron texturas, materiales, animaciones ni dependencias.
- Caché del renderer actualizada a `office-3d.js?v=70`; pruebas de monitores, teclado, ratón y reloj actualizadas.
- Cambio añadido al PR #47. La CI de este nuevo head debe pasar antes de cualquier merge. La legibilidad y los FPS aún requieren confirmación física en el Tecno Pova 4.
- Fuente: renderer y pruebas del PR #47, 2026-11-10.


### Corrección de expectativa de caché de monitores — 10 de noviembre de 2026

- La primera CI de la interfaz compacta de monitores [42903400038](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42903400038) pasó la comprobación de sintaxis JavaScript y falló en una aserción heredada que todavía esperaba `office-3d.js?v=69`.
- Se actualizó esa expresión regular en `tests/verify-3d-human-worker-details.test.mjs` para exigir v70. No se revirtió el código del renderer.
- Se debe revisar el resultado de la nueva CI del head corregido antes de fusionar.


## Identidad de proyecto en los monitores de la vista general — 10 de noviembre de 2026

- Nueva mejora en la rama `feat/project-colored-workstation-monitors`: cada puesto usa el nombre del proyecto que ya acompaña al empleado en `buildOfficeScene` para colorear la barra lateral y algunas líneas de código del monitor.
- Paletas deterministas: Guardi azul; Capi/YouTube rojo; Nova/Launcher azul violáceo; BABYMONSTER/Monstie/Charts violeta; proyectos no reconocidos turquesa neutro.
- No se añaden geometrías, materiales, draw calls, animaciones, texturas, dependencias, almacenamiento ni cambios de esquema; solo cambia el color de primitivas existentes.
- Renderer actualizado a `office-3d.js?v=71`; se añade una prueba de identidad por proyecto y se actualizan las expectativas de caché.
- Se prepara PR separado sobre main; requiere CI y no está fusionado. La comprobación visual en Tecno Pova 4 sigue pendiente.
- Fuente: código de `buildOfficeScene`, renderer y pruebas del repositorio, 2026-11-10.


### Ajuste de prueba para acento dinámico de monitores — 10 de noviembre de 2026

- La primera CI del PR #48 [42904037810](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42904037810) pasó sintaxis y 96 de 97 pruebas. La única falla fue una expectativa heredada que todavía exigía el color turquesa fijo en la barra lateral.
- Se actualizó `tests/verify-3d-human-worker-details.test.mjs` para exigir el uso de `stationAccent`, que es la salida de la paleta determinista por proyecto. La prueba nueva dedicada conserva las verificaciones de cada mapeo de color.
- PR #48 fue fusionado mediante squash en `a1cd16bf043e6e733d6872ccc96dfd29332d1b04`; CI [42904167117](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42904167117) y despliegue Pages [42904236621](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42904236621) completados con éxito.


## Indicador de estado en la cabecera de los monitores — 10 de noviembre de 2026

- Nueva rama `feat/monitor-live-status-indicator`: la franja superior de cada monitor refleja el estado del trabajador vinculado a GitHub, mientras la barra lateral conserva el color de identidad del proyecto.
- Paleta: trabajando verde azulado; pensando azul; requiere decisión ámbar; éxito verde; fallo rojo; descanso/otro gris azulado.
- Solo se cambia el color de la primitiva de cabecera que ya existía: no se añade geometría, draw calls, materiales, texturas, animaciones, dependencias, APIs, backend ni almacenamiento.
- Renderer actualizado a `office-3d.js?v=72`; pruebas existentes actualizadas y nueva prueba dedicada de estados.
- PR #49 fue fusionado mediante squash en `6b21039ba3163e1514c0d1b5074a40574a0ec607`; CI [42904967960](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42904967960) y Pages [42905037573](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42905037573) completados con éxito. La actualización dinámica real se corrigió en PR #50.
- Fuente: renderer, estado dinámico del puente GitHub y pruebas del repositorio, 2026-11-10.


### Corrección de expectativa heredada en PR #49 — 10 de noviembre de 2026

- CI inicial [42904881660](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42904881660): sintaxis pasó; 97/98 pruebas pasaron. La prueba heredada de interfaz de monitor seguía esperando el color fijo oscuro en la cabecera.
- Se actualizó la aserción para verificar `monitorStatusColor`, conservando la prueba dedicada que exige la paleta de estados trabajando/pensando/decisión/éxito/fallo/descanso.
- PR #49 fue fusionado y desplegado; su color inicial era estático. PR #50 corrige el refresco del color al cambiar estado.


## Corrección: refresco dinámico del color de estado del monitor — 10 de noviembre de 2026

- Revisión posterior al despliegue de PR #49 encontró que el color superior del monitor se calculaba al crear la geometría, pero el callback de sincronización solo actualizaba `worker.state`; por ello, el color no cambiaba cuando llegaba un nuevo estado.
- Rama `fix/live-monitor-status-refresh`: el rango de color de la franja queda registrado por trabajador. Cuando cambia el estado, se actualiza solo ese pequeño segmento del buffer GPU con `bufferSubData`, usando la paleta de estado centralizada. No se reconstruye la escena ni se añade geometría/draw calls/materiales/texturas.
- Renderer pasa a `office-3d.js?v=73`; prueba dedicada verifica paleta y actualización real del buffer. La mejora de estado dinámico no se considerará completa hasta pasar CI y publicarse.
- Fuente: inspección del callback `_office3dUpdateStates` y del buffer WebGL tras PR #49, 2026-11-10.


### Corrección de caché heredada en PR #50 — 10 de noviembre de 2026

- La primera CI [42905449263](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42905449263) pasó sintaxis y falló una prueba de identidad de proyecto que aún esperaba la caché v72. Se actualizó a v73; no falló la lógica de actualización de estado.
- PR #50 fue fusionado mediante squash en `790e966700379e92d109ad4f7b5d1d34e17ac682` tras CI [42905544491](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42905544491) aprobada. El despliegue main [42905636359](https://github.com/luisequeira612-commits/oficina-luis-sequeira/actions/runs/42905636359) terminó con validate y deploy success; renderer v73 publicado en GitHub Pages.
