import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Image,
  Video,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Welcome Message",
    type: "text",
    status: "approved",
    category: "Marketing",
    language: "English",
    lastModified: "2024-01-15",
  },
  {
    id: 2,
    name: "Order Confirmation",
    type: "text",
    status: "approved",
    category: "Utility",
    language: "English",
    lastModified: "2024-01-14",
  },
  {
    id: 3,
    name: "Product Catalog",
    type: "image",
    status: "pending",
    category: "Marketing",
    language: "English",
    lastModified: "2024-01-13",
  },
  {
    id: 4,
    name: "Video Tutorial",
    type: "video",
    status: "rejected",
    category: "Utility",
    language: "English",
    lastModified: "2024-01-12",
  },
  {
    id: 5,
    name: "Flash Sale Alert",
    type: "image",
    status: "approved",
    category: "Marketing",
    language: "English",
    lastModified: "2024-01-11",
  },
  {
    id: 6,
    name: "Appointment Reminder",
    type: "text",
    status: "draft",
    category: "Utility",
    language: "English",
    lastModified: "2024-01-10",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "image":
      return <Image className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />;
    case "pending":
      return <Clock className="h-4 w-4 text-warning" />;
    default:
      return null;
  }
};

export default function Templates() {
  return (
    <DashboardLayout
      title="Message Templates"
      subtitle="Create and manage your WhatsApp message templates"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-9" />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <Card
            key={template.id}
            variant="elevated"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  {getTypeIcon(template.type)}
                </div>
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {template.category}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(template.status)}
                  <Badge variant={template.status as any}>
                    {template.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {template.lastModified}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
