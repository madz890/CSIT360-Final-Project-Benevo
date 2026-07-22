create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'donor' check (role in ('donor','organization','admin')),
  wallet_address text,
  organization_name text,
  verification_status text default 'pending' check (verification_status in ('pending','verified','rejected')),
  reputation_score integer default 0,
  created_at timestamptz default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  goal_amount numeric not null default 0,
  current_amount numeric not null default 0,
  status text not null default 'draft' check (status in ('draft','pending','approved','funding','completed','closed')),
  category text,
  image_url text,
  documents jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  donor_id uuid references profiles(id) on delete cascade,
  amount numeric not null,
  currency text not null default 'ADA',
  wallet_address text,
  tx_hash text,
  receipt_url text,
  created_at timestamptz default now()
);

create table if not exists campaign_updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  message text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table campaigns enable row level security;
alter table donations enable row level security;
alter table campaign_updates enable row level security;

create policy "profiles read access" on profiles
  for select using (true);

create policy "profiles update own" on profiles
  for update using (auth.uid() = id);

create policy "profiles insert own" on profiles
  for insert with check (auth.uid() = id);

create policy "campaigns read access" on campaigns
  for select using (true);

create policy "campaigns manage own" on campaigns
  for all using (auth.uid() = organizer_id)
  with check (auth.uid() = organizer_id);

create policy "donations read access" on donations
  for select using (true);

create policy "donations insert own" on donations
  for insert with check (auth.uid() = donor_id);

create policy "campaign updates read access" on campaign_updates
  for select using (true);

create policy "campaign updates manage own" on campaign_updates
  for all using (
    exists (
      select 1 from campaigns where campaigns.id = campaign_updates.campaign_id and campaigns.organizer_id = auth.uid()
    )
  );
