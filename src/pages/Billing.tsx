import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Download,
  Check,
  Zap,
  MessageSquare,
  Users,
  FileText,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For small businesses getting started",
    features: [
      "5,000 messages/month",
      "1,000 contacts",
      "5 message templates",
      "Basic analytics",
      "Email support",
    ],
    current: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing businesses",
    features: [
      "25,000 messages/month",
      "10,000 contacts",
      "Unlimited templates",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large scale operations",
    features: [
      "Unlimited messages",
      "Unlimited contacts",
      "Unlimited templates",
      "Custom analytics",
      "24/7 phone support",
      "Dedicated account manager",
      "Custom integrations",
    ],
    current: false,
  },
];

const invoices = [
  { id: "INV-001", date: "Jan 15, 2024", amount: "$79.00", status: "paid" },
  { id: "INV-002", date: "Dec 15, 2023", amount: "$79.00", status: "paid" },
  { id: "INV-003", date: "Nov 15, 2023", amount: "$79.00", status: "paid" },
  { id: "INV-004", date: "Oct 15, 2023", amount: "$79.00", status: "paid" },
];

export default function Billing() {
  return (
    <DashboardLayout
      title="Billing & Subscription"
      subtitle="Manage your plan and payment methods"
    >
      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card variant="stat" className="animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages Used</p>
                <p className="text-2xl font-bold">18,432 / 25,000</p>
              </div>
            </div>
            <Progress value={73} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">73% of monthly limit</p>
          </CardContent>
        </Card>

        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contacts</p>
                <p className="text-2xl font-bold">7,234 / 10,000</p>
              </div>
            </div>
            <Progress value={72} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">72% of plan limit</p>
          </CardContent>
        </Card>

        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">24 / ∞</p>
              </div>
            </div>
            <Progress value={100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Unlimited templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans */}
      <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan, index) => (
          <Card
            key={plan.name}
            variant={plan.current ? "glow" : "elevated"}
            className={`animate-slide-up relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.current && (
                  <Badge variant="success">Current Plan</Badge>
                )}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.current ? "outline" : "default"}
                className="w-full mt-6"
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card variant="elevated" className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{invoice.amount}</span>
                    <Badge variant="success">{invoice.status}</Badge>
                    <Button variant="ghost" size="icon-sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
