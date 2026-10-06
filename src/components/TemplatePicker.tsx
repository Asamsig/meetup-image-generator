import { Copy, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Template } from "@/templates"

// Kept apart from template ids
const CREATE = "action:create"

type TemplatePickerProps = {
  builtInTemplates: Template[]
  customTemplates: Template[]
  selected: Template
  onSelect: (id: string) => void
  onCreate: () => void
  onDuplicate: () => void
  onEdit: () => void
  onDelete: () => void
}

export const TemplatePicker = ({
  builtInTemplates,
  customTemplates,
  selected,
  onSelect,
  onCreate,
  onDuplicate,
  onEdit,
  onDelete,
}: TemplatePickerProps) => (
  <div className="flex gap-2">
    <Select
      value={selected.id}
      onValueChange={(value) => {
        if (value === CREATE) onCreate()
        else onSelect(value)
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {builtInTemplates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectGroup>
        {customTemplates.length > 0 && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Your templates</SelectLabel>
              {customTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </>
        )}
        <SelectSeparator />
        <SelectItem value={CREATE}>
          <span className="flex items-center gap-2">
            <Plus className="size-4" />
            Create new template
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
    <Button variant="outline" size="icon" onClick={onCreate} title="Create a new template">
      <Plus />
    </Button>
    <Button variant="outline" size="icon" onClick={onDuplicate} title="Create a custom template based on this one">
      <Copy />
    </Button>
    {selected.custom && (
      <>
        <Button variant="outline" size="icon" onClick={onEdit} title="Edit template">
          <Pencil />
        </Button>
        <Button variant="outline" size="icon" onClick={onDelete} title="Delete template">
          <Trash2 />
        </Button>
      </>
    )}
  </div>
)
