"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannels } from "@/api/channels/use-get-channels";
import { useGetWorkspace } from "@/api/workspaces/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateChannelModal } from "@/store/use-create-channel-modal";
import { useCurrentMember } from "@/api/members/use-current-member";

const WorkspacePage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: workspace, isLoading: loadingWorkspace } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: loadingChannels } = useGetChannels({
    workspaceId,
  });
  const { data: member, isLoading: loadingMember } = useCurrentMember({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      loadingWorkspace ||
      loadingChannels ||
      loadingMember ||
      !member ||
      !workspace
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    isAdmin,
    member,
    loadingMember,
    channelId,
    loadingWorkspace,
    loadingChannels,
    workspace,
    open,
    setOpen,
    router,
    workspaceId,
  ]);

  if (loadingWorkspace || loadingChannels || loadingMember) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspaceId || !member) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-5 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
};

export default WorkspacePage;
