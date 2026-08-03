alter table public.messages add column read_at timestamptz;

-- falta una política de update: hasta ahora los mensajes solo se podían
-- leer o insertar. Marcar como leído es la primera vez que un
-- participante necesita actualizar un mensaje que no escribió él mismo.
create policy "participants mark messages as read" on public.messages for update
  to authenticated using (
    exists (
      select 1 from public.service_requests sr
      where sr.id = messages.request_id
        and (sr.client_id = auth.uid() or sr.provider_id = auth.uid())
    )
  );
