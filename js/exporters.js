import { stack, fontHref } from "./presets.js";

export const slug = (t) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sistema";

const refVar = (r) => (r.startsWith("#") ? r : `var(--color-${r})`);

export function exportCSS(sys, s) {
  const o = [];
  o.push(`/* ${s.name} — design tokens\n   Generado con Design System Playground */\n`);
  o.push(`@import url("${fontHref([s.type.display, s.type.body])}");\n`);
  o.push(`:root {`);
  if (s.brand.length) {
    o.push(`  /* Colores de marca */`);
    s.brand.forEach((h, i) => o.push(`  --brand-${i + 1}: ${h};`));
    o.push("");
  }
  o.push(`  /* Paletas (OKLCH → sRGB) */`);
  Object.entries(sys.scales).forEach(([n, sc]) => { sc.forEach((c) => o.push(`  --color-${n}-${c.step}: ${c.hex};`)); o.push(""); });
  o.push(`  /* Tipografía */`);
  o.push(`  --font-display: ${stack(s.type.display)};`);
  o.push(`  --font-body: ${stack(s.type.body)};`);
  sys.sizes.forEach((z) => o.push(`  --text-${z.k}: ${z.rem}rem; /* ${z.px.toFixed(2)}px */`));
  o.push(`  --leading-body: ${s.type.lh};\n  --leading-heading: 1.08;\n  --weight-heading: ${s.type.headWeight};\n  --tracking-heading: ${s.type.tracking}em;\n`);
  o.push(`  /* Espaciado (unidad ${s.space.unit}px) */`);
  sys.spaces.forEach((z) => o.push(`  --space-${z.k}: ${z.px / 16}rem;`));
  o.push(`\n  /* Forma */`);
  o.push(`  --radius-sm: ${sys.radius.sm}px;\n  --radius-md: ${sys.radius.md}px;\n  --radius-lg: ${sys.radius.lg}px;\n  --radius-btn: ${sys.radius.btn}px;\n  --border-width: ${s.shape.border}px;\n`);
  o.push(`  /* Semánticos · claro */`);
  Object.entries(sys.light).forEach(([k, v]) => o.push(`  --${k}: ${refVar(v.ref)};`));
  o.push(`}\n`);
  const dark = Object.entries(sys.dark).map(([k, v]) => `  --${k}: ${refVar(v.ref)};`).join("\n");
  o.push(`@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${dark.replace(/^/gm, "  ")}\n    color-scheme: dark;\n  }\n}\n`);
  o.push(`[data-theme="dark"] {\n${dark}\n  color-scheme: dark;\n}\n`);
  o.push(`/* Base */
body { background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: var(--text-base); line-height: var(--leading-body); }
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: var(--weight-heading); letter-spacing: var(--tracking-heading); line-height: var(--leading-heading); text-wrap: balance; }

/* Botón */
.btn {
  --btn-py: ${sys.btn.py / 16}rem; --btn-px: ${sys.btn.px / 16}rem;
  display: inline-flex; align-items: center; justify-content: center; gap: .5em;
  padding: var(--btn-py) var(--btn-px);
  font: ${s.button.weight} var(--text-sm)/1.2 var(--font-body);${s.button.upper ? "\n  text-transform: uppercase; letter-spacing: .06em;" : ""}
  border: var(--border-width) solid transparent; border-radius: var(--radius-btn);
  cursor: pointer; transition: background-color .15s, border-color .15s, transform .1s;
}
.btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
.btn:active:not(:disabled) { transform: translateY(1px); }
.btn:disabled { opacity: .45; cursor: not-allowed; }
.btn--primary { background: var(--primary); color: var(--on-primary); }
.btn--primary:hover:not(:disabled) { background: var(--primary-hover); }
.btn--secondary { background: var(--surface); color: var(--fg); border-color: var(--field-border); }
.btn--secondary:hover:not(:disabled) { background: var(--primary-soft); border-color: var(--primary); }
.btn--ghost { background: transparent; color: var(--primary); }
.btn--ghost:hover:not(:disabled) { background: var(--primary-soft); }
.btn--accent { background: var(--accent); color: var(--on-accent); }
.btn--danger { background: var(--danger); color: var(--on-danger); }
.btn--sm { padding: calc(var(--btn-py) * .65) calc(var(--btn-px) * .72); font-size: var(--text-xs); }
.btn--lg { padding: calc(var(--btn-py) * 1.3) calc(var(--btn-px) * 1.3); font-size: var(--text-base); }

/* Campo */
.input {
  width: 100%; font: inherit; padding: ${sys.btn.py / 16}rem var(--space-3);
  background: var(--surface); color: var(--fg);
  border: var(--border-width) solid var(--field-border); border-radius: var(--radius-md);
}
.input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); }
.input[aria-invalid="true"] { border-color: var(--danger); }

/* Tarjeta y badge */
.card { background: var(--surface); border: var(--border-width) solid var(--border); border-radius: var(--radius-lg); padding: var(--space-6); }
.badge { font-size: var(--text-xs); font-weight: 600; padding: .25em .7em; border-radius: 999px; background: var(--primary-soft); color: var(--primary-soft-fg); }`);
  return o.join("\n");
}

