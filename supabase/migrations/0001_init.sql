-- ServiHogar: esquema inicial, RLS y datos de referencia

-- enums
create type public.user_role as enum ('client', 'provider');

-- profiles: extensión 1:1 de auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'client',
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- rubros
create table public.categories (
  id smallint generated always as identity primary key,
  slug text unique not null,
  name text not null
);

-- comunas / ciudades
create table public.comunas (
  id smallint generated always as identity primary key,
  name text not null,
  region text not null,
  unique (name, region)
);

-- datos propios de un prestador (1:1 con profiles cuando role = 'provider')
create table public.provider_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  business_name text,
  bio text,
  years_experience smallint,
  verified boolean not null default false,
  avg_rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- prestador <-> rubro (N:N)
create table public.provider_categories (
  provider_id uuid references public.provider_profiles(id) on delete cascade,
  category_id smallint references public.categories(id) on delete cascade,
  primary key (provider_id, category_id)
);

-- prestador <-> comuna (N:N, zonas de cobertura)
create table public.provider_zones (
  provider_id uuid references public.provider_profiles(id) on delete cascade,
  comuna_id smallint references public.comunas(id) on delete cascade,
  primary key (provider_id, comuna_id)
);

-- reseñas: MVP = una reseña por (usuario, prestador)
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  constraint one_review_per_reviewer unique (provider_id, reviewer_id),
  constraint no_self_review check (reviewer_id <> provider_id)
);

-- crea automáticamente el perfil al registrarse (rol/nombre vienen del signup)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );

  if coalesce((new.raw_user_meta_data->>'role')::user_role, 'client') = 'provider' then
    insert into public.provider_profiles (id) values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- mantiene avg_rating / review_count al día
create function public.refresh_provider_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  target_provider uuid := coalesce(new.provider_id, old.provider_id);
begin
  update public.provider_profiles p
  set avg_rating = coalesce((select round(avg(rating)::numeric, 1) from public.reviews where provider_id = target_provider), 0),
      review_count = (select count(*) from public.reviews where provider_id = target_provider),
      updated_at = now()
  where p.id = target_provider;
  return null;
end;
$$;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_provider_rating();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.provider_categories enable row level security;
alter table public.provider_zones enable row level security;
alter table public.reviews enable row level security;
alter table public.categories enable row level security;
alter table public.comunas enable row level security;

create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "provider profiles are publicly readable" on public.provider_profiles for select using (true);
create policy "providers insert own provider profile" on public.provider_profiles for insert with check (auth.uid() = id);
create policy "providers update own provider profile" on public.provider_profiles for update using (auth.uid() = id);
create policy "providers delete own provider profile" on public.provider_profiles for delete using (auth.uid() = id);

create policy "provider_categories publicly readable" on public.provider_categories for select using (true);
create policy "providers manage own categories" on public.provider_categories for all
  using (auth.uid() = provider_id) with check (auth.uid() = provider_id);

create policy "provider_zones publicly readable" on public.provider_zones for select using (true);
create policy "providers manage own zones" on public.provider_zones for all
  using (auth.uid() = provider_id) with check (auth.uid() = provider_id);

create policy "reviews are publicly readable" on public.reviews for select using (true);
create policy "authenticated users insert own review" on public.reviews for insert
  to authenticated with check (auth.uid() = reviewer_id);
create policy "reviewers update own review" on public.reviews for update
  to authenticated using (auth.uid() = reviewer_id);
create policy "reviewers delete own review" on public.reviews for delete
  to authenticated using (auth.uid() = reviewer_id);

create policy "categories are publicly readable" on public.categories for select using (true);
create policy "comunas are publicly readable" on public.comunas for select using (true);

-- datos de referencia
insert into public.categories (slug, name) values
  ('gasfiteria', 'Gasfitería'),
  ('electricidad', 'Electricidad'),
  ('carpinteria', 'Carpintería'),
  ('mecanica-automotriz', 'Mecánica automotriz'),
  ('pintura', 'Pintura'),
  ('jardineria', 'Jardinería'),
  ('cerrajeria', 'Cerrajería'),
  ('aseo-limpieza', 'Aseo y limpieza');

insert into public.comunas (name, region) values
  ('Santiago', 'Región Metropolitana'),
  ('Providencia', 'Región Metropolitana'),
  ('Las Condes', 'Región Metropolitana'),
  ('Ñuñoa', 'Región Metropolitana'),
  ('La Florida', 'Región Metropolitana'),
  ('Maipú', 'Región Metropolitana'),
  ('Puente Alto', 'Región Metropolitana'),
  ('Vitacura', 'Región Metropolitana');
