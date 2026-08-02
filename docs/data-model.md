# Modelo de datos conceptual

> Fase conceptual. No hay tablas creadas todavía. Este documento define entidades, relaciones y estados; la implementación SQL se hará en una fase posterior.

## Convenciones de nomenclatura

- Tablas en **plural** y `snake_case` (`cotizaciones`, `servicios_contratados`).
- IDs tipo `uuid` por defecto.
- Toda tabla de negocio incluye: `created_at`, `updated_at` y `created_by` cuando aplique.
- Los estados usan valores en `snake_case` (`pendiente_activacion`).

## Entidades principales

### users (Supabase Auth)

- Usuario del sistema (interno o cliente).
- El rol vive en el claim/metadata del usuario.
- Relación 1:1 con `perfiles`.

### perfiles

- Datos de contacto del usuario: nombre, teléfono, empresa (si aplica).
- Relación n:1 con `clientes` (un perfil pertenece a un cliente).
- `rol`: `owner | admin | monitor | client`.

### clientes

- Persona o empresa que contrata servicios.
- `origen`: `web` (desde landing/lead) | `manual` (creado por admin).
- `estado`: `prospecto | activo | inactivo`.

### leads

- Solicitudes de contacto/cotización provenientes de la landing (ya existe).
- Pueden convertirse en `clientes` y/o generar `cotizaciones`.

### servicios

- Catálogo de servicios. Categorías:
  - `desarrollo` (landing, sitios corporativos, sistemas web, e-commerce, software a medida)
  - `care` (THALEX Care)
  - `automations` (THALEX Automations)
  - `ai` (THALEX AI — futura)
  - `hosting` (THALEX Hosting — futura, infraestructura tecnológica)
- Relación n:n con `clientes` vía `servicios_contratados`.

### servicios_contratados

- Relación cliente ↔ servicio.
- `estado`: `pendiente_activacion | activo | suspenso | cancelado`.
- Para `care`: se complementa con una `care_subscriptions` (1:1) que modela el comportamiento recurrente (ver [services-care.md](./services-care.md)).
- Para `hosting`: identifica el servicio de infraestructura contratado (ver [services-hosting.md](./services-hosting.md)).

### care_plans

- Catálogo de **planes** de THALEX Care.
- Campos: `nombre`, `descripcion`, `periodicidad` (`mensual | trimestral | anual`), `precio_referencia`, `moneda`, `estado` (`activo | inactivo`).
- Relación 1:n con `care_features` (beneficios del plan).

### care_features

- **Beneficios incluidos** en cada plan de care.
- Campos: `care_plan_id`, `beneficio` (`monitoreo | actualizaciones | soporte | mejoras_basicas | backups | reportes`), `descripcion`, `limite` (si aplica, ej. horas de soporte), `estado`.

### care_subscriptions

- **Suscripción recurrente** de un cliente a un plan de care. Es la especialización de `servicios_contratados` para servicios tipo `care`.
- Campos: `cliente_id`, `servicios_contratados_id` (1:1), `care_plan_id`, `estado`, `fecha_inicio`, `fecha_renovacion`, `fecha_cancelacion` (nullable), `ciclo_actual` (referencia al pago que cubre el período).
- `estado`: `pendiente_activacion | activo | suspenso | cancelado`.
- Relación 1:n con `care_subscription_historial`.

### care_subscription_historial

- **Historial de cambios** de la suscripción: creaciones, activaciones, renovaciones, cambios de plan, suspensiones y cancelaciones.
- Campos: `care_subscription_id`, `fecha`, `tipo`, `detalle`, `actor` (usuario responsable).

### cotizaciones

- Documento de propuesta económica. Origen: un `lead` o un `cliente`.
- Compuesta por `lineas_cotizacion` (uno o varios `servicios`).
- `estado`: `borrador | enviada | aprobada | rechazada | convertida`.

### lineas_cotizacion

- Detalle de una cotización: servicio, concepto, monto, moneda.

### proyectos

