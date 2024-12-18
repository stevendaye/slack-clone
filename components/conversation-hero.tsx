import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

export const ConversationHero: React.FC<ConversationHeroProps> = ({
  name = "Member",
  image,
}) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback className="w-full h-full flex justify-center items-center object-cover bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold"># {name}</p>
      </div>

      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  );
};
