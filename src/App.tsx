import { useEffect, useMemo, useRef, useState } from "react"
import { nb } from "date-fns/locale"
import { builtInTemplates, type Template } from "./templates"
import { PosterPreview } from "./components/PosterPreview"
import { SubtitleField } from "./components/SubtitleField"
import { TemplateEditor } from "./components/TemplateEditor"
import { TemplatePicker } from "./components/TemplatePicker"
import { SharePanel } from "./components/SharePanel"
import { ImportPanel } from "./components/ImportPanel"
import { codeFromLink, decodeTemplate, type ImportedTemplate } from "./lib/share"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

/** Compares everything but the id, ignoring key order and unset fields. */
const sameContent = (a: Template, b: Template) => {
  const normalize = (template: Template) =>
    JSON.stringify({ ...template, id: undefined }, (_, value) =>
      value && typeof value === "object" && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).sort()) : value,
    )
  return normalize(a) === normalize(b)
}

const App = () => {
  const [customTemplates, setCustomTemplates] = useLocalStorage<Template[]>("custom-templates", [])
  const [selectedTemplateId, setSelectedTemplateId] = useLocalStorage("selected-template", builtInTemplates[0].id)
  const [subtitleDefaults, setSubtitleDefaults] = useLocalStorage<Record<string, string>>("subtitle-defaults", {})

  const template = [...builtInTemplates, ...customTemplates].find((t) => t.id === selectedTemplateId) ?? builtInTemplates[0]

  const [date, setDate] = useState(new Date())
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState(() => subtitleDefaults[template.id] ?? "")
  const [panel, setPanel] = useState<"edit" | "share" | "import">()

  const content = useMemo(() => ({ title, subtitle, date }), [title, subtitle, date])

  const selectTemplate = (id: string) => {
    // Swap in the new template's default subtitle, unless the user has written something of their own
    if (subtitle === (subtitleDefaults[template.id] ?? "")) {
      setSubtitle(subtitleDefaults[id] ?? "")
    }
    setSelectedTemplateId(id)
    setPanel(undefined)
  }

  const saveSubtitleDefault = (value: string | undefined) => {
    setSubtitleDefaults((defaults) => {
      const updated = { ...defaults }
      if (value === undefined) delete updated[template.id]
      else updated[template.id] = value
      return updated
    })
  }

  const addTemplate = (added: Template) => {
    setCustomTemplates((templates) => [...templates, added])
    setSelectedTemplateId(added.id)
    setPanel("edit")
  }

  const importTemplate = ({ template: imported, subtitleDefault }: ImportedTemplate) => {
    // Opening the same link twice shouldn't give two copies
    const existing = customTemplates.find((t) => sameContent(t, imported))
    if (existing) {
      selectTemplate(existing.id)
      return
    }
    setCustomTemplates((templates) => [...templates, imported])
    if (subtitleDefault) setSubtitleDefaults((defaults) => ({ ...defaults, [imported.id]: subtitleDefault }))
    setSubtitle(subtitleDefault ?? "")
    setSelectedTemplateId(imported.id)
    setPanel(undefined)
  }

  // Import templates from share links, e.g. https://…/#template=<code>
  const importTemplateRef = useRef(importTemplate)
  importTemplateRef.current = importTemplate
  useEffect(() => {
    const code = codeFromLink(location.hash)
    if (!code) return
    history.replaceState(null, "", location.pathname + location.search)
    decodeTemplate(code)
      .then((imported) => importTemplateRef.current(imported))
      .catch((error: Error) => alert(`Could not import the shared template. ${error.message}`))
  }, [])

  const createTemplate = () => {
    addTemplate({
      id: `custom-${crypto.randomUUID()}`,
      name: "New template",
      colors: { background: "#ffffff", date: "#000000", title: "#2e2e2c", subtitle: "#81807d", footer: "#413f3f" },
      logos: [],
      custom: true,
    })
  }

  const duplicateTemplate = () => {
    const copy: Template = {
      ...structuredClone(template),
      id: `custom-${crypto.randomUUID()}`,
      name: `${template.name} (copy)`,
      custom: true,
    }
    if (subtitleDefaults[template.id]) setSubtitleDefaults((defaults) => ({ ...defaults, [copy.id]: defaults[template.id] }))
    addTemplate(copy)
  }

  const updateTemplate = (updated: Template) => {
    setCustomTemplates((templates) => templates.map((t) => (t.id === updated.id ? updated : t)))
  }

  const deleteTemplate = () => {
    if (!confirm(`Delete the template "${template.name}"?`)) return
    setCustomTemplates((templates) => templates.filter((t) => t.id !== template.id))
    saveSubtitleDefault(undefined)
    selectTemplate(builtInTemplates[0].id)
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Meetup Image Generator</h1>
          <p className="text-muted-foreground">Create beautiful meetup promotional images with ease.</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:[&>*:last-child]:col-start-2 md:[&>*:last-child]:row-start-1">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Customize your meetup image settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-2">
                <Label>Template</Label>
                <TemplatePicker
                  builtInTemplates={builtInTemplates}
                  customTemplates={customTemplates}
                  selected={template}
                  onSelect={selectTemplate}
                  onCreate={createTemplate}
                  onDuplicate={duplicateTemplate}
                  onImport={() => setPanel("import")}
                  onShare={() => setPanel(panel === "share" ? undefined : "share")}
                  onEdit={() => setPanel(panel === "edit" ? undefined : "edit")}
                  onDelete={deleteTemplate}
                />
              </div>

              {panel === "edit" && template.custom && (
                <TemplateEditor template={template} onChange={updateTemplate} onClose={() => setPanel(undefined)} />
              )}
              {panel === "share" && template.custom && (
                <SharePanel template={template} subtitleDefault={subtitleDefaults[template.id]} onClose={() => setPanel(undefined)} />
              )}
              {panel === "import" && <ImportPanel onImport={importTemplate} onClose={() => setPanel(undefined)} />}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Textarea id="title" rows={2} value={title} onChange={(e) => setTitle(e.target.value)} />
                <p className="text-sm text-muted-foreground">Long titles wrap automatically. Press Enter to force a line break.</p>
              </div>

              <SubtitleField
                value={subtitle}
                onChange={setSubtitle}
                savedDefault={subtitleDefaults[template.id]}
                onSaveDefault={saveSubtitleDefault}
                templateName={template.name}
              />

              <div className="space-y-2">
                <Label>Date</Label>
                <div className="flex justify-center rounded-xl border">
                  <Calendar
                    showWeekNumber
                    locale={nb}
                    weekStartsOn={1}
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    disabled={{ before: new Date() }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:sticky md:top-8 md:self-start">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Preview</CardTitle>
              <CardDescription>Generated image preview and download</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <PosterPreview template={template} content={content} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
