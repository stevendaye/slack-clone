import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export const useChannelId = () => {
  const params = useParams();
  return params.channelId as Id<"channels">;
};
