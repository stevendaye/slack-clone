import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({ url }) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg cursor-zoom-in">
          <img
            src={url}
            className="object-cover rounded-md size-full"
            alt="chat-media"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[900px] border-none bg-transparent p-0 shadow-none">
        <img
          src={url}
          className="object-cover rounded-md size-full"
          alt="chat-media"
        />
      </DialogContent>
    </Dialog>
  );
};
