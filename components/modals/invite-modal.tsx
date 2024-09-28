import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon, RefreshCcw } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNewJoinCode } from "@/api/workspaces/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  open,
  setOpen,
  name,
  joinCode,
}) => {
  const { mutate, isPending } = useNewJoinCode();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure of what you are doing?",
    "This will deactivate the current invote code and generate a new one"
  );

  const workspaceId = useWorkspaceId();
  const [copied, setCopied] = useState(false);

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess() {
          toast.success("Invite code regernerated");
        },
        onError() {
          toast.error("Failed to regenerate invite code");
        },
      }
    );
  };

  const handleCopy = () => {
    const resetTime = 4000;
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite Link Copied to Clipboard"));

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, resetTime);
  };

  return (
    <>
      <ConfirmDialog />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold tracking-wide uppercase">
              {joinCode}
            </p>

            <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>
              Copy link
              {copied ? (
                <CheckIcon className="size-4 ml-2" />
              ) : (
                <CopyIcon className="size-4 ml-2" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between w-full">
            <Button
              variant={"outline"}
              onClick={handleNewCode}
              disabled={isPending}
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
