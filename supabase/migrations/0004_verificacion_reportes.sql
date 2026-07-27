-- ServiHogar/TodoServicios: verificación manual de identidad + reportes con
-- suspensión automática

-- 10.A: documentos de verificación
create type public.document_type as enum ('id_card', 'selfie', 'background_check');
create type public.document_status as enum ('pending', 'approved', 'rejected');

create table public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  document_type document_type not null,
  storage_path text not null,
  status document_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (provider_id, document_type)
);

alter table public.verification_documents enable row level security;

create policy "providers read own documents" on public.verification_documents for select
  to authenticated using (auth.uid() = provider_id);

create policy "providers upsert own documents" on public.verification_documents for insert
  to authenticated with check (auth.uid() = provider_id);

create policy "providers update own documents" on public.verification_documents for update
  to authenticated using (auth.uid() = provider_id);

-- 10.B: reportes + suspensión automática
create type public.report_reason as enum (
  'unsafe_behavior', 'no_show', 'harassment', 'fraud', 'other'
);

alter table public.provider_profiles add column suspended boolean not null default false;

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  request_id uuid references public.service_requests(id) on delete set null,
  reason report_reason not null,
  details text,
  created_at timestamptz not null default now(),
  constraint no_self_report check (reporter_id <> reported_provider_id)
);

alter table public.reports enable row level security;

create policy "authenticated users create reports" on public.reports for insert
  to authenticated with check (auth.uid() = reporter_id);

-- sin política de select: los reportes solo se revisan desde el dashboard
-- de Supabase (tu cuenta de owner, no las claves anon/authenticated, así
-- que RLS no le aplica ahí). La app nunca necesita leer esta tabla.

create function public.check_provider_reports()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  report_count integer;
begin
  select count(*) into report_count
  from public.reports
  where reported_provider_id = new.reported_provider_id;

  if report_count >= 3 then
    update public.provider_profiles
    set suspended = true
    where id = new.reported_provider_id;
  end if;

  return new;
end;
$$;

create trigger on_report_created
  after insert on public.reports
  for each row execute function public.check_provider_reports();

-- prestadores suspendidos no deben aparecer en el directorio público
drop policy "provider profiles are publicly readable" on public.provider_profiles;
create policy "provider profiles are publicly readable" on public.provider_profiles for select
  using (suspended = false or auth.uid() = id);
