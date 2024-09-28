import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/api/members/use-current-member";
import { useGetWorkspace } from "@/api/workspaces/use-get-workspace";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import React from "react";

import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/api/channels/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/api/members/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/store/use-create-channel-modal";

export const WorkspaceSidebar: React.FC = () => {
  const workspaceId = useWorkspaceId();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: channels, isLoading: _channelsLaoding } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: _membersLaoding } = useGetMembers({
    workspaceId,
  });

  const [_open, setOpen] = useCreateChannelModal();

  if (workspaceLoading || memberLoading) {
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
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
