import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, Send, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    name: "New Campaign",
    icon: Send,
    description: "Create a new broadcast",
    href: "/campaigns/new",
    primary: true,
  },
  {
    name: "Add Template",
    icon: FileText,
    description: "Design message template",
    href: "/templates/new",
  },
  {
    name: "Import Contacts",
    icon: Upload,
    description: "Upload contact list",
    href: "/contacts/import",
  },
  {
    name: "Add Contact",
    icon: Users,
    description: "Add single contact",
    href: "/contacts/new",
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card variant="default" className="animate-slide-up">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.name}
            variant={action.primary ? "default" : "outline"}
            className="h-auto flex-col gap-2 py-4"
            onClick={() => navigate(action.href)}
          >
            <action.icon className="h-5 w-5" />
            <div className="text-center">
              <p className="font-medium">{action.name}</p>
              <p className="text-xs opacity-80">{action.description}</p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
