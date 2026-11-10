# Oficina de Luis Sequeira

Panel estático para visualizar personajes de trabajo agrupados por proyecto y consultar el estado de las últimas ejecuciones de GitHub Actions de repositorios públicos.

## Uso

Abre `index.html` en un navegador o publica el repositorio con GitHub Pages.

- Añade proyectos y personajes, y elimina los que ya no necesites.
- Los proyectos y roles se guardan en el almacenamiento local del navegador.
- Los estados animados de los personajes siguen siendo una simulación local y no se guardan.
- Cada proyecto puede vincularse a un repositorio público con el formato `usuario/repositorio`.
- La Oficina consulta la última ejecución de GitHub Actions mediante la API pública de GitHub y permite actualizarla manualmente.
- Las tarjetas iniciales de Canal de YouTube y Tema Nova Launcher apuntan a sus repositorios conocidos. App Guardi queda sin vincular hasta que indiques su repositorio. Puedes cambiar o desconectar cualquiera.
- La información local permanece en el dispositivo y navegador donde se creó.

## Integración con GitHub

La Fase B consulta `GET /repos/{owner}/{repo}/actions/runs?per_page=1` desde el navegador. No utiliza token, autenticación, backend, servidor propio ni dependencias externas.

La consulta se realiza al abrir la página y cuando el usuario pulsa **Actualizar**; no hay sondeo continuo. GitHub aplica sus límites de solicitudes públicas no autenticadas. Si se alcanza el límite, la tarjeta muestra un aviso y se puede volver a intentar más tarde. Los repositorios privados o inexistentes no se pueden consultar.

El panel muestra el estado de la última ejecución y enlaza a su página en GitHub. Los personajes mantienen sus estados visuales simulados; no se presentan como agentes reales conectados a GitHub.

## Tecnología y privacidad

HTML, CSS y JavaScript sin dependencias, backend, cuentas ni claves. No incluye service worker ni manifiesto. La API pública de GitHub recibe la consulta del navegador; los proyectos y roles siguen guardándose localmente.

## Fases

- **Fase A:** simulación visual local y gestión de proyectos/personajes.
- **Fase B:** consulta de ejecuciones recientes de GitHub Actions en repositorios públicos.
