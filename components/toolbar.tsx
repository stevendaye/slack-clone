import {
  Ellipsis,
  Forward,
  MessageSquareTextIcon,
  Pencil,
  SmilePlus,
  Trash,
} from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}) => {
  return (
    <div className="absolute top-0 right-4">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity border bg-white rounded-md shadow-sm">
        <Hint label="Complete">
          <Button
            asChild
            variant={"ghost"}
            size={"iconSm"}
            disabled={isPending}
            onClick={() => handleReaction("✅")}
            className="hover:cursor-pointer"
          >
            <span className="size-4">✅</span>
          </Button>
        </Hint>
        <Hint label="Taking a look">
          <Button
            asChild
            variant={"ghost"}
            size={"iconSm"}
            disabled={isPending}
            onClick={() => handleReaction("👀")}
            className="hover:cursor-pointer"
          >
            <span className="size-4">👀</span>
          </Button>
        </Hint>
        <Hint label="Well done">
          <Button
            asChild
            variant={"ghost"}
            size={"iconSm"}
            disabled={isPending}
            onClick={() => handleReaction("👍")}
            className="hover:cursor-pointer"
          >
            <span className="size-4">👍</span>
          </Button>
        </Hint>

        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <SmilePlus className="size-4" />
          </Button>
        </EmojiPopover>

        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        <Hint label="Forward message">
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <Forward className="size-4" />
          </Button>
        </Hint>

        {isAuthor && (
          <Hint label="Edit message">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleEdit}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <Hint label="Delete message">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}

        <Hint label="More">
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <Ellipsis className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
