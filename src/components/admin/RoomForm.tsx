import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { Room, RoomType } from '../../types';
import { AMENITY_OPTIONS } from '../../lib/constants';
import { createId } from '../../lib/utils';
import { saveRoom, uploadLodgeImage } from '../../services/store';
import { Button } from '../ui/Button';

interface RoomFormProps {
  room?: Room | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function RoomForm({ room, onSaved, onCancel }: RoomFormProps) {
  const [name, setName] = useState(room?.name ?? '');
  const [roomType, setRoomType] = useState<RoomType>(room?.roomType ?? 'double');
  const [description, setDescription] = useState(room?.description ?? '');
  const [capacityAdults, setCapacityAdults] = useState(room?.capacityAdults ?? 2);
  const [capacityChildren, setCapacityChildren] = useState(room?.capacityChildren ?? 0);
  const [numberOfUnits, setNumberOfUnits] = useState(room?.numberOfUnits ?? 1);
  const [pricePerNight, setPricePerNight] = useState(room?.pricePerNight === null || room?.pricePerNight === undefined ? '' : String(room.pricePerNight));
  const [amenities, setAmenities] = useState<string[]>(room?.amenities ?? []);
  const [images, setImages] = useState<string[]>(room?.images ?? []);
  const [isActive, setIsActive] = useState(room?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity],
    );
  }

  async function onUpload(fileList: FileList | null) {
    if (!fileList?.[0]) {
      return;
    }
    const url = await uploadLodgeImage(fileList[0], 'rooms');
    setImages((current) => [...current, url]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error('Please complete the room name and description.');
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();
    const next: Room = {
      id: room?.id ?? createId(),
      name: name.trim(),
      roomType,
      description: description.trim(),
      capacityAdults,
      capacityChildren,
      numberOfUnits,
      pricePerNight: pricePerNight === '' ? null : Number(pricePerNight),
      amenities,
      images,
      isActive,
      createdAt: room?.createdAt ?? now,
      updatedAt: now,
    };
    await saveRoom(next);
    toast.success('Room saved.');
    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Room name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2" />
        </label>
        <label className="text-sm">
          Room type
          <select value={roomType} onChange={(event) => setRoomType(event.target.value as RoomType)} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2">
            <option value="double">Double</option>
            <option value="family">Family</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      <label className="block text-sm">
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2" />
      </label>
      <div className="grid gap-4 md:grid-cols-4">
        <label className="text-sm">
          Adult capacity
          <input type="number" min={1} value={capacityAdults} onChange={(event) => setCapacityAdults(Number(event.target.value))} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2" />
        </label>
        <label className="text-sm">
          Child capacity
          <input type="number" min={0} value={capacityChildren} onChange={(event) => setCapacityChildren(Number(event.target.value))} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2" />
        </label>
        <label className="text-sm">
          Available units
          <input type="number" min={1} value={numberOfUnits} onChange={(event) => setNumberOfUnits(Number(event.target.value))} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2" />
        </label>
        <label className="text-sm">
          Price per night (ZAR)
          <input value={pricePerNight} onChange={(event) => setPricePerNight(event.target.value)} placeholder="Leave blank for rate on request" className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2" />
        </label>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm">Amenities</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {AMENITY_OPTIONS.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
              {amenity}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <p className="mb-2 text-sm">Images</p>
        <input type="file" accept="image/*" onChange={(event) => void onUpload(event.target.files)} />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((image) => (
            <button key={image} type="button" onClick={() => setImages((current) => current.filter((item) => item !== image))}>
              <img src={image} alt="" className="h-20 w-full rounded-xl object-cover" />
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
        Room is available for booking
      </label>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save room'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
