-- Enable pgvector extension for semantic search
create extension if not exists vector;

-- Events table
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  location    text,
  date        date,
  created_at  timestamptz default now()
);

-- Balloons table
create table if not exists public.balloons (
  id               uuid primary key default gen_random_uuid(),
  image_url        text not null,
  thumbnail_url    text,
  tags             text[]   default '{}',
  color            text,
  size             text check (size in ('small', 'medium', 'large')),
  shape            text check (shape in ('round', 'long', 'heart', 'star', 'other')),
  event_name       text,
  event_location   text,
  event_date       date,
  event_id         uuid references public.events(id) on delete set null,
  embedding        vector(1536),
  created_at       timestamptz default now()
);

-- Row-level security
alter table public.balloons enable row level security;
alter table public.events enable row level security;

-- Policies: allow all authenticated reads, service-role writes
create policy "Public read balloons" on public.balloons
  for select using (true);

create policy "Service role insert balloons" on public.balloons
  for insert with check (true);

create policy "Service role update balloons" on public.balloons
  for update using (true);

create policy "Public read events" on public.events
  for select using (true);

create policy "Service role insert events" on public.events
  for insert with check (true);

-- Index for faster tag searches
create index if not exists balloons_tags_gin on public.balloons using gin (tags);

-- Index for vector similarity search
create index if not exists balloons_embedding_idx on public.balloons
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);
