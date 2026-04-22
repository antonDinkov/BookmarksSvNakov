import { BookmarkForm } from '@/components/app/bookmark-form';
import { AppButton, MessageBox } from '@/components/app/controls';
import { ScreenShell } from '@/components/app/screen-shell';
import { useRequireAuth } from '@/features/auth/use-require-auth';
import { getBookmarkById, updateBookmark } from '@/features/bookmarks/bookmarks-service';
import type { BookmarkInput } from '@/features/bookmarks/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function EditBookmarkScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, ready } = useRequireAuth();
  const [initialValue, setInitialValue] = useState<BookmarkInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
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

        setInitialValue({
          url: data.url,
          description: data.description,
        });
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

  async function handleUpdate(payload: BookmarkInput) {
    if (!user || !id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateBookmark(user.id, id, payload);
      router.replace(`/bookmarks/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update bookmark');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell title="Edit Bookmark" subtitle="Update URL and description.">
      {!ready || loadingInitial ? <ActivityIndicator /> : null}
      {error ? <MessageBox message={error} /> : null}
      {initialValue ? (
        <BookmarkForm
          initialValue={initialValue}
          submitLabel="Save changes"
          loading={loading}
          onSubmit={handleUpdate}
        />
      ) : null}
      <AppButton label="Back to bookmark" variant="secondary" onPress={() => router.push(`/bookmarks/${id}`)} />
    </ScreenShell>
  );
}
