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

export type Template = {
  id: string
  name: string
  colors: TemplateColors
  logos: TemplateLogo[]
  /** Small text in the bottom left corner, e.g. a website. */
  footer?: string
}
