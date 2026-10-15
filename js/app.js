import { STEPS, fit, hexToOklch, contrast, isHex, normHex } from "./color.js";
import { FONTS, stack, fontHref, PRESET_GROUPS, presetState, presetLabel } from "./presets.js";
import { compute } from "./system.js";
import { exportCSS, exportTailwind, exportDTCG, exportTokensStudio, slug } from "./exporters.js";
import { buildSheet } from "./sheet.js";

const $ = (id) => document.getElementById(id);
const LSKEY = "dsp-state-v2";
const FRAMED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

/* ================= Estado ================= */
let presetKey = "editorial";
let state = presetState(presetKey);
try {
  const saved = JSON.parse(localStorage.getItem(LSKEY) || "null");
  if (saved && saved.state && saved.state.neutral && Array.isArray(saved.state.brand)) { state = saved.state; presetKey = saved.preset || "editorial"; }
} catch (e) { /* almacenamiento no disponible */ }
let mode = "light", fmt = "css", tab = "comp", sys = compute(state);

const get = (o, p) => p.split(".").reduce((x, k) => x[k], o);
const set = (o, p, v) => { const ks = p.split("."), last = ks.pop(); ks.reduce((x, k) => x[k], o)[last] = v; };

/* ================= Fuentes bajo demanda ================= */
const loaded = new Set(["Cormorant Garamond", "Manrope", "JetBrains Mono"]);
function ensureFonts(list) {
  const missing = [...new Set(list)].filter((f) => FONTS[f] && !loaded.has(f));
  if (!missing.length) return;
  missing.forEach((f) => loaded.add(f));
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.crossOrigin = "anonymous"; l.href = fontHref(missing);
  document.head.appendChild(l);
}

/* ================= Vista previa ================= */
function applyVars() {
  const s = state, L = [];
  L.push(`--ds-font-d:${stack(s.type.display)};--ds-font-b:${stack(s.type.body)};`);
  L.push(`--ds-leading:${s.type.lh};--ds-head-weight:${s.type.headWeight};--ds-tracking:${s.type.tracking}em;`);
  sys.sizes.forEach((z) => L.push(`--ds-text-${z.k}:${z.rem}rem;`));
  sys.spaces.forEach((z) => L.push(`--ds-space-${z.k}:${z.px / 16}rem;`));
  L.push(`--ds-r-sm:${sys.radius.sm}px;--ds-r-md:${sys.radius.md}px;--ds-r-lg:${sys.radius.lg}px;--ds-r-btn:${sys.radius.btn}px;--ds-border-w:${s.shape.border}px;`);
  L.push(`--ds-btn-py:${sys.btn.py / 16}rem;--ds-btn-px:${sys.btn.px / 16}rem;--ds-btn-weight:${s.button.weight};--ds-btn-case:${s.button.upper ? "uppercase" : "none"};--ds-btn-tracking:${s.button.upper ? "0.06em" : "0"};`);
  const semCss = (m) => Object.entries(sys[m]).map(([k, v]) => `--ds-${k}:${v.c.hex};`).join("");
  $("dsVars").textContent = `.ds{${L.join("")}} .ds[data-mode="light"]{${semCss("light")}} .ds[data-mode="dark"]{${semCss("dark")}}`;
}

function renderChart() {
  const cols = state.brand.length ? state.brand.slice(0, 6) : [sys.light.primary.c.hex, sys.light.accent.c.hex];
  const labels = ["Brief", "Diseño", "Desarrollo", "Revisión", "Publicado", "Soporte"];
  const vals = [58, 34, 82, 61, 50, 26];
  $("dsChart").innerHTML = cols.map((c, i) =>
    `<div class="ds-bar" style="--v:${vals[i]}%;--c:${c}" title="${labels[i]}: ${vals[i]}%"><span class="ds-bar-fill"></span><b class="ds-bar-val">${vals[i]}%</b></div>`).join("");
  $("dsLegend").innerHTML = cols.map((c, i) => `<span><i style="background:${c}"></i>${labels[i]} · ${vals[i]}%</span>`).join("");
}

