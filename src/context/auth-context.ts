import { createContext, useContext } from 'react';
import type { AppUser, UserRole } from '../types';

export interface AuthContextValue {
  user: AppUser | null;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  continuePreview: (role: UserRole) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateCurrentUser: (updates: Partial<Pick<AppUser, 'name' | 'phoneNumber' | 'profileImage'>>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
