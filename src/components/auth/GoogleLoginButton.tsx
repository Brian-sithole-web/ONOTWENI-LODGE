import { toast } from 'sonner';
import { useAuth } from '../../context/auth-context';
import { Button } from '../ui/Button';

export function GoogleLoginButton({ onSuccess }: { onSuccess?: () => void }) {
  const { isFirebaseConfigured, signInWithGoogle, continuePreview } = useAuth();

  async function handleGoogle() {
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in with Google.');
    }
  }

  return (
    <div className="space-y-3">
      {isFirebaseConfigured ? (
        <Button className="w-full" onClick={() => void handleGoogle()}>
          Continue with Google
        </Button>
      ) : (
        <div className="space-y-3 rounded-2xl bg-cream p-4 text-sm text-stone-ink">
          <p>
            Google sign-in activates once Firebase Authentication is configured. Until then, you can preview the guest
            and administrator experience locally.
          </p>
          <Button
            className="w-full"
            onClick={() =>
              void continuePreview('guest').then(() => {
                toast.success('Preview guest session started.');
                onSuccess?.();
              })
            }
          >
            Continue as guest preview
          </Button>
          <Button
            variant="forest"
            className="w-full"
            onClick={() =>
              void continuePreview('admin').then(() => {
                toast.success('Administrator preview started.');
                onSuccess?.();
              })
            }
          >
            Continue as administrator preview
          </Button>
        </div>
      )}
    </div>
  );
}
