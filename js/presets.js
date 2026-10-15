import { hexToOklch } from "./color.js";

// Familias disponibles (todas en Google Fonts). `axis: null` = familia de un solo estilo.
export const FONTS = {
  "Cormorant Garamond": { cat: "serif", axis: "wght@400;500;600;700" },
  "Fraunces": { cat: "serif", axis: "wght@400;500;600;700" },
  "DM Serif Display": { cat: "serif", axis: "ital@0;1" },
  "Playfair Display": { cat: "serif", axis: "wght@400;500;600;700;800" },
  "Instrument Serif": { cat: "serif", axis: "ital@0;1" },
  "IBM Plex Serif": { cat: "serif", axis: "wght@400;500;600;700" },
  "Manrope": { cat: "sans-serif", axis: "wght@400;500;600;700;800" },
  "DM Sans": { cat: "sans-serif", axis: "wght@400;500;600;700" },
  "Outfit": { cat: "sans-serif", axis: "wght@300;400;500;600;700;800" },
  "Nunito Sans": { cat: "sans-serif", axis: "wght@400;600;700;800" },
  "Noto Sans": { cat: "sans-serif", axis: "wght@300;400;600;700" },
  "IBM Plex Sans": { cat: "sans-serif", axis: "wght@400;500;600;700" },
  "Bricolage Grotesque": { cat: "sans-serif", axis: "wght@400;500;600;700;800" },
  "Barlow": { cat: "sans-serif", axis: "wght@400;500;600;700;800" },
  "Space Grotesk": { cat: "sans-serif", axis: "wght@400;500;600;700" },
  "Inter": { cat: "sans-serif", axis: "wght@400;500;600;700;800" },
  "Fredoka": { cat: "sans-serif", axis: "wght@400;500;600;700" },
  "Syne": { cat: "sans-serif", axis: "wght@400;500;600;700;800" },
  "Unbounded": { cat: "sans-serif", axis: "wght@400;500;600;700;800" },
  "Rammetto One": { cat: "display", axis: null },
  "Bagel Fat One": { cat: "display", axis: null },
  "JetBrains Mono": { cat: "monospace", axis: "wght@400;500;700" },
};

