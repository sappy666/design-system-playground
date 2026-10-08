# Design System Playground

Editor visual para crear paletas (OKLCH), escalas tipográficas, espaciado, botones y tokens, con vista previa en vivo, auditoría de contraste WCAG 2.2 y exportación.

Sitio estático: HTML, CSS y JavaScript (módulos ES). No necesita build.

## Correr en local

```bash
npm run dev        # abre http://localhost:5173
```

Los módulos ES no funcionan abriendo `index.html` con doble clic (file://); usa un servidor local.

## Desplegar en Vercel

**Opción A · GitHub (recomendada)**
1. Sube esta carpeta a un repositorio de GitHub.
2. En vercel.com → Add New → Project → importa el repositorio y usa esta carpeta como **Root Directory**.
3. Deja **Framework Preset** en **Other**. `vercel.json` ya configura el despliegue estático desde la raíz, sin comando de build.
4. Pulsa **Deploy**. Los siguientes pushes a la rama de producción se desplegarán automáticamente.

**Opción B · CLI**
```bash
npm i -g vercel
vercel          # preview
vercel --prod   # producción
```

## Exportaciones

| Formato | Uso |
|---|---|
| `tokens.css` | Variables, modo oscuro (`prefers-color-scheme` + `[data-theme]`) y componentes base |
| `tailwind.config.js` | Extiende el tema; úsalo junto a `tokens.css` |
| `tokens.dtcg.json` | Estándar W3C Design Tokens |
| `tokens-studio.json` | Plugin **Tokens Studio for Figma** → Load from file → crea variables y estilos |
| `hoja-de-estilo.svg` | Arrástralo a Figma: rectángulos y textos editables |
| Copiar SVG | Pega directo en el lienzo de Figma con Cmd/Ctrl + V |
| PNG | Captura 2× de la vista actual o de la hoja de estilo completa |
| `.zip` | Todo lo anterior junto |

## Estructura

```
index.html
css/styles.css
js/
  app.js        UI, estado, render y exportaciones
  color.js      OKLCH ⇄ sRGB, gamut mapping, contraste WCAG
  presets.js    fuentes y presets
  system.js     deriva escalas, semánticos, tipo, espacio y forma
  exporters.js  CSS, Tailwind, DTCG, Tokens Studio
  sheet.js      hoja de estilo en SVG nativo (editable en Figma)
```

## Notas

- El estado se guarda en `localStorage` del navegador.
- Las fuentes se cargan desde Google Fonts bajo demanda. Para que la hoja SVG se vea igual en Figma, las familias deben estar disponibles en Figma (todas las del selector lo están).
- Agregar un preset: añade una entrada en `RAW` dentro de `js/presets.js` y su clave en `PRESET_GROUPS`. Los colores con `hex` quedan anclados exactos en la escala.
