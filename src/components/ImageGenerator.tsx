import { useState } from "react"
import { SvgConverter } from "./SvgConverter"
import * as htmlToImage from "html-to-image"
import { Button } from "./ui/button"
import { TemplateArguments } from "../types"
import { TemplateOption } from "@/templates"

type ImageGeneratorProps = {
  template: TemplateOption
  templateArguments: TemplateArguments
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ template, templateArguments }) => {
  const [fullSizeImage, setFullSizeImage] = useState<HTMLElement | null>(null)

  const handleDownload = async () => {
    if (!fullSizeImage) return

    const clonedImage = fullSizeImage.cloneNode(true) as HTMLElement
    console.log(clonedImage.style.cssText)
    clonedImage.style.cssText = ""
    const dataUrl = await htmlToImage.toJpeg(clonedImage, {
      quality: 1.0,
      width: 1920,
      height: 1080,
    })

    // Format the filename using date and title
    const formattedDate = templateArguments.date.split("T")[0] // YYYY-MM-DD
    const sanitizedTitle = templateArguments.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const filename = `${template.id}-${formattedDate}-${sanitizedTitle}.jpg`.toLowerCase()

    const link = document.createElement("a")
    link.download = filename
    link.href = dataUrl
    link.click()
    clonedImage.remove()
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleDownload} disabled={!fullSizeImage}>
        Download Image
      </Button>
      <SvgConverter svgContent={template.content} templateArguments={templateArguments} onImageGenerated={setFullSizeImage} />
    </div>
  )
}
