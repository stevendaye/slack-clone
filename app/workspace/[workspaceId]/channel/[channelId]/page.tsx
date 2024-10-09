"use client";

import { useGetChannel } from "@/api/channels/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import React from "react";
import { Header } from "./header";

const ChannelPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: loadingChannel } = useGetChannel({
    channelId,
  });

  if (loadingChannel)
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
    </div>
  );
};

export default ChannelPage;
