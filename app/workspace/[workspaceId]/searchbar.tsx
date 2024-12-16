import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import { Info, Search } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/apis/workspaces/use-get-workspace";
import { useGetChannels } from "@/apis/channels/use-get-channels";
import { useGetMembers } from "@/apis/members/use-get-members";
import Link from "next/link";

export const Searchbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  return (
    <div className="bg-main-darker flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />

      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  asChild
                  key={channel._id}
                  onSelect={() => setOpen(false)}
                >
                  <Link
                    href={`/workspace/${workspaceId}/channel/${channel._id}`}
                  >
                    {channel.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  asChild
                  key={member._id}
                  onSelect={() => setOpen(false)}
                >
                  <Link href={`/workspace/${workspaceId}/member/${member._id}`}>
                    {member.user.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </CommandDialog>
      </div>

      <div className="flex-1 flex items-center ml-auto justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </div>
  );
};
