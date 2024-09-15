"use client";
import { useEffect, useMemo } from "react";

import { UserButton } from "@/components/auth/user-button";
import { useGetWorkspaces } from "@/worskapaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/worskapaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";

export default function Home() {
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();

  const router = useRouter();

  const workspaceId = useMemo(() => {
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!workspaceId && !open) {
      setOpen(true);
    }
  }, [isLoading, workspaceId, open, setOpen, router]);

  return (
    <div className="">
      <UserButton />
    </div>
  );
}
