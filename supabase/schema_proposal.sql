-- ============================================================================
-- THALEX SYSTEMS — ESQUEMA SUPABASE (PROPUESTA)
-- ============================================================================
-- Estado:      PROPUESTA PARA REVISIÓN. NO EJECUTAR EN PRODUCCIÓN.
-- Revisión:    docs/supabase-design.md (v3) + migración incremental de leads (aprobada).
-- Autor:       Thalex Systems
-- Fecha:       2026-08-02
--
-- CONTENIDO:
--   1. Extensiones
--   2. Enums (máquinas de estado)
--   3. Funciones base (updated_at)
--   4. Tablas (dependencias ordenadas; leads = migración incremental)
--   5. Índices
--   6. RLS: funciones helper + políticas por rol
--   7. Triggers (historiales, folio, notificaciones, auditoría)
--   8. Seeds (proveedores, external_service_types)
--   9. Storage (buckets + políticas)
--  10. Edge Functions (referencia; son archivos Deno separados)
--
-- NOTAS:
--   - Supabase otorga GRANT por defecto en public.* a anon/authenticated/
--     service_role; el control real lo hace RLS.
--   - El contenido de la comunicación NO se almacena (solo email_referencias
--     con datos técnicos: proveedor, email_id, tipo_evento, fecha_envio).
--   - Los clientes se eliminan lógicamente (estado inactivo), nunca físicamente.
--   - leads ya existe en producción; se migra incrementalmente (bigint identity
--     → uuid) sin recrear la tabla ni borrar datos (sección 4.3).
-- ============================================================================

begin;

-- ============================================================================
-- 1. Extensiones
-- ============================================================================
create extension if not exists pgcrypto;

-- ============================================================================
-- 2. Enums (máquinas de estado)
-- ============================================================================
create type public.user_role                 as enum ('owner','admin','monitor','client');
create type public.cliente_origen            as enum ('web','manual');
create type public.cliente_estado            as enum ('prospecto','activo','inactivo');
create type public.lead_estado               as enum ('nuevo','contactado','cotizando','ganado','perdido');
create type public.servicio_categoria        as enum ('desarrollo','care','automations','ai','hosting');
create type public.servicio_contratado_estado as enum ('pendiente_activacion','activo','suspenso','cancelado');
create type public.cotizacion_estado         as enum ('borrador','enviada','aprobada','rechazada','convertida');
create type public.proyecto_estado           as enum ('en_desarrollo','en_pruebas','entregado','mantenimiento');
create type public.tarea_estado              as enum ('pendiente','en_progreso','completada');
create type public.pago_estado               as enum ('pendiente','comprobante_subido','validando','aprobado','rechazado');
create type public.pago_metodo               as enum ('transferencia','efectivo','stripe'); -- stripe futuro
create type public.comprobante_estado        as enum ('subido','validado','rechazado');
create type public.contrato_estado           as enum ('borrador','firmado','activo','terminado','cancelado');
create type public.documento_categoria       as enum ('contrato','factura','informe','entregable','otro');
create type public.infra_tipo                as enum ('thalex','cliente');
create type public.infra_estado              as enum ('activa','en_migracion','inactiva');
create type public.proveedor_tipo            as enum ('infraestructura','correo','pasarela','api','almacenamiento','otro');
create type public.servicio_externo_estado   as enum ('configurado','activo','inactivo');
create type public.servicio_externo_categoria as enum ('api','pasarela','correo','almacenamiento','fiscal','otro');
create type public.care_periodicidad         as enum ('mensual','trimestral','anual');
create type public.care_beneficio            as enum ('monitoreo','actualizaciones','soporte','mejoras_basicas','backups','reportes');
create type public.care_suscripcion_estado   as enum ('pendiente_activacion','activo','suspenso','cancelado');
create type public.care_historial_tipo       as enum ('creacion','activacion','renovacion','cambio_plan','suspension','cancelacion','actualizacion');
create type public.soporte_estado            as enum ('recibido','revisando','en_proceso','resuelto','cerrado');
create type public.soporte_tipo              as enum ('soporte','reporte_error','cambio_solicitado','duda','comentario','otro');
create type public.soporte_prioridad         as enum ('baja','media','alta','urgente');
create type public.notificacion_tipo         as enum ('info','exito','advertencia','error');
create type public.audit_accion              as enum ('crear','actualizar','eliminar','validar','activar','acceder','cambio_rol','otro');

-- ============================================================================
-- 3. Funciones base
-- ============================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 4. Tablas
-- ============================================================================

-- 4.1 clientes
create table public.clientes (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  contacto_nombre text,
  correo          text,
  telefono        text,
  origen          public.cliente_origen not null default 'manual',
  estado          public.cliente_estado not null default 'prospecto', -- inactivo = baja lógica
  notas           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users(id)
);

-- 4.2 perfiles (1:1 con auth.users)
create table public.perfiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  cliente_id uuid references public.clientes(id),
  nombre     text not null,
  telefono   text,
  rol        public.user_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4.3 leads — MIGRACIÓN INCREMENTAL (existe en producción; NO se recrea)
