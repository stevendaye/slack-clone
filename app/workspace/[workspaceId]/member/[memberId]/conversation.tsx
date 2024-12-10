import { Loader } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";

import { useGetMember } from "@/api/members/use-get-member";
import { useGetMessages } from "@/api/messages/use-get-messages";
import { useMemberId } from "@/hooks/use-member-id";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation: React.FC<ConversationProps> = ({ id }) => {
  const memberId = useMemberId();

  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  const isLoadingFirstPage = status === "LoadingFirstPage";
  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";

  if (isMemberLoading || isLoadingFirstPage)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />

      <MessageList
        data={results}
        variant="conversation"
        memberName={member?.user.name}
        memberImage={member?.user.image}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        canLoadMore={canLoadMore}
      />

      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
