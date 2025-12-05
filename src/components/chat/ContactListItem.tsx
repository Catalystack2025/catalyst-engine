import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ContactListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function ContactListItem({
  name,
  lastMessage,
  time,
  unread = 0,
  avatar,
  isActive = false,
  onClick,
}: ContactListItemProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left",
        isActive
          ? "bg-accent"
          : "hover:bg-accent/50"
      )}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">{initials}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground truncate">{name}</p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
          {unread > 0 && (
            <Badge variant="default" className="h-5 min-w-[20px] px-1.5 text-[10px]">
              {unread}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
