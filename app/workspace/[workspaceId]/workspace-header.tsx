import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Hint } from "@/components/hint";
import { PreferencesModal } from "@/components/modals/preferences-modal";
import { InviteModal } from "@/components/modals/invite-modal";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  workspace,
  isAdmin,
}) => {
  const [openPreferences, setOpenPreferences] = useState<boolean>(false);
  const [openInvite, setOpenInvite] = useState<boolean>(false);

  return (
    <>
      <InviteModal
        open={openInvite}
        setOpen={setOpenInvite}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />

      <PreferencesModal
        open={openPreferences}
        setOpen={setOpenPreferences}
        initialValue={workspace.name}
      />

      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"transparent"}
              size={"sm"}
              className="font-semibold text-[16px] w-auto p-1.5 overflow-hidden"
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div
                className="flex items-center justify-center size-9 relative overflow-hidden text-white mr-2
              bg-[#616061] font-semibold text-lg rounded-md"
              >
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground ">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setOpenInvite(true)}
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setOpenPreferences(true)}
                >
                  Preference
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversations" side="bottom">
            <Button variant={"transparent"} size={"iconSm"}>
              <ListFilter className="size-4" />
            </Button>
          </Hint>

          <Hint label="New message" side="bottom">
            <Button variant={"transparent"} size={"iconSm"}>
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
