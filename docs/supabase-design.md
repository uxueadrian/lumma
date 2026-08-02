# Diseño de Supabase — Propuesta para revisión (v3)

> **Estado:** propuesta aprobada con ajustes finales. **No** se ha creado SQL ni ejecutado migraciones.
> Base conceptual: [data-model.md](./data-model.md), [roles-and-security.md](./roles-and-security.md), [payments.md](./payments.md), [services-care.md](./services-care.md), [infrastructure.md](./infrastructure.md).

## 1. Convenciones

- Tablas en `snake_case` plural. IDs `uuid default gen_random_uuid()`.
- Columnas de auditoría: `created_at timestamptz default now()`, `updated_at timestamptz default now()`, `created_by uuid references auth.users(id)` (cuando aplique).
- Los estados se modelan como **enums PostgreSQL**.
- El rol del usuario vive en `perfiles.rol` (negocio) y en el claim `app_metadata.rol` del JWT (para RLS eficiente).
- Monedas: campo `moneda text default 'MXN'`; montos `numeric(12,2)`.
- **Eliminación lógica:** los clientes se desactivan (`estado = 'inactivo'`), nunca se eliminan físicamente.
- Nada de secretos/credenciales en la base (solo referencias seguras).
- La comunicación con el cliente es por **correo (Resend)**: en la base solo vive la solicitud operacional y su `email_referencias` (sin contenido).

## 2. Enums (máquinas de estado)

```sql
-- (nomenclatura propuesta; sin ejecutar)
user_role               : owner | admin | monitor | client
cliente_origen          : web | manual
cliente_estado          : prospecto | activo | inactivo
lead_estado             : nuevo | contactado | cotizando | ganado | perdido
servicio_categoria      : desarrollo | care | automations | ai | hosting
servicio_contratado_estado : pendiente_activacion | activo | suspenso | cancelado
cotizacion_estado       : borrador | enviada | aprobada | rechazada | convertida
proyecto_estado         : en_desarrollo | en_pruebas | entregado | mantenimiento
tarea_estado            : pendiente | en_progreso | completada
pago_estado             : pendiente | comprobante_subido | validando | aprobado | rechazado
pago_metodo             : transferencia | efectivo | stripe        -- stripe futuro
comprobante_estado      : subido | validado | rechazado
contrato_estado         : borrador | firmado | activo | terminado | cancelado
documento_categoria     : contrato | factura | informe | entregable | otro
infra_tipo              : thalex | cliente
infra_estado            : activa | en_migracion | inactiva
proveedor_tipo          : infraestructura | correo | pasarela | api | almacenamiento | otro
servicio_externo_estado : configurado | activo | inactivo
servicio_externo_categoria : api | pasarela | correo | almacenamiento | fiscal | otro
care_periodicidad       : mensual | trimestral | anual
care_beneficio          : monitoreo | actualizaciones | soporte | mejoras_basicas | backups | reportes
care_suscripcion_estado : pendiente_activacion | activo | suspenso | cancelado
care_historial_tipo     : creacion | activacion | renovacion | cambio_plan | suspension | cancelacion | actualizacion
soporte_estado          : recibido | revisando | en_proceso | resuelto | cerrado
soporte_tipo            : soporte | reporte_error | cambio_solicitado | duda | comentario | otro
soporte_prioridad       : baja | media | alta | urgente
notificacion_tipo       : info | exito | advertencia | error
audit_accion            : crear | actualizar | eliminar | validar | activar | acceder | cambio_rol | otro
```

## 3. Tablas

### Identidad y roles

**perfiles** (1:1 con `auth.users`)

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | FK `auth.users(id)` on delete cascade |
| cliente_id | uuid | FK `clientes(id)` nullable |
| nombre | text | |
| telefono | text | |
| rol | `user_role` | owner \| admin \| monitor \| client |
| created_at / updated_at | timestamptz | |

**clientes**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| nombre | text | razón social / nombre |
| contacto_nombre | text | |
| correo | text | índice |
| telefono | text | |
| origen | `cliente_origen` | web \| manual |
| estado | `cliente_estado` | prospecto \| activo \| **inactivo** (baja lógica) |
| notas | text | |
| created_at / updated_at / created_by | | |

### Captación

