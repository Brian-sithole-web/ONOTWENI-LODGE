import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import {
  getLocalSessionUserId,
  getUserById,
  initializeData,
  setLocalSessionUserId,
  upsertUser,
} from '../services/store';
import type { AppUser, UserRole } from '../types';
import { AuthContext } from './auth-context';

function buildUser(params: {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  role: UserRole;
  existing?: AppUser | null;
}): AppUser {
  const now = new Date().toISOString();
  return {
    id: params.id,
    name: params.name,
    email: params.email,
    profileImage: params.profileImage,
    phoneNumber: params.existing?.phoneNumber ?? '',
    role: params.existing?.role ?? params.role,
    createdAt: params.existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      await initializeData();
      if (isFirebaseConfigured && auth) {
        return onAuthStateChanged(auth, async (firebaseUser) => {
          if (!firebaseUser) {
            if (!cancelled) {
              setUser(null);
              setIsLoading(false);
            }
            return;
          }
          const existing = await getUserById(firebaseUser.uid);
          const next = buildUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName ?? existing?.name ?? 'Guest',
            email: firebaseUser.email ?? '',
            profileImage: firebaseUser.photoURL ?? existing?.profileImage ?? '',
            role: existing?.role === 'admin' ? 'admin' : 'guest',
            existing,
          });
          await upsertUser(next);
          if (!cancelled) {
            setUser(next);
            setIsLoading(false);
          }
        });
      }

      const sessionId = getLocalSessionUserId();
      if (sessionId) {
        const existing = await getUserById(sessionId);
        if (!cancelled) {
          setUser(existing);
        }
      }
      if (!cancelled) {
        setIsLoading(false);
      }
      return undefined;
    }

    const result = boot();
    return () => {
      cancelled = true;
      void result.then((unsubscribe) => unsubscribe?.());
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth || !googleProvider) {
      throw new Error('Google sign-in is not configured yet.');
    }
    await signInWithPopup(auth, googleProvider);
  }, []);

  const continuePreview = useCallback(async (role: UserRole) => {
    const previewId = role === 'admin' ? 'preview-admin' : 'preview-guest';
    const existing = await getUserById(previewId);
    const next = buildUser({
      id: previewId,
      name: existing?.name || (role === 'admin' ? 'Lodge Administrator' : 'Preview Guest'),
      email: existing?.email || (role === 'admin' ? 'admin@onothweni.local' : 'guest@onothweni.local'),
      profileImage: existing?.profileImage ?? '',
      role: existing?.role ?? role,
      existing,
    });
    await upsertUser(next);
    setLocalSessionUserId(previewId);
    setUser(next);
  }, []);

  const signOutUser = useCallback(async () => {
    if (auth) {
      await signOut(auth);
    }
    setLocalSessionUserId(null);
    setUser(null);
  }, []);

  const updateCurrentUser = useCallback(
    async (updates: Partial<Pick<AppUser, 'name' | 'phoneNumber' | 'profileImage'>>) => {
      if (!user) {
        return;
      }
      const next: AppUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await upsertUser(next);
      setUser(next);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isFirebaseConfigured,
      signInWithGoogle,
      continuePreview,
      signOutUser,
      updateCurrentUser,
    }),
    [user, isLoading, signInWithGoogle, continuePreview, signOutUser, updateCurrentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
