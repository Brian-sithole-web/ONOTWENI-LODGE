import { X } from 'lucide-react';

interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const current = images[startIndex];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-forest-950/90 p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-cream hover:bg-white/20"
        aria-label="Close image viewer"
      >
        <X className="h-5 w-5" />
      </button>
      <img src={current} alt="" className="max-h-[86vh] max-w-full rounded-xl object-contain shadow-2xl" />
    </div>
  );
}