function renderColor() {
  const names = { primary: "Primario", accent: "Acento", neutral: "Neutro", success: "Éxito", warning: "Advertencia", danger: "Peligro" };
  const ink = sys.scales.neutral[10];
  const swatch = (c, label, anchor) => {
    const cw = contrast(c.lum, 1), cb = contrast(c.lum, ink.lum), useW = cw >= cb, r = useW ? cw : cb;
    return `<button class="sw${anchor ? " anchor" : ""}" type="button" data-copy="${c.hex}" title="${anchor ? "Tu color exacto · " : ""}Copiar ${c.hex}">
      <div class="sw-c" style="background:${c.hex};color:${useW ? "#FFFFFF" : ink.hex}"><span>${label}</span><span class="ratio">${r.toFixed(1)} ${r >= 4.5 ? "AA" : r >= 3 ? "AA+" : "—"}</span></div>
      <div class="sw-m">${c.hex}</div></button>`;
  };
  let html = "";
  if (state.brand.length) {
    html += `<div><div class="scale-name"><b>Marca</b><code>--brand-*</code></div><div class="swatches">${
      state.brand.map((h, i) => swatch({ hex: h, lum: hexLum(h) }, i + 1, false)).join("")}</div></div>`;
  }
  html += Object.keys(names).map((n) => `<div><div class="scale-name"><b>${names[n]}</b><code>--color-${n}-*</code></div><div class="swatches">${
    sys.scales[n].map((c) => swatch(c, c.step, c.anchor)).join("")}</div></div>`).join("");
  $("scales").innerHTML = html;

  const pairs = [["Texto principal", "fg", "bg", 4.5], ["Texto secundario", "muted", "bg", 4.5], ["Texto sobre tarjeta", "fg", "surface", 4.5],
    ["Enlace / botón ghost", "primary", "surface", 4.5], ["Botón primario", "on-primary", "primary", 4.5], ["Botón de acento", "on-accent", "accent", 4.5],
    ["Borde de campo (UI)", "field-border", "surface", 3], ["Alerta de peligro", "danger-fg", "danger-soft", 4.5]];
  let pass = 0, total = 0;
  const rows = pairs.map(([label, f, b, min]) => {
    const cells = ["light", "dark"].map((m) => {
      const fc = sys[m][f].c, bc = sys[m][b].c, r = contrast(fc.lum, bc.lum);
      total++; if (r >= min) pass++;
      return `<td><span class="pair"><i style="background:${bc.hex};color:${fc.hex}">Aa</i><span class="num">${r.toFixed(2)}</span><span class="pill ${r >= min ? "ok" : "bad"}">${r >= min ? "PASA" : "FALLA"}</span></span></td>`;
    }).join("");
    return `<tr><td>${label}</td><td class="num">${min}:1</td>${cells}</tr>`;
  }).join("");
  $("contrastTable").innerHTML = `<thead><tr><th>Par</th><th>Mínimo</th><th>Claro</th><th>Oscuro</th></tr></thead><tbody>${rows}</tbody>`;
  $("contrastSummary").innerHTML = `<span class="pill ${pass === total ? "ok" : "bad"}">${pass}/${total}</span> pares cumplen WCAG 2.2 AA (texto 4.5:1, componentes de UI 3:1).${pass < total ? " Ajusta el croma, el tono o el color anclado hasta que todos pasen." : ""}`;
}

