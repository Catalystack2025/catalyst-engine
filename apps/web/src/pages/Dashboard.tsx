import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { Send, Users, MessageSquare, CheckCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your messaging overview."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Messages Sent"
          value="47,730"
          change="Sum across launch, EV, service, and recall journeys"
          changeType="positive"
          icon={Send}
        />
        <StatCard
          title="Total Contacts"
          value="5"
          change="EV leads, fleet partners, and dealer managers"
          changeType="neutral"
          icon={Users}
        />
        <StatCard
          title="Active Campaigns"
          value="3"
          change="Active, paused, and scheduled recall flows"
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Delivery Rate"
          value="91.6%"
          change="Across EV and launch audiences"
          changeType="positive"
          icon={CheckCircle}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsChart />
          <RecentCampaigns />
        </div>
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
