import { AppButton, MessageBox } from '@/components/app/controls';
import { ScreenShell } from '@/components/app/screen-shell';
import { useRequireAuth } from '@/features/auth/use-require-auth';
import { deleteBookmark, getBookmarkById } from '@/features/bookmarks/bookmarks-service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';

export default function DeleteBookmarkScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, ready } = useRequireAuth();
  const [description, setDescription] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookmark() {
      if (!user || !id) {
        return;
      }

      setLoadingInitial(true);
      setError(null);

      try {
        const data = await getBookmarkById(user.id, id);
        if (!data) {
          setError('Bookmark not found');
          return;
        }

        setDescription(data.description);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load bookmark');
      } finally {
        setLoadingInitial(false);
      }
    }

    if (ready) {
      loadBookmark();
    }
  }, [user, id, ready]);

  async function handleDelete() {
    if (!user || !id) {
      return;
    }

    setLoadingDelete(true);
    setError(null);

    try {
      await deleteBookmark(user.id, id);
      router.replace('/bookmarks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete bookmark');
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <ScreenShell title="Delete Bookmark" subtitle="Confirm before removing this bookmark.">
      {!ready || loadingInitial ? <ActivityIndicator /> : null}
      {error ? <MessageBox message={error} /> : null}
      {description ? <Text>You are about to delete: {description}</Text> : null}
      <AppButton
        label="Delete bookmark"
        variant="danger"
        loading={loadingDelete}
        onPress={handleDelete}
      />
      <AppButton label="Cancel" variant="secondary" onPress={() => router.push(`/bookmarks/${id}`)} />
    </ScreenShell>
  );
}
