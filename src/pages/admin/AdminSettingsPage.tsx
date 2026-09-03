import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { useLodgeData } from '../../context/lodge-data-context';
import { saveSettings } from '../../services/store';

export function AdminSettingsPage() {
  const { settings, refresh } = useLodgeData();
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveSettings(form);
    await refresh();
    toast.success('Lodge settings saved.');
  }

  return (
    <form onSubmit={(event) => void save(event)} className="max-w-3xl space-y-4">
      <h1 className="font-serif text-4xl text-forest-900">Lodge settings</h1>
      <input value={form.lodgeName} onChange={(event) => update('lodgeName', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Lodge name" />
      <input value={form.phone} onChange={(event) => update('phone', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Phone" />
      <input value={form.email} onChange={(event) => update('email', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Email" />
      <input value={form.whatsapp} onChange={(event) => update('whatsapp', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="WhatsApp number" />
      <input value={form.address} onChange={(event) => update('address', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Address" />
      <input value={form.checkInTime} onChange={(event) => update('checkInTime', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Check-in time" />
      <input value={form.checkOutTime} onChange={(event) => update('checkOutTime', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Check-out time" />
      <input value={form.quietHours} onChange={(event) => update('quietHours', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Quiet hours" />
      <input value={form.curfew} onChange={(event) => update('curfew', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Curfew" />
      <input value={form.petsPolicy} onChange={(event) => update('petsPolicy', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Pets policy" />
      <input value={form.parking} onChange={(event) => update('parking', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Parking" />
      <input value={form.security} onChange={(event) => update('security', event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" placeholder="Security" />
      <input
        type="number"
        value={form.cancellationHoursBeforeCheckIn}
        onChange={(event) => update('cancellationHoursBeforeCheckIn', Number(event.target.value))}
        className="w-full rounded-2xl border border-gold-500/20 px-4 py-3"
        placeholder="Cancellation notice (hours)"
      />
      <textarea value={form.cancellationPolicy} onChange={(event) => update('cancellationPolicy', event.target.value)} rows={4} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" />
      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.socialLinks.facebook} onChange={(event) => update('socialLinks', { ...form.socialLinks, facebook: event.target.value })} placeholder="Facebook URL" className="rounded-2xl border border-gold-500/20 px-4 py-3" />
        <input value={form.socialLinks.instagram} onChange={(event) => update('socialLinks', { ...form.socialLinks, instagram: event.target.value })} placeholder="Instagram URL" className="rounded-2xl border border-gold-500/20 px-4 py-3" />
      </div>
      <Button type="submit">Save settings</Button>
    </form>
  );
}
