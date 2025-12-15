import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Summer Sale Announcement",
    status: "active",
    sent: 12500,
    delivered: 12234,
    read: 8945,
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "New Product Launch",
    status: "delivered",
    sent: 8500,
    delivered: 8320,
    read: 6120,
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Weekly Newsletter",
    status: "sent",
    sent: 15000,
    delivered: 14850,
    read: 0,
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Flash Sale Reminder",
    status: "draft",
    sent: 0,
    delivered: 0,
    read: 0,
    date: "2024-01-12",
  },
  {
    id: 5,
    name: "Customer Feedback Request",
    status: "failed",
    sent: 5000,
    delivered: 3200,
    read: 1500,
    date: "2024-01-11",
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
