export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type BookmarkInput = {
  url: string;
  description: string;
};
