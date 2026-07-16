-- ServiHogar: agenda (fecha/hora real de los trabajos aceptados)

alter table public.service_requests add column scheduled_at timestamptz;
create index service_requests_status_scheduled_idx on public.service_requests (status, scheduled_at);
