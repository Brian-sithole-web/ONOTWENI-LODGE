import { useLodgeData } from '../context/lodge-data-context';

export function PrivacyPage() {
  const { settings } = useLodgeData();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-5xl text-forest-900">Privacy Policy</h1>
      <p className="mt-6 text-stone-ink">
        {settings.lodgeName} collects guest names, email addresses, phone numbers and booking details so that we can
        process stay requests. Google sign-in is handled by Google and Firebase Authentication. We do not ask for your
        Google password. Booking records are visible to the guest who created them and to lodge administrators.
      </p>
    </article>
  );
}

export function TermsPage() {
  const { settings } = useLodgeData();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-5xl text-forest-900">Terms & Conditions</h1>
      <div className="mt-6 space-y-4 text-stone-ink">
        <p>Check-in: {settings.checkInTime}. Guests should share their expected arrival time in advance where possible.</p>
        <p>Check-out: {settings.checkOutTime}.</p>
        <p>Quiet hours / curfew: {settings.quietHours}.</p>
        <p>{settings.petsPolicy}</p>
        <p>{settings.parking}</p>
        <p>{settings.security}</p>
        <p>{settings.cancellationPolicy}</p>
      </div>
    </article>
  );
}

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-32 text-center">
      <h1 className="font-serif text-5xl text-forest-900">Page not found</h1>
      <a href="/" className="mt-6 inline-block text-gold-700">
        Return home
      </a>
    </section>
  );
}
