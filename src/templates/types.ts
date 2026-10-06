export type TemplateLogo = {
  src: string
  x: number
  y: number
  width: number
  height: number
}

export type TemplateColors = {
  background: string
  date: string
  title: string
  subtitle: string
  footer: string
}

export type TextField = "date" | "title" | "subtitle" | "footer"

export type FieldFont = {
  /** One of `fontFamilies` in src/lib/fonts.ts */
  family: string
  weight: number
}

export type Template = {
  id: string
  name: string
  colors: TemplateColors
  logos: TemplateLogo[]
  /** Falls back to `defaultFonts` for fields that aren't set. */
  fonts?: Partial<Record<TextField, FieldFont>>
  /** Small text in the bottom left corner, e.g. a website. */
  footer?: string
  /** Colored bands along the bottom edge, drawn left to right. */
  stripes?: string[]
  /** Created by the user and stored in local storage. */
  custom?: boolean
}