-- ---------------------------------------------------------------------
-- Estado en producción (inspeccionado 2026-08-02 vía Management API):
--   id bigint GENERATED BY DEFAULT AS IDENTITY PK (seq leads_id_seq)
--   created_at timestamptz default now()
--   nombre, correo, telefono, servicio, presupuesto, mensaje text (nullable)
--   RLS activa. Políticas legacy: anon_insert (with check true), anon_select (false)
--   Sin FKs, sin triggers, sin más índices que la PK. 14 filas, sin nulos.
-- Convergencia a v3: id uuid gen_random_uuid() | estado | cliente_id → clientes.
-- NO borra datos. Las políticas legacy se reemplazan en la sección 6.2.

-- (a) id: bigint identity → uuid (opción A aprobada)
alter table public.leads add column id_uuid uuid;
update public.leads set id_uuid = gen_random_uuid() where id_uuid is null;
alter table public.leads alter column id_uuid set default gen_random_uuid();
alter table public.leads alter column id_uuid set not null;
alter table public.leads drop constraint leads_pkey; -- retirar PK bigint primero (solo una PK por tabla)
alter table public.leads add constraint leads_pkey_new primary key (id_uuid);
alter table public.leads drop column id; -- identity y su secuencia se descartan
alter table public.leads rename column id_uuid to id;
alter table public.leads rename constraint leads_pkey_new to leads_pkey;
drop sequence if exists public.leads_id_seq; -- limpieza defensiva (no-op si ya cayó)

-- (b) NOT NULL en captación (verificado: 0 nulos en producción)
alter table public.leads alter column nombre set not null;
alter table public.leads alter column correo set not null;

-- (c) columnas nuevas de v3 (requieren enum lead_estado y tabla clientes previos)
alter table public.leads add column estado public.lead_estado not null default 'nuevo';
alter table public.leads add column cliente_id uuid references public.clientes(id); -- lead → cliente al convertirse

-- 4.4 servicios (catálogo)
create table public.servicios (
  id          uuid primary key default gen_random_uuid(),
  categoria   public.servicio_categoria not null,
  nombre      text not null,
  descripcion text,
  config      jsonb default '{}'::jsonb,
  estado      boolean not null default true
);

-- 4.5 proveedores (catálogo desacoplado)
create table public.proveedores (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  tipo        public.proveedor_tipo not null,
  descripcion text,
  estado      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 4.6 external_service_types (catálogo de tipos de servicios externos)
create table public.external_service_types (
  id        uuid primary key default gen_random_uuid(),
  nombre    text not null unique,
  categoria public.servicio_externo_categoria not null,
  estado    boolean not null default true
);

-- 4.7 servicios_contratados
create table public.servicios_contratados (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references public.clientes(id),
  servicio_id uuid not null references public.servicios(id),
  estado      public.servicio_contratado_estado not null default 'pendiente_activacion',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id)
);

-- 4.8 cotizaciones (folio humano COT-AAAA-00001 vía trigger)
create table public.cotizaciones (
  id            uuid primary key default gen_random_uuid(),
  numero        text unique, -- COT-AAAA-00001 (asignado por trigger)
  cliente_id    uuid references public.clientes(id),
  lead_id       uuid references public.leads(id),
  estado        public.cotizacion_estado not null default 'borrador',
  moneda        text not null default 'MXN',
  subtotal      numeric(12,2) not null default 0,
  impuestos     numeric(12,2) not null default 0,
  total         numeric(12,2) not null default 0,
  fecha_emision timestamptz not null default now(),
  valida_hasta  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references auth.users(id)
);

-- 4.9 lineas_cotizacion
create table public.lineas_cotizacion (
  id             uuid primary key default gen_random_uuid(),
  cotizacion_id  uuid not null references public.cotizaciones(id) on delete cascade,
  servicio_id    uuid references public.servicios(id),
  concepto       text not null,
  cantidad       int not null default 1,
  precio_unitario numeric(12,2) not null default 0,
  subtotal       numeric(12,2) not null default 0
);

