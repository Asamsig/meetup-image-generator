import satori from "satori"
import { Poster, POSTER_HEIGHT, POSTER_WIDTH, type PosterContent } from "@/components/Poster"
import { loadFonts } from "@/lib/fonts"
import { fieldFont, type Template, type TextField } from "@/templates"

const fields: TextField[] = ["date", "title", "subtitle", "footer"]

/** Renders the poster to a self-contained SVG string, with all text converted to paths. */
export const renderPosterSvg = async (template: Template, content: PosterContent) =>
  satori(<Poster template={template} content={content} />, {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    fonts: await loadFonts(fields.map((field) => fieldFont(template, field))),
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
