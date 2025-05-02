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

    // Handle title wrapping and subtitle positioning
    const title = templateArguments.title || ""

    // Change back to 50 characters per line which worked well
    const titleLines = wrapTitleText(title, 50)
    const lineCount = titleLines.length

    // Create title with multiple tspans if needed
    if (lineCount > 1) {
      // First tspan is positioned at the original location
      let titleMarkup = `<tspan x="100%" dy="0">${titleLines[0]}</tspan>`

      // For subsequent lines, use a consistent line spacing
      const lineSpacing = 90 // Vertical space between lines

      // Add each subsequent line with proper spacing
      for (let i = 1; i < titleLines.length; i++) {
        titleMarkup += `<tspan x="100%" dy="${lineSpacing}">${titleLines[i]}</tspan>`
      }

      // Replace the title placeholder with our wrapped version
      processedSvg = processedSvg.replace(/{{title}}/g, titleMarkup)

      // Adjust subtitle position based on how many extra lines we have
      // Use the same line spacing value for consistency
      const subtitleYOffset = lineSpacing * (lineCount - 1)
      const newSubtitleTransform = `translate(-145 ${580.042 + subtitleYOffset})`
      processedSvg = processedSvg.replace(/transform="translate\(-145 580.042\)"/g, `transform="${newSubtitleTransform}"`)
    }

    // Handle all template variables
    Object.entries(templateArguments).forEach(([key, value]) => {
      // Skip title replacement if we already did it with wrapping
      if (key !== "title" || lineCount === 1) {
        processedSvg = processedSvg.replace(new RegExp(`{{${key}}}`, "g"), value)
      }
    })

    svgRef.current.innerHTML = processedSvg
    onImageUpdated(svgRef.current)
  }

  // Improved wrapping algorithm
  const wrapTitleText = (text: string, charsPerLine: number): string[] => {
    // If text is short enough, return as single line
    if (text.length <= charsPerLine) return [text]

    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      if (currentLine.length + word.length + 1 <= charsPerLine) {
        currentLine += ` ${word}`
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine)
    }

    return lines
  }

  useEffect(() => {
    updateImage()
  }, [svgContent, templateArguments])

  return <div ref={svgRef} />
}
