import { useMemo, useState } from "react"
import { nb } from "date-fns/locale"
import { builtInTemplates } from "./templates"
import { PosterPreview } from "./components/PosterPreview"
import { SubtitleField } from "./components/SubtitleField"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const App = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useLocalStorage("selected-template", builtInTemplates[0].id)
  const [subtitleDefaults, setSubtitleDefaults] = useLocalStorage<Record<string, string>>("subtitle-defaults", {})

  const template = builtInTemplates.find((t) => t.id === selectedTemplateId) ?? builtInTemplates[0]

  const [date, setDate] = useState(new Date())
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState(() => subtitleDefaults[template.id] ?? "")

  const content = useMemo(() => ({ title, subtitle, date }), [title, subtitle, date])

  const selectTemplate = (id: string) => {
    // Swap in the new template's default subtitle, unless the user has written something of their own
    if (subtitle === (subtitleDefaults[template.id] ?? "")) {
      setSubtitle(subtitleDefaults[id] ?? "")
    }
    setSelectedTemplateId(id)
  }

  const saveSubtitleDefault = (value: string | undefined) => {
    setSubtitleDefaults((defaults) => {
      const updated = { ...defaults }
      if (value === undefined) delete updated[template.id]
      else updated[template.id] = value
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Meetup Image Generator</h1>
          <p className="text-muted-foreground">Create beautiful meetup promotional images with ease.</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:[&>*:last-child]:col-start-2 md:[&>*:last-child]:row-start-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Customize your meetup image settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={template.id} onValueChange={selectTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {builtInTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                <Card className="flex justify-center">
                  <CardContent className="pt-6">
                    <Calendar
                      showWeekNumber
                      locale={nb}
                      weekStartsOn={1}
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      disabled={{ before: new Date() }}
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="md:sticky md:top-8 md:self-start">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Generated image preview and download</CardDescription>
            </CardHeader>
            <CardContent>
              <PosterPreview template={template} content={content} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
