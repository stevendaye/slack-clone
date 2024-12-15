import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { toast } from "sonner";

import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";

import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "./ui/dropdown-menu";

import { useGetMember } from "@/api/members/use-get-member";
import { useUpdateMember } from "@/api/members/use-update-member";
import { useRemoveMember } from "@/api/members/use-remove-member";
import { useCurrentMember } from "@/api/members/use-current-member";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

interface ProfileProps {
  memberId: Id<"members">;
  onCloseProfile: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  memberId,
  onCloseProfile,
}) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change role",
    "Are you sure you want to change this member's role?"
  );
  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "Are you sure you want to leave this worksapce?"
  );
  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?"
  );

  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const avatarFallback = member?.user.name?.[0] ?? "M";

  const onLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess() {
          router.replace("/");
          toast.success("You left the workspace");
          onCloseProfile();
        },
        onError() {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  const onRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess() {
          router.replace("/");
          toast.success("Member removed");
          onCloseProfile();
        },
        onError() {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();

    if (!ok) return;

    updateMember(
      { id: memberId, role },
      {
        onSuccess() {
          toast.success("Role changed");
          onCloseProfile();
        },
        onError() {
          toast.error("Failed to change role");
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember)
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button size={"iconSm"} variant={"ghost"} onClick={onCloseProfile}>
            <XIcon className="size-5  stroke-[1.5]" />
          </Button>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );

  if (!member)
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button size={"iconSm"} variant={"ghost"} onClick={onCloseProfile}>
            <XIcon className="size-5  stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );

  return (
    <>
      <UpdateDialog />
      <LeaveDialog />
      <RemoveDialog />

      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button size={"iconSm"} variant={"ghost"} onClick={onCloseProfile}>
            <XIcon className="size-5  stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[255px] max-h-[255px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="rounded-md bg-sky-500 aspect-square text-5xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" && currentMember._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="w-full capitalize">
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant={"outline"} className="w-full" onClick={onRemove}>
                Remove
              </Button>
            </div>
          ) : currentMember?.role !== "admin" &&
            currentMember?._id === memberId ? (
            <div className="mt-4">
              <Button variant={"outline"} className="w-full" onClick={onLeave}>
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-9 rounded-md bg-muted ">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
