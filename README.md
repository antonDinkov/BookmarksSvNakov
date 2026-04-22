# Bookmarks App (Expo Router + Supabase)

A responsive mobile/web app built with React Native, Expo and Expo Router.

Features:
- Supabase email/password authentication (Login, Register)
- Home screen with welcome and auth actions
- Bookmarks CRUD with separate screens
- View Bookmark screen
- Add Bookmark screen
- Edit Bookmark screen
- Delete Bookmark confirmation screen
- Responsive layouts for smartphones and desktop web
- Local SQL migrations for database setup

## Tech Stack

- Expo + React Native + TypeScript
- Expo Router (file-based navigation)
- Supabase Auth + Postgres

## Environment Variables

Set these in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_publishable_or_anon_key
```

## Install & Run

```bash
npm install
npx expo start
```

Run on web:

```bash
npx expo start --web
```

## Supabase Database Migration

Migration files are local in:

- `supabase/migrations`

Current migration:

- `supabase/migrations/202604220001_create_bookmarks.sql`

What it creates/configures:
- `public.bookmarks` table
- index for user/time access patterns
- `updated_at` trigger function
- row-level security (RLS)
- owner-only SELECT/INSERT/UPDATE/DELETE policies

Apply the SQL file in your Supabase SQL editor or via Supabase CLI.

## Route Structure

- `/` Home
- `/login` Login
- `/register` Register
- `/bookmarks` Bookmarks List
- `/bookmarks/add` Add Bookmark
- `/bookmarks/[id]` View Bookmark
- `/bookmarks/[id]/edit` Edit Bookmark
- `/bookmarks/[id]/delete` Delete Bookmark

## Architecture Notes

Separation of concerns and DRY are implemented by splitting the app into focused modules:

- `features/auth` for auth actions and route-guard hook
- `features/bookmarks` for bookmark types and data access service
- `providers` for auth session state
- `components/app` for shared form controls, layout shell, and reusable forms
- `app` routes stay thin: navigation + screen-specific orchestration
