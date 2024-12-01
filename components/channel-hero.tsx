import { format } from "date-fns";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

export const ChannelHero: React.FC<ChannelHeroProps> = ({
  name,
  creationTime,
}) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="text-2xl font-bold flex items-center mb-2">
        <span># {name} </span>
      </div>

      <p className="font-normal text-slate-800 mb-4">
        This channel was created on {format(creationTime, "MMMM do, yyyy")}.
        This is the very begining of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
};
