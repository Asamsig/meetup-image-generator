import type { Font } from "satori"
import type { FieldFont } from "@/templates"

// Satori can't read woff2, so use the woff files. Only the files a poster uses are downloaded. The globs have to be
// written out per package, Vite doesn't follow pnpm's symlinked packages when the package name is a wildcard.
const families = [
  {
    id: "manrope",
    name: "Manrope",
    files: import.meta.glob<string>("/node_modules/@fontsource/manrope/files/manrope-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "inter",
    name: "Inter",
    files: import.meta.glob<string>("/node_modules/@fontsource/inter/files/inter-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "roboto",
    name: "Roboto",
    files: import.meta.glob<string>("/node_modules/@fontsource/roboto/files/roboto-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "arimo",
    name: "Arimo (like Arial)",
    files: import.meta.glob<string>("/node_modules/@fontsource/arimo/files/arimo-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "montserrat",
    name: "Montserrat",
    files: import.meta.glob<string>("/node_modules/@fontsource/montserrat/files/montserrat-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "poppins",
    name: "Poppins",
    files: import.meta.glob<string>("/node_modules/@fontsource/poppins/files/poppins-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    files: import.meta.glob<string>("/node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "playfair-display",
    name: "Playfair Display",
    files: import.meta.glob<string>("/node_modules/@fontsource/playfair-display/files/playfair-display-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "bebas-neue",
    name: "Bebas Neue",
    files: import.meta.glob<string>("/node_modules/@fontsource/bebas-neue/files/bebas-neue-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "orbitron",
    name: "Orbitron",
    files: import.meta.glob<string>("/node_modules/@fontsource/orbitron/files/orbitron-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
  {
    id: "jetbrains-mono",
    name: "JetBrains Mono",
    files: import.meta.glob<string>("/node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-[0-9]*-normal.woff", {
      query: "?url",
      import: "default",
      eager: true,
    }),
  },
]

export const fontFamilies = families.map(({ id, name }) => ({ id, name }))

export const weightNames: Record<number, string> = {
  100: "Thin",
  200: "Extra light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
  800: "Extra bold",
  900: "Black",
}

const fontUrls: Record<string, Record<number, string>> = {}
for (const { id, files } of families) {
  fontUrls[id] = {}
  for (const [path, url] of Object.entries(files)) {
    fontUrls[id][Number(path.match(/-latin-(\d+)-normal\.woff$/)![1])] = url
  }
}

export const availableWeights = (family: string) => Object.keys(fontUrls[family] ?? {}).map(Number)

/** The available weight closest to the one asked for, e.g. Bebas Neue only comes in 400. */
export const closestWeight = (family: string, weight: number) =>
  availableWeights(family).reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best))

const fontCache = new Map<string, Promise<Font>>()

const loadFont = (family: string, weight: number) => {
  const url = fontUrls[family][weight]
  if (!fontCache.has(url)) {
    fontCache.set(
      url,
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => ({ name: family, data, weight: weight as Font["weight"], style: "normal" as const })),
    )
  }
  return fontCache.get(url)!
}

export const loadFonts = (fonts: FieldFont[]) => {
  const unique = new Set(fonts.map((font) => `${font.family}:${closestWeight(font.family, font.weight)}`))
  return Promise.all(
    [...unique].map((key) => {
      const [family, weight] = key.split(":")
      return loadFont(family, Number(weight))
    }),
  )
}
