# Roles y seguridad

## Roles del sistema

| Rol | Descripción | Alcance |
| --- | --- | --- |
| `OWNER` / `SUPER ADMIN` | Propietario del sistema. Control total. | Todo, incluyendo configuración global y datos sensibles. |
| `ADMIN` | Gestión operativa. | Operación diaria: leads, clientes, cotizaciones, proyectos, pagos, contratos, documentos y usuarios. Sin acceso a configuración de infraestructura crítica. |
| `MONITOR` | Puede observar proyectos y estados. | **Ve proyectos asignados** y **actualiza tareas y avances asignados**. **No** accede a pagos, contratos, información financiera ni configuración crítica. |
| `CLIENT` | Cliente final. | **Solo su propia información**: perfil, servicios contratados, proyectos, pagos, documentos y solicitudes de soporte. |

## Matriz de permisos

| Acceso | OWNER | ADMIN | MONITOR | CLIENT |
| --- | :-: | :-: | :-: | :-: |
| Leads (ver/gestionar) | ✅ | ✅ | ❌ | ❌ |
| Clientes (CRUD) | ✅ | ✅ | ❌ | ❌ |
| Cotizaciones (CRUD) | ✅ | ✅ | ❌ | ❌ |
| Proyectos (ver) | ✅ | ✅ | ✅ (asignados) | ✅ (suyos) |
| Tareas y avances (ver) | ✅ | ✅ | ✅ (asignados) | ✅ (suyos) |
| Tareas y avances (actualizar) | ✅ | ✅ | ✅ (asignados) | ❌ |
| Pagos (montos) | ✅ | ✅ | ❌ | ✅ (suyos) |
| Contratos (ver) | ✅ | ✅ | ❌ | ✅ (suyos) |
| Documentos (ver) | ✅ | ✅ | ❌ | ✅ (suyos) |
| Solicitudes de soporte | ✅ | ✅ | ✅ (asignadas) | ✅ (suyas) |
| Notificaciones del portal | ✅ | ✅ | ✅ (propias) | ✅ (propias) |
| Auditoría (audit_logs) | ✅ | ✅ | ❌ | ❌ |
| Usuarios y roles | ✅ | ✅ | ❌ | ❌ |
| Configuración global | ✅ | ❌ | ❌ | ❌ |
| Datos sensibles / financieros | ✅ | ✅ | ❌ | ❌ |

## Principios de seguridad (RLS)

- Toda política se aplica en la base de datos (**Row Level Security**) y se refuerza en la UI.
- **CLIENT:** solo filas donde el registro pertenece a su cliente. Nunca datos ajenos.
- **MONITOR:** ve proyectos asignados; puede **actualizar** el estado y avance de tareas asignadas. Sin acceso a pagos, contratos, información financiera ni configuración crítica.
- **ADMIN / OWNER:** acceso amplio; `OWNER` además puede gestionar roles y configuración.
- **Público (no autenticado):** únicamente escritura de `leads` (insert) y lectura de catálogo de la landing. Nada más.
- El **service role** (Edge Functions) ejecuta operaciones privilegiadas internas: validación de comprobantes, activación de servicios, generación de acceso al portal.
- `audit_logs`, `notifications` (internas) y `email_referencias` se escriben por trigger/Edge Function; los usuarios solo leen (según rol).
- La comunicación con el cliente es por correo (Resend); en la base solo vive el registro operacional de la solicitud (`support_requests`) y su referencia técnica (`email_referencias`), no conversaciones completas.
- Los clientes se desactivan lógicamente (`estado = inactivo`); nunca se eliminan físicamente.

## Reglas

- Nunca exponer datos sensibles de un cliente a otro usuario `CLIENT`.
- El rol se asigna al crear el usuario y se valida en cada petición.
- El panel `/admin` rechaza acceso a usuarios con rol `CLIENT`; el portal `/client` rechaza roles internos.
- MONITOR no puede ver montos, métodos de pago ni documentos financieros.
- MONITOR puede ver solicitudes de soporte únicamente si está asignado como responsable.
- MONITOR puede actualizar el estado y avance de las tareas asignadas, pero no crear ni eliminar tareas ni proyectos.
