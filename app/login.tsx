import { AuthCredentialsForm } from '@/components/app/auth-credentials-form';
import { AppButton, MessageBox } from '@/components/app/controls';
import { ScreenShell } from '@/components/app/screen-shell';
import { signInWithEmail } from '@/features/auth/auth-service';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace('/bookmarks');
    }
  }, [user, router]);

  async function handleLogin(email: string, password: string) {
    setError(null);
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.replace('/bookmarks');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell title="Login" subtitle="Access your bookmark collection.">
      <AuthCredentialsForm submitLabel="Login" loading={loading} onSubmit={handleLogin} error={error} />
      <AppButton label="Need an account? Register" variant="secondary" onPress={() => router.push('/register')} />
      <MessageBox message="After login you will be redirected to Bookmarks." tone="success" />
    </ScreenShell>
  );
}
