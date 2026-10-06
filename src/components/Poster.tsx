import { format } from "date-fns"
import { nb } from "date-fns/locale"
import { fieldFont, type FieldFont, type Template } from "@/templates"

export const POSTER_WIDTH = 1920
export const POSTER_HEIGHT = 1080
const TITLE_LINE_HEIGHT = 90 / 78

export type PosterContent = {
  title: string
  subtitle: string
  date: Date
}

type PosterProps = {
  template: Template
  content: PosterContent
}

// Line height is set as a ratio on each text element, Satori misplaces text when a pixel line height is inherited by
// text in a different font.
const textStyle = (font: FieldFont, fontSize: number, color: string, lineHeight = 1) => ({
  fontFamily: font.family,
  fontWeight: font.weight,
  fontSize,
  lineHeight,
  color,
})

/**
 * The poster layout, rendered to SVG by Satori. Only use the subset of CSS that Satori supports:
 * https://github.com/vercel/satori#css
 */
export const Poster = ({ template, content }: PosterProps) => {
  const { colors } = template
  const dateFont = fieldFont(template, "date")

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        backgroundColor: colors.background,
      }}
    >
      {template.logos.map((logo, i) => (
        <img key={i} src={logo.src} width={logo.width} height={logo.height} style={{ position: "absolute", left: logo.x, top: logo.y }} />
      ))}

      <div style={{ position: "absolute", left: 1610, top: 52, display: "flex", flexDirection: "column" }}>
        <div style={textStyle(dateFont, 43, colors.date)}>{format(content.date, "EEEE", { locale: nb }).toUpperCase()}</div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 8 }}>
          <span style={textStyle(dateFont, 116, colors.date)}>{format(content.date, "dd")}</span>
          <span style={textStyle(dateFont, 48, colors.date)}>/{format(content.date, "MM")}</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 145,
          top: 410,
          width: 1630,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textAlign: "right",
          whiteSpace: "pre-wrap",
        }}
      >
        <div style={textStyle(fieldFont(template, "title"), 78, colors.title, TITLE_LINE_HEIGHT)}>{content.title.trim()}</div>
        {content.subtitle.trim() && (
          <div style={{ ...textStyle(fieldFont(template, "subtitle"), 78, colors.subtitle, TITLE_LINE_HEIGHT), marginTop: 14 }}>
            {content.subtitle.trim()}
          </div>
        )}
      </div>

      {template.footer && (
        <div style={{ ...textStyle(fieldFont(template, "footer"), 37, colors.footer), position: "absolute", left: 128, bottom: 64 }}>
          {template.footer}
        </div>
      )}

      {template.stripes && (
        <div style={{ position: "absolute", left: 0, bottom: 0, width: POSTER_WIDTH, height: 24, display: "flex" }}>
          {template.stripes.map((color, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: color }} />
          ))}
        </div>
      )}
    </div>
  )
}
