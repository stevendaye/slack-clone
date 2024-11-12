import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";

import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile, XIcon } from "lucide-react";

import "quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}

const Editor = ({
  variant = "create",
  innerRef,
  defaultValue = [],
  placeholder = "Write something",
  onCancel,
  onSubmit,
  disabled,
}: EditorProps) => {
  const [text, setText] = useState<string>("");
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);
  const [image, setImage] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Using useRef instead to avoid re-render issues
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  /* Using refs for most elements in useEffect, to avoid the entire editor
   * to re-render o re-initialize on every state change
   */
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialiaze the Quill Editor
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    //Set Quill Editor Options
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const selectedImage =
                  imageElementRef.current?.files?.[0] || null;
                const hasEmptyMessage =
                  !selectedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (hasEmptyMessage) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: selectedImage });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index ?? 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    // Controlling the Quill Editor from outside the component
    if (innerRef) {
      innerRef.current = quill;
    }

    // Remove Quill Editor from the DOM on unmount
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) container.innerHTML = "";
      if (quillRef.current) quillRef.current = null;
      if (innerRef) innerRef.current = null;
    };
  }, [innerRef]);

  // Toggle Toolbar
  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) toolbarElement.classList.toggle("hidden");
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index ?? 0, emoji.native);
  };

  // Trim and get rid of html element within the Quil Editor
  const hasEmptyMessage =
    !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
      />

      <div
        className={cn(
          `flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300
          focus-within:shadow-sm trnasition bg-white`,
          disabled && "opacity-50"
        )}
      >
        {/* Initialize Quill Editor */}
        <div ref={containerRef} className="h-full ql-custom" />

        {/* Display selected image in editor */}
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex justify-center items-center group/image">
              <Hint label="Remove image">
                <button
                  className="absolute hidden rounded-full bg-black/70 hover:bg-black -top-2.5 -right-2.5 
                  text-white size-6 z-[4] border-2 border-white items-center justify-center group-hover/image:flex "
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>

              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden object-cover border"
              />
            </div>
          </div>
        )}

        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              variant={"ghost"}
              size={"iconSm"}
              onClick={toggleToolbar}
              disabled={disabled}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>

          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button variant={"ghost"} size={"iconSm"} disabled={disabled}>
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {variant === "create" && (
            <Hint label="Image">
              <Button
                variant={"ghost"}
                size={"iconSm"}
                onClick={() => imageElementRef.current?.click()}
                disabled={disabled}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}

          {variant === "create" && (
            <Button
              size={"iconSm"}
              className={cn(
                hasEmptyMessage
                  ? "bg-white hover:bg-white text-muted-foreground"
                  : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white",
                "ml-auto"
              )}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                });
              }}
              disabled={disabled || hasEmptyMessage}
            >
              <MdSend className="size-4" />
            </Button>
          )}

          {variant === "update" && (
            <div className="flex flex-row-reverse items-center gap-x-2 ml-auto">
              <Button
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                size={"sm"}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                disabled={disabled || hasEmptyMessage}
              >
                Save
              </Button>
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            !hasEmptyMessage && "opacity-100"
          )}
        >
          <p>
            <b>Shift + return</b> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
