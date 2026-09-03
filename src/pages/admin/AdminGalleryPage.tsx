import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { useLodgeData } from '../../context/lodge-data-context';
import { createId } from '../../lib/utils';
import { deleteGalleryImage, saveGalleryImage, uploadLodgeImage } from '../../services/store';
import type { GalleryCategory } from '../../types';

const categories: GalleryCategory[] = ['rooms', 'lodge', 'interiors', 'garden', 'surroundings'];

export function AdminGalleryPage() {
  const { gallery, refresh } = useLodgeData();
  const [category, setCategory] = useState<GalleryCategory>('rooms');
  const [caption, setCaption] = useState('');

  async function upload(fileList: FileList | null) {
    if (!fileList?.[0]) {
      return;
    }
    const imageUrl = await uploadLodgeImage(fileList[0], 'gallery');
    await saveGalleryImage({
      id: createId(),
      category,
      imageUrl,
      caption: caption || fileList[0].name,
      sortOrder: gallery.length,
      createdAt: new Date().toISOString(),
    });
    setCaption('');
    await refresh();
    toast.success('Image added to the gallery.');
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest-900">Gallery</h1>
      <p className="mt-2 text-stone-ink">Upload lodge photography here. Guest-facing pages will use these images once they are added.</p>
      <div className="luxury-card mt-6 flex flex-wrap items-end gap-4 rounded-3xl p-6">
        <label className="text-sm">
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value as GalleryCategory)} className="mt-1 block rounded-xl border border-gold-500/20 px-3 py-2">
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Caption
          <input value={caption} onChange={(event) => setCaption(event.target.value)} className="mt-1 block rounded-xl border border-gold-500/20 px-3 py-2" />
        </label>
        <input type="file" accept="image/*" onChange={(event) => void upload(event.target.files)} />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.map((image) => (
          <article key={image.id} className="overflow-hidden rounded-2xl bg-white shadow">
            <img src={image.imageUrl} alt={image.caption} className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between p-3 text-sm">
              <span>{image.caption}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  void deleteGalleryImage(image.id).then(() => {
                    void refresh();
                  })
                }
              >
                Remove
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
