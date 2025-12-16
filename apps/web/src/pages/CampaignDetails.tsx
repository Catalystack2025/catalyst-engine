import { useMemo, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CheckCircle,
  Clock,
  GitBranch,
  Send,
  Target,
  Users,
} from "lucide-react";
import { CampaignRecord, sampleCampaigns } from "@/lib/sampleData";

const steps = [
  "Draft created",
  "Audience locked",
  "Template finalized",
  "Delivery scheduled",
  "Live",
];

const statusToBadgeVariant = (status: CampaignRecord["status"]): BadgeProps["variant"] => status;

export default function CampaignDetails() {
  const { id } = useParams();
  const campaign = useMemo<CampaignRecord | undefined>(
    () => sampleCampaigns.find((entry) => String(entry.id) === id),
    [id]
  );

  const progressStep = useMemo(() => {
    if (!campaign) return 1;
    if (campaign.status === "draft") return 1;
    if (campaign.status === "scheduled") return 3;
    if (campaign.status === "active") return 4;
    return 5;
  }, [campaign]);

  if (!campaign) {
    return (
      <DashboardLayout title="Campaign not found" subtitle="Return to the campaign list to try again">
        <Card className="animate-slide-up">
          <CardContent className="p-6 space-y-3">
            <p className="text-muted-foreground">We could not locate that campaign.</p>
            <Button asChild>
              <Link to="/campaigns">Back to campaigns</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Campaign • ${campaign.name}`}
      subtitle="A focused view of delivery, audience, and content"
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button variant="ghost" className="gap-2" asChild>
          <Link to="/campaigns">
            <ArrowLeft className="h-4 w-4" /> Back to campaigns
          </Link>
        </Button>
        <Badge variant={statusToBadgeVariant(campaign.status)} className="capitalize">
          {campaign.status}
        </Badge>
        <Badge variant="outline">Audience: {campaign.audience}</Badge>
        {campaign.scheduledAt && (
          <Badge variant="muted" className="gap-1">
            <Clock className="h-3 w-3" /> {new Date(campaign.scheduledAt).toLocaleString()}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card variant="elevated" className="xl:col-span-2 animate-slide-up">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">Delivery overview</CardTitle>
              <p className="text-sm text-muted-foreground">Timeline separated from the main list for deeper inspection.</p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/automation">
                <GitBranch className="h-4 w-4" /> Automation flow
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricTile label="Sent" value={campaign.sent} icon={<Send className="h-4 w-4 text-primary" />} />
              <MetricTile label="Delivered" value={campaign.delivered} icon={<CheckCircle className="h-4 w-4 text-success" />} />
              <MetricTile label="Read" value={campaign.read} icon={<BarChart3 className="h-4 w-4 text-primary" />} />
              <MetricTile label="Replied" value={campaign.replied} icon={<Users className="h-4 w-4 text-primary" />} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Timeline progress</span>
                <span className="font-medium">{campaign.progress}%</span>
              </div>
              <Progress value={campaign.progress} className="h-2" />
            </div>
            <div className="rounded-lg border p-4 space-y-3">
              <p className="text-sm font-medium">Campaign steps</p>
              <ol className="relative ms-5 space-y-4 border-s border-border/70">
                {steps.map((step, index) => (
                  <li key={step} className="ps-3">
                    <span
                      className={`absolute -start-[10px] h-2.5 w-2.5 rounded-full ${
                        index + 1 <= progressStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className={index + 1 <= progressStep ? "text-foreground" : "text-muted-foreground"}>{step}</span>
                      <Badge variant={index + 1 <= progressStep ? "success" : "muted"}>
                        {index + 1 <= progressStep ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "60ms" }}>
          <CardHeader>
            <CardTitle>Message & intent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-dashed bg-muted/40 p-3 text-sm text-foreground">
              {campaign.message}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              {campaign.objective}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Need to adjust something?</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/templates">Swap template</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/follow-ups">Schedule follow-up</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle>Activity timeline</CardTitle>
            <p className="text-sm text-muted-foreground">
              Titles stay tidy in the timeline while details live on this screen.
            </p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/campaigns">
              <CalendarDays className="h-4 w-4" /> Back to timeline
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-medium">Scheduled window</p>
              <p className="text-sm text-muted-foreground">
                {campaign.scheduledAt
                  ? new Date(campaign.scheduledAt).toLocaleString()
                  : "Send immediately when activated"}
              </p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-medium">Audience note</p>
              <p className="text-sm text-muted-foreground">{campaign.audience}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <Badge variant="muted">Timeline separated</Badge>
            <Badge variant="outline">Deep dive screen</Badge>
            <Badge variant="muted">Automation ready</Badge>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

function MetricTile({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-lg font-semibold text-foreground">{value.toLocaleString()}</p>
    </div>
  );
}
