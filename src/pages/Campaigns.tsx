import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  MoreHorizontal,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Summer Sale 2024",
    status: "active",
    sent: 12500,
    delivered: 12234,
    read: 8945,
    replied: 234,
    progress: 98,
    scheduledAt: "2024-01-15 10:00",
  },
  {
    id: 2,
    name: "New Product Launch",
    status: "completed",
    sent: 8500,
    delivered: 8320,
    read: 6120,
    replied: 456,
    progress: 100,
    scheduledAt: "2024-01-14 14:00",
  },
  {
    id: 3,
    name: "Weekly Newsletter",
    status: "sending",
    sent: 7500,
    delivered: 7200,
    read: 0,
    replied: 0,
    progress: 50,
    scheduledAt: "2024-01-16 09:00",
  },
  {
    id: 4,
    name: "Customer Feedback",
    status: "scheduled",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    progress: 0,
    scheduledAt: "2024-01-20 11:00",
  },
  {
    id: 5,
    name: "Holiday Greetings",
    status: "draft",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    progress: 0,
    scheduledAt: null,
  },
  {
    id: 6,
    name: "Failed Campaign Test",
    status: "failed",
    sent: 5000,
    delivered: 2500,
    read: 1000,
    replied: 50,
    progress: 50,
    scheduledAt: "2024-01-10 08:00",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
    case "sending":
      return <Send className="h-4 w-4 text-primary animate-pulse" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "scheduled":
      return <Clock className="h-4 w-4 text-warning" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

export default function Campaigns() {
  return (
    <DashboardLayout
      title="Campaigns"
      subtitle="Create and manage your broadcast campaigns"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-9" />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-4">
        {campaigns.map((campaign, index) => (
          <Card
            key={campaign.id}
            variant="elevated"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Campaign Info */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {campaign.name}
                      </h3>
                      {getStatusIcon(campaign.status)}
                      <Badge variant={campaign.status as any}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {campaign.scheduledAt
                        ? `Scheduled: ${campaign.scheduledAt}`
                        : "Not scheduled"}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-4 gap-4 text-center">
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
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {campaign.status !== "draft" && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Report
                    </Button>
                  )}
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {(campaign.status === "active" || campaign.status === "sending") && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-medium">{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
