import { useRef, useState } from "react";
import Quill from "quill";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

import { Id } from "@/convex/_generated/dataModel";

import { AlertTriangle, Loader, XIcon } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";

import { useGetMessage } from "@/apis/messages/use-get-message";
import { useCurrentMember } from "@/apis/members/use-current-member";
import { useCreateMessage } from "@/apis/messages/use-create-message";
import { useCreateUploadURL } from "@/apis/upload/use-create-upload-url";
import { useGetMessages } from "@/apis/messages/use-get-messages";

import { Button } from "./ui/button";
import { Message } from "./message";

interface ThreadProps {
  messageId: Id<"messages">;
  onCloseThread: () => void;
}

type TextMessage = {
  body: string;
  image: File | null;
};

type CreateMessageValues = {
  body: string;
  channelId: Id<"channels">;
  parentMessageId: Id<"messages">;
  workspaceId: Id<"workspaces">;
  image: Id<"_storage"> | undefined;
};

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

const TIME_TRESHOLD = 5;

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export const Thread: React.FC<ThreadProps> = ({ messageId, onCloseThread }) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState<number>(0);
  const [isPending, setIsPending] = useState<boolean>(false);

  const editorRef = useRef<Quill | null>(null);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: createUploadURL } = useCreateUploadURL();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: isLoadingMessage } = useGetMessage({
    id: messageId,
  });
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";
  const isLoadingFirstPage = status === "LoadingFirstPage";

  // Submit message in thread
  const onSubmit = async ({ body, image }: TextMessage) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        workspaceId,
        parentMessageId: messageId,
        channelId,
        image: undefined,
      };

      if (image) {
        const url = await createUploadURL({}, { throwError: true });

        if (!url) throw new Error("We cannot find the url");

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!res.ok) throw new Error("Failed to upload image");

        const { storageId } = await res.json();

        values.image = storageId;
      }

      createMessage(values, { throwError: true });
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  /* Grouping messages by date */
  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = []; // initialize
      }
      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (isLoadingMessage || isLoadingFirstPage)
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button size={"iconSm"} variant={"ghost"} onClick={onCloseThread}>
            <XIcon className="size-5  stroke-[1.5]" />
          </Button>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );

  if (!message)
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button size={"iconSm"} variant={"ghost"} onClick={onCloseThread}>
            <XIcon className="size-5  stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button size={"iconSm"} variant={"ghost"} onClick={onCloseThread}>
          <XIcon className="size-5  stroke-[1.5]" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {
          /* Messages replied in thread to parent message */
          Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
            <div key={dateKey}>
              <div className="text-center my-2 relative">
                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                <span className="relative inline-block bg-white px-4 py-1 rounded-full border border-gray-300 shadow-sm">
                  {formatDateLabel(dateKey)}
                </span>
              </div>

              {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                const isCompact =
                  prevMessage &&
                  prevMessage.user?._id === message.user?._id &&
                  differenceInMinutes(
                    new Date(message._creationTime),
                    new Date(prevMessage._creationTime)
                  ) < TIME_TRESHOLD;

                return (
                  <Message
                    key={message._id}
                    id={message._id}
                    hideThreadButton
                    memberId={message.memberId}
                    authorImage={message.user.image}
                    authorName={message.user.name}
                    isAuthor={currentMember?._id === message.memberId}
                    reactions={message.reactions}
                    body={message.body}
                    image={message.image}
                    updatedAt={message.updatedAt}
                    createdAt={message._creationTime}
                    isEditing={editingId === message._id}
                    setEditingId={setEditingId}
                    isCompact={isCompact}
                    threadCount={message.threadCount}
                    threadImage={message.threadImage}
                    threadName={message.threadName}
                    threadTimestamp={message.threadTimestamp}
                  />
                );
              })}
            </div>
          ))
        }

        {/* Infinite scrolling to the top */}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );

              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />

        {/* Loding more status */}
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full border border-gray-300 shadow-sm">
              <Loader className="animate-spin size-5 text-muted-foreground" />
            </span>
          </div>
        )}

        {/* Parent Message */}
        <Message
          key={message._id}
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>

      <div className="px-4">
        <Editor
          key={editorKey}
          innerRef={editorRef}
          onSubmit={onSubmit}
          placeholder="Reply.."
          disabled={isPending}
        />
      </div>
    </div>
  );
};
