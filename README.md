# Oficina de Luis Sequeira

Panel estático para visualizar personajes de trabajo agrupados por proyecto y consultar el estado de las últimas ejecuciones de GitHub Actions de repositorios públicos.

## Uso

Abre `index.html` en un navegador o publica el repositorio con GitHub Pages.

- Añade proyectos y personajes, y elimina los que ya no necesites.
- Los proyectos y roles se guardan en el almacenamiento local del navegador.
- Los estados animados de los personajes siguen siendo una simulación local y no se guardan.
- Cada proyecto puede vincularse a un repositorio público con el formato `usuario/repositorio`.
- La Oficina consulta la última ejecución de GitHub Actions y las hasta tres PR abiertas más recientes mediante la API pública de GitHub. Las PR se consultan al abrir la página o al pulsar Actualizar; no se sondean en segundo plano.
- Las tarjetas iniciales de Canal de YouTube y Tema Nova Launcher apuntan a sus repositorios conocidos. App Guardi queda sin vincular hasta que indiques su repositorio. Puedes cambiar o desconectar cualquiera.
- La información local permanece en el dispositivo y navegador donde se creó.

## Integración con GitHub

La Fase B consulta `GET /repos/{owner}/{repo}/actions/runs?per_page=1` desde el navegador. No utiliza token, autenticación, backend, servidor propio ni dependencias externas.

Las ejecuciones de Actions se consultan al abrir la página, al pulsar **Actualizar** y cada cinco minutos. Las PR abiertas se consultan al abrir la página y al pulsar **Actualizar**, pero no en el sondeo periódico para reducir el consumo de la cuota pública no autenticada. GitHub aplica límites de solicitudes públicas. Si se alcanza el límite, la tarjeta muestra un aviso y se puede volver a intentar más tarde. Los repositorios privados o inexistentes no se pueden consultar.

El panel muestra el estado de la última ejecución y enlaza a su página en GitHub. También lista hasta tres PR abiertas recientes, con enlace a cada propuesta. Esto representa actividad real de GitHub, pero no identifica si una PR fue creada por una persona o por un agente. Los personajes mantienen sus estados visuales simulados; no se presentan como agentes reales conectados a GitHub.

## Tecnología y privacidad

HTML, CSS y JavaScript sin dependencias, backend, cuentas ni claves. No incluye service worker ni manifiesto. La API pública de GitHub recibe la consulta del navegador; los proyectos y roles siguen guardándose localmente.

## Oficina 3D

La vista general ahora reúne las habitaciones de los proyectos en una planta 3D conectada por un pasillo común. Puedes girar, desplazar y acercar la cámara, y entrar en cada habitación desde los controles del propio edificio. Cada habitación conserva su escena detallada individual. Si WebGL 2 no está disponible, se mantiene el mapa de proyectos como alternativa accesible.

Las salas 3D se dibujan localmente con WebGL 2 y geometría procedural propia: escritorio, monitor encendido, teclado, ratón, torre, silla, lámpara, accesorios y trabajadores low-poly. La cámara admite rotación táctil, desplazamiento, zoom por botones/gesto y rueda. No descarga modelos ni bibliotecas externas. Si WebGL 2 no está disponible, conserva la vista CSS anterior como alternativa. El rendimiento y la compatibilidad real deben comprobarse en el teléfono objetivo. Los trabajadores 3D reutilizan los tonos de piel, peinados y colores de ropa de sus avatares humanos, y actualizan sus movimientos low-poly cuando cambia el estado simulado (trabajo, pensamiento, espera y descanso), con soporte de movimiento reducido. El render se limita aproximadamente a 30 FPS para moderar el uso de recursos móviles. La animación es visual y no representa actividad real de agentes.

La vista general incorpora una capa de presentación CSS de bajo coste: retícula ambiental tenue, etiqueta de orientación y navegación de habitaciones numerada con acentos visuales. No añade geometría, efectos de iluminación física ni trabajo extra al renderizador WebGL; mantiene controles accesibles, adaptación móvil y respeto por movimiento reducido.

