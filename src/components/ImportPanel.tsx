import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { decodeTemplate, type ImportedTemplate } from "@/lib/share"

type ImportPanelProps = {
  onImport: (imported: ImportedTemplate) => void
  onClose: () => void
}

export const ImportPanel = ({ onImport, onClose }: ImportPanelProps) => {
  const [input, setInput] = useState("")
  const [error, setError] = useState<string>()

  const handleImport = async () => {
    try {
      onImport(await decodeTemplate(input))
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Import template</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
      <Textarea
        rows={3}
        className="font-mono text-xs"
        placeholder="Paste a share link or code"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setError(undefined)
        }}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleImport} disabled={!input.trim()}>
        Import
      </Button>
    </div>
  )
}