function hexLum(hex) {
  const n = hex.replace("#", "");
  const f = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const [r, g, b] = [0, 2, 4].map((i) => f(parseInt(n.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function renderScales() {
  const s = state;
  const sample = { "4xl": "Retícula", "3xl": "Jerarquía", "2xl": "Sistema de diseño", xl: "Componentes con ritmo", lg: "Un subtítulo que acompaña",
    base: "El cuerpo de texto debe leerse sin esfuerzo en cualquier pantalla.", sm: "Texto secundario, etiquetas y ayudas de formulario.", xs: "LEYENDAS · METADATOS · NOTAS AL PIE" };
  $("typeSpec").innerHTML = sys.sizes.slice().reverse().map((z) => {
    const disp = ["4xl", "3xl", "2xl", "xl"].includes(z.k);
    const st = `font-family:${(disp ? stack(s.type.display) : stack(s.type.body)).replace(/"/g, "'")};font-size:${z.px}px;${disp ? `font-weight:${s.type.headWeight};letter-spacing:${s.type.tracking}em` : ""}`;
    return `<div class="spec-row"><div class="spec-meta"><b>text-${z.k}</b>${z.px.toFixed(2)}px · ${z.rem}rem</div><div class="spec-sample" style="${st}">${sample[z.k]}</div></div>`;
  }).join("");
  const max = Math.max(...sys.spaces.map((z) => z.px));
  $("spaceSpec").innerHTML = sys.spaces.map((z) => `<div class="space-row"><div class="spec-meta"><b>space-${z.label}</b>${z.px}px · ${z.px / 16}rem</div><div><div class="space-bar" style="width:${Math.max(2, (z.px / max) * 100)}%"></div></div></div>`).join("");
  $("radiusSpec").innerHTML = [["sm", sys.radius.sm], ["md", sys.radius.md], ["lg", sys.radius.lg], ["btn", sys.radius.btn]]
    .map(([k, v]) => `<div class="radius-box" style="border-radius:${Math.min(v, 42)}px">${k} · ${v === 999 ? "full" : v + "px"}</div>`).join("");
}

function renderSheet() { $("sheetWrap").innerHTML = buildSheet(sys, state, mode).svg; }

/* ================= Código ================= */
const FORMATS = {
  css: { fn: exportCSS, file: (n) => `${n}-tokens.css`, mime: "text/css", label: "CSS copiado" },
  tailwind: { fn: exportTailwind, file: () => "tailwind.config.js", mime: "text/javascript", label: "Config de Tailwind copiada" },
  json: { fn: exportDTCG, file: (n) => `${n}-tokens.dtcg.json`, mime: "application/json", label: "JSON DTCG copiado" },
  studio: { fn: exportTokensStudio, file: (n) => `${n}-tokens-studio.json`, mime: "application/json", label: "JSON de Tokens Studio copiado" },
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function highlight(code) {
  let h = esc(code);
  if (fmt === "css") h = h.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="c">$1</span>').replace(/(--[a-z0-9-]+)(?=:)/g, '<span class="p">$1</span>');
  else if (fmt === "tailwind") h = h.replace(/^(\s*\/\/.*|\s*\/\*\*.*\*\/)$/gm, '<span class="c">$1</span>');
  else h = h.replace(/("[^"]+")(?=:)/g, '<span class="p">$1</span>');
  return h;
}
let currentCode = "";
function renderCode() {
  currentCode = FORMATS[fmt].fn(sys, state);
  $("code").innerHTML = highlight(currentCode);
}

/* ================= Controles ================= */
const fmtOut = { deg: (v) => `${Math.round(v)}°`, c: (v) => (+v).toFixed(3), px: (v) => `${v}px`, em: (v) => `${(+v).toFixed(3)}em`, n2: (v) => (+v).toFixed(2) };
["fD", "fB"].forEach((id) => { $(id).innerHTML = Object.keys(FONTS).map((f) => `<option value="${f}">${f}</option>`).join(""); });
$("preset").innerHTML = PRESET_GROUPS.map((g) => `<optgroup label="${g.label}">${g.keys.map((k) => `<option value="${k}">${presetLabel(k)}</option>`).join("")}</optgroup>`).join("")
  + `<option value="custom" disabled>Personalizado</option>`;

function syncControls() {
  document.querySelectorAll("[data-path]").forEach((el) => {
    const v = get(state, el.dataset.path);
    if (el.type === "radio") el.checked = String(v) === el.value;
    else if (el.type === "checkbox") el.checked = !!v;
    else el.value = v;
    el.removeAttribute("aria-invalid");
  });
  ["nameErr", "baseErr", "pHexErr", "aHexErr", "brandErr"].forEach((id) => ($(id).hidden = true));
  $("preset").value = presetKey;
}
function hueTrack() {
  const stops = []; for (let h = 0; h <= 360; h += 30) stops.push(fit(0.65, 0.16, h).hex);
  document.querySelectorAll("input.hue").forEach((el) => el.style.setProperty("--track", `linear-gradient(90deg,${stops.join(",")})`));
}
function chromaTracks() {
  [["pC", "primary", 0.3], ["aC", "accent", 0.3], ["nC", "neutral", 0.05]].forEach(([id, k, max]) => {
    const h = state[k].h;
    $(id).style.setProperty("--track", `linear-gradient(90deg,${fit(0.8, 0, h).hex},${fit(0.8, max / 2, h).hex},${fit(0.8, max, h).hex})`);
  });
}
function renderBrand() {
  $("brandChips").innerHTML = state.brand.length
    ? state.brand.map((h, i) => `<span class="bchip"><i style="background:${h}"></i>${h}<button type="button" data-rm="${i}" aria-label="Quitar ${h}"><svg viewBox="0 0 10 10" stroke="currentColor" stroke-width="1.6"><path d="M2 2l6 6M8 2 2 8"/></svg></button></span>`).join("")
    : `<p class="empty">Sin colores de marca. Agrega los hex de tu identidad.</p>`;
}

/* Las vistas ocultas solo se marcan como pendientes; se dibujan al abrirlas. */
const VIEWS = { sheet: () => renderSheet(), color: () => renderColor(), scale: () => renderScales(), tokens: () => renderCode() };
let stale = new Set();
function renderView(t) { if (stale.delete(t)) VIEWS[t](); }

let raf = 0, saveT = 0;
function render() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    sys = compute(state);
    ensureFonts([state.type.display, state.type.body]);
    applyVars();
    document.querySelectorAll("[data-out]").forEach((o) => (o.textContent = fmtOut[o.dataset.fmt](get(state, o.dataset.out))));
    document.querySelectorAll('[data-bind="name"]').forEach((e) => (e.textContent = state.name));
    [["p", "primary"], ["a", "accent"]].forEach(([pfx, k]) => {
      const sc = sys.scales[k], shown = sc.anchorIdx != null ? sc[sc.anchorIdx] : sys.light[k].c;
      $(pfx + "Chip").style.background = shown.hex;
      if (document.activeElement !== $(pfx + "Hex")) $(pfx + "Hex").value = shown.hex;
      const note = $(pfx + "AnchorNote");
      note.hidden = sc.anchorIdx == null;
      if (sc.anchorIdx != null) note.textContent = `Tu color exacto ocupa el paso ${STEPS[sc.anchorIdx]} de la escala.`;
    });
    chromaTracks(); renderBrand(); renderChart();
    stale = new Set(Object.keys(VIEWS)); renderView(tab);
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { localStorage.setItem(LSKEY, JSON.stringify({ state, preset: presetKey })); $("saveState").textContent = "Guardado local"; }
      catch (e) { $("saveState").textContent = "Sin guardado local"; }
    }, 400);
  });
}

function markCustom() { if (presetKey !== "custom") { presetKey = "custom"; $("preset").value = "custom"; } }

document.querySelectorAll("[data-path]").forEach((el) => {
  const ev = el.tagName === "SELECT" || el.type === "radio" || el.type === "checkbox" ? "change" : "input";
  el.addEventListener(ev, () => {
    const p = el.dataset.path; let v;
    if (el.type === "checkbox") v = el.checked;
    else if (el.type === "radio") { if (!el.checked) return; v = "num" in el.dataset ? Number(el.value) : el.value; }
    else if (el.type === "range" || "num" in el.dataset) v = Number(el.value);
    else v = el.value;
    if (p === "name") {
      const ok = v.trim().length > 0; el.setAttribute("aria-invalid", String(!ok)); $("nameErr").hidden = ok; if (!ok) return; v = v.trim();
    }
    if (p === "type.base") {
      const n = Number(el.value), ok = el.value !== "" && Number.isFinite(n) && n >= 12 && n <= 22;
      el.setAttribute("aria-invalid", String(!ok)); $("baseErr").hidden = ok; if (!ok) return; v = Math.round(n);
    }
    if (p === "primary.h" || p === "primary.c") state.primary.anchor = null;
    if (p === "accent.h" || p === "accent.c") state.accent.anchor = null;
    set(state, p, v);
    if (p !== "name") markCustom();
    $("saveState").textContent = "Guardando…";
    render();
  });
});

document.querySelectorAll("[data-hex]").forEach((el) => {
  const k = el.dataset.hex, errId = (k === "primary" ? "p" : "a") + "HexErr";
  const apply = () => {
    const v = normHex(el.value), ok = isHex(v);
    el.setAttribute("aria-invalid", String(!ok)); $(errId).hidden = ok; if (!ok) return;
    const o = hexToOklch(v);
    state[k].h = Math.round(o.h); state[k].c = Math.min(0.3, Math.round(o.C * 1000) / 1000); state[k].anchor = v;
    $(k === "primary" ? "pH" : "aH").value = state[k].h; $(k === "primary" ? "pC" : "aC").value = state[k].c;
    markCustom(); render(); toast("Color anclado a la escala");
  };
  el.addEventListener("change", apply);
  el.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } });
});

