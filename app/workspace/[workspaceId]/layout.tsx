"use client";

import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Thread } from "@/components/thread";
import { Profile } from "@/components/profile";

import { Searchbar } from "./searchbar";
import { Sidebar } from "./sidebar";
import { WorkspaceSidebar } from "./workspace-sidebar";

import { usePanel } from "@/hooks/use-panel";

interface WorkspaceLayout {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayout) => {
  const { parentMessageId, memberProfileId, onClose } = usePanel();

  const showPanel = !!parentMessageId || !!memberProfileId;

  return (
    <div className="h-full">
      <Searchbar />

      <div className="flex h-[calc(100vh-2.5rem)]">
        <Sidebar />

        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"sd-slcn-workspace-layout"}
        >
          <ResizablePanel defaultSize={20} minSize={15} className="bg-main">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={75}>
            {children}
          </ResizablePanel>

          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onCloseThread={onClose}
                  />
                ) : memberProfileId ? (
                  <Profile
                    memberId={memberProfileId as Id<"members">}
                    onCloseProfile={onClose}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