- Trabajo asociado a un `servicio_contratado` (o directamente a un cliente).
- `estado`: `en_desarrollo | en_pruebas | entregado | mantenimiento`.
- Tiene una `infraestructura` asociada (ver [infrastructure.md](./infrastructure.md)).

### tareas

- Etapas/tareas del proyecto con responsables y estados.
- `estado`: `pendiente | en_progreso | completada`.
- `avance` (0-100): progreso de la tarea.
- Los `MONITOR` pueden visualizar y **actualizar** tareas y avances asignados.

### proveedores

- Catálogo de proveedores de infraestructura y servicios externos (desacoplado de la lógica).
- Ejemplos: Supabase, Vercel, AWS, THALEX Hosting, infraestructura propia del cliente.
- Permite registrar múltiples proveedores y migrar sin cambiar el modelo.

### infraestructura_proyecto

- 1:1 con `proyectos`. Describe dónde y cómo vive el proyecto, **sin fijar proveedor**.
- Campos: `tipo` (`thalex` | `cliente`), `proveedor` (referencia a `proveedores`), `dominio`, `hosting`, `base_de_datos`, `estado`, `responsable`, `informacion_tecnica`.
- Los servicios externos se registran como **sub-entidad propia** (`servicios_externos`), no como campo libre.
- Guarda referencia no sensible. Nunca credenciales.

### servicios_externos

- **Sub-entidad** relacionada con `proyectos`: cada proyecto puede usar múltiples servicios externos según las necesidades del cliente.
- Campos: `proyecto_id`, `proveedor` (referencia a `proveedores`), `servicio_tipo_id` (referencia al catálogo `external_service_types`), `estado`, `referencia_secreta` (referencia segura del secreto, **nunca el valor**), `informacion_operativa` (datos no sensibles necesarios para operarlo).
- Configurables por proyecto: no todas las soluciones THALEX usan los mismos servicios.
- Ejemplos:
  - Proyecto inmobiliario → Google Maps API, Google Places API, Resend.
  - Proyecto restaurante → WhatsApp API, Google Calendar API, Stripe, Resend.
  - Proyecto empresarial → OpenAI API, AWS S3, servicios fiscales, firma electrónica.

### external_service_types

- **Catálogo de tipos de servicios externos** (configurable, con nuevos tipos futuros).
- Seed inicial: Google Maps API, Google Calendar API, Stripe, Resend, OpenAI API, WhatsApp API, AWS S3 (+ otros futuros).
- Campos: `nombre`, `categoria` (`api | pasarela | correo | almacenamiento | fiscal | otro`), `estado`.

#### Seguridad de secretos

- Las credenciales y secretos **NO** se almacenan en la base de datos.
- La base solo almacena: proveedor, tipo de servicio (catálogo), estado, **referencia segura del secreto** e información operativa necesaria.
- Las credenciales reales viven en:
  - Variables de entorno.
  - Gestores de secretos.
  - Configuración segura de infraestructura.

### pagos

- Pagos de clientes vinculados a `cotizaciones` o `servicios_contratados`.
- `metodo`: `transferencia | efectivo` (futuro `stripe`).
- `estado`: `pendiente | comprobante_subido | validando | aprobado | rechazado`.
- Flujo completo en [payments.md](./payments.md).

### comprobantes

- 1:1 con `pagos`. Archivo en Supabase Storage + metadatos.
- Cargado por el cliente, validado por THALEX.

### contratos

- Contrato legal del servicio. 1:1 con `servicios_contratados` (o `cotizaciones`).
- Documento en Storage + metadatos.

### documentos

- Documentos del cliente (facturas, informes, entregables).
- Archivo en Storage + metadatos. Alcance controlado por rol.

### support_requests

- **Solicitudes de clientes enviadas desde el portal** (no es chat interno).
- Solo información **operacional mínima**. El contenido completo de la comunicación se envía por correo (Resend) y no se almacena en Supabase.
- Campos: `cliente_id`, `proyecto_id` (opcional), `tipo_solicitud`, `estado`, `prioridad`, `fecha_creacion`, `fecha_actualizacion`, `responsable_asignado` (opcional).
- `tipo_solicitud`: `soporte | reporte_error | cambio_solicitado | duda | comentario | otro`.
- `estado`: `recibido | revisando | en_proceso | resuelto | cerrado`.
- Las referencias de correo asociadas viven en `email_referencias`.

