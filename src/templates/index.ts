import bartjsTemplate from "../assets/bartjs-meetup-template.svg?raw"
import javabinTemplate from "../assets/javabin-meetup-template.svg?raw"

export type TemplateOption = {
  id: string
  name: string
  content: string
}

export const templates: TemplateOption[] = [
  {
    id: "javabin",
    name: "javaBin Meetup",
    content: javabinTemplate,
  },
  {
    id: "bartjs",
    name: "BartJS Meetup",
    content: bartjsTemplate,
  },
]
