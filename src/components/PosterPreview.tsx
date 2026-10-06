import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { slugify } from "@/lib/text"
import { format } from "date-fns"
import type { PosterContent } from "./Poster"
import type { Template } from "@/templates"

// Satori is large, so load it separately from the rest of the app
const loadRenderer = () => import("@/lib/render")

type PosterPreviewProps = {
  template: Template
  content: PosterContent
}

export const PosterPreview = ({ template, content }: PosterPreviewProps) => {
  const [svg, setSvg] = useState<string>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let cancelled = false
    loadRenderer()
      .then(({ renderPosterSvg }) => renderPosterSvg(template, content))
      .then((svg) => {
        if (cancelled) return
        setSvg(svg)
        setError(undefined)
      })
      .catch((error: unknown) => {
        console.error(error)
        if (!cancelled) setError(String(error))
      })
    return () => {
      cancelled = true
    }
  }, [template, content])

  const handleDownload = async () => {
    if (!svg) return
    const filename = [template.id, format(content.date, "yyyy-MM-dd"), slugify(content.title).slice(0, 60).replace(/-$/, "")]
      .filter(Boolean)
      .join("-")

    const { svgToJpeg } = await loadRenderer()
    const url = URL.createObjectURL(await svgToJpeg(svg))
    const link = document.createElement("a")
    link.download = `${filename}.jpg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleDownload} disabled={!svg}>
        <Download />
        Download image
      </Button>
      {error && <p className="text-sm text-destructive">Could not render the image: {error}</p>}
      <div className="aspect-video overflow-hidden rounded-md border">
        {svg && <img className="h-full w-full" src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} alt="Preview" />}
      </div>
    </div>
  )
}
