"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/worskapaces/api/use-get-workspace";

const WorkspacePage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ id: workspaceId });

  return <div>Workspace Data: {JSON.stringify(data)}</div>;
};

export default WorkspacePage;
