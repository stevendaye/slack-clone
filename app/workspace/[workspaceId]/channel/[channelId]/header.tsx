import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { FaChevronDown } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUpdateChannel } from "@/api/channels/use-update-channel";
import { useRemoveChannel } from "@/api/channels/use-remove-channel";
import { useConfirm } from "@/hooks/use-confirm";
import { useCurrentMember } from "@/api/members/use-current-member";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();

  const [name, setName] = useState<string>(title);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete channel",
    "Are you sure you want to permanently delete this channel?"
  );

  const { data: member } = useCurrentMember({ workspaceId });

  const { mutate: updateChannel, isPending: updatingChannel } =
    useUpdateChannel();

  const { mutate: removeChannel, isPending: removingChannel } =
    useRemoveChannel();

  const handleEditOpen = () => {
    if (member?.role !== "admin") return;

    setEditOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess() {
          toast.success("Channel deleted");
          router.push(`/workspace/${workspaceId}`);
        },
        onError() {
          toast.error("Channel failed to delete");
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name },
      {
        onSuccess() {
          toast.success("Channel updated");
          setEditOpen(false);
        },
        onError() {
          toast.error("Channel failed to update");
        },
      }
    );
  };

  return (
    <div className="flex items-center h-[49px] px-4 bg-white border-b overflow-hidden">
      <Dialog>
        <ConfirmDialog />

        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-auto text-lg font-semibold px-2 overflow-hidden"
          >
            # {title}
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col px-4 pb-4 gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] font-semibold hover:underline">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename channel</DialogTitle>
                </DialogHeader>

                {/* Rename channel form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    value={name}
                    disabled={updatingChannel}
                    autoFocus
                    minLength={3}
                    maxLength={60}
                    onChange={handleChange}
                    placeholder="e.g. education-budget"
                    required
                  />
                  <DialogFooter>
                    <DialogClose>
                      <Button variant={"outline"} disabled={updatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={updatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {member?.role === "admin" && (
              <Button
                onClick={handleDelete}
                disabled={removingChannel}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