**leads** (ya existe en producción)

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| nombre / correo / telefono | text | correo indexado |
| servicio | text | nombre desde la landing |
| presupuesto | text | |
| mensaje | text | |
| estado | `lead_estado` | |
| cliente_id | uuid | FK `clientes(id)` nullable — al convertirse |
| created_at | timestamptz | |

### Catálogos

**servicios**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| categoria | `servicio_categoria` | desarrollo \| care \| automations \| ai \| hosting |
| nombre | text | |
| descripcion | text | |
| config | jsonb | props de la landing (`services.jsx`) |
| estado | bool | activo / inactivo |

**proveedores** (seed: Supabase, Vercel, Resend, AWS, THALEX Hosting, Cliente)

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| nombre | text | |
| tipo | `proveedor_tipo` | |
| descripcion | text | |
| estado | bool | |

**external_service_types** (catálogo de tipos de servicios externos)

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| nombre | text | **UNIQUE** |
| categoria | `servicio_externo_categoria` | api \| pasarela \| correo \| almacenamiento \| fiscal \| otro |
| estado | bool | activo / inactivo |

Seed inicial: Google Maps API, Google Calendar API, Stripe, Resend, OpenAI API, WhatsApp API, AWS S3 (+ otros futuros).

### Contratación y venta

**servicios_contratados**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| cliente_id | uuid **FK** | `clientes(id)` |
| servicio_id | uuid **FK** | `servicios(id)` |
| estado | `servicio_contratado_estado` | |
| created_at / updated_at / created_by | | |

**cotizaciones**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| numero | text | **folio humano** `COT-AAAA-00001` (trigger/seq) |
| cliente_id | uuid **FK** | nullable |
| lead_id | uuid **FK** | nullable |
| estado | `cotizacion_estado` | |
| moneda | text | MXN |
| subtotal / impuestos / total | numeric(12,2) | |
| fecha_emision | timestamptz | |
| valida_hasta | timestamptz | |
| created_at / updated_at / created_by | | |

**lineas_cotizacion**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| cotizacion_id | uuid **FK** | `cotizaciones(id)` |
| servicio_id | uuid **FK** | nullable |
| concepto | text | |
| cantidad | int | |
| precio_unitario | numeric(12,2) | |
| subtotal | numeric(12,2) | |

**contratos**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| cliente_id | uuid **FK** | |
| cotizacion_id | uuid **FK** | nullable |
| servicios_contratados_id | uuid **FK** | nullable |
| estado | `contrato_estado` | |
| fecha_inicio / fecha_fin | date | |
| file_path | text | ruta en bucket `contratos` |
| created_at / updated_at | | |

### Proyectos

**proyectos**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| cliente_id | uuid **FK** | |
| servicios_contratados_id | uuid **FK** | nullable |
| nombre | text | |
| descripcion | text | |
| estado | `proyecto_estado` | |
| fecha_inicio | date | |
| fecha_entrega_estimada | date | |
| fecha_entrega | date | nullable |
| created_at / updated_at | | |

**tareas**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| proyecto_id | uuid **FK** | `proyectos(id)` |
| nombre / descripcion | text | |
| responsable_id | uuid **FK** | `perfiles(id)` nullable |
| estado | `tarea_estado` | |
| **avance** | int | 0-100 (progreso; lo actualiza MONITOR en tareas asignadas) |
| fecha_vencimiento | date | |
| orden | int | |

### Infraestructura

**infraestructura_proyecto** (1:1 con proyectos)

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| proyecto_id | uuid **FK UNIQUE** | `proyectos(id)` |
| tipo | `infra_tipo` | thalex \| cliente |
| proveedor_id | uuid **FK** | `proveedores(id)` |
| dominio / hosting / base_de_datos | text | |
| estado | `infra_estado` | |
| responsable | text | |
| informacion_tecnica | jsonb | sin credenciales |

**servicios_externos**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| proyecto_id | uuid **FK** | `proyectos(id)` |
| proveedor_id | uuid **FK** | `proveedores(id)` |
| servicio_tipo_id | uuid **FK** | `external_service_types(id)` |
| estado | `servicio_externo_estado` | |
| referencia_secreta | text | referencia, **nunca el valor** |
| informacion_operativa | jsonb | sin credenciales |

### Pagos

