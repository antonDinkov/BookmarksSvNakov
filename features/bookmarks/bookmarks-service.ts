import { supabase } from '@/lib/supabase';

import type { Bookmark, BookmarkInput } from './types';

const BOOKMARK_COLUMNS = 'id, user_id, url, description, created_at, updated_at';

export async function listBookmarks(userId: string): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(BOOKMARK_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Bookmark[];
}

export async function getBookmarkById(userId: string, bookmarkId: string): Promise<Bookmark | null> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(BOOKMARK_COLUMNS)
    .eq('user_id', userId)
    .eq('id', bookmarkId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Bookmark | null) ?? null;
}

export async function createBookmark(userId: string, input: BookmarkInput): Promise<Bookmark> {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ ...input, user_id: userId })
    .select(BOOKMARK_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return data as Bookmark;
}

export async function updateBookmark(
  userId: string,
  bookmarkId: string,
  input: BookmarkInput,
): Promise<Bookmark> {
  const { data, error } = await supabase
    .from('bookmarks')
    .update(input)
    .eq('id', bookmarkId)
    .eq('user_id', userId)
    .select(BOOKMARK_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return data as Bookmark;
}

export async function deleteBookmark(userId: string, bookmarkId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}
