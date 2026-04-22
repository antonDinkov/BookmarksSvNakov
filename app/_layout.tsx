import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/providers/auth-provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="login" options={{ title: 'Login' }} />
          <Stack.Screen name="register" options={{ title: 'Register' }} />
          <Stack.Screen name="bookmarks/index" options={{ title: 'Bookmarks' }} />
          <Stack.Screen name="bookmarks/add" options={{ title: 'Add Bookmark' }} />
          <Stack.Screen name="bookmarks/[id]" options={{ title: 'View Bookmark' }} />
          <Stack.Screen name="bookmarks/[id]/edit" options={{ title: 'Edit Bookmark' }} />
          <Stack.Screen name="bookmarks/[id]/delete" options={{ title: 'Delete Bookmark' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
