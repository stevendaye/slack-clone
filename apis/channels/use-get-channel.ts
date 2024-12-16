import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetChannelProps {
  channelId: Id<"channels">;
}

export const useGetChannel = ({ channelId }: UseGetChannelProps) => {
  const data = useQuery(api.channels.getById, { id: channelId });
  const isLoading = data === undefined;

  return { isLoading, data };
};