/* Colores de marca */
function addBrand() {
  const v = normHex($("brandAdd").value), ok = isHex(v);
  $("brandAdd").setAttribute("aria-invalid", String(!ok)); $("brandErr").hidden = ok;
  if (!ok) return;
  if (state.brand.includes(v)) { toast(`${v} ya está en la paleta`); return; }
  if (state.brand.length >= 12) { toast("Máximo 12 colores de marca"); return; }
  state.brand.push(v); $("brandAdd").value = ""; markCustom(); render();
}
$("brandAddBtn").addEventListener("click", addBrand);
$("brandAdd").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); addBrand(); } });
$("brandChips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-rm]"); if (!b) return;
  state.brand.splice(Number(b.dataset.rm), 1); markCustom(); render();
});

$("preset").addEventListener("change", (e) => {
  presetKey = e.target.value; state = presetState(presetKey); syncControls(); render();
  toast(`Preset ${presetLabel(presetKey)} aplicado`);
});
$("resetBtn").addEventListener("click", () => {
  const key = presetKey === "custom" ? "editorial" : presetKey;
  presetKey = key; state = presetState(key); syncControls(); render(); toast("Valores restablecidos");
});

/* Tabs */
function showTab(t) {
  tab = t;
  document.querySelectorAll(".tab").forEach((b) => {
    const on = b.dataset.tab === t;
    b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1;
  });
  document.querySelectorAll(".view").forEach((v) => (v.hidden = v.dataset.view !== t));
  renderView(t);
}
const tabBtns = [...document.querySelectorAll(".tab")];
tabBtns.forEach((b, i) => {
  b.addEventListener("click", () => showTab(b.dataset.tab));
  b.addEventListener("keydown", (e) => {
    const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabBtns.length - 1 }[e.key];
    if (n == null) return;
    e.preventDefault();
    const next = tabBtns[(n + tabBtns.length) % tabBtns.length];
    showTab(next.dataset.tab); next.focus();
  });
});

