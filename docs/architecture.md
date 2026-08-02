# Arquitectura general

## Modelo

THALEX SYSTEMS comparte **un solo backend** (Supabase) con **dos repositorios**:

1. **Landing pública** — repo `thalexsystems`. Marketing, captación de leads y **documentación del negocio** (Business Core). Público (sin login).
2. **Portal del sistema** — repo `thalexsystems-client-portal`. **Una sola aplicación** con **un único inicio de sesión**. Tras autenticarse, el sistema determina el rol del usuario (`OWNER`, `ADMIN`, `MONITOR`, `CLIENT`) y carga la interfaz correspondiente.

No existe un repositorio independiente para el panel administrativo ni un segundo sistema de autenticación: **todo el Portal vive en una única aplicación** cuya interfaz cambia según el rol.

```
                          ┌─────────────────────────────┐
                          │          SUPABASE           │
                          │   Postgres + Auth + Storage │
                          │  + Edge Functions (Deno)    │
                          └─────────────────────────────┘
                                    ▲        ▲
                          público   │        │      autenticado
                          (leads)   │        │  (owner|admin|monitor|client)
                                    │        │
                    ┌───────────────┤        ├────────────────┐
                    │               │        │                │
            ┌───────┴───────┐ ┌─────┴────────┴─────┐  ┌───────┴──────┐
            │   LANDING     │ │      PORTAL        │  │  n8n (fut.)  │
            │  (público)    │ │  una sola app      │  │ automaciones │
            │ thalexsystems │ │  UI según rol      │  └──────┬───────┘
            └───────┬───────┘ │ client-portal      │         │
                    │         └────────────────────┘    ┌────▼────┐
            leads + email                               │ Base    │
                    │                                   │ local   │
            Resend (Edge Function)                      │histórico│
                    │                                   └─────────┘
            Emails / notificaciones
```

## Capas

### 1. Landing (`thalexsystems`)

- React 19 + Vite + Tailwind CSS. Deploy en Vercel.
- Captura de leads (tabla `leads`) con notificación por correo vía Edge Function `send-email` (Resend).
- Integración con WhatsApp para contacto directo.
- **Business Core:** aloja también la documentación del negocio, la arquitectura, el modelo de datos y las decisiones técnicas (carpeta `docs/`, ver [docs/README.md](./README.md)).

### 2. Portal del sistema (`thalexsystems-client-portal`)

- **Una sola aplicación** con un único inicio de sesión. Tras autenticarse, el sistema determina el rol (`OWNER`, `ADMIN`, `MONITOR`, `CLIENT`) y carga la interfaz correspondiente.
- Vista `CLIENT`: inicio de sesión, perfil, servicios contratados, seguimiento de proyectos, solicitudes de cotización, solicitudes de servicio (THALEX Care, THALEX Automations), comprobantes de pago, contratos, documentos y **solicitudes de soporte** (`support_requests`).
- Vista interna (`OWNER` / `ADMIN` / `MONITOR`): gestión de leads, clientes, cotizaciones, proyectos, pagos, contratos, documentos, soporte y usuarios. Cada rol ve solo el alcance que le corresponde (ver [roles-and-security.md](./roles-and-security.md)).
- No existe un repositorio independiente para el panel administrativo ni un segundo sistema de autenticación.

### 3. Backend y datos (Supabase)

- **Auth** — usuarios, sesiones y rol (claim/metadata).
- **Postgres** — datos operacionales (ver [data-model.md](./data-model.md)).
- **Storage** — comprobantes de pago, contratos, documentos y adjuntos.
- **Edge Functions** — email, validaciones, webhooks de pago (futuro Stripe), generación de acceso al portal. Las **notificaciones** se crean con **triggers** para eventos internos de BD y con **Edge Functions** para eventos externos e integraciones.

### 4. Automatización e integración (futuro)

- **n8n** — automatizaciones e integraciones: correo masivo, respaldos, reportes, sincronización de histórico.
- **Base local** — histórico empresarial (data warehouse ligero).

