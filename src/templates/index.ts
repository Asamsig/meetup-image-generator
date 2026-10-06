import bartjsLogo from "@/assets/logos/bartjs.png?inline"
import javabinLogo from "@/assets/logos/javabin.jpg?inline"
import nnugLogo from "@/assets/logos/nnug.png?inline"
import type { FieldFont, Template, TextField } from "./types"

export type { FieldFont, Template, TemplateColors, TemplateLogo, TextField } from "./types"

export const defaultFonts: Record<TextField, FieldFont> = {
  date: { family: "manrope", weight: 700 },
  title: { family: "manrope", weight: 400 },
  subtitle: { family: "manrope", weight: 400 },
  footer: { family: "arimo", weight: 400 },
}

export const fieldFont = (template: Template, field: TextField) => template.fonts?.[field] ?? defaultFonts[field]

/** Shared templates refer to these by name instead of embedding the image. */
export const builtInLogos: Record<string, string> = {
  javabin: javabinLogo,
  bartjs: bartjsLogo,
  nnug: nnugLogo,
}

const brand = {
  javabin: "#2a9cde",
  bartjs: "#f7df1e",
  nnug: "#002e62",
}

export const builtInTemplates: Template[] = [
  {
    id: "javabin",
    name: "javaBin Meetup",
    colors: { background: "#ffffff", date: "#000000", title: brand.javabin, subtitle: "#81807d", footer: "#413f3f" },
    logos: [{ src: javabinLogo, x: 23, y: 83, width: 579, height: 195 }],
    footer: "java.no",
  },
  {
    id: "bartjs",
    name: "BartJS Meetup",
    colors: { background: brand.bartjs, date: "#2e2e2c", title: "#2e2e2c", subtitle: "#706f6c", footer: "#2e2e2c" },
    logos: [{ src: bartjsLogo, x: 15, y: 20, width: 336, height: 335 }],
  },
  {
    id: "nnug",
    name: "NNUG Meetup",
    colors: { background: "#ffffff", date: brand.nnug, title: brand.nnug, subtitle: "#81807d", footer: brand.nnug },
    logos: [{ src: nnugLogo, x: 60, y: 70, width: 518, height: 202 }],
  },
  {
    id: "felles",
    name: "Fellesmeetup (javaBin, BartJS, NNUG)",
    colors: { background: "#ffffff", date: "#000000", title: "#2e2e2c", subtitle: "#81807d", footer: "#413f3f" },
    logos: [
      { src: javabinLogo, x: 60, y: 70, width: 416, height: 140 },
      { src: bartjsLogo, x: 536, y: 70, width: 140, height: 140 },
      { src: nnugLogo, x: 736, y: 70, width: 359, height: 140 },
    ],
    stripes: [brand.javabin, brand.bartjs, brand.nnug],
  },
]
