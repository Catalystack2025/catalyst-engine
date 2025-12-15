import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

export type TemplateHeaderType = "none" | "text" | "media";
export type TemplateButtonType = "cta" | "quick_reply";

export interface TemplateButton {
  id: number;
  type: TemplateButtonType;
  label: string;
  url?: string;
}

export interface TemplateFormState {
  name: string;
  category: string;
  language: string;
  headerType: TemplateHeaderType;
  headerText: string;
  body: string;
  footer?: string;
  buttons: TemplateButton[];
}

interface TemplateFormProps {
  value: TemplateFormState;
  onChange: (updates: Partial<TemplateFormState>) => void;
}

export function TemplateForm({ value, onChange }: TemplateFormProps) {
  const [newButton, setNewButton] = useState({
    type: "cta" as TemplateButtonType,
    label: "",
    url: "",
  });

  const handleButtonAdd = () => {
    if (!newButton.label.trim()) return;
    const button: TemplateButton = {
      id: Date.now(),
      type: newButton.type,
      label: newButton.label,
      url: newButton.type === "cta" ? newButton.url : undefined,
    };
    onChange({ buttons: [...value.buttons, button] });
    setNewButton({ type: newButton.type, label: "", url: "" });
  };

  const handleButtonRemove = (id: number) => {
    onChange({ buttons: value.buttons.filter((button) => button.id !== id) });
  };

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Template basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template name</Label>
              <Input
                id="name"
                placeholder="Summer promo reminder"
                value={value.name}
                onChange={(event) => onChange({ name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={value.category}
                onValueChange={(category) => onChange({ category })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Utility">Utility</SelectItem>
                  <SelectItem value="Authentication">Authentication</SelectItem>
                  <SelectItem value="Alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={value.language}
                onValueChange={(language) => onChange({ language })}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headerType">Header type</Label>
              <Select
                value={value.headerType}
                onValueChange={(headerType: TemplateHeaderType) =>
                  onChange({ headerType, headerText: headerType === "text" ? value.headerText : "" })
                }
              >
                <SelectTrigger id="headerType">
                  <SelectValue placeholder="Choose header" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {value.headerType === "text" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="headerText">Header text</Label>
                <Input
                  id="headerText"
                  placeholder="Limited time offer"
                  value={value.headerText}
                  onChange={(event) => onChange({ headerText: event.target.value })}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body">Body text</Label>
              <Badge variant="outline">Supports variables like {`{{1}}`}</Badge>
            </div>
            <Textarea
              id="body"
              placeholder="Hi {{1}}, your order is ready for pickup at {{2}}."
              className="min-h-[140px]"
              value={value.body}
              onChange={(event) => onChange({ body: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer">Footer (optional)</Label>
            <Input
              id="footer"
              placeholder="Reply STOP to opt out"
              value={value.footer || ""}
              onChange={(event) => onChange({ footer: event.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Button type</Label>
              <Select
                value={newButton.type}
                onValueChange={(type: TemplateButtonType) =>
                  setNewButton((prev) => ({ ...prev, type }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pick type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cta">Call to action</SelectItem>
                  <SelectItem value="quick_reply">Quick reply</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder="View offer"
                value={newButton.label}
                onChange={(event) =>
                  setNewButton((prev) => ({ ...prev, label: event.target.value }))
                }
              />
            </div>
            {newButton.type === "cta" && (
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  placeholder="https://example.com"
                  value={newButton.url}
                  onChange={(event) =>
                    setNewButton((prev) => ({ ...prev, url: event.target.value }))
                  }
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Add up to 3 buttons. Quick replies are best for short responses.
            </p>
            <Button size="sm" className="gap-2" onClick={handleButtonAdd}>
              <Plus className="h-4 w-4" /> Add button
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {value.buttons.map((button) => (
              <div
                key={button.id}
                className="flex items-center justify-between rounded-lg border bg-muted/40 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{button.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {button.type === "cta" ? `CTA · ${button.url || "Link TBD"}` : "Quick reply"}
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleButtonRemove(button.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {value.buttons.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No buttons added yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

