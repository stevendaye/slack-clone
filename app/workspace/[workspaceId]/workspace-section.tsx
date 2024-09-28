import React from "react";
import { useToggle } from "react-use";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface WorkspaceSectionProps {
  label: string;
  hint: string;
  children: React.ReactNode;
  onNew?: () => void;
}

export const WorkspaceSection: React.FC<WorkspaceSectionProps> = ({
  label,
  hint,
  children,
  onNew,
}) => {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-3.5 group">
        <Button
          variant={"transparent"}
          className="p-0.5 text-sm text-[#F9EDFFcc] shrink-0 size-6"
          onClick={toggle}
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", !on && "-rotate-90")}
          />
        </Button>

        <Button
          variant={"transparent"}
          className="px-1.5 group text-sm text-[#F9EDFFcc] flex justify-center items-start overflow-hidden"
        >
          <span className="truncate">{label}</span>
        </Button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              variant={"transparent"}
              size={"iconSm"}
              onClick={onNew}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#F9EDFFcc] size-6 shrink-0"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};
