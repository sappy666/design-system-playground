---
name: Design System Playground
description: Editor visual de sistemas de diseño con interfaz de cuaderno de especímenes.
colors:
  paper-bg: "#E9ECEF"
  paper-panel: "#F6F7F8"
  paper-field: "#FFFFFF"
  paper-canvas: "#DCE0E4"
  hairline: "#CDD2D8"
  hairline-strong: "#A9B0B9"
  field-line: "#80878F"
  ink: "#13151A"
  ink-soft: "#4F5560"
  ink-faint: "#5E636E"
  printers-ink: "#2E2AD6"
  printers-ink-on: "#FFFFFF"
  printers-ink-wash: "#E2E1FB"
  proof-green: "#046D3A"
  proof-red: "#B42318"
  paper-bg-dark: "#0E0F12"
  paper-panel-dark: "#15171B"
  paper-field-dark: "#1C1F24"
  paper-canvas-dark: "#08090B"
  hairline-dark: "#2A2E35"
  hairline-strong-dark: "#3F444D"
  field-line-dark: "#696F79"
  ink-dark: "#ECEEF2"
  ink-soft-dark: "#A6ACB6"
  ink-faint-dark: "#808692"
  printers-ink-dark: "#9592FF"
  printers-ink-on-dark: "#0E0F12"
  printers-ink-wash-dark: "#25244A"
  proof-green-dark: "#5BC98A"
  proof-red-dark: "#FF8A80"
typography:
  display:
    fontFamily: "Cormorant Garamond, Iowan Old Style, Georgia, serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Iowan Old Style, Georgia, serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.05
  title:
    fontFamily: "Cormorant Garamond, Iowan Old Style, Georgia, serif"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.1
  body:
    fontFamily: "Manrope, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: "Manrope, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.09em"
  annotation:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.04em"
  value:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "10px"
  pill: "999px"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "28px"
components:
  button:
    backgroundColor: "{colors.paper-field}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  button-solid:
    backgroundColor: "{colors.printers-ink}"
    textColor: "{colors.printers-ink-on}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  select:
    backgroundColor: "{colors.paper-field}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0 28px 0 10px"
    height: "32px"
  input-text:
    backgroundColor: "{colors.paper-field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "34px"
  segmented-option-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-panel}"
    rounded: "{rounded.sm}"
    padding: "5px 8px"
  tab:
    textColor: "{colors.ink-faint}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  tab-selected:
    backgroundColor: "{colors.paper-panel}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  menu-item-hover:
    backgroundColor: "{colors.printers-ink-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-bg}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
---

# Design System: Design System Playground

## Overview

**Creative North Star: "El cuaderno de especímenes"**

El editor es un libro de muestras abierto sobre la mesa. Cada sección se titula como una lámina de espécimen tipográfico, en serif itálica. Cada valor se anota al margen en tipografía mono, y cada muestra de color lleva su medida de contraste como si fuera un pie de foto. Las láminas son el sistema que el usuario genera. El cuaderno las presenta, las mide y las cataloga, pero nunca compite con ellas: la vista previa (`.ds`) usa solo los tokens del usuario, y el editor la enmarca en papel gris neutro.

La densidad es de herramienta de mano: cuerpo a 14px, controles a 13px, anotaciones a 11px, todo en un panel de 340px. El ánimo que buscamos es **cálido, curioso y lúdico**. Es una invitación a mover cosas y ver qué pasa, no un tablero de control. Hoy ese ánimo vive sobre todo en la tipografía (la itálica de Cormorant, la palabra *Playground* en tinta) y en los controles que responden al tacto. La paleta todavía es de grises fríos.

**Rumbo (provisional):** los cambios futuros deben acercar el editor a ese ánimo cálido y lúdico. Puede ser con papel menos azulado, microcopy con más voz o interacciones con más carácter, sin perder la neutralidad que necesita la vista previa para juzgar color con honestidad. Esto es dirección, no un token: la paleta actual sigue siendo la referencia normativa hasta que se cambie a propósito.

**Key Characteristics:**
- Títulos de sección en Cormorant Garamond itálica, como láminas de un espécimen.
- Anotaciones y valores en JetBrains Mono, en mayúsculas espaciadas o con cifras tabulares.
- Un solo acento, tinta de imprenta índigo, y papel en capas planas.
- Profundidad por tono y línea fina, no por sombra.
- Modo claro y oscuro completos, con los mismos roles.

