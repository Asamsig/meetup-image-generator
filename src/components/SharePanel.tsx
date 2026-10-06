import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { encodeTemplate, shareLink } from "@/lib/share"
import type { Template } from "@/templates"

type SharePanelProps = {
  template: Template
  subtitleDefault: string | undefined
  onClose: () => void
}

export const SharePanel = ({ template, subtitleDefault, onClose }: SharePanelProps) => {
  const [link, setLink] = useState<string>()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    encodeTemplate(template, subtitleDefault).then((code) => {
      if (!cancelled) setLink(shareLink(code))
    })
    return () => {
      cancelled = true
    }
  }, [template, subtitleDefault])

  const copy = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Share "{template.name}"</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Opening this link adds a copy of the template, including logo, fonts and default subtitle. You can also paste it into "Import
        template" in the template list.
      </p>
      <Textarea readOnly rows={3} className="font-mono text-xs" value={link ?? ""} onFocus={(e) => e.target.select()} />
      <Button onClick={copy} disabled={!link}>
        {copied ? <Check /> : <Copy />}
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  )
}
