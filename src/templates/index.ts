import bartjsLogo from "@/assets/logos/bartjs.png?inline"
import javabinLogo from "@/assets/logos/javabin.jpg?inline"
import type { Template } from "./types"

export type { Template, TemplateColors, TemplateLogo } from "./types"

const brand = {
  javabin: "#2a9cde",
  bartjs: "#f7df1e",
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
]
