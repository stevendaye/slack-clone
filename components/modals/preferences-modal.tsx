import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/apis/workspaces/use-update-workspace";
import { useRemoveWorkspace } from "@/apis/workspaces/use-remove-workspace";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  open,
  setOpen,
  initialValue,
}) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    "Are you sure you want to permanently delete?",
    "This action is irreversible"
  );

  const [ConfirmEditDialog, confirmEdit] = useConfirm(
    "Are you sure you want to edit?",
    "This action will update the worksapce's title"
  );

  const [value, setValue] = useState<string>(initialValue);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const { mutate: updateWorkspace, isPending: updatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: removingWorkspace } =
    useRemoveWorkspace();

  const handleEditWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ok = await confirmEdit();

    if (!ok) return;

    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Workspace Updated");
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const hanldeRemoveWorkspace = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace removed");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to remove worksapce");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDeleteDialog />
      <ConfirmEditDialog />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace</p>
                    <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename workspace</DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleEditWorkspace}>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={updatingWorkspace}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={50}
                    placeholder="Workspace name eg: 'Personal', 'Work', 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <Button disabled={updatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
              onClick={hanldeRemoveWorkspace}
              disabled={removingWorkspace}
            >
              <TrashIcon className="size-4" />
              <p className="text-xs font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