**pagos**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| cliente_id | uuid **FK** | |
| cotizacion_id | uuid **FK** | nullable |
| servicios_contratados_id | uuid **FK** | nullable |
| monto | numeric(12,2) | |
| moneda | text | |
| metodo | `pago_metodo` | |
| estado | `pago_estado` | |
| referencia | text | |
| validado_por | uuid **FK** | `auth.users(id)` nullable |
| validado_en | timestamptz | nullable |
| created_at / updated_at | | |

**comprobantes** (1:1 con pagos)

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| pago_id | uuid **FK UNIQUE** | `pagos(id)` |
| file_path | text | ruta en bucket `comprobantes` |
| mime_type / size | text / bigint | |
| estado | `comprobante_estado` | |
| created_at | | |

### Documentos

**documentos**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| cliente_id | uuid **FK** | |
| categoria | `documento_categoria` | |
| nombre | text | |
| file_path | text | ruta en bucket `documentos` |
| mime_type / size | text / bigint | |
| created_at / created_by | | |

### Soporte (reemplaza el chat interno)

**support_requests**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| cliente_id | uuid **FK** | `clientes(id)` |
| proyecto_id | uuid **FK** | `proyectos(id)` nullable |
| tipo_solicitud | `soporte_tipo` | soporte \| reporte_error \| cambio_solicitado \| duda \| comentario \| otro |
| estado | `soporte_estado` | recibido \| revisando \| en_proceso \| resuelto \| cerrado |
| prioridad | `soporte_prioridad` | baja \| media \| alta \| urgente |
| fecha_creacion | timestamptz | |
| fecha_actualizacion | timestamptz | |
| responsable_asignado | uuid **FK** | `perfiles(id)` nullable |

> El **contenido completo de la comunicación viaja por correo (Resend)**. La referencia técnica del envío se guarda en `email_referencias` (proveedor, email_id, tipo_evento, fecha_envio). No se almacenan conversaciones.

**email_referencias**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| support_request_id | uuid **FK** | `support_requests(id)` nullable |
| pago_id | uuid **FK** | `pagos(id)` nullable |
| proveedor | text | ej. `resend` |
| email_id | text | id del correo en el proveedor |
| tipo_evento | text | lead, solicitud, respuesta, pago, activacion, renovacion… |
| fecha_envio | timestamptz | |

### Eventos y auditoría

**notifications** (triggers para eventos internos; Edge Functions para eventos externos)

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| usuario_id | uuid **FK** | `perfiles(id)` destinatario |
| tipo | `notificacion_tipo` | info \| exito \| advertencia \| error |
| titulo / cuerpo | text | |
| enlace | text | nullable |
| leido | bool | default false |
| created_at | timestamptz | |

**audit_logs**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| actor_id | uuid **FK** | `perfiles(id)` nullable |
| accion | `audit_accion` | |
| entidad / entidad_id | text / uuid | |
| detalle | jsonb | |
| ip | text | nullable |
| created_at | timestamptz | |

### THALEX Care

**care_plans**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| nombre | text | Básico, Pro, Empresarial |
| descripcion | text | |
| periodicidad | `care_periodicidad` | |
| precio_referencia | numeric(12,2) | |
| moneda | text | |
| estado | bool | |

**care_features**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| care_plan_id | uuid **FK** | `care_plans(id)` |
| beneficio | `care_beneficio` | |
| descripcion | text | |
| limite | text | |
| estado | bool | |

**care_subscriptions** (1:1 con servicios_contratados tipo care)

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| cliente_id | uuid **FK** | |
| servicios_contratados_id | uuid **FK UNIQUE** | |
| care_plan_id | uuid **FK** | |
| estado | `care_suscripcion_estado` | |
| fecha_inicio | date | |
| fecha_renovacion | date | |
| fecha_cancelacion | date | nullable |
| ciclo_actual | uuid **FK** | `pagos(id)` nullable |
| created_at / updated_at | | |

### Historiales (automáticos por trigger)

**care_subscription_historial**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| care_subscription_id | uuid **FK** | |
| fecha | timestamptz | |
| tipo | `care_historial_tipo` | |
| detalle | text | |
| actor | uuid **FK** | `auth.users(id)` nullable |

