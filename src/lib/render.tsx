import satori, { type Font } from "satori"
import manrope400 from "@fontsource/manrope/files/manrope-latin-400-normal.woff?url"
import manrope700 from "@fontsource/manrope/files/manrope-latin-700-normal.woff?url"
import { Poster, POSTER_HEIGHT, POSTER_WIDTH, type PosterContent } from "@/components/Poster"
import type { Template } from "@/templates"

const loadFont = async (url: string, weight: Font["weight"]): Promise<Font> => ({
  name: "Manrope",
  data: await fetch(url).then((res) => res.arrayBuffer()),
  weight,
  style: "normal",
})

let fontsPromise: Promise<Font[]> | undefined

const loadFonts = () => {
  fontsPromise ??= Promise.all([loadFont(manrope400, 400), loadFont(manrope700, 700)])
  return fontsPromise
}

/** Renders the poster to a self-contained SVG string, with all text converted to paths. */
export const renderPosterSvg = async (template: Template, content: PosterContent) =>
  satori(<Poster template={template} content={content} />, {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    fonts: await loadFonts(),
  })

export const svgToJpeg = async (svg: string): Promise<Blob> => {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
  try {
    const image = new Image()
    image.src = url
    await image.decode()

    const canvas = document.createElement("canvas")
    canvas.width = POSTER_WIDTH
    canvas.height = POSTER_HEIGHT
    canvas.getContext("2d")!.drawImage(image, 0, 0, POSTER_WIDTH, POSTER_HEIGHT)

    return await new Promise((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))), "image/jpeg", 0.95),
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}
