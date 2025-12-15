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
          value="45,231"
          change="+20.1% from last month"
          changeType="positive"
          icon={Send}
        />
        <StatCard
          title="Total Contacts"
          value="12,847"
          change="+180 this week"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Active Campaigns"
          value="8"
          change="3 scheduled"
          changeType="neutral"
          icon={MessageSquare}
        />
        <StatCard
          title="Delivery Rate"
          value="98.2%"
          change="+0.5% from last week"
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
