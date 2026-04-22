import { AppButton, MessageBox } from '@/components/app/controls';
import { ScreenShell } from '@/components/app/screen-shell';
import { AppTheme } from '@/components/app/theme';
import { useRequireAuth } from '@/features/auth/use-require-auth';
import { getBookmarkById } from '@/features/bookmarks/bookmarks-service';
import type { Bookmark } from '@/features/bookmarks/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ViewBookmarkScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, ready } = useRequireAuth();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookmark() {
      if (!user || !id) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getBookmarkById(user.id, id);
        if (!data) {
          setError('Bookmark not found');
          return;
        }

        setBookmark(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load bookmark');
      } finally {
        setLoading(false);
      }
    }

    if (ready) {
      loadBookmark();
    }
  }, [user, id, ready]);

  return (
    <ScreenShell title="View Bookmark" subtitle="Read bookmark details and choose next action.">
      {!ready || loading ? <ActivityIndicator /> : null}
      {error ? <MessageBox message={error} /> : null}

      {bookmark ? (
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{bookmark.description}</Text>
          <Text style={styles.label}>URL</Text>
          <Text style={styles.url}>{bookmark.url}</Text>
        </View>
      ) : null}

      {bookmark ? (
        <View style={styles.actions}>
          <Pressable style={styles.pill} onPress={() => router.push(`/bookmarks/${bookmark.id}/edit`)}>
            <Text style={styles.pillText}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.pill, styles.pillDanger]}
            onPress={() => router.push(`/bookmarks/${bookmark.id}/delete`)}>
            <Text style={styles.pillText}>Delete</Text>
          </Pressable>
        </View>
      ) : null}

      <AppButton label="Back to bookmarks" variant="secondary" onPress={() => router.push('/bookmarks')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    padding: 14,
    gap: 6,
    backgroundColor: AppTheme.colors.surface,
  },
  label: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  url: {
    fontSize: 15,
    color: AppTheme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surfaceMuted,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  pillDanger: {
    backgroundColor: '#f8e3e3',
  },
  pillText: {
    fontWeight: '600',
    color: AppTheme.colors.text,
  },
});
