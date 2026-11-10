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

## Fases

- **Fase A:** simulación visual local y gestión de proyectos/personajes.
- **Fase B:** consulta de ejecuciones recientes de GitHub Actions en repositorios públicos.
