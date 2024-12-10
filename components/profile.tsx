import { Button } from "./ui/button";
import { AlertTriangle, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { useGetMember } from "@/api/members/use-get-member";
import { Id } from "@/convex/_generated/dataModel";
import { Separator } from "./ui/separator";
import Link from "next/link";

interface ProfileProps {
  memberId: Id<"members">;
  onCloseProfile: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  memberId,
  onCloseProfile,
}) => {
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  const avatarFallback = member?.user.name?.[0] ?? "M";

  if (isLoadingMember)
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
          <AvatarFallback className="aspect-square text-5xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{member.user.name}</p>
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
  );
};
