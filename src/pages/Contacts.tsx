import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  Upload,
  Download,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "+1 234 567 8901",
    email: "sarah@example.com",
    status: "active",
    tags: ["VIP", "Customer"],
    lastContact: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    phone: "+1 234 567 8902",
    email: "michael@example.com",
    status: "active",
    tags: ["Lead"],
    lastContact: "2024-01-14",
  },
  {
    id: 3,
    name: "Emily Davis",
    phone: "+1 234 567 8903",
    email: "emily@example.com",
    status: "inactive",
    tags: ["Customer"],
    lastContact: "2024-01-10",
  },
  {
    id: 4,
    name: "James Wilson",
    phone: "+1 234 567 8904",
    email: "james@example.com",
    status: "active",
    tags: ["VIP", "Partner"],
    lastContact: "2024-01-13",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    phone: "+1 234 567 8905",
    email: "lisa@example.com",
    status: "blocked",
    tags: [],
    lastContact: "2024-01-05",
  },
];

export default function Contacts() {
  return (
    <DashboardLayout
      title="Contacts"
      subtitle="Manage your contact list and segments"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card variant="stat" className="animate-slide-up">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">12,847</p>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">11,234</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <UserX className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">89</p>
              <p className="text-sm text-muted-foreground">Blocked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search contacts..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Contacts Table */}
      <Card variant="elevated" className="animate-slide-up">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-left">
                    <Checkbox />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Phone
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Email
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                    Tags
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                  >
                    <td className="p-4">
                      <Checkbox />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="font-medium">{contact.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{contact.phone}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">
                      {contact.email}
                    </td>
                    <td className="p-4">
                      <Badge variant={contact.status as any}>
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {contact.tags.map((tag) => (
                          <Badge key={tag} variant="muted">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
