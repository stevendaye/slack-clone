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

  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: isLoadingChannels } = useGetChannels({
    workspaceId,
  });
  const { data: currentMember, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(
    () => currentMember?.role === "admin",
    [currentMember?.role]
  );

  useEffect(() => {
    if (
      isLoadingWorkspace ||
      isLoadingChannels ||
      isLoadingMember ||
      !currentMember ||
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
    currentMember,
    isLoadingMember,
    channelId,
    isLoadingWorkspace,
    isLoadingChannels,
    workspace,
    open,
    setOpen,
    router,
    workspaceId,
  ]);

  if (isLoadingWorkspace || isLoadingChannels || isLoadingMember) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspaceId || !currentMember) {
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
