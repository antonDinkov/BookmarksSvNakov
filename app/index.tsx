import { AppButton } from '@/components/app/controls';
import { ScreenShell } from '@/components/app/screen-shell';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { initialized, user } = useAuth();

  useEffect(() => {
    if (initialized && user) {
      router.replace('/bookmarks');
    }
  }, [initialized, user, router]);

  return (
    <ScreenShell
      title="Bookmarks"
      subtitle="Store your favorite links in one place and manage them from mobile or desktop web.">
      <Text>Welcome! Please log in or create an account to continue.</Text>
      <AppButton label="Login" onPress={() => router.push('/login')} />
      <AppButton label="Register" variant="secondary" onPress={() => router.push('/register')} />
    </ScreenShell>
  );
}
