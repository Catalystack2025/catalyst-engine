import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import type { BadgeProps } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PlayCircle,
  PauseCircle,
  CalendarDays,
  Users,
  GitBranch,
} from "lucide-react";
import { CampaignRecord, CampaignStatus, sampleCampaigns } from "@/lib/sampleData";

const getStatusIcon = (status: CampaignStatus) => {
  switch (status) {
    case "active":
      return <Send className="h-4 w-4 text-primary animate-pulse" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "scheduled":
      return <Clock className="h-4 w-4 text-warning" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-destructive" />;
    case "paused":
      return <PauseCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
};

const statusToBadgeVariant = (status: CampaignStatus): BadgeProps["variant"] => status;

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(sampleCampaigns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">(
    "all"
  );
  const [formState, setFormState] = useState({
    name: "",
    audience: "",
    scheduledAt: "",
    message: "",
  });

  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter((campaign) => {
        const matchesSearch = campaign.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [campaigns, search, statusFilter]
  );

  const totals = useMemo(() => {
    const sent = campaigns.reduce((sum, c) => sum + c.sent, 0);
    const delivered = campaigns.reduce((sum, c) => sum + c.delivered, 0);
    const replied = campaigns.reduce((sum, c) => sum + c.replied, 0);
    return { sent, delivered, replied };
  }, [campaigns]);

  const handleCreateCampaign = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) return;

    const newCampaign: CampaignRecord = {
      id: Date.now(),
      name: formState.name,
      audience: formState.audience || "All contacts",
      status: formState.scheduledAt ? "scheduled" : "draft",
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      progress: 0,
      scheduledAt: formState.scheduledAt || null,
      message: formState.message,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setFormState({ name: "", audience: "", scheduledAt: "", message: "" });
  };

  const updateStatus = (id: number, status: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              status,
              progress: status === "completed" ? 100 : campaign.progress,
              sent: status === "completed" ? Math.max(campaign.sent, 1000) : campaign.sent,
              delivered:
                status === "completed"
                  ? Math.max(campaign.delivered, Math.floor(campaign.sent * 0.9))
                  : campaign.delivered,
              read:
                status === "completed"
                  ? Math.max(campaign.read, Math.floor(campaign.sent * 0.7))
                  : campaign.read,
              replied:
                status === "completed"
                  ? Math.max(campaign.replied, Math.floor(campaign.sent * 0.03))
                  : campaign.replied,
            }
          : campaign
      )
    );
  };

  const advanceProgress = (id: number) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              status: "active",
              progress: Math.min(100, campaign.progress + 20),
              sent: campaign.sent + 500,
              delivered: campaign.delivered + 480,
              read: campaign.read + 300,
              replied: campaign.replied + 12,
            }
          : campaign
      )
    );
  };

  return (
    <DashboardLayout
      title="Campaigns"
      subtitle="Create, schedule, and monitor your campaigns"
    >
      <Card variant="elevated" className="mb-6 animate-slide-up">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle>Campaign timeline</CardTitle>
            <p className="text-sm text-muted-foreground">
              Quickly scan each campaign title, then jump into a focused detail screen.
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <GitBranch className="h-4 w-4" />
            View flow
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="relative border-s border-border/70">
            {campaigns.map((campaign, index) => (
              <li key={campaign.id} className="ms-4 pb-6 last:pb-0">
                <span className="absolute -start-[10px] flex h-5 w-5 items-center justify-center rounded-full bg-background ring-4 ring-background">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{campaign.name}</p>
                      <Badge variant={statusToBadgeVariant(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.scheduledAt
                        ? `Scheduled ${new Date(campaign.scheduledAt).toLocaleString()}`
                        : "Draft timeline awaiting schedule"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {campaign.audience}
                    </Badge>
                    <Button size="sm" variant="outline" className="gap-2" asChild>
                      <Link to={`/campaigns/${campaign.id}`}>View campaign</Link>
                    </Button>
                  </div>
                </div>
                {index < campaigns.length - 1 && <div className="mt-4 h-px bg-border/60" />}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card variant="stat" className="animate-slide-up">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Messages sent</p>
              <p className="text-2xl font-semibold">{totals.sent.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivered</p>
              <p className="text-2xl font-semibold">
                {totals.delivered.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageWithReply />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Replies</p>
              <p className="text-2xl font-semibold">{totals.replied.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card variant="elevated" className="xl:col-span-2 animate-slide-up">
          <CardHeader>
            <CardTitle>Create campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreateCampaign}>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Campaign name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Re-engagement push"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Input
                  id="audience"
                  placeholder="VIP customers, Newsletter list, ..."
                  value={formState.audience}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, audience: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formState.scheduledAt}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, scheduledAt: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write the message customers will receive"
                  value={formState.message}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, message: event.target.value }))
                  }
                  rows={4}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" type="reset" onClick={() => setFormState({ name: "", audience: "", scheduledAt: "", message: "" })}>
                  Clear
                </Button>
                <Button type="submit" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Save campaign
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up xl:col-span-1" style={{ animationDelay: "50ms" }}>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as CampaignStatus | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Use filters to hone in on a specific audience or delivery stage before
              taking action.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredCampaigns.map((campaign, index) => (
          <Card
            key={campaign.id}
            variant="elevated"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                      {getStatusIcon(campaign.status)}
                    <Badge variant={statusToBadgeVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Audience: {campaign.audience}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.scheduledAt
                        ? `Scheduled for ${new Date(campaign.scheduledAt).toLocaleString()}`
                        : "Not scheduled"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {campaign.sent.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Sent</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {campaign.delivered.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {campaign.read.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Read</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {campaign.replied.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Replied</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => advanceProgress(campaign.id)}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Advance
                  </Button>
                    {campaign.status !== "draft" && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Report
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => updateStatus(campaign.id, "completed")}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => updateStatus(campaign.id, "paused")}
                  >
                    <PauseCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => updateStatus(campaign.id, "failed")}
                  >
                    <XCircle className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Delivery plan
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {campaign.scheduledAt
                      ? `Scheduled: ${new Date(campaign.scheduledAt).toLocaleString()}`
                      : "Send immediately once activated"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <Users className="h-4 w-4 text-primary" />
                    Message preview
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {campaign.message || "No message content added yet."}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border flex flex-col justify-center">
                  {(campaign.status === "active" || campaign.status === "paused") && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>
                  )}
                  {campaign.status === "completed" && (
                    <Badge variant="success" className="w-fit">Completed</Badge>
                  )}
                  {campaign.status === "failed" && (
                    <Badge variant="destructive" className="w-fit">Attention needed</Badge>
                  )}
                  {campaign.status === "draft" && (
                    <Badge variant="muted" className="w-fit">Draft not scheduled</Badge>
                  )}
                  {campaign.status === "scheduled" && (
                    <Badge variant="warning" className="w-fit">Ready to send</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

function MessageWithReply() {
  return (
    <div className="relative h-6 w-6">
      <Send className="h-4 w-4 text-primary absolute inset-0" />
      <CheckCircle className="h-3 w-3 text-success absolute -right-1 -bottom-1 bg-background rounded-full" />
    </div>
  );
}
