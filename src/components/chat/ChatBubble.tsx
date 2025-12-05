import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  time: string;
  type: "incoming" | "outgoing";
  status?: "sent" | "delivered" | "read";
  sender?: string;
}

export function ChatBubble({
  message,
  time,
  type,
  status,
  sender,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full animate-slide-up",
        type === "outgoing" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
          type === "outgoing"
            ? "bg-chat-outgoing text-chat-outgoing-foreground rounded-br-md"
            : "bg-chat-incoming text-chat-incoming-foreground rounded-bl-md"
        )}
      >
        {sender && type === "incoming" && (
          <p className="text-xs font-semibold text-primary mb-1">{sender}</p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        <div
          className={cn(
            "flex items-center justify-end gap-1 mt-1",
            type === "outgoing" ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          <span className="text-[10px]">{time}</span>
          {type === "outgoing" && status && (
            <>
              {status === "sent" && <Check className="h-3 w-3" />}
              {status === "delivered" && <CheckCheck className="h-3 w-3" />}
              {status === "read" && (
                <CheckCheck className="h-3 w-3 text-info" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
