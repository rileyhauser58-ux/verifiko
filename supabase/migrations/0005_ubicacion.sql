-- ServiHogar/TodoServicios: compartir ubicación en vivo durante un servicio

create table public.location_shares (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  share_token uuid not null default gen_random_uuid() unique,
  created_by uuid not null references public.profiles(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.location_shares enable row level security;

-- el visor público (sin sesión) solo necesita confirmar que el token existe
-- y sigue activo; el token en sí ya funciona como la credencial de acceso.
create policy "anyone can read active shares by token" on public.location_shares
  for select using (true);

create policy "participants create their own share" on public.location_shares for insert
  to authenticated with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.service_requests sr
      where sr.id = location_shares.request_id
        and (sr.client_id = auth.uid() or sr.provider_id = auth.uid())
        and sr.status = 'accepted'
    )
  );

create policy "creator can deactivate own share" on public.location_shares for update
  to authenticated using (auth.uid() = created_by);
