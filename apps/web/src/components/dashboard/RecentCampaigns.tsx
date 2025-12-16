import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Tiago.ev City Drive Conversions",
    status: "active",
    sent: 18250,
    delivered: 17640,
    read: 13210,
    date: "2024-06-18",
  },
  {
    id: 2,
    name: "Harrier & Safari 2024 Launch",
    status: "completed",
    sent: 15480,
    delivered: 14900,
    read: 12040,
    date: "2024-06-10",
  },
  {
    id: 3,
    name: "Service Loyalty Q2",
    status: "paused",
    sent: 9800,
    delivered: 9100,
    read: 6020,
    date: "2024-06-05",
  },
  {
    id: 4,
    name: "Fleet Safety Recall – Airbag Module",
    status: "scheduled",
    sent: 0,
    delivered: 0,
    read: 0,
    date: "2024-06-22",
  },
  {
    id: 5,
    name: "Dealer Engagement Pulse",
    status: "failed",
    sent: 4200,
    delivered: 2100,
    read: 860,
    date: "2024-06-02",
  },
];

export function RecentCampaigns() {
  return (
    <Card variant="elevated" className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Campaigns</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          View all <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
            >
              <div className="space-y-1">
                <p className="font-medium text-foreground">{campaign.name}</p>
                <p className="text-sm text-muted-foreground">{campaign.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {campaign.sent.toLocaleString()} sent
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {campaign.delivered.toLocaleString()} delivered
                  </p>
                </div>
                <Badge variant={campaign.status as any}>{campaign.status}</Badge>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
