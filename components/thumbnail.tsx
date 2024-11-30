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
          {/* trunk-ignore(eslint/@next/next/no-img-element) */}
          <img
            src={url}
            alt="media"
            className="object-cover rounded-md size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[900px] border-none bg-transparent p-0 shadow-none">
        {/* trunk-ignore(eslint/@next/next/no-img-element) */}
        <img
          src={url}
          alt="media"
          className="object-cover rounded-md size-full"
        />
      </DialogContent>
    </Dialog>
  );
};
