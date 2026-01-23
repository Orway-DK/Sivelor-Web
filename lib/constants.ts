// lib\constants.ts

export type Channel = 'c' | 'm' | 'y' | 'k'
export type VariationMode = '2-axis' | '4-way'
export type OperationMode = 'add' | 'subtract'

export interface CMYK {
  c: number
  m: number
  y: number
  k: number
}

export interface PaperSize {
  id: string
  name: string
  w: number // mm
  h: number // mm
}

export interface TemplateSpec {
  id: string
  name: string
  type: 'none' | 'summa' | 'plotter'
  safeMarginTop: number
  safeMarginBottom: number
  safeMarginLeft: number
  safeMarginRight: number
}

export const TEMPLATE_PRESETS: TemplateSpec[] = [
  {
    id: 'none',
    name: 'Şablonsuz (Ham)',
    type: 'none',
    safeMarginTop: 5,
    safeMarginBottom: 5,
    safeMarginLeft: 5,
    safeMarginRight: 5
  },
  {
    id: 'summa',
    name: 'Summa (Etiket/Yarım Kesim)',
    type: 'summa',
    // Summa sensörleri için genelde üstten/alttan pay gerekir
    safeMarginTop: 15,
    safeMarginBottom: 15,
    safeMarginLeft: 10,
    safeMarginRight: 10
  },
  {
    id: 'plotter',
    name: 'Plotter (Standart Kesim)',
    type: 'plotter',
    // Plotter noktaları için paylar
    safeMarginTop: 10,
    safeMarginBottom: 10,
    safeMarginLeft: 10,
    safeMarginRight: 10
  }
]

// Renk Yardımcıları
export function cmykToRgbString (
  c: number,
  m: number,
  y: number,
  k: number
): string {
  const r = 255 * (1 - c / 100) * (1 - k / 100)
  const g = 255 * (1 - m / 100) * (1 - k / 100)
  const b = 255 * (1 - y / 100) * (1 - k / 100)
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

export function getContrastColor (
  c: number,
  m: number,
  y: number,
  k: number
): string {
  const totalInk = c + m + y + k
  return k > 50 || totalInk > 220 ? '#ffffff' : '#000000'
}

export interface PaperSize {
  id: string
  name: string
  w: number
  h: number
}

export const PAPER_PRESETS: PaperSize[] = [
  { id: 'xerox', name: 'Xerox / Standart (350x500mm)', w: 350, h: 500 },
  { id: 'konica', name: 'Konica (330x487mm)', w: 330, h: 487 },
  { id: '32x45', name: '32x45 (320x450mm)', w: 320, h: 450 }
]

export const SUMMA_CONFIGS: Record<string, any> = {
  xerox: {
    safeAreaW: 333,
    safeAreaH: 448,
    markerSize: 3,
    staticSide: 4.901,
    staticTop: 28.787,
    staticBottom: 13.9,
    barGap: 9.999,
    barHeight: 3
  },
  konica: {
    safeAreaW: 313,
    safeAreaH: 436,
    markerSize: 3,
    staticSide: 5,
    staticTop: 32.971,
    staticBottom: 10.029,
    barGap: 10.029,
    barHeight: 3
  },
  default: {
    safeAreaW: 300,
    safeAreaH: 400,
    markerSize: 3,
    staticSide: 5,
    staticTop: 30,
    staticBottom: 15,
    barGap: 10,
    barHeight: 3
  }
}

export const MACHINE_LIMITS = {
  none: null,
  plotter: {
    markerRadius: 5.0,
    centerOffset: 10
  }
}