**pago_historial**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| pago_id | uuid **FK** | `pagos(id)` |
| estado_anterior / estado_nuevo | `pago_estado` | |
| fecha | timestamptz | |
| actor | uuid **FK** | nullable |
| detalle | text | |

**servicio_contratado_historial**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| servicios_contratados_id | uuid **FK** | |
| estado_anterior / estado_nuevo | `servicio_contratado_estado` | |
| fecha | timestamptz | |
| actor | uuid **FK** | nullable |
| detalle | text | |

**proyecto_historial**

| Columna | Tipo | Notas |
| --- | --- | --- |
| id | uuid **PK** | |
| proyecto_id | uuid **FK** | `proyectos(id)` |
| campo | text | |
| valor_anterior / valor_nuevo | jsonb | |
| fecha | timestamptz | |
| actor | uuid **FK** | nullable |

## 4. Relaciones (resumen)

```
auth.users 1:1 perfiles
perfiles n:1 clientes
leads 0:1 clientes        | leads 0:n cotizaciones
clientes 1:n servicios_contratados | cotizaciones | proyectos | pagos | contratos | documentos | support_requests | care_subscriptions
servicios n:n clientes (servicios_contratados)
servicios_contratados 1:n proyectos | 1:0..1 contratos | 1:0..1 care_subscriptions
cotizaciones 1:n lineas_cotizacion | 0:1 contratos | 0:n pagos
proyectos 1:n tareas | 1:1 infraestructura_proyecto | 1:n servicios_externos
servicios_externos n:1 proveedores | n:1 external_service_types
infraestructura_proyecto n:1 proveedores
pagos 1:1 comprobantes
care_plans 1:n care_features | 1:n care_subscriptions
care_subscriptions 1:n care_subscription_historial
support_requests n:1 clientes | n:0..1 proyectos | 0:n email_referencias
email_referencias n:0..1 support_requests | n:0..1 pagos
notifications n:1 perfiles
audit_logs n:1 perfiles
pagos 1:n pago_historial
servicios_contratados 1:n servicio_contratado_historial
proyectos 1:n proyecto_historial
```

## 5. Índices recomendados

| Tabla | Índices |
| --- | --- |
| perfiles | `cliente_id`, `rol` |
| leads | `estado`, `correo`, `cliente_id` |
| clientes | `correo`, `estado`, `origen` |
| cotizaciones | `cliente_id`, `lead_id`, `estado`, `numero` (unique) |
| lineas_cotizacion | `cotizacion_id` |
| servicios_contratados | `cliente_id`, `servicio_id`, `estado` |
| proyectos | `cliente_id`, `servicios_contratados_id`, `estado` |
| tareas | `proyecto_id`, `estado`, `responsable_id` |
| infraestructura_proyecto | `proyecto_id` (unique), `proveedor_id` |
| servicios_externos | `proyecto_id`, `proveedor_id`, `servicio_tipo_id` |
| external_service_types | `nombre` (unique), `categoria` |
| pagos | `cliente_id`, `cotizacion_id`, `servicios_contratados_id`, `estado` |
| comprobantes | `pago_id` (unique) |
| documentos | `cliente_id`, `categoria` |
| support_requests | `cliente_id`, `proyecto_id`, `estado`, `prioridad`, `responsable_asignado` |
| email_referencias | `support_request_id`, `pago_id`, `fecha_envio` |
| notifications | `usuario_id`, `leido` |
| audit_logs | `entidad`, `entidad_id`, `actor_id`, `created_at` |
| care_subscriptions | `cliente_id`, `care_plan_id`, `estado`, `fecha_renovacion` |
| care_subscription_historial | `care_subscription_id` |
| pago_historial | `pago_id` |
| servicio_contratado_historial | `servicios_contratados_id` |
| proyecto_historial | `proyecto_id` |

## 6. Políticas RLS por rol

### Funciones auxiliares (security definer)

```sql
is_owner()            → bool   (rol = 'owner')
is_admin()            → bool   (rol in ('owner','admin'))
is_monitor()          → bool   (rol = 'monitor')
current_cliente_id()  → uuid   (cliente_id del usuario autenticado)
```

### Matriz de políticas

