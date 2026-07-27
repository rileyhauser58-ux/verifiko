-- ServiHogar/TodoServicios: expone el conteo de trabajos completados de un
-- prestador sin exponer las filas de service_requests en sí (que son
-- privadas entre cliente y prestador). SECURITY DEFINER + una función que
-- solo devuelve un número es más seguro que agregar una política pública
-- de SELECT sobre toda la tabla.

create function public.get_completed_jobs_count(target_provider_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer
  from public.service_requests
  where provider_id = target_provider_id
    and status = 'completed';
$$;
