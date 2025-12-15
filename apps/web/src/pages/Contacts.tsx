import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Upload,
  Download,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  FilePlus,
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "active" | "inactive" | "blocked";
  tags: string[];
  lastContact: string;
  notes?: string;
}

const initialContacts: Contact[] = [
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
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Contact["status"] | "all">(
    "all"
  );
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    status: "active" as Contact["status"],
    tags: "",
    notes: "",
  });

  const stats = useMemo(() => {
    const total = contacts.length;
    const active = contacts.filter((c) => c.status === "active").length;
    const blocked = contacts.filter((c) => c.status === "blocked").length;
    return { total, active, blocked };
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = `${contact.name} ${contact.email} ${contact.phone}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  const addContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim() || !formState.phone.trim()) return;

    const newContact: Contact = {
      id: Date.now(),
      name: formState.name,
      phone: formState.phone,
      email: formState.email,
      status: formState.status,
      tags: formState.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      lastContact: new Date().toISOString().slice(0, 10),
      notes: formState.notes,
    };

    setContacts((prev) => [newContact, ...prev]);
    setFormState({ name: "", phone: "", email: "", status: "active", tags: "", notes: "" });
  };

  const updateStatus = (id: number, status: Contact["status"]) => {
    setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, status } : contact)));
  };

  return (
    <DashboardLayout
      title="Contacts"
      subtitle="Manage your contact list, segments, and onboarding"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card variant="stat" className="animate-slide-up">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
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
              <p className="text-2xl font-bold">{stats.active.toLocaleString()}</p>
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
              <p className="text-2xl font-bold">{stats.blocked.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Blocked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card variant="elevated" className="xl:col-span-2 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Quick add contact</CardTitle>
              <p className="text-sm text-muted-foreground">
                Capture new leads or customers and instantly place them into campaigns.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <FilePlus className="h-4 w-4" />
              CSV import available soon
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={addContact}>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Jane Doe"
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formState.phone}
                  onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formState.email}
                  onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, status: value as Contact["status"] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Comma separated e.g. VIP, Lead"
                  value={formState.tags}
                  onChange={(event) => setFormState((prev) => ({ ...prev, tags: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Context, preferences, or next steps"
                  value={formState.notes}
                  onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="reset" variant="outline" onClick={() => setFormState({ name: "", phone: "", email: "", status: "active", tags: "", notes: "" })}>
                  Clear
                </Button>
                <Button type="submit" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add contact
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardHeader>
            <CardTitle>Search & filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as Contact["status"] | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 w-full">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="gap-2 w-full">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" className="animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contacts</CardTitle>
          <p className="text-sm text-muted-foreground">{filteredContacts.length} visible</p>
        </CardHeader>
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
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden xl:table-cell">
                    Notes
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
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
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Last contact: {contact.lastContact}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{contact.phone}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">
                      {contact.email}
                    </td>
                    <td className="p-4">
                      <Badge variant={contact.status as any}>{contact.status}</Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags.map((tag) => (
                          <Badge key={tag} variant="muted">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden xl:table-cell max-w-xs">
                      {contact.notes || "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {contact.status !== "active" && (
                          <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={() => updateStatus(contact.id, "active")}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {contact.status !== "blocked" && (
                          <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={() => updateStatus(contact.id, "blocked")}
                          >
                            <UserX className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
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
