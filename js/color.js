// Conversión OKLCH ⇄ sRGB, mapeo de gamut y contraste WCAG.

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LS = [0.975, 0.94, 0.885, 0.81, 0.72, 0.63, 0.54, 0.46, 0.38, 0.30, 0.22];
const CF_COLOR = [0.18, 0.32, 0.55, 0.8, 0.95, 1, 0.95, 0.85, 0.72, 0.58, 0.45];
const CF_NEUTRAL = [1, 1, 0.95, 0.9, 0.8, 0.7, 0.6, 0.55, 0.5, 0.45, 0.4];

const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
const toGam = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);

function oklchToLin(L, C, h) {
  const r = (h * Math.PI) / 180, a = C * Math.cos(r), b = C * Math.sin(r);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (v) => v.every((x) => x >= -1e-4 && x <= 1 + 1e-4);

/** Devuelve el color más cercano dentro de sRGB reduciendo croma. */
export function fit(L, C, h) {
  let rgb = oklchToLin(L, C, h), c = C;
  if (!inGamut(rgb)) {
    let lo = 0, hi = C;
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      inGamut(oklchToLin(L, mid, h)) ? (lo = mid) : (hi = mid);
    }
    c = lo; rgb = oklchToLin(L, c, h);
  }
  rgb = rgb.map((x) => Math.min(1, Math.max(0, x)));
  const hex = "#" + rgb.map((x) => Math.round(toGam(x) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
  return { hex, lum: 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2], C: c };
}

export function hexToOklch(hex) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => toLin(parseInt(n.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C: Math.sqrt(A * A + B * B), h };
}

export function lumOfHex(hex) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => toLin(parseInt(n.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const contrast = (a, b) => {
  const hi = Math.max(a, b), lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
};

export const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v);
export const normHex = (v) => {
  let s = String(v || "").trim();
  if (s && s[0] !== "#") s = "#" + s;
  return s.toUpperCase();
};

/**
 * Escala de 11 pasos. Si hay `anchor`, el paso con lightness más cercana
 * se reemplaza por el hex exacto; su índice queda en `scale.anchorIdx`.
 */
export function makeScale(h, c, anchor = null, neutral = false) {
  const cf = neutral ? CF_NEUTRAL : CF_COLOR;
  const out = STEPS.map((step, i) => {
    const f = fit(LS[i], c * cf[i], h);
    return { step, hex: f.hex, lum: f.lum, L: LS[i], C: f.C, h };
  });
  out.anchorIdx = null;
  if (anchor && isHex(anchor)) {
    const o = hexToOklch(anchor);
    let bi = 0, bd = 9;
    LS.forEach((l, i) => { const d = Math.abs(l - o.L); if (d < bd) { bd = d; bi = i; } });
    out[bi] = { ...out[bi], hex: anchor.toUpperCase(), lum: lumOfHex(anchor), anchor: true };
    out.anchorIdx = bi;
  }
  return out;
}