### 5. Histórico empresarial y respaldos

| Capa | Rol |
| --- | --- |
| **Supabase** | Base operacional diaria. |
| **n8n** | Automatizaciones e integraciones. |
| **Base local** | Histórico empresarial. |

La **base local NO se usa directamente por clientes**. Su objetivo:

- Respaldos.
- Auditoría histórica.
- Reportes.
- Migraciones.
- Conservación de información antigua.

## Múltiples clientes e infraestructuras

THALEX SYSTEMS administra dentro del mismo sistema:

- Múltiples **clientes**.
- Múltiples **proyectos**.
- Múltiples **proveedores**.
- Diferentes **tipos de infraestructura**.

Ejemplos de coexistencia:

| Cliente | Infraestructura |
| --- | --- |
| Cliente A | Administrada por THALEX. |
| Cliente B | Propia del cliente. |
| Cliente C | Cloud externa (AWS, etc.). |

Todos coexisten bajo el mismo modelo de datos, sin acoplar la lógica a un proveedor (ver [infrastructure.md](./infrastructure.md) y [technology-strategy.md](./technology-strategy.md)).

## Ubicación de la información

| Información | Ubicación |
| --- | --- |
| Leads, clientes, cotizaciones, proyectos, pagos, contratos, documentos | Supabase Postgres |
| Solicitudes de soporte (solo metadatos operacionales) | Supabase Postgres (`support_requests`) |
| Notificaciones del portal y auditoría | Supabase Postgres (`notifications`, `audit_logs`) |
| Servicios externos de cada proyecto (sub-entidad, sin credenciales) | Supabase Postgres |
| Comprobantes de pago y documentos | Supabase Storage |
| Usuarios, sesiones y roles | Supabase Auth |
| **Contenido de la comunicación con el cliente** (solicitudes/respuestas de soporte) | **Correo (Resend)** — no se almacenan conversaciones en la base |
| Notificaciones por correo | Resend (Edge Function) |
| Flujos de automatización | n8n (futuro) |
| Histórico empresarial | Base local |
| Credenciales y secretos (infraestructura y servicios externos) | Variables de entorno, gestores de secretos o configuración segura de infraestructura (nunca en Supabase) |

## Principios

- El método de pago es configurable (dato), no lógica: cambiar de transferencia a Stripe no cambia los flujos de negocio.
- RLS controla el alcance por rol en la base de datos (ver [roles-and-security.md](./roles-and-security.md)).
- El Portal es una sola aplicación (repo `thalexsystems-client-portal`) con un único inicio de sesión; comparte el mismo backend y modelo de datos que la landing.
- La arquitectura evita dependencia de proveedores: backend, base de datos e infraestructura son **intercambiables** (ver [technology-strategy.md](./technology-strategy.md)).
- THALEX Hosting es un proveedor futuro de infraestructura (ver [services-hosting.md](./services-hosting.md)).
- Los servicios externos se modelan como sub-entidad por proyecto; la base solo guarda referencias seguras de secretos, nunca credenciales reales.
- La comunicación con el cliente es por correo (Resend); en la base solo vive el registro operacional de la solicitud (`support_requests`), sin conversaciones completas.
- Los clientes se desactivan lógicamente (`inactivo`); no se eliminan físicamente.

## Roadmap

| Fase | Alcance |
| --- | --- |
| 0 | Documentación y modelo conceptual (completado). |
| 1 | Esquema de base de datos en Supabase: tablas, RLS, Edge Functions (implementado — migración v3 ejecutada; registro en `supabase/schema_proposal.sql`). |
| 2 | Portal (única aplicación): auth + roles, primeras secciones operativas (leads, clientes, cotizaciones, pagos). |
| 3 | Portal: funcionalidad de cliente (perfil, servicios, proyectos, pagos, documentos, soporte). |
| 4 | Automatizaciones (n8n), respaldos y sincronización de histórico. |
| 5 | THALEX AI. |
