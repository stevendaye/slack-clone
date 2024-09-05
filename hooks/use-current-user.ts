import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export const useCurrentUser = () => {
  const data = useQuery(api.users.currentUser);
  const isLoading = data === undefined;

  return { data, isLoading };
};
