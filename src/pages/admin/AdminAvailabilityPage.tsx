import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { AvailabilityCalendar } from '../../components/admin/AvailabilityCalendar';
import { Button } from '../../components/ui/Button';
import { useLodgeData } from '../../context/lodge-data-context';
import { createId } from '../../lib/utils';
import { deleteBlockedDate, saveBlockedDate } from '../../services/store';
import { useAuth } from '../../context/auth-context';

export function AdminAvailabilityPage() {
  const { user } = useAuth();
  const { rooms, occupancy, blockedDates, refresh } = useLodgeData();
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('Maintenance');
  const selectedRoom = rooms.find((room) => room.id === roomId) ?? rooms[0];

  async function blockDates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRoom || !startDate || !endDate || endDate <= startDate) {
      toast.error('Choose a valid date range.');
      return;
    }
    await saveBlockedDate({
      id: createId(),
      roomId: selectedRoom.id,
      startDate,
      endDate,
      reason,
      createdBy: user?.id ?? 'admin',
      createdAt: new Date().toISOString(),
    });
    await refresh();
    toast.success('Dates blocked.');
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest-900">Availability</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => setRoomId(room.id)}
            className={`rounded-full px-4 py-2 text-sm ${selectedRoom?.id === room.id ? 'bg-forest-900 text-cream' : 'bg-cream'}`}
          >
            {room.name}
          </button>
        ))}
      </div>
      {selectedRoom ? (
        <div className="luxury-card mt-8 rounded-3xl p-6">
          <AvailabilityCalendar room={selectedRoom} occupancy={occupancy} blockedDates={blockedDates} />
        </div>
      ) : null}
      <form onSubmit={(event) => void blockDates(event)} className="luxury-card mt-8 grid gap-4 rounded-3xl p-6 md:grid-cols-4">
        <label className="text-sm">
          Start
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2" />
        </label>
        <label className="text-sm">
          End
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2" />
        </label>
        <label className="text-sm">
          Reason
          <select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 w-full rounded-xl border border-gold-500/20 px-3 py-2">
            <option>Maintenance</option>
            <option>Private Events</option>
            <option>Unavailability</option>
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Block dates
          </Button>
        </div>
      </form>
      <div className="mt-6 space-y-3">
        {blockedDates
          .filter((block) => !selectedRoom || block.roomId === selectedRoom.id)
          .map((block) => (
            <div key={block.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
              <p className="text-sm">
                {block.startDate} → {block.endDate} · {block.reason}
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  void deleteBlockedDate(block.id).then(() => {
                    void refresh();
                    toast.success('Block removed.');
                  })
                }
              >
                Remove
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
