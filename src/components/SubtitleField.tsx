import { Bookmark, RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SubtitleFieldProps = {
  value: string
  onChange: (value: string) => void
  savedDefault: string | undefined
  onSaveDefault: (value: string | undefined) => void
  templateName: string
}

export const SubtitleField = ({ value, onChange, savedDefault, onSaveDefault, templateName }: SubtitleFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="subtitle">Subtitle</Label>
    <Input id="subtitle" placeholder="Venue 17.00" value={value} onChange={(e) => onChange(e.target.value)} />
    <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      <span className="mr-auto">
        {savedDefault ? (
          <>
            Default for {templateName}: <span className="text-foreground">{savedDefault}</span>
          </>
        ) : (
          <>No default subtitle saved for {templateName}</>
        )}
      </span>
      {value.trim() && value !== savedDefault && (
        <Button variant="ghost" size="sm" onClick={() => onSaveDefault(value)}>
          <Bookmark />
          Save as default
        </Button>
      )}
      {savedDefault && value !== savedDefault && (
        <Button variant="ghost" size="sm" onClick={() => onChange(savedDefault)}>
          <RotateCcw />
          Use default
        </Button>
      )}
      {savedDefault && (
        <Button variant="ghost" size="sm" onClick={() => onSaveDefault(undefined)}>
          <X />
          Clear default
        </Button>
      )}
    </div>
  </div>
)
