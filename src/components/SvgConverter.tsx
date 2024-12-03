import { useEffect, useRef } from "react"

type SvgConverterProps = {
  svgContent: string
  templateArguments: Record<string, string>
  onImageGenerated: (svgElement: HTMLDivElement) => void
}

export const SvgConverter: React.FC<SvgConverterProps> = ({ svgContent, templateArguments, onImageGenerated: onImageUpdated }) => {
  const svgRef = useRef<HTMLDivElement | null>(null)

  const updateImage = async () => {
    if (!svgRef.current) return

    let processedSvg = svgContent
    Object.entries(templateArguments).forEach(([key, value]) => {
      processedSvg = processedSvg.replace(new RegExp(`{{${key}}}`, "g"), value)
    })

    svgRef.current.innerHTML = processedSvg
    onImageUpdated(svgRef.current)
  }

  useEffect(() => {
    updateImage()
  }, [svgContent, templateArguments])

  return <div ref={svgRef} />
}