### email_referencias

- **Referencia técnica de los correos enviados** por el proveedor de correo (Resend).
- Almacena únicamente: `proveedor`, `email_id`, `tipo_evento`, `fecha_envio` y la entidad de negocio relacionada (solicitud, pago, etc.).
- **No** guarda el contenido del correo ni la conversación completa.

### audit_logs

- **Bitácora de acciones críticas** del sistema (acceso al portal, validación de pagos, activación de servicios, cambios de roles, cambios de estados críticos).
- Campos: `actor` (usuario), `accion`, `entidad`, `entidad_id`, `detalle` (jsonb), `ip` (opcional), `fecha`.

### notifications

- **Eventos dentro del portal**: notificaciones para el cliente (pago validado, servicio activado, respuesta a solicitud, renovación próxima) e internas (nueva solicitud, lead asignado).
- Campos: `usuario_id` (destinatario), `tipo`, `titulo`, `cuerpo`, `leido`, `enlace`, `fecha`.
- **Triggers** para eventos internos de base de datos; **Edge Functions** para eventos externos e integraciones.

## Relaciones

```
users 1:1 perfiles
perfiles n:1 clientes
leads 0:1 clientes            (conversión lead → cliente)
leads 0:n cotizaciones
clientes 1:n cotizaciones
clientes 1:n servicios_contratados
clientes 1:n proyectos
clientes 1:n pagos
clientes 1:n contratos
clientes 1:n documentos
clientes 1:n support_requests
cotizaciones 1:n lineas_cotizacion
lineas_cotizacion n:1 servicios
servicios n:n clientes (servicios_contratados)
servicios_contratados 1:n proyectos
proyectos 1:n tareas
proyectos 1:1 infraestructura_proyecto
proyectos 1:n servicios_externos
servicios_externos n:1 external_service_types
infraestructura_proyecto n:1 proveedores
infraestructura_proyecto 0:1 servicios_contratados   (hosting contratado, si aplica)
servicios_externos n:1 proveedores
pagos n:1 cotizaciones | servicios_contratados
pagos 1:1 comprobantes
servicios_contratados 1:1 contratos
servicios_contratados 1:0..1 care_subscriptions      (cuando categoría care)
care_plans 1:n care_features
care_plans 1:n care_subscriptions
care_subscriptions 1:1 servicios_contratados
care_subscriptions n:1 clientes
care_subscriptions n:1 pagos                          (pago del período / renovación)
care_subscriptions 1:n care_subscription_historial
support_requests n:1 clientes | n:0..1 proyectos
support_requests 0:n email_referencias
email_referencias n:0..1 support_requests | n:0..1 pagos
notifications n:1 perfiles (destinatario)
audit_logs n:1 perfiles (actor)
pagos 1:n pago_historial
servicios_contratados 1:n servicio_contratado_historial
proyectos 1:n proyecto_historial
```

## Máquinas de estado

### lead
```
nuevo → contactado → cotizando → ganado | perdido
```

### cotizacion
```
borrador → enviada → aprobada | rechazada → convertida
```

### pago
```
pendiente → comprobante_subido → validando → aprobado | rechazado
```

### servicio_contratado
```
pendiente_activacion → activo → suspenso | cancelado
```

### proyecto
```
en_desarrollo → en_pruebas → entregado → mantenimiento
```

### cliente
```
prospecto → activo → inactivo
```

### tarea
```
pendiente → en_progreso → completada
```

### infraestructura_proyecto
```
activa → en_migracion → inactiva
```

### servicios_externos
```
configurado → activo → inactivo
```

### care_subscriptions (servicio recurrente)
```
pendiente_activacion → activo → suspenso | cancelado
                      └── renovación (pago del período validado) ──► activo
```

