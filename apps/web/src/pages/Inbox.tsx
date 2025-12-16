import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ContactListItem } from "@/components/chat/ContactListItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Loader2,
} from "lucide-react";
import { apiBaseUrl, getMessageStatus, sendWhatsAppMessage } from "@/lib/api";

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    lastMessage: "Thanks for the update!",
    time: "2m ago",
    unread: 3,
  },
  {
    id: 2,
    name: "Michael Chen",
    lastMessage: "When will my order arrive?",
    time: "15m ago",
    unread: 1,
  },
  {
    id: 3,
    name: "Emily Davis",
    lastMessage: "I love the new products!",
    time: "1h ago",
    unread: 0,
  },
  {
    id: 4,
    name: "James Wilson",
    lastMessage: "Can you send me the catalog?",
    time: "3h ago",
    unread: 0,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    lastMessage: "Perfect, thank you!",
    time: "1d ago",
    unread: 0,
  },
];

const messages = [
  {
    id: 1,
    message: "Hi! I saw your new collection and I'm really interested. Can you tell me more about the summer sale?",
    time: "10:30 AM",
    type: "incoming" as const,
    sender: "Sarah Johnson",
  },
  {
    id: 2,
    message: "Hello Sarah! Thanks for reaching out. Yes, our summer sale starts this weekend with up to 50% off on selected items! 🎉",
    time: "10:32 AM",
    type: "outgoing" as const,
    status: "read" as const,
  },
  {
    id: 3,
    message: "That sounds amazing! Do you have the blue floral dress in size M?",
    time: "10:35 AM",
    type: "incoming" as const,
    sender: "Sarah Johnson",
  },
  {
    id: 4,
    message: "Let me check our inventory for you. One moment please! ⏳",
    time: "10:36 AM",
    type: "outgoing" as const,
    status: "read" as const,
  },
  {
    id: 5,
    message: "Great news! Yes, we have the blue floral dress in size M. Would you like me to reserve it for you?",
    time: "10:38 AM",
    type: "outgoing" as const,
    status: "delivered" as const,
  },
  {
    id: 6,
    message: "Yes please! That would be perfect. Thanks for the update!",
    time: "10:40 AM",
    type: "incoming" as const,
    sender: "Sarah Johnson",
  },
];

export default function Inbox() {
  const [activeConversation, setActiveConversation] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [recipient, setRecipient] = useState("+1 555 555 0100");
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMutation = useMutation({
    mutationFn: async () => {
      const trimmed = messageInput.trim();
      if (!trimmed) {
        throw new Error("Type a message to send.");
      }

      return sendWhatsAppMessage({
        to: recipient.replace(/\D/g, ""),
        type: "text",
        text: trimmed,
      });
    },
    onSuccess: (data) => {
      const messageId = data.messages?.[0]?.id ?? null;
      setLastMessageId(messageId);
      setMessageInput("");
      toast({
        title: "Message sent to WhatsApp",
        description: messageId
          ? `Tracking delivery status for ${messageId}`
          : "Message accepted by backend",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const statusQuery = useQuery({
    queryKey: ["message-status", lastMessageId],
    queryFn: () => getMessageStatus(lastMessageId as string),
    enabled: Boolean(lastMessageId),
    refetchInterval: 4000,
  });

  const latestStatus = useMemo(() => {
    if (!statusQuery.data?.latest) return null;
    return statusQuery.data.latest as { status?: string; timestamp?: string };
  }, [statusQuery.data]);

  const handleSend = () => {
    sendMutation.mutate();
  };

  return (
    <DashboardLayout title="Inbox" subtitle="Manage customer conversations">
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* Conversations List */}
        <Card variant="elevated" className="w-80 flex-shrink-0 flex flex-col animate-slide-up">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto scrollbar-thin p-2">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <ContactListItem
                  key={conversation.id}
                  name={conversation.name}
                  lastMessage={conversation.lastMessage}
                  time={conversation.time}
                  unread={conversation.unread}
                  isActive={conversation.id === activeConversation}
                  onClick={() => setActiveConversation(conversation.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card variant="elevated" className="flex-1 flex flex-col animate-slide-up" style={{ animationDelay: "100ms" }}>
          {/* Chat Header */}
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">SJ</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                time={msg.time}
                type={msg.type}
                status={msg.status}
                sender={msg.sender}
              />
            ))}
            {lastMessageId && (
              <div className="rounded-lg border border-border/60 bg-muted/40 p-3 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Delivery status</p>
                  <span className="text-xs text-muted-foreground">{lastMessageId}</span>
                </div>
                {statusQuery.isFetching ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" /> Checking delivery updates...
                  </div>
                ) : statusQuery.isError ? (
                  <p className="text-destructive text-sm">Unable to fetch status from backend.</p>
                ) : (
                  <p className="text-sm">
                    Latest status: {latestStatus?.status ?? "waiting for webhook callbacks"}
                  </p>
                )}
              </div>
            )}
          </CardContent>

          {/* Message Input */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="grid gap-2 sm:grid-cols-3 items-center">
              <Input
                placeholder="WhatsApp number (e.g., 15551234567)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <div className="sm:col-span-2 flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message to send via backend..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={handleSend}
                  disabled={sendMutation.isLoading}
                >
                  {sendMutation.isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Connected to backend at <span className="font-medium text-foreground">{apiBaseUrl}</span>.
              Delivery receipts update automatically when webhook callbacks arrive.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
