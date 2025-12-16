import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Plus,
  Clock3,
  Users,
  Filter,
  Tags,
} from "lucide-react";
import { sampleCampaigns, sampleContacts } from "@/lib/sampleData";

interface FollowUp {
  id: number;
  campaignId: number;
  contactId: number;
  notes: string;
  dueAt: string;
  status: "scheduled" | "done" | "overdue";
  priority: "low" | "medium" | "high";
}

const campaigns = sampleCampaigns.map((campaign) => ({ id: campaign.id, name: campaign.name }));
const contacts = sampleContacts.map((contact) => ({ id: contact.id, name: contact.name }));

const initialFollowUps: FollowUp[] = [
  {
    id: 1,
    campaignId: 1,
    contactId: 2,
    notes: "Send personalized coupon and check delivery confirmation.",
    dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    status: "scheduled",
    priority: "high",
  },
  {
    id: 2,
    campaignId: 3,
    contactId: 1,
    notes: "Confirm they received the newsletter and ask for feedback.",
    dueAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    status: "overdue",
    priority: "medium",
  },
];

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [formState, setFormState] = useState({
    campaignId: "1",
    contactId: "1",
    notes: "",
    dueAt: new Date().toISOString().slice(0, 16),
    priority: "medium" as FollowUp["priority"],
  });
  const [statusFilter, setStatusFilter] = useState<FollowUp["status"] | "all">(
    "all"
  );
  const [contactSearch, setContactSearch] = useState("");
  const [contactTagFilter, setContactTagFilter] = useState("all");

  const selectedContact = useMemo(
    () => sampleContacts.find((contact) => contact.id === Number(formState.contactId)),
    [formState.contactId]
  );

  const stats = useMemo(() => {
    const scheduled = followUps.filter((f) => f.status === "scheduled").length;
    const done = followUps.filter((f) => f.status === "done").length;
    const overdue = followUps.filter((f) => f.status === "overdue").length;
    return { scheduled, done, overdue };
  }, [followUps]);

  const filteredFollowUps = useMemo(
    () =>
      followUps.filter((item) =>
        statusFilter === "all" ? true : item.status === statusFilter
      ),
    [followUps, statusFilter]
  );

  const filteredContacts = useMemo(() => {
    return sampleContacts.filter((contact) => {
      const matchesSearch = `${contact.name} ${contact.email} ${contact.phone}`
        .toLowerCase()
        .includes(contactSearch.toLowerCase());
      const matchesTag = contactTagFilter === "all" || contact.tags.includes(contactTagFilter);
      return matchesSearch && matchesTag;
    });
  }, [contactSearch, contactTagFilter]);

  const addFollowUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.notes.trim()) return;

    const newFollowUp: FollowUp = {
      id: Date.now(),
      campaignId: Number(formState.campaignId),
      contactId: Number(formState.contactId),
      notes: formState.notes,
      dueAt: formState.dueAt,
      status: "scheduled",
      priority: formState.priority,
    };

    setFollowUps((prev) => [newFollowUp, ...prev]);
    setFormState({
      campaignId: "1",
      contactId: "1",
      notes: "",
      dueAt: new Date().toISOString().slice(0, 16),
      priority: "medium",
    });
  };

  const setStatus = (id: number, status: FollowUp["status"]) => {
    setFollowUps((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const resolveName = (id: number, list: { id: number; name: string }[]) =>
    list.find((entry) => entry.id === id)?.name ?? "Unknown";

  return (
    <DashboardLayout
      title="Follow-ups"
      subtitle="Schedule callbacks and personal notes for campaigns and customers"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card variant="stat" className="animate-slide-up">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock3 className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-semibold">{stats.scheduled}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold">{stats.done}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-2xl font-semibold">{stats.overdue}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        <Card variant="elevated" className="xl:col-span-2 animate-slide-up">
          <CardHeader>
            <CardTitle>Create follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={addFollowUp}>
              <div className="space-y-2">
                <Label>Campaign</Label>
                <Select
                  value={formState.campaignId}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, campaignId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={String(campaign.id)}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact</Label>
                <Select
                  value={formState.contactId}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, contactId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={String(contact.id)}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueAt">When to follow up</Label>
                <Input
                  id="dueAt"
                  type="datetime-local"
                  value={formState.dueAt}
                  onChange={(event) => setFormState((prev) => ({ ...prev, dueAt: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formState.priority}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, priority: value as FollowUp["priority"] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes for this follow-up</Label>
                <Textarea
                  id="notes"
                  placeholder="What to ask, what to offer, or any context"
                  value={formState.notes}
                  onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={4}
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button
                  type="reset"
                  variant="outline"
                  onClick={() =>
                    setFormState({
                      campaignId: "1",
                      contactId: "1",
                      notes: "",
                      dueAt: new Date().toISOString().slice(0, 16),
                      priority: "medium",
                    })
                  }
                >
                  Clear
                </Button>
                <Button type="submit" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule follow-up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card
          variant="elevated"
          className="animate-slide-up"
          style={{ animationDelay: "50ms" }}
        >
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Focus on overdue or completed callbacks to keep your outreach tidy.
            </p>
            <Label>Status</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as FollowUp["status"] | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card
          variant="elevated"
          className="animate-slide-up xl:col-span-1"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader>
            <CardTitle>Pick a contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search contacts by name"
                value={contactSearch}
                onChange={(event) => setContactSearch(event.target.value)}
              />
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={contactTagFilter} onValueChange={setContactTagFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All segments</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`rounded-lg border p-3 space-y-2 ${
                    contact.id === Number(formState.contactId)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setFormState((prev) => ({ ...prev, contactId: String(contact.id) }))}>
                      Select
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {contact.tags.map((tag) => (
                      <Badge key={`${contact.id}-${tag}`} variant="muted" className="gap-1">
                        <Tags className="h-3 w-3" /> {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last interaction: {contact.lastContact} • Prefers {contact.preferences?.[0] ?? ""}
                  </p>
                </div>
              ))}
            </div>
            {selectedContact && (
              <div className="rounded-lg bg-muted/50 border border-dashed p-3 space-y-1 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Currently assigned</p>
                <p>{selectedContact.name}</p>
                <p>
                  {selectedContact.phone} • {selectedContact.timezone}
                </p>
                <p>Value: {selectedContact.accountValue}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" className="animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Follow-up queue</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select the campaign and customer, jot quick notes, and decide when you will follow up.
            </p>
          </div>
          <Badge variant="muted">{filteredFollowUps.length} tasks</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Campaign</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">When</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Notes</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFollowUps.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                  >
                    <td className="p-4 font-medium flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      {resolveName(item.campaignId, campaigns)}
                    </td>
                    <td className="p-4 text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {resolveName(item.contactId, contacts)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(item.dueAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm">
                      <Badge
                        variant={
                          item.priority === "high"
                            ? "destructive"
                            : item.priority === "medium"
                            ? "warning"
                            : "muted"
                        }
                      >
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground max-w-md">
                      {item.notes}
                    </td>
                    <td className="p-4 text-sm">
                      <Badge variant={item.status === "done" ? "success" : item.status === "overdue" ? "destructive" : "warning"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {item.status !== "done" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setStatus(item.id, "done")}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Done
                          </Button>
                        )}
                        {item.status !== "overdue" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStatus(item.id, "overdue")}
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {item.status !== "scheduled" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setStatus(item.id, "scheduled")}
                            className="gap-2"
                          >
                            <ClipboardList className="h-4 w-4" />
                            Re-open
                          </Button>
                        )}
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
