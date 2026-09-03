import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useLodgeData } from '../context/lodge-data-context';
import { saveContactMessage } from '../services/store';

export function ContactPage() {
  const { settings } = useLodgeData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const mapQuery = encodeURIComponent(settings.address || 'Manguzi, KwaZulu-Natal, South Africa');
  const whatsappNumber = settings.whatsapp.replace(/\D/g, '');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSending(true);
    await saveContactMessage({ name, email, phoneNumber, subject, message });
    toast.success('Your message has been sent.');
    setName('');
    setEmail('');
    setPhoneNumber('');
    setSubject('');
    setMessage('');
    setSending(false);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
      <div>
        <SectionHeader align="left" eyebrow="Contact" title="We would love to hear from you" />
        <form onSubmit={(event) => void submit(event)} className="mt-8 space-y-4">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" required />
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" required />
          <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Phone Number" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" />
          <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" required />
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message" rows={6} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" required />
          <Button type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send Message'}
          </Button>
        </form>
      </div>
      <div className="space-y-6">
        <div className="luxury-card rounded-3xl p-6">
          <h2 className="font-serif text-3xl text-forest-900">Location</h2>
          <p className="mt-3 text-stone-ink">
            Onothweni Lodge
            <br />
            {settings.address}
          </p>
          <p className="mt-4 text-sm text-stone-ink">{settings.email || 'Email will appear once the administrator adds it.'}</p>
          <p className="text-sm text-stone-ink">{settings.phone || 'Phone will appear once the administrator adds it.'}</p>
          {whatsappNumber ? (
            <a href={`https://wa.me/${whatsappNumber}`} className="mt-4 inline-block text-gold-700" target="_blank" rel="noreferrer">
              Message on WhatsApp
            </a>
          ) : null}
        </div>
        <iframe
          title="Lodge area map"
          className="h-80 w-full rounded-3xl border border-gold-500/20"
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        />
      </div>
    </div>
  );
}