## Colors

Papel gris frío en cuatro tonos, tinta casi negra en tres intensidades y una sola tinta de color que hace el trabajo de marca.

### Primary
- **Tinta de imprenta** (#2E2AD6 claro / #9592FF oscuro): el único color de marca del editor. Se usa en el botón Exportar, en la palabra *Playground* del logo, en el anillo de foco, en las barras de espaciado, en los interruptores activos y en los nombres de propiedad del código. Sobre papel da 7.3–8.7:1.
- **Lavado de tinta** (#E2E1FB claro / #25244A oscuro): el fondo de hover y foco de los ítems del menú de exportación. Es la tinta diluida, nunca un color nuevo.

### Neutral
- **Papel base** (#E9ECEF): el fondo de la app y de las barras de vista.
- **Papel de panel** (#F6F7F8): el panel de propiedades, la cabecera, las láminas (`.sheet`) y los menús.
- **Papel de campo** (#FFFFFF): campos, selects, botones secundarios y bloques de código. Es el papel más claro, para lo que se toca o se lee de cerca.
- **Mesa** (#DCE0E4): el lienzo detrás de la vista previa. Es más oscuro que el papel para que la lámina del usuario se despegue sin sombra.
- **Línea fina** (#CDD2D8) y **línea marcada** (#A9B0B9): bordes de contenedores, divisores y separadores de sección. La marcada aparece en hover de botones.
- **Línea de control** (#80878F / #696F79): el límite de todo lo que se edita (campos, selects, controles segmentados) y el riel apagado del interruptor. Está calibrada a 3:1 contra todos los papeles, porque el campo blanco casi no se separa del panel y el borde es lo único que lo delata.
- **Tinta** (#13151A): texto principal, contorno del pulgar de los sliders y fondo de la opción seleccionada en controles segmentados y del toast.
- **Tinta suave** (#4F5560): etiquetas de control y texto secundario (6.3–7.5:1).
- **Tinta tenue** (#5E636E / #808692): anotaciones mono, encabezados de tabla, pestañas inactivas y descripciones del menú. Está calibrada para dar al menos 4.5:1 sobre todos los papeles, incluida la mesa.

### Semantic
- **Verde de prueba** (#046D3A / #5BC98A) y **rojo de prueba** (#B42318 / #FF8A80): solo para resultados de auditoría (píldoras PASA/FALLA), errores de validación y el hover de borrar en los chips de marca. Las píldoras usan el color al 16% como fondo y el color pleno como texto.

### Named Rules
**The Control Edge Rule.** Un divisor puede ser casi invisible; el borde de un control no. Todo límite que indica "aquí se escribe o se elige" usa la línea de control (≥3:1), nunca la línea fina.

**The Single Ink Rule.** El editor tiene una sola tinta de color. Si algo nuevo necesita destacar, usa la tinta de imprenta o su lavado. No se agrega un segundo acento.

**The Neutral Table Rule.** El papel y la mesa que rodean la vista previa se quedan sin croma apreciable, porque el usuario juzga su paleta contra ellos. Cualquier calidez futura debe probarse contra esta regla.

## Typography

**Display Font:** Cormorant Garamond (con Iowan Old Style, Georgia)
**Body Font:** Manrope (con system-ui)
**Label/Mono Font:** JetBrains Mono (con SF Mono, Menlo)

**Character:** Una serif de libro antiguo para nombrar las cosas, una sans geométrica y cálida para operar, y una mono para medir. Es la tríada de un cuaderno de especímenes: título caligráfico, texto de trabajo y nota al margen.

### Hierarchy
- **Display** (500, 26px, 1): el logo. *Playground* va en itálica y en tinta de imprenta.
- **Headline** (500, 28px, 1.05): títulos de cada vista del lienzo ("Color y contraste", "Escalas", "Tokens").
- **Title** (500 itálica, 21px, 1.1): títulos de sección del panel ("Marca", "Color", "Tipografía"), con un subtítulo mono a la derecha.
- **Body** (400, 14px, 1.5): texto base de la app. Las descripciones se limitan a 56ch.
- **Control** (600, 13px): botones, pestañas, selects y opciones segmentadas.
- **Label** (700, 11px, 0.09em, mayúsculas): subgrupos del panel, grupos del menú y encabezados de tabla.
- **Annotation** (mono 400, 11px, 0.04–0.08em, mayúsculas): subtítulos de sección, el estado "Guardado local" y metadatos de escala.
- **Value** (mono 400, 11.5px, cifras tabulares): lecturas de sliders, ratios de contraste y valores hex.

### Named Rules
**The Specimen Title Rule.** Todo título de sección del panel va en Cormorant itálica con una anotación mono a la derecha. Esa pareja es la firma del cuaderno; no se reemplaza por sans en negrita.

**The Measured Value Rule.** Todo número que el usuario lee como medida (px, rem, ratios, hex, porcentajes) va en mono con cifras tabulares.

**The 11px Floor Rule.** Ningún texto funcional del editor baja de 11px, ni siquiera las anotaciones en mayúsculas espaciadas. Si algo no cabe, se reduce el contenido o se cambia la cuadrícula, no la letra.

## Layout

Es una herramienta de dos planos. En escritorio hay una cuadrícula de `340px | 1fr`: el panel de propiedades con scroll propio a la izquierda y el escenario a la derecha (barra de pestañas y lienzo con scroll). La vista previa se centra en el lienzo con un ancho máximo de 1040px, que se reduce a 390px en el modo móvil con una transición de 0.35s `cubic-bezier(.2,.7,.2,1)`. La vista previa es un *container* (`container-type:inline-size`), así que sus reglas responden al ancho del marco y no al de la ventana.

El ritmo del panel es de secciones con 18px arriba y 20px a los lados, separadas por línea fina y con 14px entre controles. Los controles van en una cuadrícula de etiqueta y valor (`1fr auto`), y los pares se ponen lado a lado con 10px de separación. El lienzo tiene 28px arriba y 24px a los lados.

Hay dos cortes principales. A 900px o menos, la cuadrícula pasa a una sola columna y aparece un conmutador fijo "Editar / Vista previa" que muestra uno de los dos planos. Los márgenes bajan a 16px. A 640px o menos, el menú de exportación pasa a posición fija con 16px de margen a cada lado.

Con puntero táctil (`pointer:coarse`), los controles crecen a 44px de alto (botones, selects, campos, pestañas, opciones segmentadas, interruptores) y el pulgar de los sliders a 24px, sin cambiar la densidad que se ve con ratón. Las muestras de color pasan de 11 a 6 columnas por debajo de 700px de marco, y a 4 por debajo de 520px.

## Elevation & Depth

Plano por defecto. La profundidad se logra con capas de papel de distinto tono (mesa < base < panel < campo) y líneas finas de 1px. Solo lo que flota sobre la interfaz lleva sombra.

### Shadow Vocabulary
- **Sombra flotante** (`box-shadow: 0 18px 40px -12px rgba(10,12,20,.35)`): el menú de exportación. Es la única sombra proyectada del editor.
- **Anillo de selección** (`box-shadow: inset 0 0 0 1px var(--line)`): la pestaña activa. Es una línea dibujada hacia dentro, no una elevación.
- **Marca de ancla** (`box-shadow: inset 0 0 0 2px currentColor`): la muestra de color que coincide con el color de marca ingresado.

### Named Rules
**The Flat Paper Rule.** Las superficies quedan planas en reposo. Una sombra proyectada significa "esto flota encima" (menú o toast), nunca "esto es importante".

## Shapes

Las esquinas son suaves y pequeñas. El radio base es 6px (`--r`) y se usa en botones, campos, selects, pestañas y controles segmentados. Los elementos internos bajan a 4px (opciones segmentadas, muestras de color, botones de icono) y las barras de espaciado a 2px. Los contenedores grandes suben a 8px (tablas, bloques de código) y 10px (láminas, menú, marco de la vista previa). La forma de píldora (999px) queda para lo que es una etiqueta o un objeto suelto: píldoras de auditoría, chips de marca, toast e interruptores.

Los bordes son siempre de 1px en línea fina. Los únicos más gruesos son el contorno de 2px de los pulgares de slider y el borde de 1.5px de las muestras de radio.

## Components

Los controles deben sentirse **amables y juguetones**: invitan a moverlos y responden enseguida, con un pulgar que crece, un botón que se hunde un píxel y un interruptor que se desliza.

### Buttons
- **Shape:** esquinas suaves (6px), 32px de alto, icono de 15px y 6px de separación.
- **Default:** papel de campo con línea fina y texto en tinta. En hover, el borde pasa a línea marcada.
- **Solid:** tinta de imprenta con texto blanco, solo para la acción principal (Exportar). En hover se aclara un 8% (`brightness(1.08)`).
- **Press:** todos bajan 1px al presionarse (`translateY(1px)`).
- **Busy:** con `aria-busy`, opacidad 0.6 y sin interacción.
- **Icon buttons:** 32×30px y sin borde. El estado activo invierte los colores (fondo tinta, icono papel).

### Inputs / Fields
- **Style:** papel de campo, línea de control, 6px de radio, 34px de alto y texto de 13px. Los campos hex usan mono en mayúsculas.
- **Focus:** contorno de 2px en tinta de imprenta, separado 2px. Es el mismo anillo global para todo elemento enfocable.
- **Error:** borde en rojo de prueba y mensaje de 12px debajo.
- **Select:** el mismo papel y la misma línea, con una flecha SVG en tinta tenue.

### Sliders
- **Track:** 4px, redondeado y en línea fina, o con un gradiente de matiz o croma (`--track`) en los controles de color. La variante `tall` usa 10px para los gradientes.
- **Thumb:** círculo de 16px en papel de campo con contorno de 2px en tinta. Crece al 120% mientras se arrastra.

### Segmented Controls & Toggles
- **Segmented:** cápsula de papel de campo con borde en línea de control y 2px de relleno. La opción elegida se rellena en tinta con texto de papel (0.15s).
- **Toggle:** riel de 34×20px en línea de control que pasa a tinta de imprenta al activarse. El pulgar de 16px se desliza en 0.18s.

### Navigation (pestañas del escenario)
- **Style:** texto de 13px y peso 600 en tinta tenue, sin fondo. En hover pasa a tinta.
- **Active:** papel de panel con anillo interior de línea fina y texto en tinta.
- **Teclado:** patrón de pestañas ARIA completo. Solo la pestaña activa entra en el orden de Tab; las flechas, Inicio y Fin cambian de vista.

### Export Menu
- **Style:** panel de 320px, 10px de radio y la única sombra flotante. Los grupos llevan etiqueta en mayúsculas espaciadas.
- **Items:** icono de 18px y dos líneas (título de 13px y peso 600, descripción de 12px en tinta tenue). En hover y foco, fondo en lavado de tinta.
- **Teclado:** al abrirse, el foco va al primer ítem. Las flechas, Inicio y Fin lo recorren, Tab lo cierra y Escape lo cierra devolviendo el foco a Exportar.

### Contrast Pills (firma)
Las píldoras mono de 11px y peso 700 con el resultado de la auditoría WCAG: fondo verde o rojo de prueba al 16%, texto en el color pleno. Son la prueba visible de que el contraste se mide mientras se edita.

### Toast
Una píldora de tinta con texto de papel, centrada abajo y por encima del área segura. Aparece subiendo 20px con fundido (0.2–0.25s).

## Do's and Don'ts

### Do:
- **Do** titular cada sección nueva del panel con Cormorant itálica de 21px y una anotación mono en mayúsculas a la derecha.
- **Do** poner todo número medible en JetBrains Mono con cifras tabulares.
- **Do** usar la tinta de imprenta (#2E2AD6 / #9592FF) para la única acción principal visible y para el foco. Para el resto, usar su lavado o la tinta neutra.
- **Do** separar planos con tono de papel y línea fina de 1px antes que con sombra.
- **Do** dar a cada control nuevo una respuesta táctil (hundirse 1px, crecer o deslizarse) en 0.12–0.2s, y respetar `prefers-reduced-motion`, que ya apaga todas las transiciones.
- **Do** definir cada color nuevo para claro y oscuro a la vez, bajo `@media (prefers-color-scheme: dark)` y `[data-theme="dark"]`.

### Don't:
- **Don't** dejar que estilos del editor entren en la vista previa: dentro de `.ds` solo se usan variables `--ds-*`.
- **Don't** agregar un segundo color de acento al editor ni teñir el papel y la mesa que rodean la vista previa.
- **Don't** usar sombras proyectadas en paneles, láminas o tarjetas del editor.
- **Don't** aclarar la tinta tenue para "suavizar" una anotación: está calibrada al mínimo de 4.5:1 sobre todos los papeles en ambos temas. La jerarquía se marca con tamaño, mayúsculas y mono, no con un gris más claro.
- **Don't** bajar ningún texto funcional de 11px.
- **Don't** reemplazar la serif itálica de los títulos por sans en negrita para "modernizar" el editor.
