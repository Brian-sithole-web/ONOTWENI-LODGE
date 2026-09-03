import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { AccountNav } from '../../components/layout/AccountNav';
import { useAuth } from '../../context/auth-context';
import { getInitials } from '../../lib/utils';
import { uploadLodgeImage } from '../../services/store';

export function ProfilePage() {
  const { user, updateCurrentUser, signOutUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');

  if (!user) {
    return null;
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateCurrentUser({ name, phoneNumber });
    toast.success('Profile updated.');
  }

  async function onImage(fileList: FileList | null) {
    if (!fileList?.[0]) {
      return;
    }
    const profileImage = await uploadLodgeImage(fileList[0], 'profiles');
    await updateCurrentUser({ profileImage });
    toast.success('Profile image updated.');
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-12">
      <AccountNav />
      <h1 className="font-serif text-4xl text-forest-900">My Profile</h1>
      <form onSubmit={(event) => void save(event)} className="luxury-card mt-8 space-y-4 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          {user.profileImage ? (
            <img src={user.profileImage} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-lg text-forest-950">
              {getInitials(user.name)}
            </span>
          )}
          <input type="file" accept="image/*" onChange={(event) => void onImage(event.target.files)} />
        </div>
        <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" />
        <input value={user.email} readOnly className="w-full rounded-2xl bg-cream px-4 py-3" />
        <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Phone number" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" />
        <div className="flex gap-3">
          <Button type="submit">Save profile</Button>
          <Button type="button" variant="ghost" onClick={() => void signOutUser()}>
            Logout
          </Button>
        </div>
      </form>
    </section>
  );
}
