"use client";

import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";

import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { useGetWorkspacePublic } from "@/apis/workspaces/use-get-workspace-public";
import { Loader } from "lucide-react";
import { useJoin } from "@/apis/workspaces/use-join";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/* Same as const workspaceId = useWorkspaceId() */
interface JoinPageProps {
  params: {
    workspaceId: Id<"workspaces">;
  };
}

const JoinPage = ({ params }: JoinPageProps) => {
  const router = useRouter();
  const { mutate, isPending } = useJoin();
  const { data, isLoading } = useGetWorkspacePublic({ id: params.workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${params.workspaceId}`);
    }
  }, [router, params.workspaceId, isMember]);

  const handleCompleteJoin = (value: string) => {
    mutate(
      { workspaceId: params.workspaceId, joinCode: value },
      {
        onSuccess(id) {
          toast.success("Workspace joined successfully");
          router.replace(`/workspace/${id}`);
        },
        onError() {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white gap-y-8 p-8">
      <Image src={"/logo.png"} width={60} height={60} alt="Slack Clone Logo" />

      <div className="flex flex-col items-center justify-center gap-y-4 max-w-md">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-[16px] text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>

        <VerificationInput
          onComplete={handleCompleteJoin}
          length={6}
          classNames={{
            container: cn(
              "flex gap-y-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "flex items-center justify-center text-lg font-medium uppercase h-auto rounded-md border border-gray-300 text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>

      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} disabled={isPending} asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
