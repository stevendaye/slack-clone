"use client";

import { useEffect, useMemo } from "react";
import { Loader } from "lucide-react";

import { UserButton } from "@/components/auth/user-button";
import { useGetWorkspaces } from "@/apis/workspaces/use-get-workspaces";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import Image from "next/image";
import { useCurrentUser } from "@/components/auth/apis/use-current-user";
export default function Home() {
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();

  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading: isLoadingWorkspace } = useGetWorkspaces();

  const router = useRouter();

  const workspaceId = useMemo(() => {
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoadingWorkspace) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!workspaceId && !open) {
      setOpen(true);
    }
  }, [isLoadingWorkspace, workspaceId, open, setOpen, router]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white gap-y-8 p-8">
      <Image src={"/logo.png"} width={60} height={60} alt="Slack Clone Logo" />

      <div className="flex flex-col items-center justify-center gap-y-4 max-w-lg">
        <div className="flex flex-col items-center justify-center gap-y-2">
          {!isLoadingUser && (
            <h1 className="text-2xl font-bold w-full text-center">
              Welcome {user?.name} on this Lightweight Clone of Slack{" "}
            </h1>
          )}
        </div>

        <UserButton />
      </div>

      {!isLoadingUser && (
        <div className="flex flex-col justify-center items-center max-w-lg gap-2">
          <p className="text-lg font-medium text-center">
            We are now preparing your workspace. We will be redirecting you
            shortly to things that matter.
          </p>

          <Loader className="size-7 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
