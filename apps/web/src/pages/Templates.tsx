import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Languages,
  CheckCircle,
  Clock3,
  XCircle,
  Copy,
  Eye,
  Pencil,
} from "lucide-react";

type TemplateStatus = "approved" | "draft" | "pending" | "rejected";

interface Template {
  id: number;
  name: string;
  category: string;
  language: string;
  status: TemplateStatus;
  lastUpdated: string;
  bodyPreview: string;
  usage: string;
}

const templates: Template[] = [
  {
    id: 1,
    name: "Welcome Aboard",
    category: "Marketing",
    language: "English",
    status: "approved",
    lastUpdated: "2024-02-04",
    bodyPreview: "Hi {{1}}, welcome to Greenwave! Tap below to set preferences.",
    usage: "High engagement", 
  },
  {
    id: 2,
    name: "Order Ready",
    category: "Utility",
    language: "English",
    status: "approved",
    lastUpdated: "2024-02-02",
    bodyPreview: "Hi {{1}}, your order {{2}} is ready for pickup at {{3}}.",
    usage: "Sent 12.4K times",
  },
  {
    id: 3,
    name: "Payment Reminder",
    category: "Alert",
    language: "Spanish",
    status: "pending",
    lastUpdated: "2024-01-30",
    bodyPreview: "Hola {{1}}, tu pago vence el {{2}}. Usa el enlace para pagar.",
    usage: "In review",
  },
  {
    id: 4,
    name: "NPS Feedback",
    category: "Marketing",
    language: "English",
    status: "draft",
    lastUpdated: "2024-01-28",
    bodyPreview: "Hi {{1}}, quick favor: rate us from 1-5 so we can improve.",
    usage: "Draft",
  },
  {
    id: 5,
    name: "Login Code",
    category: "Authentication",
    language: "French",
    status: "approved",
    lastUpdated: "2024-01-24",
    bodyPreview: "Bonjour {{1}}, votre code de connexion est {{2}}.",
    usage: "99% delivery",
  },
  {
    id: 6,
    name: "Upsell Bundle",
    category: "Marketing",
    language: "English",
    status: "rejected",
    lastUpdated: "2024-01-20",
    bodyPreview: "Hi {{1}}, unlock 15% off when you add this bundle to your order.",
    usage: "Needs edits",
  },
];

const getStatusIcon = (status: TemplateStatus) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "pending":
      return <Clock3 className="h-4 w-4 text-warning" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TemplateStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");

  const stats = useMemo(() => {
    const total = templates.length;
    const approved = templates.filter((template) => template.status === "approved").length;
    const drafts = templates.filter((template) => template.status === "draft").length;
    return { total, approved, drafts };
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = `${template.name} ${template.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || template.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || template.category === categoryFilter;
      const matchesLanguage =
        languageFilter === "all" || template.language === languageFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesLanguage;
    });
  }, [searchTerm, statusFilter, categoryFilter, languageFilter]);

  return (
    <DashboardLayout
      title="WhatsApp Templates"
      subtitle="Search, filter, and create message templates ready for approval"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card variant="stat" className="animate-slide-up">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Templates in library</p>
          </CardContent>
        </Card>
        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{stats.approved}</p>
            <p className="text-sm text-muted-foreground">Approved and ready</p>
          </CardContent>
        </Card>
        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{stats.drafts}</p>
            <p className="text-sm text-muted-foreground">Drafts to finish</p>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" className="mb-6 animate-slide-up">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates by name or category"
                className="pl-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TemplateStatus | "all")}> 
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Utility">Utility</SelectItem>
                <SelectItem value="Authentication">Authentication</SelectItem>
                <SelectItem value="Alert">Alert</SelectItem>
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/templates/create">
                <FileText className="h-4 w-4" /> Builder
              </Link>
            </Button>
            <Button className="gap-2" asChild>
              <Link to="/templates/create">
                <Plus className="h-4 w-4" /> Create template
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTemplates.map((template, index) => {
          const canEdit = template.status === "draft" || template.status === "rejected";
          return (
            <Card
              key={template.id}
              variant="elevated"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="muted" className="gap-1">
                      <Languages className="h-3 w-3" /> {template.language}
                    </Badge>
                    <Badge variant="outline">{template.category}</Badge>
                    <span className="text-muted-foreground">Updated {template.lastUpdated}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="h-4 w-4" /> View
                    </DropdownMenuItem>
                    {canEdit && (
                      <DropdownMenuItem className="gap-2">
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="gap-2">
                      <Copy className="h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(template.status)}
                  <Badge variant={template.status} className="capitalize">
                    {template.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{template.usage}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.bodyPreview}
                </p>
                {canEdit && (
                  <div className="rounded-md border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    Draft or rejected templates can be edited before resubmission.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filteredTemplates.length === 0 && (
          <Card className="md:col-span-2 xl:col-span-3 text-center py-8">
            <CardContent className="space-y-3">
              <CardTitle>No templates found</CardTitle>
              <p className="text-sm text-muted-foreground">
                Adjust your filters or create a new WhatsApp template from scratch.
              </p>
              <Button asChild>
                <Link to="/templates/create">Start a template</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

