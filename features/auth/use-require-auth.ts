import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useRequireAuth() {
  const { initialized, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!user) {
      router.replace('/login');
    }
  }, [initialized, user, router]);

  return {
    ready: initialized && Boolean(user),
    user,
  };
}