Cada habitación del edificio conectado tiene ahora una entrada física orientada al pasillo central, con marco, dintel, placa de proyecto y alfombra de acceso generados como geometría procedural en WebGL 2. Los acentos ayudan a distinguir visualmente los espacios sin descargar modelos ni texturas. Además, cada sala genera una instalación mural propia a partir del nombre del proyecto: escudo abstracto para Guardi, reproducción/línea de edición para YouTube, teléfono y órbitas para Nova Launcher, y barras de ranking con motivo musical para BABYMONSTER Chart. Los proyectos nuevos reciben una composición modular neutra. Son formas originales creadas con geometría del renderer, no logotipos oficiales ni imágenes externas. La misma identidad continúa en el suelo y los escritorios: cada puesto recibe una franja de color y un accesorio pequeño acorde con el proyecto (insignia, claqueta, teléfono o barras de ranking), con un objeto modular neutro para proyectos personalizados.


La sala 3D incorpora iluminación de relleno direccional y ambiental más equilibrada, tres lámparas colgantes con difusores, una ventana trasera dividida en paneles con marco y alféizar, y una pequeña zona de descanso con sofá, mesa y planta. Son primitivas geométricas locales; no son luces físicas con sombras dinámicas ni recursos descargados. El renderizador conserva su alternativa CSS y no modifica el almacenamiento. La compatibilidad y el rendimiento en el Tecno Pova 4 siguen pendientes de prueba física.


La vista general del edificio incluye ahora un atrio de entrada al final del pasillo: recepción con mostrador y terminal visible, muro de bienvenida con señalización, asientos para visitantes, jardineras, portal de acceso y marquesina con luces. Es geometría procedural del renderer WebGL 2; no representa una recepción operada por una persona o agente real.

## Fases

- **Fase A:** simulación visual local y gestión de proyectos/personajes.
- **Fase B:** consulta de ejecuciones recientes de GitHub Actions en repositorios públicos.


## Trabajadores humanos low-poly — detalle visual

La sala 3D añade rasgos faciales legibles (ojos, cejas, nariz, boca y orejas), gafas y pequeños accesorios en variación determinista, además de cuello, tapeta, insignia y puños en la ropa. Son detalles geométricos discretos para dar más personalidad a los trabajadores sin descargar modelos ni texturas. Los estados y movimientos continúan siendo simulación local; no representan actividad real de agentes. La apariencia física en el Tecno Pova 4 aún requiere prueba manual.


## Acabado arquitectónico de las habitaciones 3D

Las salas incorporan pilares estructurales en las esquinas, capiteles y basamentos, vigas superiores, zócalos continuos, paneles/bastidores verticales y un marco de transición entre el área de trabajo y el salón. Son detalles geométricos ligeros del renderer procedural; no requieren modelos, texturas ni recursos externos. La cámara de corte abierto y la alternativa CSS se conservan.


## Mobiliario y detalles de oficina 3D

Las estaciones de trabajo incorporan cajoneras de dos niveles, bandejas de cableado bajo el escritorio, apoyabrazos y soportes de silla, además de rejillas frontales e indicadores en las torres de PC. Una pizarra mural con notas de colores aporta un punto de planificación compartida. Todo se genera con la geometría procedural existente; no añade modelos, texturas, dependencias ni servicios externos. La escena conserva sus datos, cámara y alternativa CSS.


## Recuperación de la vista general 3D

El constructor de la vista general declara sus propios materiales geométricos, incluido el material metálico de recepción. Esto evita que un identificador local de la habitación se use fuera de ámbito y que el renderer active silenciosamente la vista alternativa.


### Diagnóstico de la vista 3D

Si WebGL 2 no está disponible o el motor falla al construir la escena, la página conserva el mapa alternativo y muestra el motivo del fallo fuera del contenedor 3D oculto. Los scripts del renderer y de la vista llevan una versión de caché para evitar reutilizar archivos antiguos del navegador. La validación automatizada comprueba que el diagnóstico permanezca visible; no sustituye una prueba física en Android.


