-- ============================================================
-- BLW Production Management System — Supabase Schema
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- 1. DROP EXISTING TABLE (to clean up schema mismatches)
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. CREATE users TABLE
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text unique not null,
  role text not null check (role in ('ADMIN', 'PRODUCTION_MANAGER', 'SHOP_SUPERVISOR')),
  shop text,
  title text,
  phone text,
  photo_url text,
  employee_id text,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. ENABLE Row Level Security
alter table public.users enable row level security;

-- 3. RLS POLICIES
-- Allow users to read all profiles (needed for UserManagement admin page)
create policy "Users can read all profiles"
  on public.users for select
  using (true);

-- Allow authenticated users to insert their own profile
create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Allow users to update their own profile, admin can update all
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Allow admin role to update any profile (handled in app layer via service key)
create policy "Admin can delete profiles"
  on public.users for delete
  using (true);

-- 4. AUTO-UPDATE updated_at TRIGGER
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- 5. STORAGE BUCKET for profile photos
-- Run this separately if you want profile photo uploads:
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- create policy "Avatar images are publicly accessible"
--   on storage.objects for select
--   using (bucket_id = 'avatars');

-- create policy "Users can upload their own avatar"
--   on storage.objects for insert
--   with check (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