export function exportTailwind(sys, s) {
  const ind = (n) => " ".repeat(n);
  const q = (f) => stack(f).split(", ").map((x) => (x.startsWith('"') ? x : `"${x}"`)).join(", ");
  const colors = Object.entries(sys.scales)
    .map(([n, sc]) => `${ind(8)}${n}: {\n${sc.map((c) => `${ind(10)}${c.step}: "${c.hex}",`).join("\n")}\n${ind(8)}},`).join("\n");
  const brand = s.brand.length ? `${ind(8)}brand: {\n${s.brand.map((h, i) => `${ind(10)}${i + 1}: "${h}",`).join("\n")}\n${ind(8)}},\n` : "";
  const sem = Object.keys(sys.light).map((k) => `${ind(8)}"${k}": "var(--${k})",`).join("\n");
  return `// tailwind.config.js · ${s.name}
// Úsalo junto a tokens.css para que los colores semánticos cambien con el modo oscuro.
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
${brand}${colors}
${sem}
      },
      fontFamily: {
        display: [${q(s.type.display)}],
        body: [${q(s.type.body)}],
      },
      fontSize: {
${sys.sizes.map((z) => `        "${z.k}": "${z.rem}rem",`).join("\n")}
      },
      spacing: {
${sys.spaces.map((z) => `        "${z.label}": "${z.px / 16}rem",`).join("\n")}
      },
      borderRadius: {
        sm: "${sys.radius.sm}px", md: "${sys.radius.md}px", lg: "${sys.radius.lg}px", btn: "${sys.radius.btn}px",
      },
      lineHeight: { body: "${s.type.lh}" },
      letterSpacing: { heading: "${s.type.tracking}em" },
    },
  },
};`;
}

