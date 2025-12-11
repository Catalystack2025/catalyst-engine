import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  audience: string;
  status: "draft" | "scheduled" | "active" | "completed" | "failed" | "paused";
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  progress: number;
  scheduledAt: string | null;
  message: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Summer Sale 2024",
    audience: "VIP customers",
    status: "active",
    sent: 12500,
    delivered: 12234,
    read: 8945,
    replied: 234,
    progress: 98,
    scheduledAt: "2024-01-15T10:00",
    message: "Don't miss our mid-season offers ending soon!",
  },
  {
    id: 2,
    name: "New Product Launch",
    audience: "All subscribers",
    status: "completed",
    sent: 8500,
    delivered: 8320,
    read: 6120,
    replied: 456,
    progress: 100,
    scheduledAt: "2024-01-14T14:00",
    message: "Introducing our latest release with exclusive pricing.",
  },
  {
    id: 3,
    name: "Weekly Newsletter",
    audience: "Newsletter list",
    status: "paused",
    sent: 7500,
    delivered: 7200,
    read: 4300,
    replied: 120,
    progress: 50,
    scheduledAt: "2024-01-16T09:00",
    message: "Your curated updates for the week ahead.",
  },
  {
    id: 4,
    name: "Customer Feedback",
    audience: "Recent purchasers",
    status: "scheduled",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    progress: 0,
    scheduledAt: "2024-01-20T11:00",
    message: "Tell us how we did and claim a reward!",
  },
  {
    id: 5,
    name: "Holiday Greetings",
    audience: "All customers",
    status: "draft",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    progress: 0,
    scheduledAt: null,
    message: "Warm wishes and thank you for being with us.",
  },
  {
    id: 6,
    name: "Failed Campaign Test",
    audience: "QA cohort",
    status: "failed",
    sent: 5000,
    delivered: 2500,
    read: 1000,
    replied: 50,
    progress: 50,
    scheduledAt: "2024-01-10T08:00",
    message: "Testing deliverability after infra changes.",
  },
];

const getStatusIcon = (status: Campaign["status"]) => {
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

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Campaign["status"] | "all">(
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
        const matchesStatus =
          statusFilter === "all" || campaign.status === statusFilter;
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

    const newCampaign: Campaign = {
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

  const updateStatus = (id: number, status: Campaign["status"]) => {
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
                onValueChange={(value) => setStatusFilter(value as Campaign["status"] | "all")}
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
                      <Badge variant={campaign.status as any}>{campaign.status}</Badge>
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