| Tabla | anon | CLIENT | MONITOR | ADMIN | OWNER |
| --- | --- | --- | --- | --- | --- |
| leads | INSERT | — | — | CRUD | CRUD |
| servicios | SELECT | SELECT | SELECT | CRUD | CRUD |
| proveedores | — | — | — | CRUD | CRUD |
| external_service_types | — | — | — | CRUD | CRUD |
| clientes | — | SELECT (propio) | — | CRUD | CRUD |
| perfiles | — | SELECT/UPDATE (propio) | SELECT (propio) | SELECT/UPDATE (internos) | CRUD |
| servicios_contratados | — | SELECT (propio) | — | CRUD | CRUD |
| cotizaciones | — | SELECT (propio) | — | CRUD | CRUD |
| lineas_cotizacion | — | SELECT (vía cotización propia) | — | CRUD | CRUD |
| contratos | — | SELECT (propio) | **sin acceso** | CRUD | CRUD |
| proyectos | — | SELECT (propio) | SELECT (asignados) | CRUD | CRUD |
| tareas | — | SELECT (proyecto propio) | SELECT/UPDATE (asignadas: estado y avance) | CRUD | CRUD |
| infraestructura_proyecto | — | SELECT (propio, solo URLs públicas) | — | CRUD | CRUD |
| servicios_externos | — | — | — | CRUD | CRUD |
| pagos | — | SELECT (propio) | **sin acceso** | CRUD | CRUD |
| comprobantes | — | INSERT/SELECT (pago propio) | **sin acceso** | CRUD (validación) | CRUD |
| documentos | — | SELECT (propio) | **sin acceso** | CRUD | CRUD |
| support_requests | — | INSERT/SELECT (propio) | SELECT (asignadas) | CRUD | CRUD |
| email_referencias | — | SELECT (vía solicitud propia) | — | CRUD | CRUD |
| notifications | — | SELECT/UPDATE (propias) | SELECT (propias) | CRUD | CRUD |
| audit_logs | — | — | — | SELECT | SELECT |
| care_plans | — | SELECT | — | CRUD | CRUD |
| care_features | — | SELECT | — | CRUD | CRUD |
| care_subscriptions | — | SELECT (propio) | — | CRUD | CRUD |
| care_subscription_historial | — | SELECT (propio) | — | CRUD | CRUD |
| pago_historial | — | — | — | CRUD | CRUD |
| servicio_contratado_historial | — | — | — | CRUD | CRUD |
| proyecto_historial | — | SELECT (proyecto propio) | SELECT (asignados) | CRUD | CRUD |

Reglas clave:
- **CLIENT** solo ve filas donde `cliente_id = current_cliente_id()`.
- **MONITOR** puede **ver proyectos asignados** y **actualizar tareas y avances asignados**. **No** accede a pagos, contratos, información financiera ni configuración crítica.
- **ADMIN/OWNER** operan sobre las filas operacionales; **OWNER** además gestiona usuarios y roles.
- `audit_logs`, `notifications` (internas) y `email_referencias` se escriben vía **trigger/Edge Function** (service role).
- El `service role` ejecuta operaciones privilegiadas y **bypasea** RLS.

## 7. Buckets de Storage

| Bucket | Estructura de ruta | Lectura | Escritura |
| --- | --- | --- | --- |
| `comprobantes` | `{cliente_id}/{pago_id}/archivo` | CLIENT (propio), ADMIN/OWNER | CLIENT (propio), ADMIN |
| `contratos` | `{cliente_id}/contrato-{id}.pdf` | CLIENT (propio), ADMIN/OWNER | ADMIN/OWNER |
| `documentos` | `{cliente_id}/{categoria}/archivo` | CLIENT (propio), ADMIN/OWNER | ADMIN/OWNER |
| `adjuntos` | `{proyecto_id}/archivo` | ADMIN/OWNER (interno) | ADMIN/OWNER |

Política: validar el prefijo `{cliente_id}` contra `current_cliente_id()` para CLIENT; MONITOR sin acceso a buckets.

## 8. Edge Functions

