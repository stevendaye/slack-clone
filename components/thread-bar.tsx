import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronRight } from "lucide-react";

interface ThreadBar {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick?: () => void;
}

export const ThreadBar: React.FC<ThreadBar> = ({
  count,
  image,
  timestamp,
  name = "Member",
  onClick,
}) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  if (!count || !image || !timestamp) return null;

  return (
    <button
      className="flex items-center justify-start p-1 rounded-md gap-1
      border-transparent border group/thread-bar transition max-w-[600px]"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <span className="text-xs text-sky-600 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>

      <ChevronRight
        className="size-4 text-muted-foreground opacity-0 group-hover/thread-bar:opacity-100
        transition shrink-0"
      />
    </button>
  );
};