const FALLBACK = {
  serif: 'Georgia, "Times New Roman", serif',
  "sans-serif": 'system-ui, -apple-system, "Segoe UI", sans-serif',
  display: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  monospace: "ui-monospace, Menlo, monospace",
};
export const stack = (f) => `"${f}", ${FALLBACK[(FONTS[f] || FONTS.Inter).cat]}`;
export const stackSingle = (f) => stack(f).replace(/"/g, "'");

export function fontHref(families) {
  const fams = [...new Set(families)].filter((f) => FONTS[f]);
  return "https://fonts.googleapis.com/css2?" +
    fams.map((f) => `family=${f.replace(/ /g, "+")}${FONTS[f].axis ? ":" + FONTS[f].axis : ""}`).join("&") +
    "&display=swap";
}

// ---------- Definición de presets ----------
const base = (o) => ({
  brand: [],
  space: { unit: 4 },
  shape: { radius: 6, border: 1 },
  button: { density: "regular", upper: false, pill: false, weight: 600 },
  ...o,
});

const RAW = {
  // Base
  editorial: base({ label: "Editorial", name: "Atelier Norte",
    primary: { h: 158, c: 0.085 }, accent: { h: 52, c: 0.15 }, neutral: { h: 158, c: 0.012 },
    brand: ["#2E5D4B", "#C9853A", "#1B1F1D", "#F4F5F2"],
    type: { display: "Cormorant Garamond", body: "Manrope", base: 16, ratio: 1.333, lh: 1.6, headWeight: 500, tracking: -0.01 },
    shape: { radius: 3, border: 1 } }),
  clinico: base({ label: "Clínico", name: "Clínica Mar",
    primary: { h: 232, c: 0.13 }, accent: { h: 180, c: 0.1 }, neutral: { h: 232, c: 0.008 },
    type: { display: "IBM Plex Sans", body: "IBM Plex Sans", base: 16, ratio: 1.2, lh: 1.55, headWeight: 600, tracking: -0.015 },
    shape: { radius: 10, border: 1 }, button: { density: "comfortable", upper: false, pill: false, weight: 600 } }),
  estudio: base({ label: "Estudio", name: "Plano Studio",
    primary: { h: 280, c: 0.2 }, accent: { h: 110, c: 0.19 }, neutral: { h: 280, c: 0.004 },
    type: { display: "Syne", body: "DM Sans", base: 16, ratio: 1.414, lh: 1.5, headWeight: 700, tracking: -0.03 },
    space: { unit: 8 }, shape: { radius: 0, border: 2 }, button: { density: "compact", upper: true, pill: false, weight: 700 } }),

  // Inspirados en las referencias
  hospedaje: base({ label: "Hospedaje · salmón y teal", name: "Hospedaje",
    primary: { hex: "#FF5A5F" }, accent: { hex: "#008489" }, neutral: { h: 20, c: 0.003 },
    brand: ["#FF5A5F", "#008489", "#484848", "#736739", "#617D46", "#A21F54", "#A00904", "#D41A9C"],
    type: { display: "Nunito Sans", body: "Nunito Sans", base: 16, ratio: 1.25, lh: 1.55, headWeight: 800, tracking: -0.01 },
    space: { unit: 8 }, shape: { radius: 4, border: 1 }, button: { density: "regular", upper: false, pill: false, weight: 700 } }),
  lavanda: base({ label: "Lavanda y lima", name: "Kit Lavanda",
    primary: { hex: "#1A1A1A" }, accent: { hex: "#A99BF5" }, neutral: { h: 285, c: 0.012 },
    brand: ["#1A1A1A", "#B3A6F7", "#E4F37A", "#F7D774", "#EDEDF2"],
    type: { display: "Unbounded", body: "Manrope", base: 15, ratio: 1.25, lh: 1.55, headWeight: 700, tracking: -0.02 },
    shape: { radius: 16, border: 1 }, button: { density: "regular", upper: false, pill: true, weight: 700 } }),
  oficina: base({ label: "Azul sistema y naranja", name: "Oficina Azul",
    primary: { hex: "#0059FF" }, accent: { hex: "#FF651E" }, neutral: { h: 255, c: 0.01 },
    brand: ["#002D7A", "#0043C3", "#0059FF", "#D6E6FF", "#FF651E", "#FFA801", "#FFD98C", "#FFEFD2"],
    type: { display: "Outfit", body: "Outfit", base: 16, ratio: 1.25, lh: 1.55, headWeight: 700, tracking: -0.01 },
    shape: { radius: 16, border: 1 }, button: { density: "compact", upper: false, pill: true, weight: 600 } }),
  pastel: base({ label: "Data pastel", name: "Panel Pastel",
    primary: { hex: "#E9573F" }, accent: { hex: "#4E7A33" }, neutral: { h: 80, c: 0.012 },
    brand: ["#F25A3F", "#E1A1C9", "#4E7A33", "#94D9E1", "#F9AF20", "#0083BE"],
    type: { display: "Bricolage Grotesque", body: "DM Sans", base: 16, ratio: 1.2, lh: 1.55, headWeight: 700, tracking: -0.02 },
    shape: { radius: 24, border: 1 }, button: { density: "regular", upper: false, pill: true, weight: 600 } }),
  magenta: base({ label: "Magenta y navy", name: "Guía Fundación",
    primary: { hex: "#2B3990" }, accent: { hex: "#EC008C" }, neutral: { h: 100, c: 0.01 },
    brand: ["#EC008C", "#2B3990", "#000000", "#FFFFFF", "#D5D7E9", "#D4D4D4"],
    type: { display: "Noto Sans", body: "Noto Sans", base: 16, ratio: 1.25, lh: 1.6, headWeight: 600, tracking: -0.01 },
    shape: { radius: 4, border: 1 }, button: { density: "regular", upper: false, pill: false, weight: 600 } }),
  bistro: base({ label: "Bistró verde y coral", name: "Bistró del Barrio",
    primary: { hex: "#003D2F" }, accent: { hex: "#E8505B" }, neutral: { h: 75, c: 0.025 },
    brand: ["#1E1E1E", "#7A2E2F", "#C27A17", "#003D2F", "#E8505B", "#F7A600", "#D4F1C8", "#DE9A97", "#F6EBDD"],
    type: { display: "DM Serif Display", body: "Outfit", base: 16, ratio: 1.414, lh: 1.6, headWeight: 400, tracking: -0.01 },
    shape: { radius: 0, border: 1 }, button: { density: "regular", upper: false, pill: false, weight: 500 } }),
  civica: base({ label: "Estrategia cívica", name: "Estrategia Cívica",
    primary: { hex: "#5B78DC" }, accent: { hex: "#E86C1F" }, neutral: { h: 85, c: 0.02 },
    brand: ["#5B78DC", "#788A2E", "#E9B12A", "#E86C1F", "#0D2C7A", "#E8E2C8", "#FFFFFF", "#000000"],
    type: { display: "Fraunces", body: "Bricolage Grotesque", base: 16, ratio: 1.333, lh: 1.6, headWeight: 400, tracking: -0.02 },
    shape: { radius: 10, border: 1 }, button: { density: "regular", upper: true, pill: false, weight: 700 } }),
  jardin: base({ label: "Jardín botánico", name: "Jardín Secreto",
    primary: { hex: "#1F5E2E" }, accent: { hex: "#93B417" }, neutral: { h: 90, c: 0.018 },
    brand: ["#93B417", "#1F5E2E", "#F2A2BE", "#EFC11C", "#FFF8E8"],
    type: { display: "Barlow", body: "Barlow", base: 16, ratio: 1.333, lh: 1.55, headWeight: 600, tracking: -0.02 },
    shape: { radius: 18, border: 1 }, button: { density: "comfortable", upper: false, pill: false, weight: 600 } }),
  barsol: base({ label: "Bar retro verde y naranja", name: "Bar Solar",
    primary: { hex: "#1F6B3A" }, accent: { hex: "#F47A1F" }, neutral: { h: 85, c: 0.02 },
    brand: ["#1F6B3A", "#F47A1F", "#E6D9C3", "#EBEDE6"],
    type: { display: "Fraunces", body: "Barlow", base: 16, ratio: 1.333, lh: 1.55, headWeight: 700, tracking: -0.02 },
    shape: { radius: 6, border: 2 }, button: { density: "regular", upper: true, pill: false, weight: 700 } }),
  flor: base({ label: "Estudio floral", name: "Estudio Flor",
    primary: { hex: "#029B77" }, accent: { hex: "#DA571E" }, neutral: { h: 70, c: 0.022 },
    brand: ["#EFE7DA", "#029B77", "#FE8CC2", "#DA571E"],
    type: { display: "Fredoka", body: "Manrope", base: 16, ratio: 1.414, lh: 1.6, headWeight: 600, tracking: -0.01 },
    shape: { radius: 20, border: 1 }, button: { density: "regular", upper: false, pill: true, weight: 700 } }),
};

export const PRESET_GROUPS = [
  { label: "Base", keys: ["editorial", "clinico", "estudio"] },
  { label: "Inspirados en referencias", keys: ["hospedaje", "lavanda", "oficina", "pastel", "magenta", "bistro", "civica", "jardin", "barsol", "flor"] },
];

function normColor(c) {
  if (c.hex) {
    const o = hexToOklch(c.hex);
    return { h: Math.round(o.h), c: Math.min(0.3, Math.round(o.C * 1000) / 1000), anchor: c.hex.toUpperCase() };
  }
  return { h: c.h, c: c.c, anchor: null };
}

export function presetState(key) {
  const p = JSON.parse(JSON.stringify(RAW[key] || RAW.editorial));
  const { label, ...s } = p;
  s.primary = normColor(s.primary);
  s.accent = normColor(s.accent);
  return s;
}
export const presetLabel = (key) => (RAW[key] || RAW.editorial).label;
