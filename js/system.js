import { STEPS, makeScale, contrast } from "./color.js";

const TYPE_STEPS = [["xs", -2], ["sm", -1], ["base", 0], ["lg", 1], ["xl", 2], ["2xl", 3], ["3xl", 4], ["4xl", 5]];
const SPACE_STEPS = ["0.5", "1", "2", "3", "4", "6", "8", "10", "12", "16"];
const DENSITY = { compact: [6, 12], regular: [10, 18], comfortable: [13, 24] };

/** Deriva el sistema completo (escalas, semánticos, tipo, espacio, forma) del estado. */
export function compute(s) {
  const scales = {
    primary: makeScale(s.primary.h, s.primary.c, s.primary.anchor),
    accent: makeScale(s.accent.h, s.accent.c, s.accent.anchor),
    neutral: makeScale(s.neutral.h, s.neutral.c, null, true),
    success: makeScale(150, 0.13),
    warning: makeScale(75, 0.14),
    danger: makeScale(27, 0.18),
  };
  const R = (n, i) => ({ ref: `${n}-${STEPS[i]}`, c: scales[n][i] });
  const WHITE = { ref: "#FFFFFF", c: { hex: "#FFFFFF", lum: 1 } };
  const ink = scales.neutral[10];
  const onColor = (bg) =>
    contrast(bg.c.lum, 1) >= contrast(bg.c.lum, ink.lum) ? WHITE : { ref: "neutral-950", c: ink };

  // Si el color de marca está anclado, el semántico usa exactamente ese paso.
  const pA = scales.primary.anchorIdx, aA = scales.accent.anchorIdx;
  const pL = pA ?? 6, pLH = pL < 10 ? pL + 1 : pL - 1;
  const pD = pA != null && pA <= 5 ? pA : 4, pDH = pD > 0 ? pD - 1 : pD + 1;
  const aL = aA ?? 5, aD = aA != null && aA <= 5 ? aA : 4;

  function sem(dark) {
    const p = dark ? R("primary", pD) : R("primary", pL);
    const a = dark ? R("accent", aD) : R("accent", aL);
    const d = dark ? R("danger", 4) : R("danger", 6);
    return {
      bg: dark ? R("neutral", 10) : R("neutral", 0),
      surface: dark ? R("neutral", 9) : WHITE,
      fg: dark ? R("neutral", 0) : R("neutral", 10),
      muted: dark ? R("neutral", 4) : R("neutral", 6),
      border: dark ? R("neutral", 8) : R("neutral", 2),
      "field-border": dark ? R("neutral", 6) : R("neutral", 4),
      primary: p,
      "primary-hover": dark ? R("primary", pDH) : R("primary", pLH),
      "on-primary": onColor(p),
      "primary-soft": dark ? R("primary", 9) : R("primary", 1),
      "primary-soft-fg": dark ? R("primary", 2) : R("primary", 8),
      accent: a,
      "on-accent": onColor(a),
      ring: dark ? R("primary", 3) : R("primary", 5),
      danger: d,
      "on-danger": onColor(d),
      "success-soft": dark ? R("success", 9) : R("success", 1),
      "success-fg": dark ? R("success", 2) : R("success", 8),
      "warning-soft": dark ? R("warning", 9) : R("warning", 1),
      "warning-fg": dark ? R("warning", 2) : R("warning", 8),
      "danger-soft": dark ? R("danger", 9) : R("danger", 1),
      "danger-fg": dark ? R("danger", 2) : R("danger", 8),
    };
  }

  const sizes = TYPE_STEPS.map(([k, n]) => {
    const px = Math.round(s.type.base * Math.pow(s.type.ratio, n) * 100) / 100;
    return { k, px, rem: +(px / 16).toFixed(4) };
  });
  const u = s.space.unit === 8 ? 8 : 4;
  const spaces = SPACE_STEPS.map((label) => ({ label, k: label.replace(".", "-"), px: u * parseFloat(label) }));
  const r = s.shape.radius;
  const radius = { sm: Math.round(r * 0.5), md: r, lg: Math.round(r * 1.5), btn: s.button.pill ? 999 : r };
  const [py, px] = DENSITY[s.button.density].map((v) => Math.round(v * (u === 8 ? 1.15 : 1)));

  return { scales, light: sem(false), dark: sem(true), sizes, spaces, radius, btn: { py, px } };
}
