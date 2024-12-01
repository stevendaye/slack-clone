import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export const useMemberId = () => {
  const params = useParams();
  return params.memberId as Id<"members">;
};
