import { AuthCredentialsForm } from '@/components/app/auth-credentials-form';
import { AppButton, MessageBox } from '@/components/app/controls';
import { ScreenShell } from '@/components/app/screen-shell';
import { signUpWithEmail } from '@/features/auth/auth-service';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RegisterScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace('/bookmarks');
    }
  }, [user, router]);

  async function handleRegister(email: string, password: string) {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await signUpWithEmail(email, password);
      setSuccess('Registration successful. You can now continue to your bookmarks.');
      router.replace('/bookmarks');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell title="Register" subtitle="Create a new account with email and password.">
      <AuthCredentialsForm
        submitLabel="Create account"
        loading={loading}
        onSubmit={handleRegister}
        error={error}
      />
      {success ? <MessageBox message={success} tone="success" /> : null}
      <AppButton label="Already have an account? Login" variant="secondary" onPress={() => router.push('/login')} />
    </ScreenShell>
  );
}
