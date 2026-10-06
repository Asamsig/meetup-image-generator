import { fontFamilies } from "@/lib/fonts"
import { builtInLogos, type FieldFont, type Template, type TemplateColors, type TemplateLogo, type TextField } from "@/templates"

/** What goes into a share code. Bump `v` if the format changes in a way old codes can't be read with. */
type SharedTemplate = {
  v: 1
  template: Omit<Template, "id" | "custom">
  subtitleDefault?: string
}

export type ImportedTemplate = {
  template: Template
  subtitleDefault?: string
}

const BUILT_IN_LOGO_PREFIX = "builtin:"

const toBase64Url = (bytes: Uint8Array) => {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

const fromBase64Url = (text: string) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))

const transform = async (bytes: Uint8Array, stream: CompressionStream | DecompressionStream) =>
  new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer())

export const encodeTemplate = async (template: Template, subtitleDefault?: string) => {
  const builtInNames = Object.fromEntries(Object.entries(builtInLogos).map(([name, src]) => [src, name]))
  const shared: SharedTemplate = {
    v: 1,
    template: {
      name: template.name,
      colors: template.colors,
      logos: template.logos.map((logo) => ({
        ...logo,
        src: builtInNames[logo.src] ? BUILT_IN_LOGO_PREFIX + builtInNames[logo.src] : logo.src,
      })),
      fonts: template.fonts,
      footer: template.footer,
      stripes: template.stripes,
    },
    subtitleDefault,
  }
  const json = new TextEncoder().encode(JSON.stringify(shared))
  return toBase64Url(await transform(json, new CompressionStream("deflate-raw")))
}

export const shareLink = (code: string) => `${location.origin}${location.pathname}#template=${code}`

/** Reads the share code out of a share link, or returns undefined if it isn't one. */
export const codeFromLink = (text: string) => text.match(/#template=([\w-]+)/)?.[1]

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null

const colorKeys: (keyof TemplateColors)[] = ["background", "date", "title", "subtitle", "footer"]
const textFields: TextField[] = ["date", "title", "subtitle", "footer"]
const knownFamilies = new Set(fontFamilies.map((family) => family.id))

const parseLogo = (value: unknown): TemplateLogo => {
  if (!isRecord(value) || typeof value.src !== "string") throw new Error("Invalid logo")
  const { x, y, width, height } = value
  if (![x, y, width, height].every((n) => typeof n === "number")) throw new Error("Invalid logo position")

  let src = value.src
  if (src.startsWith(BUILT_IN_LOGO_PREFIX)) {
    src = builtInLogos[src.slice(BUILT_IN_LOGO_PREFIX.length)]
    if (!src) throw new Error("Unknown logo")
  } else if (!src.startsWith("data:image/")) {
    throw new Error("Logos must be embedded images")
  }
  return { src, x: x as number, y: y as number, width: width as number, height: height as number }
}

const parseFonts = (value: unknown) => {
  if (!isRecord(value)) return undefined
  const fonts: Partial<Record<TextField, FieldFont>> = {}
  for (const field of textFields) {
    const font = value[field]
    // Skip fonts this version of the app doesn't have, they fall back to the defaults
    if (isRecord(font) && typeof font.family === "string" && knownFamilies.has(font.family) && typeof font.weight === "number") {
      fonts[field] = { family: font.family, weight: font.weight }
    }
  }
  return fonts
}

const parseTemplate = (value: unknown): Omit<Template, "id" | "custom"> => {
  if (!isRecord(value) || typeof value.name !== "string" || !isRecord(value.colors) || !Array.isArray(value.logos)) {
    throw new Error("Invalid template")
  }
  const colors = value.colors
  if (!colorKeys.every((key) => typeof colors[key] === "string")) throw new Error("Invalid colors")

  return {
    name: value.name,
    colors: Object.fromEntries(colorKeys.map((key) => [key, colors[key]])) as TemplateColors,
    logos: value.logos.map(parseLogo),
    fonts: parseFonts(value.fonts),
    footer: typeof value.footer === "string" ? value.footer : undefined,
    stripes: Array.isArray(value.stripes) ? value.stripes.filter((color): color is string => typeof color === "string") : undefined,
  }
}

/** Accepts a share link or a bare share code. Throws if it can't be read. */
export const decodeTemplate = async (input: string): Promise<ImportedTemplate> => {
  const code = codeFromLink(input) ?? input.trim()
  let shared: unknown
  try {
    const json = await transform(fromBase64Url(code), new DecompressionStream("deflate-raw"))
    shared = JSON.parse(new TextDecoder().decode(json))
  } catch {
    throw new Error("This doesn't look like a template share code.")
  }
  if (!isRecord(shared) || shared.v !== 1) throw new Error("This share code is from a newer version of the app, try reloading.")

  return {
    template: { ...parseTemplate(shared.template), id: `custom-${crypto.randomUUID()}`, custom: true },
    subtitleDefault: typeof shared.subtitleDefault === "string" ? shared.subtitleDefault : undefined,
  }
}