/* Modo y viewport. Los colores de la vista previa solo se animan al cambiar de tema, no al arrastrar controles. */
let themeT = 0;
document.querySelectorAll("button[data-mode]").forEach((b) => b.addEventListener("click", () => {
  const ds = $("ds");
  ds.classList.add("is-theming"); clearTimeout(themeT); themeT = setTimeout(() => ds.classList.remove("is-theming"), 300);
  mode = b.dataset.mode; ds.dataset.mode = mode;
  document.querySelectorAll("button[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  stale.add("sheet"); renderView(tab);
}));
document.querySelectorAll("button[data-vp]").forEach((b) => b.addEventListener("click", () => {
  $("frame").dataset.vp = b.dataset.vp;
  document.querySelectorAll("button[data-vp]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
}));

/* Vista móvil */
function setMView(v) { document.body.dataset.mview = v; document.querySelectorAll('input[name="mview"]').forEach((r) => (r.checked = r.value === v)); }
document.querySelectorAll('input[name="mview"]').forEach((r) => r.addEventListener("change", () => setMView(r.value)));
setMView("view");

/* ================= Copiar / descargar ================= */
function selectCode() { const r = document.createRange(); r.selectNodeContents($("code")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
async function copyText(text, msg) {
  try { await navigator.clipboard.writeText(text); toast(msg); }
  catch (e) {
    if (text === currentCode) { selectCode(); toast("Código seleccionado: usa Copiar del sistema"); }
    else toast("El navegador bloqueó el portapapeles");
  }
}
function download(name, data, mime) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast(FRAMED ? "Descarga bloqueada en la vista previa: usa la app desplegada" : `${name} descargado`);
}
const needName = () => { if (!state.name.trim()) { toast("Agrega un nombre antes de exportar"); return true; } return false; };

$("copyBtn").addEventListener("click", () => { if (!needName()) copyText(currentCode, FORMATS[fmt].label); });
$("dlBtn").addEventListener("click", () => { if (!needName()) download(FORMATS[fmt].file(slug(state.name)), currentCode, FORMATS[fmt].mime); });
document.querySelectorAll('input[name="fmt"]').forEach((r) => r.addEventListener("change", () => { fmt = r.value; renderCode(); }));
$("scales").addEventListener("click", (e) => { const b = e.target.closest("[data-copy]"); if (b) copyText(b.dataset.copy, `${b.dataset.copy} copiado`); });

/* ================= Exportar imagen ================= */
function bgFor(node) {
  return getComputedStyle(node).backgroundColor !== "rgba(0, 0, 0, 0)" ? undefined : getComputedStyle(document.body).backgroundColor;
}
/* Librerías de exportación: se cargan al abrir el menú, no en la primera pintura. */
const libs = {};
function loadLib(src, global, msg) {
  if (window[global]) return Promise.resolve(window[global]);
  return (libs[src] ||= new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => (window[global] ? res(window[global]) : rej(new Error(msg)));
    s.onerror = () => { delete libs[src]; s.remove(); rej(new Error(msg)); };
    document.head.appendChild(s);
  }));
}
const loadImageLib = () => loadLib("vendor/html-to-image.js", "htmlToImage", "La librería de imagen no cargó. Revisa tu conexión.");
const loadZipLib = () => loadLib("vendor/jszip.min.js", "JSZip", "La librería ZIP no cargó. Revisa tu conexión.");

async function nodeToPng(node, opts = {}) {
  const htmlToImage = await loadImageLib();
  await document.fonts.ready;
  return htmlToImage.toBlob(node, { pixelRatio: 2, cacheBust: true, backgroundColor: bgFor(node), ...opts });
}
async function sheetPng() {
  const { svg, width, height } = buildSheet(sys, state, mode);
  const holder = document.createElement("div");
  holder.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;height:${height}px;line-height:0`;
  holder.innerHTML = svg;
  document.body.appendChild(holder);
  try { return await nodeToPng(holder, { width, height, pixelRatio: 2, style: { position: "static", left: "0", top: "0" } }); }
  finally { holder.remove(); }
}
async function viewPng() {
  const node = document.querySelector(`.view[data-view="${tab}"] [data-capture]`);
  return nodeToPng(node);
}

const ACTIONS = {
  async "png-view"() { const b = await viewPng(); download(`${slug(state.name)}-${tab}.png`, b, "image/png"); },
  async "png-sheet"() { const b = await sheetPng(); download(`${slug(state.name)}-hoja-de-estilo.png`, b, "image/png"); },
  "svg-sheet"() { download(`${slug(state.name)}-hoja-figma.svg`, buildSheet(sys, state, mode).svg, "image/svg+xml"); },
  "copy-svg"() { return copyText(buildSheet(sys, state, mode).svg, "SVG copiado: pégalo en Figma"); },
  "tokens-studio"() { download(`${slug(state.name)}-tokens-studio.json`, exportTokensStudio(sys, state), "application/json"); },
  css() { download(`${slug(state.name)}-tokens.css`, exportCSS(sys, state), "text/css"); },
  async zip() {
    const JSZip = await loadZipLib();
    const n = slug(state.name), z = new JSZip();
    z.file("tokens.css", exportCSS(sys, state));
    z.file("tailwind.config.js", exportTailwind(sys, state));
    z.file("tokens.dtcg.json", exportDTCG(sys, state));
    z.file("figma/tokens-studio.json", exportTokensStudio(sys, state));
    z.file("figma/hoja-de-estilo.svg", buildSheet(sys, state, mode).svg);
    try { z.file("figma/hoja-de-estilo.png", await sheetPng()); } catch (e) { /* el PNG es opcional */ }
    z.file("README.md", `# ${state.name}\n\nDesign tokens generados con Design System Playground.\n\n- \`tokens.css\`: variables, modo oscuro y componentes base. Impórtalo en tu layout global.\n- \`tailwind.config.js\`: extiende tu tema; úsalo junto a tokens.css.\n- \`tokens.dtcg.json\`: formato estándar W3C Design Tokens.\n- \`figma/tokens-studio.json\`: impórtalo en el plugin Tokens Studio (Load from file) para crear variables y estilos.\n- \`figma/hoja-de-estilo.svg\`: arrástralo a Figma; las capas y textos quedan editables.\n`);
    download(`${n}-design-system.zip`, await z.generateAsync({ type: "blob" }), "application/zip");
  },
};

