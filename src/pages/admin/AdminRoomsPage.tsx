import { useState } from 'react';
import { toast } from 'sonner';
import { RoomForm } from '../../components/admin/RoomForm';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useLodgeData } from '../../context/lodge-data-context';
import { archiveRoom } from '../../services/store';
import type { Room } from '../../types';
import { formatCurrency } from '../../lib/utils';

export function AdminRoomsPage() {
  const { rooms, bookings, refresh } = useLodgeData();
  const [editing, setEditing] = useState<Room | null | undefined>(undefined);
  const [archiveId, setArchiveId] = useState<string | null>(null);

  async function archive() {
    if (!archiveId) {
      return;
    }
    const hasBookings = bookings.some((booking) => booking.roomId === archiveId);
    await archiveRoom(archiveId);
    await refresh();
    toast.success(
      hasBookings
        ? 'Room archived. Existing bookings are preserved.'
        : 'Room archived and hidden from new bookings.',
    );
    setArchiveId(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-forest-900">Rooms</h1>
        <Button onClick={() => setEditing(null)}>Add Room</Button>
      </div>
      {editing !== undefined ? (
        <div className="luxury-card mb-8 rounded-3xl p-6">
          <RoomForm
            room={editing}
            onCancel={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined);
              void refresh();
            }}
          />
        </div>
      ) : null}
      <div className="grid gap-4">
        {rooms.map((room) => (
          <article key={room.id} className="luxury-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
            <div>
              <h2 className="font-serif text-2xl">{room.name}</h2>
              <p className="text-sm text-stone-ink">
                {room.numberOfUnits} unit{room.numberOfUnits === 1 ? '' : 's'} · {formatCurrency(room.pricePerNight)} ·{' '}
                {room.isActive ? 'Active' : 'Archived'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setEditing(room)}>
                Edit
              </Button>
              {room.isActive ? (
                <Button size="sm" variant="ghost" onClick={() => setArchiveId(room.id)}>
                  Archive
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {archiveId ? (
        <ConfirmDialog
          title="Archive this room?"
          message="Rooms are archived rather than deleted so existing booking records remain intact."
          confirmLabel="Archive room"
          onClose={() => setArchiveId(null)}
          onConfirm={() => void archive()}
        />
      ) : null}
    </div>
  );
}
