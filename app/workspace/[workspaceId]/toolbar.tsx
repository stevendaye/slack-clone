import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/api/workspaces/use-get-workspace";
import { Info, Search } from "lucide-react";
import React from "react";

export const Toolbar: React.FC = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <div className="bg-main-darker flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />

      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
      </div>

      <div className="flex-1 flex items-center ml-auto justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </div>
  );
};
