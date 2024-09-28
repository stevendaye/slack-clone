"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspace } from "@/api/workspaces/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";

export const CreateWorkspaceModal: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending } = useCreateWorkspace();

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    mutate(
      {
        name,
      },
      {
        onSuccess(id) {
          handleClose();
          router.push(`/workspace/${id}`);
          toast.success(`${name} Workspace Created`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            minLength={3}
            placeholder="Workspace name e.g: 'Home', 'Work', 'Personal' "
            autoFocus
            required
          />
          <div className="flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
