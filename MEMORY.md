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