-- 4.10 contratos
create table public.contratos (
  id                     uuid primary key default gen_random_uuid(),
  cliente_id             uuid not null references public.clientes(id),
  cotizacion_id          uuid references public.cotizaciones(id),
  servicios_contratados_id uuid references public.servicios_contratados(id),
  estado                 public.contrato_estado not null default 'borrador',
  fecha_inicio           date,
  fecha_fin              date,
  file_path              text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- 4.11 proyectos
create table public.proyectos (
  id                       uuid primary key default gen_random_uuid(),
  cliente_id               uuid not null references public.clientes(id),
  servicios_contratados_id uuid references public.servicios_contratados(id),
  nombre                   text not null,
  descripcion              text,
  estado                   public.proyecto_estado not null default 'en_desarrollo',
  fecha_inicio             date,
  fecha_entrega_estimada   date,
  fecha_entrega            date,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- 4.12 tareas
create table public.tareas (
  id             uuid primary key default gen_random_uuid(),
  proyecto_id    uuid not null references public.proyectos(id) on delete cascade,
  nombre         text not null,
  descripcion    text,
  responsable_id uuid references public.perfiles(id),
  estado         public.tarea_estado not null default 'pendiente',
  avance         int not null default 0 check (avance between 0 and 100),
  fecha_vencimiento date,
  orden          int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 4.13 infraestructura_proyecto (1:1 con proyectos)
create table public.infraestructura_proyecto (
  id                  uuid primary key default gen_random_uuid(),
  proyecto_id         uuid not null unique references public.proyectos(id),
  tipo                public.infra_tipo not null,
  proveedor_id        uuid references public.proveedores(id),
  dominio             text,
  hosting             text,
  base_de_datos       text,
  estado              public.infra_estado not null default 'activa',
  responsable         text,
  informacion_tecnica jsonb default '{}'::jsonb, -- nunca credenciales
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 4.14 servicios_externos (sub-entidad por proyecto)
create table public.servicios_externos (
  id                  uuid primary key default gen_random_uuid(),
  proyecto_id         uuid not null references public.proyectos(id) on delete cascade,
  proveedor_id        uuid references public.proveedores(id),
  servicio_tipo_id    uuid references public.external_service_types(id),
  estado              public.servicio_externo_estado not null default 'configurado',
  referencia_secreta  text, -- referencia al secreto, NUNCA el valor
  informacion_operativa jsonb default '{}'::jsonb, -- sin credenciales
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 4.15 pagos
create table public.pagos (
  id                      uuid primary key default gen_random_uuid(),
  cliente_id              uuid not null references public.clientes(id),
  cotizacion_id           uuid references public.cotizaciones(id),
  servicios_contratados_id uuid references public.servicios_contratados(id),
  monto                   numeric(12,2) not null,
  moneda                  text not null default 'MXN',
  metodo                  public.pago_metodo not null,
  estado                  public.pago_estado not null default 'pendiente',
  referencia              text,
  validado_por            uuid references auth.users(id),
  validado_en             timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- 4.16 comprobantes (1:1 con pagos)
create table public.comprobantes (
  id         uuid primary key default gen_random_uuid(),
  pago_id    uuid not null unique references public.pagos(id),
  file_path  text not null,
  mime_type  text,
  size       bigint,
  estado     public.comprobante_estado not null default 'subido',
  created_at timestamptz not null default now()
);

-- 4.17 documentos
create table public.documentos (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id),
  categoria  public.documento_categoria not null,
  nombre     text not null,
  file_path  text not null,
  mime_type  text,
  size       bigint,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- 4.18 support_requests (reemplaza chat interno; comunicación por correo)
create table public.support_requests (
  id                   uuid primary key default gen_random_uuid(),
  cliente_id           uuid not null references public.clientes(id),
  proyecto_id          uuid references public.proyectos(id),
  tipo_solicitud       public.soporte_tipo not null,
  estado               public.soporte_estado not null default 'recibido',
  prioridad            public.soporte_prioridad not null default 'media',
  fecha_creacion       timestamptz not null default now(),
  fecha_actualizacion  timestamptz not null default now(),
  responsable_asignado uuid references public.perfiles(id)
);

-- 4.19 email_referencias (referencia técnica del correo, SIN contenido)
create table public.email_referencias (
  id                uuid primary key default gen_random_uuid(),
  support_request_id uuid references public.support_requests(id),
  pago_id           uuid references public.pagos(id),
  proveedor         text not null default 'resend',
  email_id          text, -- message-id / id del proveedor
  tipo_evento       text not null,
  fecha_envio       timestamptz not null default now()
);

-- 4.20 notifications (eventos del portal)
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles(id),
  tipo       public.notificacion_tipo not null default 'info',
  titulo     text not null,
  cuerpo     text,
  enlace     text,
  leido      boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4.21 audit_logs (acciones críticas; escritura por trigger/service role)
create table public.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references public.perfiles(id),
  accion     public.audit_accion not null,
  entidad    text,
  entidad_id uuid,
  detalle    jsonb default '{}'::jsonb,
  ip         text,
  created_at timestamptz not null default now()
);

-- 4.22 care_plans
create table public.care_plans (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null,
  descripcion      text,
  periodicidad     public.care_periodicidad not null default 'mensual',
  precio_referencia numeric(12,2) not null default 0,
  moneda           text not null default 'MXN',
  estado           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 4.23 care_features
create table public.care_features (
  id           uuid primary key default gen_random_uuid(),
  care_plan_id uuid not null references public.care_plans(id) on delete cascade,
  beneficio    public.care_beneficio not null,
  descripcion  text,
  limite       text,
  estado       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 4.24 care_subscriptions (1:1 con servicios_contratados tipo care)
create table public.care_subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  cliente_id               uuid not null references public.clientes(id),
  servicios_contratados_id uuid not null unique references public.servicios_contratados(id),
  care_plan_id             uuid not null references public.care_plans(id),
  estado                   public.care_suscripcion_estado not null default 'pendiente_activacion',
  fecha_inicio             date,
  fecha_renovacion         date,
  fecha_cancelacion        date,
  ciclo_actual             uuid references public.pagos(id),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- 4.25 care_subscription_historial
create table public.care_subscription_historial (
  id                    uuid primary key default gen_random_uuid(),
  care_subscription_id  uuid not null references public.care_subscriptions(id) on delete cascade,
  fecha                 timestamptz not null default now(),
  tipo                  public.care_historial_tipo not null,
  detalle               text,
  actor                 uuid references auth.users(id)
);

-- 4.26 pago_historial
create table public.pago_historial (
  id             uuid primary key default gen_random_uuid(),
  pago_id        uuid not null references public.pagos(id) on delete cascade,
  estado_anterior public.pago_estado,
  estado_nuevo   public.pago_estado not null,
  fecha          timestamptz not null default now(),
  actor          uuid references auth.users(id),
  detalle        text
);

-- 4.27 servicio_contratado_historial
create table public.servicio_contratado_historial (
  id                       uuid primary key default gen_random_uuid(),
  servicios_contratados_id uuid not null references public.servicios_contratados(id) on delete cascade,
  estado_anterior          public.servicio_contratado_estado,
  estado_nuevo             public.servicio_contratado_estado not null,
  fecha                    timestamptz not null default now(),
  actor                    uuid references auth.users(id),
  detalle                  text
);

-- 4.28 proyecto_historial
create table public.proyecto_historial (
  id            uuid primary key default gen_random_uuid(),
  proyecto_id   uuid not null references public.proyectos(id) on delete cascade,
  campo         text not null,
  valor_anterior jsonb,
  valor_nuevo   jsonb,
  fecha         timestamptz not null default now(),
  actor         uuid references auth.users(id)
);

-- ============================================================================
-- 5. Índices
-- ============================================================================
create index idx_perfiles_cliente     on public.perfiles (cliente_id);
create index idx_perfiles_rol         on public.perfiles (rol);
create index idx_leads_estado         on public.leads (estado);
create index idx_leads_correo         on public.leads (correo);
create index idx_leads_cliente        on public.leads (cliente_id);
create index idx_clientes_correo      on public.clientes (correo);
create index idx_clientes_estado      on public.clientes (estado);
create index idx_clientes_origen      on public.clientes (origen);
create index idx_cotizaciones_cliente on public.cotizaciones (cliente_id);
create index idx_cotizaciones_lead    on public.cotizaciones (lead_id);
create index idx_cotizaciones_estado  on public.cotizaciones (estado);
create index idx_lineas_cotizacion    on public.lineas_cotizacion (cotizacion_id);
create index idx_sc_cliente           on public.servicios_contratados (cliente_id);
create index idx_sc_servicio          on public.servicios_contratados (servicio_id);
create index idx_sc_estado            on public.servicios_contratados (estado);
create index idx_proyectos_cliente    on public.proyectos (cliente_id);
create index idx_proyectos_sc         on public.proyectos (servicios_contratados_id);
create index idx_proyectos_estado     on public.proyectos (estado);
create index idx_tareas_proyecto      on public.tareas (proyecto_id);
create index idx_tareas_estado        on public.tareas (estado);
create index idx_tareas_responsable   on public.tareas (responsable_id);
create index idx_infra_proyecto       on public.infraestructura_proyecto (proyecto_id);
create index idx_infra_proveedor      on public.infraestructura_proyecto (proveedor_id);
create index idx_se_proyecto          on public.servicios_externos (proyecto_id);
create index idx_se_proveedor         on public.servicios_externos (proveedor_id);
create index idx_se_tipo              on public.servicios_externos (servicio_tipo_id);
create index idx_est_categoria        on public.external_service_types (categoria);
create index idx_pagos_cliente        on public.pagos (cliente_id);
create index idx_pagos_cotizacion     on public.pagos (cotizacion_id);
create index idx_pagos_sc             on public.pagos (servicios_contratados_id);
create index idx_pagos_estado         on public.pagos (estado);
create index idx_documentos_cliente   on public.documentos (cliente_id);
create index idx_documentos_categoria on public.documentos (categoria);
create index idx_sr_cliente           on public.support_requests (cliente_id);
create index idx_sr_proyecto          on public.support_requests (proyecto_id);
create index idx_sr_estado            on public.support_requests (estado);
create index idx_sr_prioridad         on public.support_requests (prioridad);
create index idx_sr_responsable       on public.support_requests (responsable_asignado);
create index idx_er_support_request   on public.email_referencias (support_request_id);
create index idx_er_pago              on public.email_referencias (pago_id);
create index idx_er_fecha             on public.email_referencias (fecha_envio);
create index idx_notif_usuario        on public.notifications (usuario_id);
create index idx_notif_leido          on public.notifications (leido);
create index idx_audit_entidad        on public.audit_logs (entidad, entidad_id);
create index idx_audit_actor          on public.audit_logs (actor_id);
create index idx_audit_fecha          on public.audit_logs (created_at);
create index idx_cs_cliente           on public.care_subscriptions (cliente_id);
create index idx_cs_plan              on public.care_subscriptions (care_plan_id);
create index idx_cs_estado            on public.care_subscriptions (estado);
create index idx_cs_fecha_renov       on public.care_subscriptions (fecha_renovacion);
create index idx_csh_cs               on public.care_subscription_historial (care_subscription_id);
create index idx_ph_pago              on public.pago_historial (pago_id);
create index idx_sch_sc               on public.servicio_contratado_historial (servicios_contratados_id);
create index idx_ph_proyecto          on public.proyecto_historial (proyecto_id);

-- ============================================================================
-- 6. RLS — funciones helper
-- ============================================================================
create or replace function public.is_owner()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.perfiles p
    where p.id = auth.uid() and p.rol = 'owner'
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.perfiles p
    where p.id = auth.uid() and p.rol in ('owner','admin')
  );
$$;

create or replace function public.is_monitor()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.perfiles p
    where p.id = auth.uid() and p.rol = 'monitor'
  );
$$;

create or replace function public.current_cliente_id()
returns uuid language sql stable security definer set search_path = public as $$
  select cliente_id from public.perfiles where id = auth.uid();
$$;

-- ============================================================================
-- 6.1 RLS — habilitar
-- ============================================================================
alter table public.clientes                   enable row level security;
alter table public.perfiles                   enable row level security;
alter table public.leads                      enable row level security;
alter table public.servicios                  enable row level security;
alter table public.proveedores                enable row level security;
alter table public.external_service_types     enable row level security;
alter table public.servicios_contratados      enable row level security;
alter table public.cotizaciones               enable row level security;
alter table public.lineas_cotizacion          enable row level security;
alter table public.contratos                  enable row level security;
alter table public.proyectos                  enable row level security;
alter table public.tareas                     enable row level security;
alter table public.infraestructura_proyecto   enable row level security;
alter table public.servicios_externos         enable row level security;
alter table public.pagos                      enable row level security;
alter table public.comprobantes               enable row level security;
alter table public.documentos                 enable row level security;
alter table public.support_requests           enable row level security;
alter table public.email_referencias          enable row level security;
alter table public.notifications              enable row level security;
alter table public.audit_logs                 enable row level security;
alter table public.care_plans                 enable row level security;
alter table public.care_features              enable row level security;
alter table public.care_subscriptions         enable row level security;
alter table public.care_subscription_historial enable row level security;
alter table public.pago_historial             enable row level security;
alter table public.servicio_contratado_historial enable row level security;
alter table public.proyecto_historial         enable row level security;

-- ============================================================================
-- 6.2 RLS — políticas
-- ============================================================================

-- leads: público solo crea leads nuevos; internos gestionan
-- (se reemplazan las políticas legacy anon_insert/anon_select de producción;
--  anon no puede forzar estado ni asociar cliente_id)
drop policy if exists anon_insert on public.leads;
drop policy if exists anon_select on public.leads;
create policy leads_anon_insert on public.leads
  for insert to anon with check (estado = 'nuevo' and cliente_id is null);
create policy leads_admin_all on public.leads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- servicios: catálogo público
create policy servicios_anon_select on public.servicios
  for select to anon using (estado = true);
create policy servicios_auth_select on public.servicios
  for select to authenticated using (true);
create policy servicios_admin_all on public.servicios
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- proveedores: solo internos
create policy proveedores_admin_all on public.proveedores
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- external_service_types: visible a autenticados; gestiona admin
create policy est_auth_select on public.external_service_types
  for select to authenticated using (true);
create policy est_admin_all on public.external_service_types
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- clientes: CLIENT ve su fila; internos gestionan
create policy clientes_client_select on public.clientes
  for select to authenticated using (id = public.current_cliente_id());
create policy clientes_admin_all on public.clientes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- perfiles: CLIENT/MONITOR ven/actualizan el propio (sin cambiar rol)
create policy perfiles_client_select on public.perfiles
  for select to authenticated using (id = auth.uid());
create policy perfiles_client_update on public.perfiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and rol = (select rol from public.perfiles where id = auth.uid()));
create policy perfiles_admin_all on public.perfiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- servicios_contratados
create policy sc_client_select on public.servicios_contratados
  for select to authenticated using (cliente_id = public.current_cliente_id());
create policy sc_admin_all on public.servicios_contratados
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- cotizaciones
create policy cotizaciones_client_select on public.cotizaciones
  for select to authenticated using (cliente_id = public.current_cliente_id());
create policy cotizaciones_admin_all on public.cotizaciones
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- lineas_cotizacion
create policy lineas_client_select on public.lineas_cotizacion
  for select to authenticated using (
    cotizacion_id in (select id from public.cotizaciones where cliente_id = public.current_cliente_id())
  );
create policy lineas_admin_all on public.lineas_cotizacion
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- contratos: MONITOR sin acceso
create policy contratos_client_select on public.contratos
  for select to authenticated using (cliente_id = public.current_cliente_id());
create policy contratos_admin_all on public.contratos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- proyectos: CLIENT (propios), MONITOR (asignados)
create policy proyectos_client_select on public.proyectos
  for select to authenticated using (cliente_id = public.current_cliente_id());
create policy proyectos_monitor_select on public.proyectos
  for select to authenticated using (
    public.is_monitor() and exists (
      select 1 from public.tareas t
      where t.proyecto_id = public.proyectos.id and t.responsable_id = auth.uid()
    )
  );
create policy proyectos_admin_all on public.proyectos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- tareas: CLIENT (proyecto propio), MONITOR (asignadas: estado/avance)
create policy tareas_client_select on public.tareas
  for select to authenticated using (
    proyecto_id in (select id from public.proyectos where cliente_id = public.current_cliente_id())
  );
create policy tareas_monitor_select on public.tareas
  for select to authenticated using (responsable_id = auth.uid());
create policy tareas_monitor_update on public.tareas
  for update to authenticated
  using (responsable_id = auth.uid())
  with check (responsable_id = auth.uid());
create policy tareas_admin_all on public.tareas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- infraestructura_proyecto: CLIENT ve la suya (solo URLs públicas por columna)
create policy infra_client_select on public.infraestructura_proyecto
  for select to authenticated using (
    proyecto_id in (select id from public.proyectos where cliente_id = public.current_cliente_id())
  );
create policy infra_admin_all on public.infraestructura_proyecto
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- servicios_externos: solo internos (sin credenciales expuestas)
create policy se_admin_all on public.servicios_externos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- pagos: MONITOR sin acceso
create policy pagos_client_select on public.pagos
  for select to authenticated using (cliente_id = public.current_cliente_id());
create policy pagos_admin_all on public.pagos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- comprobantes: CLIENT inserta/lee los suyos
create policy comprobantes_client_select on public.comprobantes
  for select to authenticated using (
    pago_id in (select id from public.pagos where cliente_id = public.current_cliente_id())
  );
create policy comprobantes_client_insert on public.comprobantes
  for insert to authenticated with check (
    pago_id in (select id from public.pagos where cliente_id = public.current_cliente_id())
  );
create policy comprobantes_admin_all on public.comprobantes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- documentos
create policy documentos_client_select on public.documentos
  for select to authenticated using (cliente_id = public.current_cliente_id());
create policy documentos_admin_all on public.documentos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- support_requests: CLIENT crea/ve las suyas; MONITOR las asignadas
create policy sr_client_select on public.support_requests
  for select to authenticated using (cliente_id = public.current_cliente_id());
create policy sr_client_insert on public.support_requests
  for insert to authenticated with check (cliente_id = public.current_cliente_id());
create policy sr_monitor_select on public.support_requests
  for select to authenticated using (responsable_asignado = auth.uid());
create policy sr_admin_all on public.support_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- email_referencias: CLIENT lee las suyas (escritura por trigger/edge function)
create policy er_client_select on public.email_referencias
  for select to authenticated using (
    support_request_id in (select id from public.support_requests where cliente_id = public.current_cliente_id())
    or pago_id in (select id from public.pagos where cliente_id = public.current_cliente_id())
  );
create policy er_admin_select on public.email_referencias
  for select to authenticated using (public.is_admin());

-- notifications
create policy notifications_client_select on public.notifications
  for select to authenticated using (usuario_id = auth.uid());
create policy notifications_client_update on public.notifications
  for update to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy notifications_admin_all on public.notifications
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- audit_logs: solo lectura interna (escritura vía trigger/service role)
create policy audit_admin_select on public.audit_logs
  for select to authenticated using (public.is_admin());

-- care_plans / care_features: visibles a autenticados; gestiona admin
create policy care_plans_auth_select on public.care_plans
  for select to authenticated using (estado = true);
create policy care_plans_admin_all on public.care_plans
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy care_features_auth_select on public.care_features
  for select to authenticated using (true);
create policy care_features_admin_all on public.care_features
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- care_subscriptions
create policy cs_client_select on public.care_subscriptions
  for select to authenticated using (cliente_id = public.current_cliente_id());
create policy cs_admin_all on public.care_subscriptions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- care_subscription_historial
create policy csh_client_select on public.care_subscription_historial
  for select to authenticated using (
    care_subscription_id in (select id from public.care_subscriptions where cliente_id = public.current_cliente_id())
  );
create policy csh_admin_all on public.care_subscription_historial
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- pago_historial / servicio_contratado_historial: internos
create policy ph_admin_all on public.pago_historial
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy sch_admin_all on public.servicio_contratado_historial
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- proyecto_historial
create policy ph_proyecto_client_select on public.proyecto_historial
  for select to authenticated using (
    proyecto_id in (select id from public.proyectos where cliente_id = public.current_cliente_id())
  );
create policy ph_proyecto_monitor_select on public.proyecto_historial
  for select to authenticated using (
    proyecto_id in (select proyecto_id from public.tareas where responsable_id = auth.uid())
  );
create policy ph_proyecto_admin_all on public.proyecto_historial
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- 7. Triggers
-- ============================================================================

-- 7.1 updated_at automático
create trigger trg_perfiles_updated_at before update on public.perfiles
  for each row execute function public.handle_updated_at();
create trigger trg_clientes_updated_at before update on public.clientes
  for each row execute function public.handle_updated_at();
create trigger trg_proveedores_updated_at before update on public.proveedores
  for each row execute function public.handle_updated_at();
create trigger trg_sc_updated_at before update on public.servicios_contratados
  for each row execute function public.handle_updated_at();
create trigger trg_cotizaciones_updated_at before update on public.cotizaciones
  for each row execute function public.handle_updated_at();
create trigger trg_contratos_updated_at before update on public.contratos
  for each row execute function public.handle_updated_at();
create trigger trg_proyectos_updated_at before update on public.proyectos
  for each row execute function public.handle_updated_at();
create trigger trg_tareas_updated_at before update on public.tareas
  for each row execute function public.handle_updated_at();
create trigger trg_infra_updated_at before update on public.infraestructura_proyecto
  for each row execute function public.handle_updated_at();
create trigger trg_se_updated_at before update on public.servicios_externos
  for each row execute function public.handle_updated_at();
create trigger trg_pagos_updated_at before update on public.pagos
  for each row execute function public.handle_updated_at();
create trigger trg_care_plans_updated_at before update on public.care_plans
  for each row execute function public.handle_updated_at();
create trigger trg_cs_updated_at before update on public.care_subscriptions
  for each row execute function public.handle_updated_at();

-- 7.2 Folio de cotización COT-AAAA-00001 (secuencia por año)
create table if not exists public.cotizacion_folios (
  año    int primary key,
  ultimo int not null default 0
);

create or replace function public.asignar_folio_cotizacion()
returns trigger language plpgsql as $$
declare
  v_año int := extract(year from now());
  v_num int;
begin
  if new.numero is null then
    insert into public.cotizacion_folios (año, ultimo)
    values (v_año, 1)
    on conflict (año) do update set ultimo = cotizacion_folios.ultimo + 1
    returning ultimo into v_num;
    new.numero := 'COT-' || v_año::text || '-' || lpad(v_num::text, 5, '0');
  end if;
  return new;
end;
$$;

create trigger trg_cotizaciones_folio before insert on public.cotizaciones
  for each row execute function public.asignar_folio_cotizacion();

-- 7.3 Historiales automáticos (estado anterior → nuevo)

-- pagos
create or replace function public.historico_pago()
returns trigger language plpgsql as $$
begin
  if new.estado is distinct from old.estado then
    insert into public.pago_historial (pago_id, estado_anterior, estado_nuevo, actor, detalle)
    values (new.id, old.estado, new.estado, auth.uid(), 'cambio de estado');
  end if;
  return new;
end;
$$;
create trigger trg_pago_historial after update on public.pagos
  for each row execute function public.historico_pago();

-- servicios_contratados
create or replace function public.historico_servicio_contratado()
returns trigger language plpgsql as $$
begin
  if new.estado is distinct from old.estado then
    insert into public.servicio_contratado_historial (servicios_contratados_id, estado_anterior, estado_nuevo, actor, detalle)
    values (new.id, old.estado, new.estado, auth.uid(), 'cambio de estado');
  end if;
  return new;
end;
$$;
create trigger trg_sc_historial after update on public.servicios_contratados
  for each row execute function public.historico_servicio_contratado();

-- care_subscriptions
create or replace function public.historico_care()
returns trigger language plpgsql as $$
declare
  v_tipo public.care_historial_tipo;
begin
  if new.estado is distinct from old.estado then
    v_tipo := case
      when new.estado = 'activo' and old.estado = 'pendiente_activacion' then 'activacion'::public.care_historial_tipo
      when new.estado = 'suspenso' then 'suspension'::public.care_historial_tipo
      when new.estado = 'cancelado' then 'cancelacion'::public.care_historial_tipo
      else 'actualizacion'::public.care_historial_tipo
    end;
  elsif new.care_plan_id is distinct from old.care_plan_id then
    v_tipo := 'cambio_plan'::public.care_historial_tipo;
  elsif new.fecha_renovacion is distinct from old.fecha_renovacion then
    v_tipo := 'renovacion'::public.care_historial_tipo;
  else
    v_tipo := 'actualizacion'::public.care_historial_tipo;
  end if;
  insert into public.care_subscription_historial (care_subscription_id, tipo, detalle, actor)
  values (new.id, v_tipo, 'estado: ' || coalesce(old.estado::text,'-') || ' → ' || coalesce(new.estado::text,'-'), auth.uid());
  return new;
end;
$$;
create trigger trg_cs_historial after update on public.care_subscriptions
  for each row execute function public.historico_care();

-- proyectos
create or replace function public.historico_proyecto()
returns trigger language plpgsql as $$
begin
  if new.estado is distinct from old.estado then
    insert into public.proyecto_historial (proyecto_id, campo, valor_anterior, valor_nuevo, actor)
    values (new.id, 'estado', to_jsonb(old.estado), to_jsonb(new.estado), auth.uid());
  end if;
  if new.nombre is distinct from old.nombre then
    insert into public.proyecto_historial (proyecto_id, campo, valor_anterior, valor_nuevo, actor)
    values (new.id, 'nombre', to_jsonb(old.nombre), to_jsonb(new.nombre), auth.uid());
  end if;
  return new;
end;
$$;
create trigger trg_proyecto_historial after update on public.proyectos
  for each row execute function public.historico_proyecto();

-- 7.4 Notifications (eventos internos por trigger)
-- pago aprobado → notificación al cliente
create or replace function public.notif_pago_aprobado()
returns trigger language plpgsql as $$
begin
  if new.estado = 'aprobado' and old.estado is distinct from 'aprobado' then
    insert into public.notifications (usuario_id, tipo, titulo, cuerpo, enlace)
    select p.id, 'exito', 'Pago aprobado', 'Tu pago fue validado.', '/pagos'
    from public.perfiles p
    where p.cliente_id = new.cliente_id and p.rol = 'client';
  end if;
  return new;
end;
$$;
create trigger trg_notif_pago_aprobado after update on public.pagos
  for each row execute function public.notif_pago_aprobado();

-- servicio activado → notificación al cliente
create or replace function public.notif_servicio_activado()
returns trigger language plpgsql as $$
begin
  if new.estado = 'activo' and old.estado is distinct from 'activo' then
    insert into public.notifications (usuario_id, tipo, titulo, cuerpo, enlace)
    select p.id, 'exito', 'Servicio activado', 'Tu servicio ya está activo.', '/servicios'
    from public.perfiles p
    where p.cliente_id = new.cliente_id and p.rol = 'client';
  end if;
  return new;
end;
$$;
create trigger trg_notif_servicio_activado after update on public.servicios_contratados
  for each row execute function public.notif_servicio_activado();

-- nueva solicitud de soporte → notificación al responsable
create or replace function public.notif_support_created()
returns trigger language plpgsql as $$
begin
  if new.responsable_asignado is not null then
    insert into public.notifications (usuario_id, tipo, titulo, cuerpo, enlace)
    values (new.responsable_asignado, 'info', 'Nueva solicitud de soporte', 'Revisa la solicitud asignada.', '/soporte');
  end if;
  return new;
end;
$$;
create trigger trg_notif_support_created after insert on public.support_requests
  for each row execute function public.notif_support_created();

-- tarea asignada → notificación al responsable
create or replace function public.notif_tarea_asignada()
returns trigger language plpgsql as $$
begin
  if new.responsable_id is not null and (old.responsable_id is null or new.responsable_id is distinct from old.responsable_id) then
    insert into public.notifications (usuario_id, tipo, titulo, cuerpo, enlace)
    values (new.responsable_id, 'info', 'Tarea asignada', 'Tienes una tarea nueva.', '/proyectos');
  end if;
  return new;
end;
$$;
create trigger trg_notif_tarea_asignada after insert or update of responsable_id on public.tareas
  for each row execute function public.notif_tarea_asignada();

-- 7.5 Auditoría de acciones críticas
-- (función de ejemplo: se invoca desde Edge Functions/triggers puntuales)
create or replace function public.audit_log(
  p_accion public.audit_accion,
  p_entidad text,
  p_entidad_id uuid,
  p_detalle jsonb default '{}'::jsonb,
  p_ip text default null
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_logs (actor_id, accion, entidad, entidad_id, detalle, ip)
  values (auth.uid(), p_accion, p_entidad, p_entidad_id, p_detalle, p_ip);
end;
$$;

-- 7.6 Sincronización de rol al claim (RLS eficiente)
-- Nota: se configura en Supabase con trigger en auth.users o función de
-- invite; al crear/actualizar perfiles.rol se refleja en app_metadata.rol.

-- 7.7 Correo de lead — DECISIÓN: SIN trigger.
-- Flujo confirmado: Landing → insert en leads → Edge Function send-email → Resend.
-- (No se usa pg_net_trigger.sql; la Edge Function resend-email ya está desplegada)

-- ============================================================================
-- 8. Seeds
-- ============================================================================
insert into public.proveedores (nombre, tipo, descripcion) values
  ('Supabase',       'infraestructura', 'Backend administrado actual'),
  ('Vercel',         'infraestructura', 'Frontend hosting actual'),
  ('Resend',         'correo',          'Servicio de correo'),
  ('AWS',            'almacenamiento',  'Nube externa (S3 y otros)'),
  ('THALEX Hosting', 'infraestructura', 'Hosting propio futuro'),
  ('Cliente',        'infraestructura', 'Infraestructura propia del cliente')
on conflict (nombre) do nothing;

insert into public.external_service_types (nombre, categoria) values
  ('Google Maps API',      'api'),
  ('Google Calendar API',  'api'),
  ('Stripe',               'pasarela'),
  ('Resend',               'correo'),
  ('OpenAI API',           'api'),
  ('WhatsApp API',         'api'),
  ('AWS S3',               'almacenamiento')
on conflict (nombre) do nothing;

-- ============================================================================
-- 9. Storage (buckets + políticas)
-- ============================================================================
insert into storage.buckets (id, name, public) values
  ('comprobantes', 'comprobantes', false),
  ('contratos',    'contratos',    false),
  ('documentos',   'documentos',   false),
  ('adjuntos',     'adjuntos',     false)
on conflict (id) do nothing;

-- comprobantes: CLIENT sube/lee en su carpeta {cliente_id}/...
create policy comprobantes_storage_insert on storage.objects
  for insert to authenticated with check (
    bucket_id = 'comprobantes' and
    (storage.foldername(name))[1] = public.current_cliente_id()::text
  );
create policy comprobantes_storage_select on storage.objects
  for select to authenticated using (
    bucket_id = 'comprobantes' and
    (storage.foldername(name))[1] = public.current_cliente_id()::text
  );

-- contratos/documentos/adjuntos: administradores (CLIENT lee contratos/documentos propios)
create policy contratos_storage_admin on storage.objects
  for all to authenticated using (
    bucket_id = 'contratos' and public.is_admin()
  ) with check (bucket_id = 'contratos' and public.is_admin());
create policy contratos_storage_client_select on storage.objects
  for select to authenticated using (
    bucket_id = 'contratos' and
    (storage.foldername(name))[1] = public.current_cliente_id()::text
  );
create policy documentos_storage_admin on storage.objects
  for all to authenticated using (
    bucket_id = 'documentos' and public.is_admin()
  ) with check (bucket_id = 'documentos' and public.is_admin());
create policy documentos_storage_client_select on storage.objects
  for select to authenticated using (
    bucket_id = 'documentos' and
    (storage.foldername(name))[1] = public.current_cliente_id()::text
  );
create policy adjuntos_storage_admin on storage.objects
  for all to authenticated using (
    bucket_id = 'adjuntos' and public.is_admin()
  ) with check (bucket_id = 'adjuntos' and public.is_admin());

-- ============================================================================
-- 10. Edge Functions (referencia — archivos Deno aparte)
-- ============================================================================
-- Funciones a crear en supabase/functions/:
--   send-email          : envía correo (lead, soporte, notificaciones) y registra
--                         email_referencias (proveedor, email_id, tipo_evento,
--                         fecha_envio). NO almacena contenido.
--   activar-servicio    : al aprobarse un pago, activa servicios_contratados y
--                         care_subscriptions (fecha_inicio/fecha_renovacion) + notifica.
--   generar-acceso-portal: crea usuario Auth de cliente (rol client, cliente_id) e invita.
--   validar-comprobante : ADMIN aprueba/rechaza pago y dispara activar-servicio.
--   webhook-stripe      : (futuro) confirma pagos Stripe → mismo flujo de activación.
--   procesar-renovaciones: (futuro) pg_cron/n8n crea pagos de renovación de care.
--
-- Regla de notificaciones:
--   - Triggers: eventos internos de BD (cambios de estado, asignaciones).
--   - Edge Functions: eventos externos e integraciones (Stripe, n8n, respuestas de correo).

commit;
