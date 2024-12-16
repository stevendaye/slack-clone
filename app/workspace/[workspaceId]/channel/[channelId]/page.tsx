"use client";

import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannel } from "@/apis/channels/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/apis/messages/use-get-messages";
import { MessageList } from "@/components/message-list";

const ChannelPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: isLoadingChannel } = useGetChannel({
    channelId,
  });

  if (isLoadingChannel && status === "LoadingFirstPage")
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );

  if (!channel)
    return (
      <div className="flex flex-1 flex-col h-full items-center justify-center gap-y-2">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />

      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />

      <ChatInput placeholder={`Message ${channel.name}`} />
    </div>
  );
};

export default ChannelPage;
