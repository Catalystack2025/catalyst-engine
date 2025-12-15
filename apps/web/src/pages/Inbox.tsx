import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ContactListItem } from "@/components/chat/ContactListItem";
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";

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
          </CardContent>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Button size="icon" className="rounded-full">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
