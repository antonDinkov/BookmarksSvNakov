import { BookmarkForm } from '@/components/app/bookmark-form';
import { AppButton, MessageBox } from '@/components/app/controls';
import { ScreenShell } from '@/components/app/screen-shell';
import { useRequireAuth } from '@/features/auth/use-require-auth';
import { createBookmark } from '@/features/bookmarks/bookmarks-service';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function AddBookmarkScreen() {
  const router = useRouter();
  const { user, ready } = useRequireAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(payload: { url: string; description: string }) {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createBookmark(user.id, payload);
      router.replace('/bookmarks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create bookmark');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell title="Add Bookmark" subtitle="Create a new bookmark with URL and description.">
      {!ready ? <MessageBox message="Loading session..." tone="success" /> : null}
      {error ? <MessageBox message={error} /> : null}
      <BookmarkForm submitLabel="Save bookmark" loading={loading} onSubmit={handleCreate} />
      <AppButton label="Back to bookmarks" variant="secondary" onPress={() => router.push('/bookmarks')} />
    </ScreenShell>
  );
}
