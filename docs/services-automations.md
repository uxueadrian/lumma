# THALEX Automations

## Qué es

THALEX Automations es la automatización de procesos de negocio mediante formularios, integraciones y flujos configurados por THALEX.

## Áreas de automatización

- **Formularios** — captura de datos con validaciones y envío automático.
- **Correos** — notificaciones, seguimiento y correos automáticos.
- **WhatsApp** — mensajes y recordatorios automáticos.
- **Reportes** — generación y envío periódico de reportes.
- **Facturación** — emisión y seguimiento de facturas.
- **Reservaciones** — gestión de citas y reservas.
- **Seguimiento de clientes** — pipelines, recordatorios y tareas.
- **Procesos internos** — automatización de la operación del cliente.

## Tipo de servicio

- Categoría de catálogo: `automations` (ver [data-model.md](./data-model.md)).
- Cada automatización es un `proyecto` (o parte de uno) dentro de un `servicio_contratado`.

## Ciclo de vida

```
Solicitud (portal / landing) → Revisión THALEX → Diseño de flujo → Cotización
→ Pago → Activación → Puesta en producción → Mantenimiento (opcional)
```

## Flujo de solicitud

El cliente puede solicitar THALEX Automations:

1. Desde la **landing** (lead) o desde el **portal** (servicio solicitado).
2. THALEX revisa la solicitud y diseña el flujo propuesto.
3. Se emite cotización con el alcance (qué procesos se automatizan).
4. Tras pago y validación, el servicio se activa y se implementa el flujo.
5. Si aplica, el cliente contrata THALEX Care para el mantenimiento de la automatización.

## Entidades involucradas

- `clientes` → `servicios_contratados` (tipo `automations`)
- `proyectos` (el flujo automatizado) y `tareas`
- `cotizaciones` / `lineas_cotizacion`
- `pagos` / `comprobantes`
- `infraestructura_proyecto` (dónde se ejecuta la automatización)

## Futuro: n8n

La ejecución de automatizaciones se integrará con **n8n** como orquestador. Supabase conserva los datos del negocio; n8n ejecuta los flujos y dispara correos, WhatsApp y reportes (ver [architecture.md](./architecture.md)).

## Reglas

- Cada automatización se entrega documentada y con pruebas.
- El cliente ve el estado de sus automatizaciones desde el portal.
- Los cambios al flujo fuera de alcance se cotizan por separado.
