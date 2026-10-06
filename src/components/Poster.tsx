import { format } from "date-fns"
import { nb } from "date-fns/locale"
import type { Template } from "@/templates"

export const POSTER_WIDTH = 1920
export const POSTER_HEIGHT = 1080

export type PosterContent = {
  title: string
  subtitle: string
  date: Date
}

type PosterProps = {
  template: Template
  content: PosterContent
}

/**
 * The poster layout, rendered to SVG by Satori. Only use the subset of CSS that Satori supports:
 * https://github.com/vercel/satori#css
 */
export const Poster = ({ template, content }: PosterProps) => {
  const { colors } = template

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        backgroundColor: colors.background,
        fontFamily: "Manrope",
      }}
    >
      {template.logos.map((logo, i) => (
        <img key={i} src={logo.src} width={logo.width} height={logo.height} style={{ position: "absolute", left: logo.x, top: logo.y }} />
      ))}

      <div
        style={{
          position: "absolute",
          left: 1610,
          top: 52,
          display: "flex",
          flexDirection: "column",
          color: colors.date,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        <div style={{ fontSize: 43 }}>{format(content.date, "EEEE", { locale: nb }).toUpperCase()}</div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 8 }}>
          <span style={{ fontSize: 116 }}>{format(content.date, "dd")}</span>
          <span style={{ fontSize: 48 }}>/{format(content.date, "MM")}</span>
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
          fontSize: 78,
          lineHeight: "90px",
          textAlign: "right",
          whiteSpace: "pre-wrap",
        }}
      >
        <div style={{ color: colors.title }}>{content.title.trim()}</div>
        {content.subtitle.trim() && <div style={{ color: colors.subtitle, marginTop: 14 }}>{content.subtitle.trim()}</div>}
      </div>

      {template.footer && (
        <div style={{ position: "absolute", left: 128, bottom: 64, fontSize: 37, color: colors.footer }}>{template.footer}</div>
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