- **Activación:** al aprobarse el pago inicial → `activo`, se fija `fecha_inicio` y `fecha_renovacion` según la periodicidad.
- **Renovación:** en `fecha_renovacion` se genera un nuevo pago del período; al validarse, se actualiza `fecha_renovacion` al siguiente ciclo.
- **Suspensión:** si el pago de renovación no se valida o se acuerda pausa.
- **Cancelación:** fin definitivo del plan; se registra en el historial.

### support_request
```
recibido → revisando → en_proceso → resuelto → cerrado
```
- Cualquier estado puede cerrarse; las respuestas se envían por correo (Resend) y se registra `referencia_correo`.

## Reglas derivadas

- Un servicio solo queda `activo` cuando el pago asociado pasa a `aprobado` (ver [payments.md](./payments.md)).
- La conversión `lead → cliente` puede ocurrir desde el panel administrativo.
- `servicios_contratados` de tipo `care`, `automations` y `hosting` siguen su propio ciclo de vida documentado en sus archivos.
- La infraestructura se registra contra un `proveedor` del catálogo; ningún proveedor se fija en la lógica del negocio.
- Los servicios externos son configurables **por proyecto** y apuntan a un `proveedor` del catálogo.
- La base de datos jamás almacena credenciales ni secretos: solo referencias seguras (variables de entorno, gestores de secretos, configuración de infraestructura).
- THALEX Care opera como **servicio recurrente**: la activación exige pago aprobado y cada renovación depende de la validación del pago del período (ver [services-care.md](./services-care.md)).
- La comunicación con el cliente se hace por **correo (Resend)**; en la base solo vive la solicitud operacional (`support_requests`) con referencia al correo. No hay conversaciones almacenadas.
- Los cambios de estado críticos quedan registrados en **historiales automáticos** (pagos, servicios_contratados, care_subscriptions, proyectos) y las acciones críticas en `audit_logs`.
- Los clientes se eliminan **lógicamente** (estado `inactivo`), nunca físicamente.

---

## Revisión del modelo (evolución del ecosistema)

### Verificación: ¿las entidades actuales soportan la evolución?

| Requisito de evolución | Entidades afectadas | ¿Soporta hoy? |
| --- | --- | --- |
| Desacoplar la arquitectura de proveedores | `infraestructura_proyecto`, `proveedores` | ⚠️ Parcial: `infraestructura_proyecto` referenciaba proveedor como texto. |
| Registrar múltiples clientes/proyectos/proveedores | `clientes`, `proyectos`, `infraestructura_proyecto` | ✅ Sí. |
| Tipos de infraestructura variados (thalex/cliente/cloud) | `infraestructura_proyecto` | ⚠️ Parcial: `tipo` contemplaba `thalex` y `cliente`; falta visión de proveedor genérico. |
| THALEX Hosting como servicio futuro | `servicios`, `servicios_contratados` | ⚠️ Faltaba la categoría `hosting`. |
| Servicios externos configurables por proyecto | `servicios_externos`, `proveedores` | ⚠️ Parcial: `infraestructura_proyecto.servicios_externos` era campo libre. |
| Histórico empresarial / base local | — (fuera del modelo operacional) | ✅ Sí, se documenta en [architecture.md](./architecture.md). |

### Cambios propuestos (incorporados arriba)

1. **Nueva entidad `proveedores`** — catálogo desacoplado (Supabase, Vercel, AWS, THALEX Hosting, cliente). `infraestructura_proyecto.proveedor` pasa a ser referencia a esta entidad.
2. **Nueva sub-entidad `servicios_externos`** — relacionada con `proyectos` (1:n). Cada proyecto puede tener múltiples servicios externos, cada uno con su proveedor, tipo, estado, referencia segura de secreto e información operativa. Se elimina como campo libre de `infraestructura_proyecto`.
3. **`infraestructura_proyecto` ampliada** — registra dominio, hosting, base de datos, estado, responsable e información técnica, además de tipo y proveedor.
4. **Nueva categoría de servicio `hosting`** — THALEX Hosting como entrada del catálogo y de `servicios_contratados`, relacionada con `infraestructura_proyecto` y con THALEX Care.
5. **Nueva máquina de estado para infraestructura** — `activa → en_migracion → inactiva`, soporta migraciones entre proveedores. Sub-entidad `servicios_externos`: `configurado → activo → inactivo`.
6. **Política de secretos** — la base solo guarda referencias seguras; las credenciales reales viven en variables de entorno, gestores de secretos o configuración de infraestructura.
7. **Sin cambios al núcleo operacional** — leads, clientes, cotizaciones, pagos y contratos permanecen iguales: la evolución agrega, no rompe.