| Función | Rol | Descripción |
| --- | --- | --- |
| `send-email` / `resend-email` | existente | Notificaciones Resend. Recibe el contenido de la solicitud/respuesta, envía el correo y registra `email_referencias` (proveedor, email_id, tipo_evento, fecha_envio). También: lead nuevo, pago recibido, activación, renovación. |
| `activar-servicio` | service role | Al aprobarse un pago: activa `servicios_contratados` (y `care_subscriptions` con fechas) + notifica. |
| `generar-acceso-portal` | service role | Crea el usuario Auth de un cliente (rol `client`, `cliente_id`) e invita por correo. |
| `validar-comprobante` | service role | Acción de ADMIN: marca pago aprobado/rechazado y dispara `activar-servicio` si aplica. |
| `webhook-stripe` | service role (futuro) | Confirma pagos Stripe y deriva al flujo de activación. |
| `procesar-renovaciones` | service role (futuro) | Job programado (pg_cron/n8n): crea pagos de renovación de `care_subscriptions`. |

**Notificaciones:** **triggers** para eventos internos de BD (cambio de estado de pago, activación, nueva solicitud interna); **Edge Functions** para eventos externos e integraciones (webhook Stripe, n8n, respuestas de correo).

## 9. Triggers recomendados

- `on_lead_inserted` → dispara `send-email` (notificación de lead). Ya existe.
- `on_support_request_created` → dispara `send-email` (envía la solicitud), crea `notifications` (interna al responsable) y `email_referencias`.
- **Historiales automáticos** (estado anterior → nuevo en cada UPDATE):
  - `on_pago_update` → `pago_historial`.
  - `on_servicio_contratado_update` → `servicio_contratado_historial`.
  - `on_care_subscription_change` → `care_subscription_historial`.
  - `on_proyecto_update` → `proyecto_historial`.
- **Notifications internas por trigger:** pago aprobado (cliente), servicio activado (cliente), nueva solicitud de soporte (responsable), tarea asignada (MONITOR).
- `sync_role_claim` → mantiene `app_metadata.rol` al actualizar `perfiles.rol`.
- `asignar_folio_cotizacion` → genera `COT-AAAA-00001` al insertar una cotización (secuencia por año).
- `audit_critical_actions` → registra en `audit_logs` las acciones críticas (validación de pagos, activaciones, cambios de rol, accesos).

## 10. Seeds

**Proveedores**

```
Supabase        (infraestructura)
Vercel          (infraestructura)
Resend          (correo)
AWS             (almacenamiento / infraestructura)
THALEX Hosting  (infraestructura — futuro)
Cliente         (infraestructura propia del cliente)
```

**External service types**

```
Google Maps API      (api)
Google Calendar API  (api)
Stripe               (pasarela)
Resend               (correo)
OpenAI API           (api)
WhatsApp API         (api)
AWS S3               (almacenamiento)
(otros futuros: configurable)
```

## 11. Decisiones aplicadas

| Decisión | Resultado |
| --- | --- |
| `mensajes` → `support_requests` | Solicitudes operacionales del portal; comunicación completa por Resend, sin conversaciones en base. |
| Catálogo `external_service_types` | Tipos de servicios externos configurables (seed: Google Maps/Calendar API, Stripe, Resend, OpenAI, WhatsApp, AWS S3). |
| `notifications` | Triggers para eventos internos de BD; Edge Functions para eventos externos e integraciones. |
| `email_referencias` | Referencia técnica del correo (proveedor, email_id, tipo_evento, fecha_envio); sin contenido. |
| MONITOR | Ve proyectos asignados; actualiza tareas y avances asignados. Nunca pagos, contratos, financiero ni configuración crítica. |
| `audit_logs` | Acciones críticas del sistema. |
| Seed de proveedores | Supabase, Vercel, Resend, AWS, THALEX Hosting, Cliente. |
| Folio de cotización | `COT-AAAA-00001` vía trigger + secuencia anual. |
| Historiales automáticos | Triggers para pagos, servicios_contratados, care_subscriptions y proyectos. |
| Eliminación lógica | Clientes desactivados (`inactivo`), nunca eliminados físicamente. |

## 12. Pendientes menores para la implementación

1. Formato exacto de `email_id` (message-id de Resend) para trazabilidad.
2. Confirmar si MONITOR puede crear solicitudes internas o solo atender las asignadas.
3. Definir el vencimiento/limpieza de `notifications` (retención).

---

Diseño v3 listo. El SQL completo se genera como **propuesta** en el siguiente paso (sin ejecutar).
