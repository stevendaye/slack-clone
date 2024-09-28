"use client";

import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { WorkspaceSidebar } from "./workspace-sidebar";

interface WorkspaceLayout {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayout) => {
  return (
    <div className="h-full">
      <Toolbar />
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
          <ResizablePanel minSize={25}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
