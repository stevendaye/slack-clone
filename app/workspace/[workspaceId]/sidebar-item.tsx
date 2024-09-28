import React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
  "flex items-center justify-start gap-1.5 font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  id,
  variant,
}) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      asChild
      variant={"transparent"}
      size={"sm"}
      className={cn(sidebarItemVariants({ variant: variant }))}
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-4 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