### Pendientes para la fase de diseño (aún no SQL)

- Definir si `proveedores` es catálogo administrado (CRUD admin) o fijo.
- Confirmar los proveedores iniciales a sembrar en el catálogo.
- Definir el catálogo de `tipo` para `servicios_externos` (API, pasarela, correo, almacenamiento, fiscal, etc.).

---

## Revisión final: THALEX Care

Confirmación de que el modelo soporta el funcionamiento de THALEX Care como **servicio recurrente**:

| Requisito | Soporte en el modelo | Entidades |
| --- | --- | --- |
| Planes de THALEX Care | ✅ Catálogo de planes con periodicidad y precio de referencia | `care_plans` |
| Servicios contratados por cliente | ✅ Relación cliente ↔ servicio | `servicios_contratados` |
| Activación después de validación de pago | ✅ El pago debe pasar a `aprobado` para activar | `pagos`, `care_subscriptions` |
| Renovaciones | ✅ Nuevo pago por período; al validarse se extiende la vigencia | `pagos`, `care_subscriptions.fecha_renovacion` |
| Estado del servicio | ✅ `pendiente_activacion → activo → suspenso | cancelado` | `care_subscriptions` |
| Fecha de inicio | ✅ | `care_subscriptions.fecha_inicio` |
| Fecha de renovación | ✅ | `care_subscriptions.fecha_renovacion` |
| Beneficios incluidos | ✅ Catálogo de beneficios por plan | `care_features` |
| Historial de cambios | ✅ Registro de activaciones, renovaciones, cambios de plan, suspensiones y cancelaciones | `care_subscription_historial` |

**Conclusión:** el modelo actual soporta todos los requisitos. Se incorporaron las entidades sugeridas `care_plans`, `care_subscriptions` y `care_features`, más `care_subscription_historial` para el historial de cambios. No se requiere SQL todavía.

---

## Cambios aprobados (iteración final)

| Cambio | Detalle |
| --- | --- |
| `mensajes` → `support_requests` | No hay chat interno. Las solicitudes del portal guardan solo información operacional mínima; la comunicación completa viaja por correo (Resend). |
| `audit_logs` | Bitácora de acciones críticas del sistema. |
| `notifications` | Eventos dentro del portal (cliente e internas). |
| Seed de proveedores | Supabase, Vercel, Resend, AWS, THALEX Hosting, Cliente. |
| Folio de cotización | `COT-AAAA-00001` (año + secuencial). |
| Historial por triggers | `pago_historial`, `servicio_contratado_historial`, `proyecto_historial`, `care_subscription_historial`. |
| Eliminación lógica | Los clientes se desactivan (`inactivo`), nunca se eliminan físicamente. |

### Cambios aprobados v2 (ajustes finales)

| Cambio | Detalle |
| --- | --- |
| `external_service_types` | Catálogo de tipos de servicios externos (Google Maps API, Google Calendar API, Stripe, Resend, OpenAI API, WhatsApp API, AWS S3 + futuros). `servicios_externos.servicio_tipo_id` lo referencia. |
| `notifications` | **Triggers** para eventos internos de BD; **Edge Functions** para eventos externos e integraciones. |
| `email_referencias` | Guarda la referencia técnica del correo (`proveedor`, `email_id`, `tipo_evento`, `fecha_envio`) sin contenido. |
| MONITOR | Ve proyectos asignados; **actualiza** tareas y avances asignados. **Nunca** pagos, contratos, financiero ni configuración crítica. |
| `tareas.avance` | Progreso (0-100) actualizable por MONITOR en tareas asignadas. |

**Estado:** modelo conceptual cerrado y aprobado. Listo para la generación del SQL (solo como propuesta, sin ejecutar).
