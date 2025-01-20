import { useState } from "react"
import { templates } from "./templates"
import { ImageGenerator } from "./components/ImageGenerator"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TemplateArguments } from "./types"
import { nb } from "date-fns/locale"
import { format } from "date-fns"

const App = () => {
  const [date, setDate] = useState(new Date())
  const [title, setTitle] = useState("")
  const [secondaryTitle, setSecondaryTitle] = useState("")
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id)

  const templateArguments: TemplateArguments = {
    dateDay: String(date.getDate()).padStart(2, "0"),
    dateMonth: String(date.getMonth() + 1).padStart(2, "0"),
    day: date.toLocaleString("no-NO", { weekday: "long" }).toUpperCase(),
    title,
    secondaryTitle,
    date: format(date, "yyyy-MM-dd"),
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)!

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Meetup Image Generator</h1>
          <p className="text-muted-foreground">Create beautiful meetup promotional images with ease.</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:[&>*:last-child]:col-start-2 md:[&>*:last-child]:row-start-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Customize your meetup image settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={secondaryTitle} onChange={(e) => setSecondaryTitle(e.target.value)} />
              </div>

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
                      disabled={(date) => date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)}
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Generated image preview and download</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGenerator template={selectedTemplate} templateArguments={templateArguments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
