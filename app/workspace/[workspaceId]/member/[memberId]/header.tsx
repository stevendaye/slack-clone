import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaChevronDown } from "react-icons/fa";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  memberName,
  memberImage,
  onClick,
}) => {
  const avatarFallback = memberName?.charAt(0).toUpperCase();

  return (
    <div className="flex items-center h-[49px] px-4 bg-white border-b overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size={"sm"}
        onClick={onClick}
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};
