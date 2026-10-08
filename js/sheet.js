// Hoja de estilo en SVG nativo: rectángulos y textos reales, editables al importarla en Figma.
import { stackSingle } from "./presets.js";
import { contrast } from "./color.js";

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";

export function buildSheet(sys, s, mode = "light") {
  const W = 1200, P = 64, IW = W - P * 2;
  const sem = sys[mode];
  const C = (k) => sem[k].c.hex;
  const fD = stackSingle(s.type.display), fB = stackSingle(s.type.body);
  const hw = s.type.headWeight, tr = s.type.tracking;
  const el = [];
  const text = (x, y, str, o = {}) =>
    el.push(`<text x="${x}" y="${y}" font-family="${o.f || fB}" font-size="${o.size || 14}" font-weight="${o.w || 400}" fill="${o.fill || C("fg")}"${o.anchor ? ` text-anchor="${o.anchor}"` : ""}${o.ls ? ` letter-spacing="${o.ls}"` : ""}${o.op ? ` opacity="${o.op}"` : ""}>${esc(str)}</text>`);
  const rect = (x, y, w, h, fill, o = {}) =>
    el.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ""}${o.op ? ` opacity="${o.op}"` : ""}/>`);
  const tw = (str, size, ls = 0) => str.length * size * 0.56 + str.length * ls;

  let y = 0;
  // ---------- Cabecera ----------
  rect(0, 0, W, 220, C("primary"));
  text(P, 118, s.name, { f: fD, size: 72, w: hw, fill: C("on-primary"), ls: (tr * 72).toFixed(2) });
  text(P, 168, "Design system · tokens y componentes base", { size: 16, fill: C("on-primary"), op: 0.85 });
  text(W - P, 118, `Títulos · ${s.type.display}`, { size: 14, fill: C("on-primary"), anchor: "end", w: 600 });
  text(W - P, 142, `Texto · ${s.type.body}`, { size: 14, fill: C("on-primary"), anchor: "end", op: 0.85 });
  text(W - P, 166, `Escala ${s.type.ratio} · unidad ${s.space.unit}px`, { size: 14, fill: C("on-primary"), anchor: "end", op: 0.85 });
  y = 290;

  const section = (n, title) => {
    text(P, y, `${n}  ${title.toUpperCase()}`, { size: 12, w: 700, fill: C("muted"), ls: 2 });
    rect(P, y + 14, IW, 1, C("border"));
    y += 56;
  };

  // ---------- 01 Color ----------
  section("01", "Color");
  if (s.brand.length) {
    text(P, y, "Colores de marca", { size: 14, w: 600 });
    y += 24;
    const per = 8, gap = IW / per;
    s.brand.forEach((h, i) => {
      const col = i % per, row = Math.floor(i / per);
      const cx = P + 36 + col * gap, cy = y + 36 + row * 120;
      const lum = sys.scales.neutral[0].lum;
      el.push(`<circle cx="${cx}" cy="${cy}" r="36" fill="${h}"${h.toUpperCase() === "#FFFFFF" || contrast(lumHex(h), lum) < 1.3 ? ` stroke="${C("border")}"` : ""}/>`);
      text(cx - 36, cy + 62, h, { f: MONO, size: 12, fill: C("muted") });
    });
    y += Math.ceil(s.brand.length / per) * 120 + 16;
  }
  const names = { primary: "Primario", accent: "Acento", neutral: "Neutro", success: "Éxito", warning: "Advertencia", danger: "Peligro" };
  const labelW = 120, gapS = 6, sw = (IW - labelW - gapS * 10) / 11;
  Object.entries(names).forEach(([k, label]) => {
    text(P, y + 32, label, { size: 14, w: 600 });
    sys.scales[k].forEach((c, i) => {
      const x = P + labelW + i * (sw + gapS);
      rect(x, y, sw, 56, c.hex, { rx: 4 });
      const onW = contrast(c.lum, 1) >= contrast(c.lum, sys.scales.neutral[10].lum);
      text(x + 8, y + 20, String(c.step), { f: MONO, size: 11, fill: onW ? "#FFFFFF" : sys.scales.neutral[10].hex });
      text(x, y + 74, c.hex, { f: MONO, size: 10, fill: C("muted") });
    });
    y += 96;
  });
  y += 24;

  // ---------- 02 Tipografía ----------
  section("02", "Tipografía");
  const startY = y;
  text(P, y + 150, "Aa", { f: fD, size: 180, w: hw, ls: (tr * 180).toFixed(1) });
  text(P, y + 210, s.type.display, { size: 16, w: 700 });
  text(P, y + 234, `Títulos · peso ${hw}`, { size: 13, fill: C("muted") });
  text(P, y + 300, "Aa", { f: fB, size: 72 });
  text(P, y + 334, s.type.body, { size: 16, w: 700 });
  text(P, y + 358, `Cuerpo · interlineado ${s.type.lh}`, { size: 13, fill: C("muted") });
  const sx = P + 380, sample = {
    "4xl": "Retícula", "3xl": "Jerarquía clara", "2xl": "Sistema de diseño", xl: "Componentes con ritmo",
    lg: "Un subtítulo que acompaña", base: "El cuerpo de texto debe leerse sin esfuerzo.", sm: "Texto secundario y ayudas de formulario.", xs: "LEYENDAS · METADATOS · NOTAS",
  };
  let ty = y;
  sys.sizes.slice().reverse().forEach((z) => {
    const head = ["4xl", "3xl", "2xl", "xl"].includes(z.k);
    text(sx, ty + 12, `text-${z.k} · ${z.px.toFixed(1)}px · ${z.rem}rem`, { f: MONO, size: 11, fill: C("muted") });
    ty += 18 + z.px * 1.05;
    text(sx, ty, sample[z.k], head ? { f: fD, size: z.px, w: hw, ls: (tr * z.px).toFixed(2) } : { size: z.px });
    ty += 22;
  });
  y = Math.max(startY + 380, ty) + 40;

  // ---------- 03 Botones ----------
  section("03", "Botones");
  const fsBtn = sys.sizes.find((z) => z.k === "sm").px;
  const btn = (x, yy, label, v, scale = 1, disabled = false) => {
    const fs = fsBtn * (scale < 1 ? 0.88 : scale > 1 ? 1.12 : 1);
    const t = s.button.upper ? label.toUpperCase() : label;
    const ls = s.button.upper ? fs * 0.06 : 0;
    const h = Math.round(sys.btn.py * 2 * scale + fs * 1.2);
    const w = Math.round(tw(t, fs, ls) + sys.btn.px * 2 * scale);
    const rx = Math.min(sys.radius.btn, h / 2);
    const st = {
      primary: [C("primary"), C("on-primary"), null], secondary: [C("surface"), C("fg"), C("field-border")],
      ghost: ["none", C("primary"), null], accent: [C("accent"), C("on-accent"), null], danger: [C("danger"), C("on-danger"), null],
    }[v];
    const g = [];
    g.push(`<g${disabled ? ' opacity="0.45"' : ""}>`);
    g.push(`<rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="${rx}" fill="${st[0]}"${st[2] ? ` stroke="${st[2]}" stroke-width="${s.shape.border}"` : ""}/>`);
    g.push(`<text x="${x + w / 2}" y="${yy + h / 2 + fs * 0.36}" text-anchor="middle" font-family="${fB}" font-size="${fs}" font-weight="${s.button.weight}" fill="${st[1]}"${ls ? ` letter-spacing="${ls.toFixed(2)}"` : ""}>${esc(t)}</text>`);
    g.push(`</g>`);
    el.push(g.join(""));
    return { w, h };
  };
  let bx = P, rowH = 0;
  [["Primario", "primary"], ["Secundario", "secondary"], ["Ghost", "ghost"], ["Acento", "accent"], ["Eliminar", "danger"]].forEach(([l, v]) => {
    const r = btn(bx, y, l, v); bx += r.w + 16; rowH = Math.max(rowH, r.h);
  });
  btn(bx, y, "Inactivo", "primary", 1, true);
  y += rowH + 24;
  bx = P; rowH = 0;
  [["Pequeño", 0.7], ["Regular", 1], ["Grande", 1.3]].forEach(([l, sc]) => { const r = btn(bx, y, l, "primary", sc); bx += r.w + 16; rowH = Math.max(rowH, r.h); });
  text(bx + 8, y + rowH / 2 + 5, `radio ${sys.radius.btn === 999 ? "píldora" : sys.radius.btn + "px"} · padding ${sys.btn.py}/${sys.btn.px}px`, { f: MONO, size: 11, fill: C("muted") });
  y += rowH + 56;

  // ---------- 04 Campos ----------
  section("04", "Campos de formulario");
  const fw = (IW - 3 * 24) / 4, fh = Math.round(sys.btn.py * 2 + 22);
  [["Predeterminado", "camila@estudio.cl", "field-border", null, false],
   ["Foco", "camila@estu", "primary", "primary-soft", false],
   ["Error", "camila@", "danger", null, false],
   ["Deshabilitado", "No editable", "border", null, true]].forEach(([lab, val, bc, ring, dis], i) => {
    const x = P + i * (fw + 24);
    text(x, y, lab, { size: 13, w: 600 });
    if (ring) rect(x - 3, y + 11, fw + 6, fh + 6, "none", { rx: sys.radius.md + 3, stroke: C(ring), sw: 3 });
    rect(x, y + 14, fw, fh, dis ? C("bg") : C("surface"), { rx: sys.radius.md, stroke: C(bc), sw: s.shape.border });
    text(x + 12, y + 14 + fh / 2 + 5, val, { size: 14, fill: dis ? C("muted") : C("fg") });
    if (lab === "Error") text(x, y + fh + 36, "Revisa el formato del correo.", { size: 12, fill: C("danger") });
  });
  y += fh + 90;

  // ---------- 05 Badges ----------
  section("05", "Badges");
  let gx = P;
  [["En diseño", "primary-soft", "primary-soft-fg"], ["Publicado", "success-soft", "success-fg"], ["En revisión", "warning-soft", "warning-fg"], ["Bloqueado", "danger-soft", "danger-fg"]].forEach(([l, b, f]) => {
    const w = tw(l, 12) + 24;
    rect(gx, y, w, 26, C(b), { rx: 13 });
    text(gx + 12, y + 17, l, { size: 12, w: 600, fill: C(f) });
    gx += w + 10;
  });
  y += 80;

  // ---------- 06 Espaciado y radios ----------
  section("06", "Espaciado y radios");
  const maxS = Math.max(...sys.spaces.map((z) => z.px));
  sys.spaces.forEach((z) => {
    text(P, y + 12, `space-${z.label}`, { f: MONO, size: 11, fill: C("muted") });
    text(P + 96, y + 12, `${z.px}px`, { f: MONO, size: 11 });
    rect(P + 160, y, Math.max(2, (z.px / maxS) * (IW / 2 - 180)), 14, C("primary"), { rx: 2 });
    y += 26;
  });
  const ry = y - sys.spaces.length * 26;
  [["sm", sys.radius.sm], ["md", sys.radius.md], ["lg", sys.radius.lg], ["btn", sys.radius.btn]].forEach(([k, v], i) => {
    const x = P + IW / 2 + 40 + i * 120;
    rect(x, ry, 88, 88, C("surface"), { rx: Math.min(v, 44), stroke: C("fg"), sw: 1.5 });
    text(x, ry + 112, `${k} · ${v === 999 ? "full" : v + "px"}`, { f: MONO, size: 11, fill: C("muted") });
  });
  y = Math.max(y, ry + 130) + 40;

  rect(P, y, IW, 1, C("border"));
  text(P, y + 30, "Generado con Design System Playground", { size: 12, fill: C("muted") });
  text(W - P, y + 30, mode === "dark" ? "Modo oscuro" : "Modo claro", { size: 12, fill: C("muted"), anchor: "end" });
  const H = Math.ceil(y + 64);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<title>${esc(s.name)} · hoja de estilo</title>
<rect width="${W}" height="${H}" fill="${C("bg")}"/>
${el.join("\n")}
</svg>`;
  return { svg, width: W, height: H };
}

function lumHex(hex) {
  const n = hex.replace("#", "");
  const f = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const [r, g, b] = [0, 2, 4].map((i) => f(parseInt(n.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
