import { AppButton, MessageBox } from '@/components/app/controls';
import { ScreenShell } from '@/components/app/screen-shell';
import { AppTheme } from '@/components/app/theme';
import { useRequireAuth } from '@/features/auth/use-require-auth';
import { listBookmarks } from '@/features/bookmarks/bookmarks-service';
import type { Bookmark } from '@/features/bookmarks/types';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';

export default function BookmarksScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { ready, user } = useRequireAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 960;

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookmarks = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listBookmarks(user.id);
      setBookmarks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load bookmarks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (ready) {
      loadBookmarks();
    }
  }, [ready, loadBookmarks]);

  async function handleLogout() {
    await signOut();
    router.replace('/');
  }

  async function openBookmarkUrl(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      setError('Could not open bookmark URL');
    }
  }

  if (!ready) {
    return (
      <ScreenShell title="Bookmarks" subtitle="Loading session...">
        <ActivityIndicator />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Bookmarks" subtitle="View, add, edit and delete your bookmarks.">
      <View style={[styles.actionsRow, isWide && styles.actionsRowWide]}>
        <AppButton label="Add bookmark" onPress={() => router.push('/bookmarks/add')} />
        <AppButton label="Logout" variant="secondary" onPress={handleLogout} />
      </View>

      {error ? <MessageBox message={error} /> : null}

      {loading ? <ActivityIndicator /> : null}

      {!loading && bookmarks.length === 0 ? (
        <MessageBox message="No bookmarks yet. Add your first one." tone="success" />
      ) : null}

      <View style={[styles.grid, isWide && styles.gridWide]}>
        {bookmarks.map((bookmark) => (
          <View key={bookmark.id} style={styles.card}>
            <Pressable style={styles.cardLinkArea} onPress={() => openBookmarkUrl(bookmark.url)}>
              <Text style={styles.cardTitle}>{bookmark.description}</Text>
              <Text style={styles.cardUrl}>{bookmark.url}</Text>
            </Pressable>
            <View style={styles.cardActions}>
              <Pressable style={styles.actionPill} onPress={() => router.push(`/bookmarks/${bookmark.id}`)}>
                <Text style={styles.actionText}>View</Text>
              </Pressable>
              <Pressable
                style={styles.actionPill}
                onPress={() => router.push(`/bookmarks/${bookmark.id}/edit`)}>
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.actionPill, styles.deletePill]}
                onPress={() => router.push(`/bookmarks/${bookmark.id}/delete`)}>
                <Text style={styles.actionText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    gap: 10,
  },
  actionsRowWide: {
    flexDirection: 'row',
  },
  grid: {
    gap: 12,
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 14,
    gap: 8,
    flexBasis: 340,
    flexGrow: 1,
  },
  cardLinkArea: {
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  cardUrl: {
    color: AppTheme.colors.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionPill: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: AppTheme.colors.surfaceMuted,
  },
  deletePill: {
    backgroundColor: '#f8e3e3',
  },
  actionText: {
    fontWeight: '600',
    color: AppTheme.colors.text,
  },
});