const menu = $("exportMenu"), exportBtn = $("exportBtn");
$("frameNote").hidden = !FRAMED;
function openMenu(open) {
  menu.hidden = !open; exportBtn.setAttribute("aria-expanded", String(open));
  if (open) {
    menu.querySelector(".menu-i").focus();
    loadImageLib().catch(() => {}); loadZipLib().catch(() => {});
  }
}
const menuItems = [...menu.querySelectorAll(".menu-i")];
menuItems.forEach((it) => (it.tabIndex = -1));
exportBtn.addEventListener("click", () => openMenu(menu.hidden));
exportBtn.addEventListener("keydown", (e) => { if (e.key === "ArrowDown" && menu.hidden) { e.preventDefault(); openMenu(true); } });
menu.addEventListener("keydown", (e) => {
  if (e.key === "Tab") { openMenu(false); return; }
  const i = menuItems.indexOf(document.activeElement);
  const n = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: menuItems.length - 1 }[e.key];
  if (n == null) return;
  e.preventDefault();
  menuItems[(n + menuItems.length) % menuItems.length].focus();
});
document.addEventListener("click", (e) => { if (!menu.hidden && !e.target.closest(".menu-wrap")) openMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { openMenu(false); exportBtn.focus(); } });
menu.addEventListener("click", async (e) => {
  const it = e.target.closest("[data-act]"); if (!it) return;
  if (needName()) return;
  openMenu(false);
  exportBtn.setAttribute("aria-busy", "true");
  toast("Preparando exportación…");
  try { await ACTIONS[it.dataset.act](); }
  catch (err) { toast(`No se pudo exportar: ${err.message || err}`); }
  finally { exportBtn.removeAttribute("aria-busy"); }
});

