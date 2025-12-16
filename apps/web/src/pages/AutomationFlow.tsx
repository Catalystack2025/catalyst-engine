import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlarmClock,
  GitBranch,
  MessageCircle,
  Plus,
  Sparkles,
  Workflow,
} from "lucide-react";
import { sampleContacts, sampleTemplates } from "@/lib/sampleData";

interface Condition {
  id: number;
  field: string;
  operator: string;
  value: string;
}

export default function AutomationFlow() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(sampleTemplates[0]?.id ?? 1);
  const [conditions, setConditions] = useState<Condition[]>([
    { id: 1, field: "Tag", operator: "is", value: "VIP" },
    { id: 2, field: "Last reply", operator: "greater than", value: "7 days" },
  ]);
  const [message, setMessage] = useState("Send a thank-you note and an optional coupon if the customer has not replied.");
  const selectedTemplate = useMemo(
    () => sampleTemplates.find((template) => template.id === selectedTemplateId),
    [selectedTemplateId]
  );

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { id: Date.now(), field: "Channel", operator: "is", value: "WhatsApp" },
    ]);
  };

  const updateCondition = (id: number, key: keyof Condition, value: string) => {
    setConditions((prev) => prev.map((condition) => (condition.id === id ? { ...condition, [key]: value } : condition)));
  };

  const removeCondition = (id: number) => {
    setConditions((prev) => prev.filter((condition) => condition.id !== id));
  };

  return (
    <DashboardLayout
      title="Automation flow"
      subtitle="Select templates, add branching, and deliver messages on autopilot"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card variant="elevated" className="xl:col-span-2 animate-slide-up">
          <CardHeader>
            <CardTitle>Flow configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={String(selectedTemplateId)} onValueChange={(value) => setSelectedTemplateId(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleTemplates.map((template) => (
                      <SelectItem key={template.id} value={String(template.id)}>
                        {template.name} • {template.language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Send after</Label>
                <Input placeholder="e.g. 5 minutes" defaultValue="2 hours" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Message variation</Label>
                <Textarea
                  value={message}
                  rows={3}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Describe the automation action"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Conditions</p>
                <Button variant="outline" size="sm" className="gap-2" onClick={addCondition}>
                  <Plus className="h-4 w-4" /> Add condition
                </Button>
              </div>
              <div className="space-y-3">
                {conditions.map((condition) => (
                  <div key={condition.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-3 rounded-lg border bg-muted/40">
                    <div className="space-y-1">
                      <Label className="text-xs">Field</Label>
                      <Select
                        value={condition.field}
                        onValueChange={(value) => updateCondition(condition.id, "field", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tag">Tag</SelectItem>
                          <SelectItem value="Last reply">Last reply</SelectItem>
                          <SelectItem value="Channel">Channel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="is">is</SelectItem>
                          <SelectItem value="is not">is not</SelectItem>
                          <SelectItem value="greater than">greater than</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Value</Label>
                      <Input
                        value={condition.value}
                        onChange={(event) => updateCondition(condition.id, "value", event.target.value)}
                        placeholder="Type value"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(condition.id)}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "60ms" }}>
          <CardHeader>
            <CardTitle>Flow preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Workflow className="h-4 w-4" />
              The automation will watch {conditions.length} conditions and trigger one template.
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="muted" className="gap-1">
                  <Sparkles className="h-3 w-3" /> Template
                </Badge>
                <p className="text-sm text-foreground">{selectedTemplate?.name}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                {message}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Example contacts</p>
                <div className="flex flex-wrap gap-2">
                  {sampleContacts.slice(0, 3).map((contact) => (
                    <Badge key={contact.id} variant="outline">
                      {contact.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <p className="text-sm font-medium">Flow steps</p>
              <ol className="relative ms-5 space-y-4 border-s border-border/70">
                <li className="ps-3">
                  <span className="absolute -start-[10px] h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="flex items-center justify-between text-sm">
                    <span>Wait until conditions are true</span>
                    <Badge variant="muted">{conditions.length} checks</Badge>
                  </div>
                </li>
                <li className="ps-3">
                  <span className="absolute -start-[10px] h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="flex items-center justify-between text-sm">
                    <span>Send template</span>
                    <Badge variant="outline">{selectedTemplate?.language}</Badge>
                  </div>
                </li>
                <li className="ps-3">
                  <span className="absolute -start-[10px] h-2.5 w-2.5 rounded-full bg-muted" />
                  <div className="flex items-center justify-between text-sm">
                    <span>Monitor replies</span>
                    <Badge variant="muted" className="gap-1">
                      <MessageCircle className="h-3 w-3" /> follow-ups
                    </Badge>
                  </div>
                </li>
              </ol>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlarmClock className="h-4 w-4" />
                Automations run continuously; edits publish instantly.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/templates">Use a different template</Link>
                </Button>
                <Button className="gap-2">
                  <GitBranch className="h-4 w-4" /> Save flow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
