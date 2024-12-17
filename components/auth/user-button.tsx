"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

import { useCurrentUser } from "@/components/auth/apis/use-current-user";

export const UserButton: React.FC = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!user) {
    return null;
  }

  const { image, name } = user;

  const avatarFallback = name!.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();

    /* Due to a bug in Convex Auth in the recent version,
     * here is a hacky way to successfully log out the user
     */
    location.reload();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="rounded-md hover:opacity-75 transition">
          <AvatarImage
            alt={name}
            src={image}
            className="w-full h-full object-cover rounded-md"
          />
          <AvatarFallback className="rounded-md bg-sky-600 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="center" className="w-60">
        <DropdownMenuItem
          onClick={handleSignOut}
          className="h-10 cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
