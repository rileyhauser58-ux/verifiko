-- ServiHogar/TodoServicios: marca los reportes originados por el botón de
-- emergencia (además de guardarse en reports como cualquier otro reporte,
-- estos disparan un correo inmediato al equipo, ver app/actions/reports.ts)

alter table public.reports add column is_emergency boolean not null default false;
