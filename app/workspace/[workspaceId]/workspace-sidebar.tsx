import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import React from "react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/apis/members/use-current-member";
import { useGetWorkspace } from "@/apis/workspaces/use-get-workspace";
import { useChannelId } from "@/hooks/use-channel-id";

import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/apis/channels/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/apis/members/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/store/use-create-channel-modal";
import { useMemberId } from "@/hooks/use-member-id";

export const WorkspaceSidebar: React.FC = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();

  const { data: workspace, isLoading: loadingWorkspace } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: member, isLoading: loadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: channels, isLoading: _laodingChannels } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: _laodingMembers } = useGetMembers({
    workspaceId,
  });

  const [_open, setOpen] = useCreateChannelModal();

  if (loadingWorkspace || loadingMember) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-main">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 items-center justify-center h-full bg-main">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-main">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />

      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label={"Threads"} icon={MessageSquareText} id="threads" />
        <SidebarItem label={"Drafts & Sent"} icon={SendHorizonal} id="drafts" />
      </div>

      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={
          member.role === "admin"
            ? () => {
                setOpen(true);
              }
            : undefined
        }
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label="Direct Messages"
        hint="New Direct Message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={item._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
