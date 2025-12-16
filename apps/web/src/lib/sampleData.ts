export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "completed"
  | "failed"
  | "paused";

export interface CampaignRecord {
  id: number;
  name: string;
  audience: string;
  status: CampaignStatus;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  progress: number;
  scheduledAt: string | null;
  message: string;
  objective?: string;
}

export const sampleCampaigns: CampaignRecord[] = [
  {
    id: 1,
    name: "Summer Sale 2024",
    audience: "VIP customers",
    status: "active",
    sent: 12500,
    delivered: 12234,
    read: 8945,
    replied: 234,
    progress: 98,
    scheduledAt: "2024-01-15T10:00",
    message: "Don't miss our mid-season offers ending soon!",
    objective: "Generate repeat purchases from high-intent buyers.",
  },
  {
    id: 2,
    name: "New Product Launch",
    audience: "All subscribers",
    status: "completed",
    sent: 8500,
    delivered: 8320,
    read: 6120,
    replied: 456,
    progress: 100,
    scheduledAt: "2024-01-14T14:00",
    message: "Introducing our latest release with exclusive pricing.",
    objective: "Create awareness for the new product drop.",
  },
  {
    id: 3,
    name: "Weekly Newsletter",
    audience: "Newsletter list",
    status: "paused",
    sent: 7500,
    delivered: 7200,
    read: 4300,
    replied: 120,
    progress: 50,
    scheduledAt: "2024-01-16T09:00",
    message: "Your curated updates for the week ahead.",
    objective: "Maintain weekly engagement without overwhelming subscribers.",
  },
  {
    id: 4,
    name: "Customer Feedback",
    audience: "Recent purchasers",
    status: "scheduled",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    progress: 0,
    scheduledAt: "2024-01-20T11:00",
    message: "Tell us how we did and claim a reward!",
    objective: "Capture NPS while the purchase is fresh.",
  },
  {
    id: 5,
    name: "Holiday Greetings",
    audience: "All customers",
    status: "draft",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    progress: 0,
    scheduledAt: null,
    message: "Warm wishes and thank you for being with us.",
    objective: "Strengthen relationship before peak shopping period.",
  },
  {
    id: 6,
    name: "Failed Campaign Test",
    audience: "QA cohort",
    status: "failed",
    sent: 5000,
    delivered: 2500,
    read: 1000,
    replied: 50,
    progress: 50,
    scheduledAt: "2024-01-10T08:00",
    message: "Testing deliverability after infra changes.",
    objective: "Validate infra changes with low-risk users.",
  },
];

export interface ContactRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "active" | "inactive" | "blocked";
  tags: string[];
  lastContact: string;
  timezone?: string;
  preferences?: string[];
  accountValue?: string;
}

export const sampleContacts: ContactRecord[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "+1 234 567 8901",
    email: "sarah@example.com",
    status: "active",
    tags: ["VIP", "Customer"],
    lastContact: "2024-01-15",
    timezone: "EST",
    preferences: ["Evening", "SMS first"],
    accountValue: "$9.8k LTV",
  },
  {
    id: 2,
    name: "Michael Chen",
    phone: "+1 234 567 8902",
    email: "michael@example.com",
    status: "active",
    tags: ["Lead"],
    lastContact: "2024-01-14",
    timezone: "PST",
    preferences: ["Product updates"],
    accountValue: "$2.4k LTV",
  },
  {
    id: 3,
    name: "Emily Davis",
    phone: "+1 234 567 8903",
    email: "emily@example.com",
    status: "inactive",
    tags: ["Customer"],
    lastContact: "2024-01-10",
    timezone: "CST",
    preferences: ["Newsletter"],
    accountValue: "$1.2k LTV",
  },
  {
    id: 4,
    name: "James Wilson",
    phone: "+1 234 567 8904",
    email: "james@example.com",
    status: "active",
    tags: ["VIP", "Partner"],
    lastContact: "2024-01-13",
    timezone: "MST",
    preferences: ["Phone calls"],
    accountValue: "$5.1k LTV",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    phone: "+1 234 567 8905",
    email: "lisa@example.com",
    status: "blocked",
    tags: ["DNC"],
    lastContact: "2024-01-05",
    timezone: "EST",
    preferences: ["No promotions"],
    accountValue: "$450 LTV",
  },
];

export type TemplateStatus = "approved" | "draft" | "pending" | "rejected";

export interface TemplateRecord {
  id: number;
  name: string;
  category: string;
  language: string;
  status: TemplateStatus;
  lastUpdated: string;
  bodyPreview: string;
  usage: string;
  channel?: string;
}

export const sampleTemplates: TemplateRecord[] = [
  {
    id: 1,
    name: "Welcome Aboard",
    category: "Marketing",
    language: "English",
    status: "approved",
    lastUpdated: "2024-02-04",
    bodyPreview: "Hi {{1}}, welcome to Greenwave! Tap below to set preferences.",
    usage: "High engagement",
    channel: "WhatsApp",
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
    channel: "WhatsApp",
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
    channel: "SMS",
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
    channel: "WhatsApp",
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
    channel: "WhatsApp",
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
    channel: "WhatsApp",
  },
];