### Animaciones Tycoon de trabajadores

Los trabajadores low-poly ahora tienen rangos de movimiento independientes para cabeza, brazos y manos. En estado de trabajo realizan pequeños movimientos de tecleo; al pensar mueven la cabeza de forma más pausada; al esperar y descansar usan movimientos más suaves y distintos. Todo sigue siendo animación local ilustrativa, se limita a unos 30 FPS y respeta la preferencia de movimiento reducido del dispositivo. No representa telemetría ni ejecución real de agentes.


## Actividad real de GitHub Actions

Cada proyecto puede vincular un repositorio público mediante el campo `owner/repo`. El módulo `assets/github-live.js` consulta únicamente `GET /repos/{owner}/{repo}/actions/runs?per_page=5`, de forma serial y escalonada: ciclo de repositorios inactivos de aproximadamente cuatro minutos (mínimo un minuto entre peticiones globales) y prioridad de repositorios con ejecuciones `queued` o `in_progress`. Los proyectos con repositorio duplicado comparten una sola consulta.

El módulo guarda por repositorio los cinco runs recientes, ETag y hora de consulta en `localStorage` bajo `oficina-luis-sequeira-github-cache-v1`; no cambia el esquema existente `oficina-luis-sequeira-v1`. Muestra la caché inmediatamente, pausa con la pestaña oculta, actualiza al volver si los datos superan dos minutos y aplica enfriamiento manual de 15 segundos. Registra `X-RateLimit-Remaining` y `X-RateLimit-Reset`, pausa por debajo de diez solicitudes y aplica retroceso exponencial ante 403/429. Un 404 se reintenta con menor frecuencia.

La UI separa estados reales de GitHub Actions (trabajando, éxito, fallo, descanso) de las animaciones decorativas. Los estados de éxito y fallo también se sincronizan con poses específicas del trabajador 3D. El panel de actividad muestra proyecto, workflow, estado, tiempo relativo y enlace a GitHub. No se usa token, servidor, dependencia nueva ni consulta de pull requests en este módulo.

**Nota de cuota:** ETag/If-None-Match permite recibir 304 cuando la respuesta no cambió, pero la documentación oficial indica que la exención de cuota primaria para 304 se aplica a solicitudes condicionales correctamente autenticadas con cabecera Authorization. Esta app no usa token, así que no presupone que un 304 anónimo sea gratuito: sigue los encabezados reales de cuota de la respuesta. Fuente: documentación oficial de GitHub sobre [solicitudes condicionales](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api) y [límites de API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).


The live UI keeps two timestamps per repository: `checkedAt` controls freshness ("En vivo" / "Desactualizado"), while `fetchedAt` controls the "Datos de hace X min" label. A 304 updates validation time but does not pretend the cached response body was downloaded again.


### Distinción entre ejecuciones en cola y en curso

Una ejecución `queued` se muestra como «En cola» y usa la pose de espera; solo una ejecución `in_progress` activa «Trabajando». Ambos estados conservan la prioridad de sondeo rápido. Esto evita representar como trabajo ya iniciado una ejecución que GitHub todavía no ha puesto en marcha.


## LEGO Office Tycoon 3D — primera etapa visual

La dirección visual aprobada sustituye los avatares humanos low-poly por personajes originales de estilo minifigura: cabeza cilíndrica con pieza superior, torso y extremidades geométricos, rasgos faciales impresos, tonos de piel variados y diversidad de peinados/ropa. La distribución de género se mantiene aproximadamente equilibrada. No se usan modelos, texturas ni recursos de terceros.

La vista general conectada pasa a ser un modo de juego a pantalla completa en móvil y escritorio. Arrastrar desplaza la cámara dentro de límites, pellizcar ajusta el zoom y los controles discretos permiten una rotación limitada o recentrar la oficina. El HUD queda superpuesto al área jugable. La geometría procedural, WebGL 2, la alternativa CSS y la integración real de GitHub Actions se mantienen; no se altera el almacenamiento ni su esquema.
