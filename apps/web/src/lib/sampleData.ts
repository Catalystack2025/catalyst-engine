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
    name: "Tiago.ev City Drive Conversions",
    audience: "EV intenders – Mumbai & Pune",
    status: "active",
    sent: 18250,
    delivered: 17640,
    read: 13210,
    replied: 842,
    progress: 72,
    scheduledAt: "2024-06-18T10:00",
    message: "Book your Tiago.ev city drive slot with a home-charging demo included.",
    objective: "Convert EV leads into test drives and financing pre-approvals for the Tata Tiago.ev.",
  },
  {
    id: 2,
    name: "Harrier & Safari 2024 Launch",
    audience: "SUV intenders – pan India",
    status: "completed",
    sent: 15480,
    delivered: 14900,
    read: 12040,
    replied: 965,
    progress: 100,
    scheduledAt: "2024-06-10T11:30",
    message: "Explore the new Harrier and Safari with ADAS and ventilated seating.",
    objective: "Drive launch RSVPs and dealer visit commitments across metros and Tier-1 cities.",
  },
  {
    id: 3,
    name: "Service Loyalty Q2",
    audience: "In-warranty owners",
    status: "paused",
    sent: 9800,
    delivered: 9100,
    read: 6020,
    replied: 430,
    progress: 58,
    scheduledAt: "2024-06-05T09:15",
    message: "Schedule your free pickup and monsoon-ready check-up at the nearest Tata Motors workshop.",
    objective: "Lift repeat service bookings and shield NPS ahead of monsoon season.",
  },
  {
    id: 4,
    name: "Fleet Safety Recall – Airbag Module",
    audience: "Fleet operators & dealer stock",
    status: "scheduled",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    progress: 0,
    scheduledAt: "2024-06-22T08:00",
    message: "Critical safety update: schedule airbag module inspection for impacted VINs.",
    objective: "Reach all fleet custodians with recall details and slot booking links.",
  },
  {
    id: 5,
    name: "Monsoon Check-up Camps",
    audience: "After-sales owners",
    status: "draft",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    progress: 0,
    scheduledAt: null,
    message: "Join the monsoon camp for free 40-point inspection and tyre offers.",
    objective: "Protect uptime for owners before peak rains while surfacing accessory bundles.",
  },
  {
    id: 6,
    name: "Dealer Engagement Pulse",
    audience: "Top 50 dealerships",
    status: "failed",
    sent: 4200,
    delivered: 2100,
    read: 860,
    replied: 95,
    progress: 38,
    scheduledAt: "2024-06-02T08:00",
    message: "Monthly dealer scorecard submission and display audit reminders.",
    objective: "Collect dealer-ready feedback packs; retry after fixing routing issues.",
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
    name: "Ananya Rao",
    phone: "+91 98765 11001",
    email: "ananya.rao@tatamotors.com",
    status: "active",
    tags: ["EV lead", "Mumbai"],
    lastContact: "2024-06-17",
    timezone: "IST",
    preferences: ["Evening", "WhatsApp preferred"],
    accountValue: "₹18L est. order",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    phone: "+91 99200 45022",
    email: "rohan.mehta@fleetlogistics.in",
    status: "active",
    tags: ["Fleet", "Pune"],
    lastContact: "2024-06-12",
    timezone: "IST",
    preferences: ["Morning", "Email first"],
    accountValue: "28 vehicles managed",
  },
  {
    id: 3,
    name: "Kabir Singh",
    phone: "+91 98190 22133",
    email: "kabir.singh@logicorp.com",
    status: "inactive",
    tags: ["Fleet", "Recall"],
    lastContact: "2024-06-03",
    timezone: "IST",
    preferences: ["SMS alerts"],
    accountValue: "VIN batch pending recall",
  },
  {
    id: 4,
    name: "Priya Sharma",
    phone: "+91 97020 88214",
    email: "priya.sharma@tatamotors.com",
    status: "active",
    tags: ["Dealer", "North"],
    lastContact: "2024-06-15",
    timezone: "IST",
    preferences: ["Afternoon", "Phone call"],
    accountValue: "Top-10 outlet",
  },
  {
    id: 5,
    name: "Sanjay Patel",
    phone: "+91 98670 11245",
    email: "sanjay.patel@autojunction.in",
    status: "blocked",
    tags: ["Press", "DNC"],
    lastContact: "2024-05-28",
    timezone: "IST",
    preferences: ["No promotions"],
    accountValue: "Media contact",
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
    name: "Test Drive Confirmation – Tiago.ev",
    category: "Marketing",
    language: "English",
    status: "approved",
    lastUpdated: "2024-06-16",
    bodyPreview: "Hi {{1}}, your Tiago.ev drive is booked at {{2}}. Tap to add a home-charger demo.",
    usage: "High engagement for EV intenders",
    channel: "WhatsApp",
  },
  {
    id: 2,
    name: "Finance Pre-Approval",
    category: "Utility",
    language: "English",
    status: "approved",
    lastUpdated: "2024-06-14",
    bodyPreview: "Hi {{1}}, your Tata Motors finance pre-check is ready. Share PAN to finalize in {{2}} mins.",
    usage: "Sent 8.1K times",
    channel: "WhatsApp",
  },
  {
    id: 3,
    name: "Service Reminder – Monsoon Check",
    category: "Alert",
    language: "English",
    status: "pending",
    lastUpdated: "2024-06-12",
    bodyPreview: "Hi {{1}}, book your monsoon-ready service at {{2}}. Free pickup slots open till {{3}}.",
    usage: "Awaiting compliance review",
    channel: "SMS",
  },
  {
    id: 4,
    name: "Safety Recall Notice",
    category: "Marketing",
    language: "English",
    status: "draft",
    lastUpdated: "2024-06-11",
    bodyPreview: "Dear {{1}}, schedule inspection for VIN {{2}}. Service center contact: {{3}}.",
    usage: "Draft for legal sign-off",
    channel: "WhatsApp",
  },
  {
    id: 5,
    name: "Exchange Bonus Offer",
    category: "Marketing",
    language: "English",
    status: "approved",
    lastUpdated: "2024-06-08",
    bodyPreview: "Swap your car for a new Tata with exchange bonus up to ₹{{1}}. Book evaluation for {{2}}.",
    usage: "95% delivery",
    channel: "WhatsApp",
  },
  {
    id: 6,
    name: "Accessories Upsell – Harrier",
    category: "Marketing",
    language: "English",
    status: "rejected",
    lastUpdated: "2024-06-06",
    bodyPreview: "Hi {{1}}, add ambient lighting + dashcam bundle for your Harrier at {{2}}% off.",
    usage: "Needs price disclaimer",
    channel: "WhatsApp",
  },
];
