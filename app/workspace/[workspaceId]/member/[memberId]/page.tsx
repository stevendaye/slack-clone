"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { useCreateOrGetConversation } from "@/api/conversations/user-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

import { Conversation } from "./conversation";

const MemberPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess(conversationId) {
          setConversationId(conversationId);
        },
        onError() {
          toast.error("Failed to set conversation");
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );

  if (!conversationId)
    return (
      <div className="flex flex-col gapy-y-2 items-center h-full justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Coversation not found
        </span>
      </div>
    );

  return <Conversation id={conversationId} />;
};

export default MemberPage;
