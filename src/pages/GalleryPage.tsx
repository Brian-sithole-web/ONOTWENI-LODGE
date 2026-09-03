import { useMemo, useState } from 'react';
import { Lightbox } from '../components/ui/Lightbox';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useLodgeData } from '../context/lodge-data-context';
import type { GalleryCategory } from '../types';

const categories: Array<{ id: 'all' | GalleryCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'lodge', label: 'Lodge' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'garden', label: 'Garden & Outdoors' },
  { id: 'surroundings', label: 'Surroundings' },
];

export function GalleryPage() {
  const { gallery } = useLodgeData();
  const [category, setCategory] = useState<'all' | GalleryCategory>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const images = useMemo(
    () => gallery.filter((item) => category === 'all' || item.category === category),
    [gallery, category],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        eyebrow="Gallery"
        title="A first look at Onothweni"
        description="Photography from Onothweni Lodge — rooms, interiors, terrace and the view into the surrounding landscape."
      />
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`rounded-full px-4 py-2 text-sm ${category === item.id ? 'bg-forest-900 text-cream' : 'bg-cream text-forest-900'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="masonry-gallery mt-10">
        {images.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(index)}
            className="group overflow-hidden rounded-2xl"
          >
            <img src={item.imageUrl} alt={item.caption} className="w-full object-cover transition duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {lightbox !== null ? (
        <Lightbox images={images.map((item) => item.imageUrl)} startIndex={lightbox} onClose={() => setLightbox(null)} />
      ) : null}
    </div>
  );
}
