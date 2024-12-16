import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetWorkspace {
  id: Id<"workspaces">;
}

export const useGetWorkspace = ({ id }: UseGetWorkspace) => {
  const data = useQuery(api.workspaces.getById, { id });
  const isLoading = data === undefined;

  return { isLoading, data };
};
