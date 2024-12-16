import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "@/apis/messages/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useCreateUploadURL } from "@/apis/upload/use-create-upload-url";
import { Id } from "@/convex/_generated/dataModel";

// Dynamically import Quill Editor as it does not support server side render
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
  conversationId: Id<"conversations">;
}

type TextMessage = {
  body: string;
  image: File | null;
};

type CreateMessageValues = {
  body: string;
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  image: Id<"_storage"> | undefined;
};

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder,
  conversationId,
}) => {
  const [editorKey, setEditorKey] = useState<number>(0);
  const [isPending, setIsPending] = useState<boolean>(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: createUploadURL } = useCreateUploadURL();

  const onSubmit = async ({ body, image }: TextMessage) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        workspaceId,
        conversationId,
        image: undefined,
      };

      if (image) {
        const url = await createUploadURL({}, { throwError: true });

        if (!url) throw new Error("We cannot find the url");

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!res.ok) throw new Error("Failed to upload image");

        const { storageId } = await res.json();

        values.image = storageId;
      }

      createMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        disabled={isPending}
        innerRef={editorRef}
        onSubmit={onSubmit}
      />
    </div>
  );
};