/* Formulario demo */
const form = $("dsForm");
function fieldState(input, help, ok, msg, def) { input.setAttribute("aria-invalid", String(!ok)); help.textContent = ok ? def : msg; help.classList.toggle("is-error", !ok); }
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const n = $("dsName"), m = $("dsEmail");
  const okN = n.value.trim().length > 1, okM = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value.trim());
  fieldState(n, $("dsNameHelp"), okN, "Escribe tu nombre (mínimo 2 letras).", "Como quieres que te llamemos.");
  fieldState(m, $("dsEmailHelp"), okM, "Ese correo no parece válido. Revisa el formato nombre@dominio.cl.", "Responderemos en 48 horas hábiles.");
  $("dsOk").hidden = !(okN && okM);
  if (!(okN && okM)) (okN ? m : n).focus();
});
form.addEventListener("reset", () => setTimeout(() => {
  fieldState($("dsName"), $("dsNameHelp"), true, "", "Como quieres que te llamemos.");
  fieldState($("dsEmail"), $("dsEmailHelp"), true, "", "Responderemos en 48 horas hábiles.");
  $("dsOk").hidden = true;
}));

/* Toast */
let tT = 0;
function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tT); tT = setTimeout(() => t.classList.remove("show"), 2200); }

hueTrack(); syncControls(); render();
