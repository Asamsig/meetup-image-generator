import type { TemplateLogo } from "@/templates"

const readAsDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

/**
 * Reads an uploaded image and fits it inside `box`, anchored to the top left corner. The image is redrawn at its final
 * size as PNG, so it's small enough for local storage, sharp for vector logos, and in a format Satori can draw.
 */
export const fileToLogo = async (file: File, box: Omit<TemplateLogo, "src">): Promise<TemplateLogo> => {
  const image = new Image()
  image.src = await readAsDataUrl(file)
  await image.decode()

  const naturalWidth = image.naturalWidth || box.width
  const naturalHeight = image.naturalHeight || box.height
  const fit = Math.min(box.width / naturalWidth, box.height / naturalHeight)
  const width = Math.round(naturalWidth * fit)
  const height = Math.round(naturalHeight * fit)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  canvas.getContext("2d")!.drawImage(image, 0, 0, width, height)

  return { src: canvas.toDataURL("image/png"), x: box.x, y: box.y, width, height }
}
