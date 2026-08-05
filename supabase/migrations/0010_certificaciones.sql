-- Certificaciones profesionales de un prestador (ej. "Certificado SEC
-- Clase A", "Certificado de gasfitería"). A diferencia de
-- verification_documents (carnet/selfie/antecedentes, privado, revisado a
-- mano), esto es información que el propio prestador declara para mostrar
-- en su perfil público — no pasa por revisión del equipo.
create table public.provider_certifications (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  title text not null,
  issuer text,
  file_url text not null,
  created_at timestamptz not null default now()
);

create index provider_certifications_provider_id_idx on public.provider_certifications (provider_id);

alter table public.provider_certifications enable row level security;

create policy "certifications are publicly readable" on public.provider_certifications
  for select using (true);

create policy "providers add their own certifications" on public.provider_certifications
  for insert to authenticated with check (auth.uid() = provider_id);

create policy "providers delete their own certifications" on public.provider_certifications
  for delete to authenticated using (auth.uid() = provider_id);