/** W3C Design Tokens (DTCG). */
export function exportDTCG(sys, s) {
  const t = { $description: `${s.name} — generado con Design System Playground`, brand: {}, color: {}, font: {}, size: {}, space: {}, radius: {}, semantic: { light: {}, dark: {} } };
  s.brand.forEach((h, i) => (t.brand[i + 1] = { $type: "color", $value: h }));
  Object.entries(sys.scales).forEach(([n, sc]) => { t.color[n] = {}; sc.forEach((c) => (t.color[n][c.step] = { $type: "color", $value: c.hex })); });
  t.font.display = { $type: "fontFamily", $value: stack(s.type.display).split(", ").map((f) => f.replace(/"/g, "")) };
  t.font.body = { $type: "fontFamily", $value: stack(s.type.body).split(", ").map((f) => f.replace(/"/g, "")) };
  t.font.weightHeading = { $type: "fontWeight", $value: s.type.headWeight };
  sys.sizes.forEach((z) => (t.size[z.k] = { $type: "dimension", $value: `${z.rem}rem` }));
  sys.spaces.forEach((z) => (t.space[z.label] = { $type: "dimension", $value: `${z.px / 16}rem` }));
  Object.entries(sys.radius).forEach(([k, v]) => (t.radius[k] = { $type: "dimension", $value: `${v}px` }));
  ["light", "dark"].forEach((m) => Object.entries(sys[m]).forEach(([k, v]) => {
    t.semantic[m][k] = { $type: "color", $value: v.ref.startsWith("#") ? v.ref : `{color.${v.ref.replace("-", ".")}}` };
  }));
  return JSON.stringify(t, null, 2);
}

/** Formato de Tokens Studio for Figma: sets global / light / dark con temas. */
export function exportTokensStudio(sys, s) {
  const global = { brand: {}, color: {}, fontFamilies: {}, fontWeights: {}, fontSizes: {}, lineHeights: {}, letterSpacing: {}, spacing: {}, borderRadius: {}, borderWidth: {} };
  s.brand.forEach((h, i) => (global.brand[i + 1] = { value: h, type: "color" }));
  Object.entries(sys.scales).forEach(([n, sc]) => { global.color[n] = {}; sc.forEach((c) => (global.color[n][c.step] = { value: c.hex, type: "color" })); });
  global.fontFamilies.display = { value: s.type.display, type: "fontFamilies" };
  global.fontFamilies.body = { value: s.type.body, type: "fontFamilies" };
  global.fontWeights.heading = { value: String(s.type.headWeight), type: "fontWeights" };
  global.fontWeights.button = { value: String(s.button.weight), type: "fontWeights" };
  sys.sizes.forEach((z) => (global.fontSizes[z.k] = { value: String(z.px), type: "fontSizes" }));
  global.lineHeights.body = { value: `${Math.round(s.type.lh * 100)}%`, type: "lineHeights" };
  global.lineHeights.heading = { value: "108%", type: "lineHeights" };
  global.letterSpacing.heading = { value: `${(s.type.tracking * 100).toFixed(1)}%`, type: "letterSpacing" };
  sys.spaces.forEach((z) => (global.spacing[z.label] = { value: String(z.px), type: "spacing" }));
  Object.entries(sys.radius).forEach(([k, v]) => (global.borderRadius[k] = { value: String(v), type: "borderRadius" }));
  global.borderWidth.default = { value: String(s.shape.border), type: "borderWidth" };
  global.typography = {};
  sys.sizes.forEach((z) => {
    const isHead = ["xl", "2xl", "3xl", "4xl"].includes(z.k);
    global.typography[z.k] = { type: "typography", value: {
      fontFamily: isHead ? "{fontFamilies.display}" : "{fontFamilies.body}",
      fontWeight: isHead ? "{fontWeights.heading}" : "400",
      fontSize: `{fontSizes.${z.k}}`,
      lineHeight: isHead ? "{lineHeights.heading}" : "{lineHeights.body}",
      letterSpacing: isHead ? "{letterSpacing.heading}" : "0%",
    } };
  });
  const semSet = (m) => {
    const o = {};
    Object.entries(sys[m]).forEach(([k, v]) => {
      o[k] = { value: v.ref.startsWith("#") ? v.ref : `{color.${v.ref.replace("-", ".")}}`, type: "color" };
    });
    return o;
  };
  return JSON.stringify({
    global, light: semSet("light"), dark: semSet("dark"),
    $themes: [
      { id: "light", name: "Claro", selectedTokenSets: { global: "source", light: "enabled" } },
      { id: "dark", name: "Oscuro", selectedTokenSets: { global: "source", dark: "enabled" } },
    ],
    $metadata: { tokenSetOrder: ["global", "light", "dark"] },
  }, null, 2);
}
