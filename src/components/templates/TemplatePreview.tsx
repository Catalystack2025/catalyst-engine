import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TemplateFormState } from "./TemplateForm";
import { Image, Play } from "lucide-react";

interface TemplatePreviewProps {
  value: TemplateFormState;
}

const variablePreview: Record<string, string> = {
  "1": "Customer",
  "2": "Order #1234",
  "3": "Tomorrow 2 PM",
};

const renderVariables = (text: string) =>
  text.replace(/{{(\d+)}}/g, (_, key) => variablePreview[key] || "Value");

export function TemplatePreview({ value }: TemplatePreviewProps) {
  return (
    <Card variant="elevated" className="h-full">
      <CardHeader>
        <CardTitle>Live preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mx-auto max-w-md rounded-[32px] bg-muted p-6 shadow-inner">
          <div className="rounded-3xl bg-background shadow-lg overflow-hidden">
            <div className="flex items-center gap-3 border-b px-4 py-3 bg-muted/60">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Customer" />
                <AvatarFallback>CU</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Customer</p>
                <p className="text-xs text-muted-foreground truncate">Online • WhatsApp</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {value.language}
              </Badge>
            </div>

            <div className="space-y-3 px-4 py-5 text-sm">
              {value.headerType === "text" && value.headerText && (
                <p className="font-semibold">{renderVariables(value.headerText)}</p>
              )}
              {value.headerType === "media" && (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                    <Image className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Media header</p>
                    <p className="truncate">Upload image, document, or video</p>
                  </div>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              <div className="rounded-2xl bg-muted/60 px-3 py-3 text-sm leading-relaxed whitespace-pre-line">
                {renderVariables(value.body) || "Body preview will appear here."}
              </div>

              {value.footer && (
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {value.footer}
                </p>
              )}

              {value.buttons.length > 0 && (
                <div className="space-y-2">
                  {value.buttons.map((button) => (
                    <button
                      key={button.id}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-center text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

