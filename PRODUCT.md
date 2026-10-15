# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Diseñadores externos (público, no un equipo interno) que necesitan arrancar un sistema de diseño sin montarlo desde cero: definir color, tipografía, espaciado, forma y botones, comprobar que funciona y llevarlo a Figma y a código.

## Product Purpose

Design System Playground es un editor visual que deriva un sistema de diseño completo a partir de pocas decisiones (color primario y de acento, neutro, familias tipográficas, ratio de escala, unidad de espacio, radio, estilo de botón) y lo entrega listo para usar. Éxito: el diseñador sale con tokens y una hoja de estilo que puede abrir en Figma y pasar a desarrollo sin rehacer nada.

## Positioning

Combina en una sola herramienta lo que normalmente está repartido:

- **Salida directa a Figma:** hoja de estilo en SVG con capas y textos editables, opción de copiar y pegar en el lienzo, y JSON para Tokens Studio (sets global, claro y oscuro).
- **Color OKLCH con auditoría WCAG 2.2:** escalas perceptualmente uniformes, con gamut mapping a sRGB y contraste comprobado mientras se edita.
- **Vista previa realista:** el sistema se ve aplicado en componentes reales (formulario, precios, estados, gráfico de datos), en modo claro y oscuro.
- **Presets inspirados en referencias:** se arranca desde estilos basados en referencias reales y se ajusta.

## Operating Context

El diseñador ajusta controles en el panel lateral y mira el resultado en la vista previa. En móvil alterna entre "Editar" y "Vista previa". Al terminar exporta: `tokens.css`, `tailwind.config.js`, `tokens.dtcg.json`, `tokens-studio.json`, `hoja-de-estilo.svg`, PNG (2×) de la vista o de la hoja, o un `.zip` con todo. Dentro de la vista previa de Claude las descargas están bloqueadas y solo funcionan las opciones de copiar.

## Capabilities and Constraints

- **Todo en el navegador:** sin backend ni cuentas. El estado vive en `localStorage`.
- **Fuentes disponibles en Google Fonts y en Figma:** cualquier familia nueva debe existir en ambos, para que la hoja SVG se vea igual al importarla.
- Sitio estático con módulos ES, sin paso de build. Se despliega en Vercel (`vercel.json`) y en local se sirve con `npm run dev`.
- Terminología: preset, tokens, semánticos, escala, hoja de estilo.
- **Sin decidir:** si la interfaz se queda solo en español (hoy está en español, pero no se fijó como restricción) y si el proyecto debe seguir sin framework.

## Evidence on Hand

- README con la tabla de exportaciones y la estructura del proyecto.
- Presets: 3 base (Editorial, Clínico, Estudio) y 10 inspirados en referencias (en `js/presets.js`).
- No hay testimonios, usuarios, métricas, precios ni casos de estudio. No se deben inventar. Los textos de la vista previa son contenido de ejemplo y deben seguir marcados como tal.

## Product Principles

1. **Lo que se ve es lo que se exporta:** la vista previa, los tokens y la hoja de Figma salen de la misma fuente y no deben divergir.
2. **Accesible por defecto:** el contraste WCAG se verifica mientras se edita, no al final.
3. **Pocas decisiones, sistema completo:** el diseñador elige lo esencial y la herramienta deriva el resto con criterio.
4. **Listo para el siguiente paso:** cada exportación debe abrirse en Figma o en código sin tener que limpiarla.
5. **Sin fricción:** sin cuentas, sin instalación y sin servidor.

## Accessibility & Inclusion

Los sistemas generados se auditan con WCAG 2.2 (contraste). No se estableció ningún requisito específico para la interfaz del editor.
