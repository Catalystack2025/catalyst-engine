import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", sent: 4000, delivered: 3800, read: 2400 },
  { name: "Tue", sent: 3000, delivered: 2900, read: 1398 },
  { name: "Wed", sent: 2000, delivered: 1980, read: 9800 },
  { name: "Thu", sent: 2780, delivered: 2700, read: 3908 },
  { name: "Fri", sent: 1890, delivered: 1850, read: 4800 },
  { name: "Sat", sent: 2390, delivered: 2300, read: 3800 },
  { name: "Sun", sent: 3490, delivered: 3400, read: 4300 },
];

export function AnalyticsChart() {
  return (
    <Card variant="elevated" className="animate-slide-up">
      <CardHeader>
        <CardTitle>Message Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 49%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 70%, 49%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(168, 75%, 31%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(168, 75%, 31%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.75rem",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="sent"
                stroke="hsl(142, 70%, 49%)"
                fillOpacity={1}
                fill="url(#colorSent)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="delivered"
                stroke="hsl(168, 75%, 31%)"
                fillOpacity={1}
                fill="url(#colorDelivered)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="read"
                stroke="hsl(199, 89%, 48%)"
                fillOpacity={1}
                fill="url(#colorRead)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-info" />
            <span className="text-sm text-muted-foreground">Read</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
