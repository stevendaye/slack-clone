import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetWorkspacePublicProps {
  id: Id<"workspaces">;
}

export const useGetWorkspacePublic = ({ id }: UseGetWorkspacePublicProps) => {
  const data = useQuery(api.workspaces.getByIdPublic, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
