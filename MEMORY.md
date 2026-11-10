# Memoria del proyecto

## Identidad y alcance
- Nombre visible y título del documento: **Oficina de Luis Sequeira**.
- Repositorio público: `luisequeira612-commits/oficina-luis-sequeira`.
- Fase A: simulación visual local; sin conexión a GitHub, API, backend, cuentas ni servicios externos.
- Mantener la implementación estática, gratuita y sin dependencias.

## Decisiones
- Marca de cabecera: `assets/guardi-mark.svg`, copiada literalmente del archivo aprobado.
- Personajes: plantilla SVG 64 × 70 aprobada por el usuario; sustituir únicamente los marcadores de color del rol. Mantener números, colores fijos y clases.
- Roles y colores: Desarrollo (#534AB7, #3C3489, #AFA9EC), Diseño (#D4537E, #993556, #F4C0D1), Revisión (#1D9E75, #0F6E56, #9FE1CB), Escritor (#BA7517, #854F0B, #FAC775), Community (#D85A30, #993C1D, #F5C4B3).
- Proyectos iniciales: App Guardi (Desarrollo, Revisión, Diseño); Canal de YouTube (Escritor, Diseño); Tema Nova Launcher (Diseño).
- Persistencia: solo proyectos y roles en localStorage bajo `oficina-luis-sequeira-v1`; los estados son efímeros.
- Diseñar primero para móvil, incluidos 360 px; controles táctiles de al menos 44 px; respetar `prefers-reduced-motion`.
- No añadir service worker ni manifest.
- La Fase A debe terminar en PR; no fusionar sin autorización explícita.

## Fuente
- Especificación visual, de comportamiento y SVG facilitada directamente por el usuario en esta conversación, 2026-11-09.