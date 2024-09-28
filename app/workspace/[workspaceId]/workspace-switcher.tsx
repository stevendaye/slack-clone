import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/api/workspaces/use-get-workspace";
import { useGetWorkspaces } from "@/api/workspaces/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const WorkspaceSwitcher: React.FC = () => {
  const [_open, setOpen] = useCreateWorkspaceModal();
  const workspaceId = useWorkspaceId();
  const { data: workspaces, isLoading: _isLoadingWorkspaces } =
    useGetWorkspaces();
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    id: workspaceId,
  });

  const router = useRouter();

  const nonCurrentWorkspaces = workspaces?.filter(
    (workspace) => workspace._id !== workspaceId
  );

  const handleNavigateToWorskpace = (id: Id<"workspaces">) => {
    router.push(`/workspace/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {isLoadingWorkspace ? (
            <Loader className="size-4 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex flex-col justify-start items-start capitalize"
          onClick={() => handleNavigateToWorskpace(workspaceId)}
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>

        {nonCurrentWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer"
            onClick={() => handleNavigateToWorskpace(workspace._id)}
          >
            <div
              className={`shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg
                rounded-md flex items-center justify-center mr-2`}
            >
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{workspace.name}</span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div
            className={`size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg
          rounded-md flex items-center justify-center mr-2`}
          >
            <Plus className="size-4" />
          </div>
          <span className="font-normal">Create a new workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
