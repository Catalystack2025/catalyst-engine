import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateForm, TemplateFormState } from "@/components/templates/TemplateForm";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";

const initialTemplate: TemplateFormState = {
  name: "Flash Sale Reminder",
  category: "Marketing",
  language: "English",
  headerType: "text",
  headerText: "48-hour sale ends soon!",
  body: "Hi {{1}}, we saved a cart for you. Tap below to claim {{2}} off before it expires.",
  footer: "Reply STOP to opt out",
  buttons: [
    { id: 1, type: "cta", label: "View cart", url: "https://greenwave.app/cart" },
    { id: 2, type: "quick_reply", label: "Remind me tomorrow" },
  ],
};

export default function TemplateBuilder() {
  const [template, setTemplate] = useState<TemplateFormState>(initialTemplate);

  const handleChange = (updates: Partial<TemplateFormState>) => {
    setTemplate((prev) => ({ ...prev, ...updates }));
  };

  return (
    <DashboardLayout
      title="Create WhatsApp template"
      subtitle="Build compliant WhatsApp message templates with live previews"
    >
      <div className="mb-6 flex flex-col gap-3 justify-between md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/templates" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to library
            </Link>
          </Button>
          <Badge variant="success">Auto-saved draft</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CheckCircle2 className="h-4 w-4" /> Save draft
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" /> Submit for approval
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <TemplateForm value={template} onChange={handleChange} />
        <TemplatePreview value={template} />
      </div>

      <Card className="mt-6 bg-muted/30 border-dashed">
        <CardHeader>
          <CardTitle>Template guidelines</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3 text-sm text-muted-foreground">
          <div className="rounded-lg border bg-background/60 p-3">
            Keep bodies personal. Use placeholders ({`{{1}}`}, {`{{2}}`}) for names or codes and avoid spammy text.
          </div>
          <div className="rounded-lg border bg-background/60 p-3">
            Buttons support two CTAs plus three quick replies. Include URLs for CTAs to speed up approvals.
          </div>
          <div className="rounded-lg border bg-background/60 p-3">
            Provide translated variants per language and stay within channel policy to reduce rejection risk.
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

