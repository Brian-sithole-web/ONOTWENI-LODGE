import { useState } from 'react';
import { Lightbox } from '../ui/Lightbox';

export function RoomGallery({ images, roomName }: { images: string[]; roomName: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-sand text-stone-ink">
        Gallery images will appear here once they are uploaded.
      </div>
    );
  }

  return (
    <div>
      <button type="button" className="block w-full overflow-hidden rounded-3xl" onClick={() => setLightbox(active)}>
        <img src={images[active]} alt={roomName} className="aspect-[4/3] w-full object-cover" />
      </button>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.slice(0, 8).map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActive(index)}
              className={`overflow-hidden rounded-xl ${active === index ? 'ring-2 ring-gold-400' : ''}`}
            >
              <img src={image} alt="" className="h-20 w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      {lightbox !== null ? <Lightbox images={images} startIndex={lightbox} onClose={() => setLightbox(null)} /> : null}
    </div>
  );
}
