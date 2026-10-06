import { Fragment, useRef } from "react"
import { ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { availableWeights, closestWeight, fontFamilies, weightNames } from "@/lib/fonts"
import { fileToLogo } from "@/lib/image"
import { fieldFont, type FieldFont, type Template, type TemplateColors, type TextField } from "@/templates"

const LOGO_BOX = { x: 40, y: 40, width: 600, height: 320 }

const colorFields: { key: keyof TemplateColors; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "title", label: "Title" },
  { key: "subtitle", label: "Subtitle" },
  { key: "date", label: "Date" },
  { key: "footer", label: "Footer" },
]

const fontFields: { key: TextField; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "subtitle", label: "Subtitle" },
  { key: "date", label: "Date" },
  { key: "footer", label: "Footer" },
]

type TemplateEditorProps = {
  template: Template
  onChange: (template: Template) => void
  onClose: () => void
}

export const TemplateEditor = ({ template, onChange, onClose }: TemplateEditorProps) => {
  const fileInput = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (file: File | undefined) => {
    if (!file) return
    try {
      onChange({ ...template, logos: [await fileToLogo(file, LOGO_BOX)] })
    } catch (error) {
      console.error(error)
      alert("Could not read the image.")
    }
  }

  const setFont = (field: TextField, font: FieldFont) => onChange({ ...template, fonts: { ...template.fonts, [field]: font } })

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Edit template</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-name">Name</Label>
        <Input id="template-name" value={template.name} onChange={(e) => onChange({ ...template, name: e.target.value })} />
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
        {colorFields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`color-${key}`}>{label}</Label>
            <input
              id={`color-${key}`}
              type="color"
              className="h-9 w-full cursor-pointer rounded-md border bg-transparent"
              value={template.colors[key]}
              onChange={(e) => onChange({ ...template, colors: { ...template.colors, [key]: e.target.value } })}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Fonts</Label>
        <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-2">
          {fontFields.map(({ key, label }) => {
            const font = fieldFont(template, key)
            return (
              <Fragment key={key}>
                <span className="pr-2 text-sm">{label}</span>
                <Select
                  value={font.family}
                  onValueChange={(family) => setFont(key, { ...font, family, weight: closestWeight(family, font.weight) })}
                >
                  <SelectTrigger aria-label={`${label} font`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((family) => (
                      <SelectItem key={family.id} value={family.id}>
                        {family.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={String(font.weight)} onValueChange={(weight) => setFont(key, { ...font, weight: Number(weight) })}>
                  <SelectTrigger aria-label={`${label} weight`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWeights(font.family).map((weight) => (
                      <SelectItem key={weight} value={String(weight)}>
                        {weightNames[weight]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Fragment>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-footer">Footer</Label>
        <Input
          id="template-footer"
          placeholder="java.no"
          value={template.footer ?? ""}
          onChange={(e) => onChange({ ...template, footer: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fileInput.current?.click()}>
            <ImagePlus />
            Upload logo
          </Button>
          {template.logos.length > 0 && (
            <Button variant="outline" onClick={() => onChange({ ...template, logos: [] })}>
              <X />
              Remove logo{template.logos.length > 1 && "s"}
            </Button>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleLogoUpload(e.target.files?.[0])
            e.target.value = ""
          }}
        />
        <p className="text-sm text-muted-foreground">Replaces the current logos. Placed in the top left corner.</p>
      </div>
    </div>
  )
}
