import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateChannelModal } from "@/store/use-create-channel-modal";
import { useCreateChannel } from "@/api/channels/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateChannelModel = () => {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateChannelModal();

  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useCreateChannel();

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name, workspaceId },
      {
        onSuccess: (id: Id<"channels">) => {
          toast.success("Channed created successfully");
          handleClose();
          router.push(`/workspace/${workspaceId}/channel/${id}`);
        },
        onError: () => {
          toast.error("Failed to create channel");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            minLength={2}
            maxLength={80}
            value={name}
            onChange={handleChange}
            autoFocus
            required
            placeholder="e.g. project-brainstorming"
          />

          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
