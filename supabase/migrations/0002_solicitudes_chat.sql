-- ServiHogar: solicitudes de servicio, chat y reseñas ligadas a una solicitud

create type public.request_status as enum (
  'pending', 'accepted', 'declined', 'completed', 'cancelled'
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  message text not null,
  status request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint no_self_request check (client_id <> provider_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- limpia reseñas de prueba previas al nuevo modelo (no hay lanzamiento real
-- todavia); si en el futuro ya hay reseñas reales, esta linea se reemplaza
-- por un backfill de request_id en vez de un delete.
delete from public.reviews;

alter table public.reviews drop constraint one_review_per_reviewer;
alter table public.reviews add column request_id uuid references public.service_requests(id) on delete cascade;
alter table public.reviews alter column request_id set not null;
alter table public.reviews add constraint one_review_per_request unique (request_id);

create index service_requests_client_id_idx on public.service_requests (client_id);
create index service_requests_provider_id_idx on public.service_requests (provider_id);
create index messages_request_id_idx on public.messages (request_id, created_at);

alter table public.service_requests enable row level security;
alter table public.messages enable row level security;

create policy "participants read own requests" on public.service_requests for select
  to authenticated using (auth.uid() = client_id or auth.uid() = provider_id);

create policy "clients create requests" on public.service_requests for insert
  to authenticated with check (auth.uid() = client_id);

create policy "participants update own requests" on public.service_requests for update
  to authenticated using (auth.uid() = client_id or auth.uid() = provider_id);

create policy "participants read messages" on public.messages for select
  to authenticated using (
    exists (
      select 1 from public.service_requests sr
      where sr.id = messages.request_id
        and (sr.client_id = auth.uid() or sr.provider_id = auth.uid())
    )
  );

create policy "participants send messages on active requests" on public.messages for insert
  to authenticated with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.service_requests sr
      where sr.id = messages.request_id
        and (sr.client_id = auth.uid() or sr.provider_id = auth.uid())
        and sr.status in ('accepted', 'completed')
    )
  );

drop policy "authenticated users insert own review" on public.reviews;

create policy "clients review their completed requests" on public.reviews for insert
  to authenticated with check (
    auth.uid() = reviewer_id
    and exists (
      select 1 from public.service_requests sr
      where sr.id = reviews.request_id
        and sr.client_id = auth.uid()
        and sr.provider_id = reviews.provider_id
        and sr.status = 'completed'
    )
  );

alter publication supabase_realtime add table public.messages;
