# Business Core — THALEX SYSTEMS

## Resumen

THALEX SYSTEMS es una empresa tecnológica que ofrece desarrollo digital, mantenimiento continuo, automatización de procesos y, en el futuro, soluciones con inteligencia artificial.

## Estructura del repositorio

| Repositorio | Rol |
| --- | --- |
| `thalexsystems` | Business Core: documentación del negocio, reglas, arquitectura y la **landing page** pública. |
| `thalexsystems-client-portal` | Portal de Clientes y Panel Administrativo (rutas `/client` y `/admin`). |

## Catálogo de servicios

### Desarrollo Digital

- **Landing Pages** — páginas de aterrizaje orientadas a conversión.
- **Sitios Web Corporativos** — presencia digital profesional.
- **Sistemas Web Empresariales** — sistemas a medida para controlar operaciones (CRM, gestores, paneles).
- **E-commerce / Tiendas en Línea** — venta en línea con catálogo y pagos.
- **Software a Medida** — soluciones personalizadas desde cero.

### THALEX Care

Planes de mantenimiento continuo: monitoreo, actualizaciones, soporte y mejoras básicas. Ver [services-care.md](./services-care.md).

### THALEX Automations

Automatización de procesos de negocio: formularios, correos, WhatsApp, reportes, facturación, reservaciones, seguimiento de clientes y procesos internos. Ver [services-automations.md](./services-automations.md).

### THALEX AI

Soluciones futuras: chatbots, asistentes inteligentes y automatización con inteligencia artificial. Modelada como categoría del catálogo desde ahora, implementación futura. Ver [services-ai.md](./services-ai.md).

### THALEX Hosting

Infraestructura tecnológica futura: hosting administrado, VPS, configuración de servidores, dominios, SSL, backups, monitoreo y migraciones. Definición conceptual solamente; no se implementa todavía. Ver [services-hosting.md](./services-hosting.md).

> **Nota:** el catálogo mostrado en la landing vive hoy en `src/config/services.jsx`. A futuro será una entidad gestionada en Supabase (`servicios`).

## Estrategia de evolución

THALEX SYSTEMS diseña su arquitectura para **no depender de proveedores específicos**. La lógica del negocio se basa en reglas documentadas, no en tecnología. Ver [technology-strategy.md](./technology-strategy.md).

## Flujo principal de clientes

THALEX SYSTEMS soporta dos formas de crear clientes.

### 1. Cliente desde la página

El cliente solicita información o cotización desde la landing.

```
Solicitud → Revisión THALEX → Cotización → Pago → Activación → Portal del cliente
```

### 2. Cliente creado manualmente

THALEX crea clientes desde el panel administrativo. Ejemplos: venta presencial, WhatsApp, referencia, contacto directo.

El administrador crea el cliente, asigna servicios y genera el acceso al portal.

## Pipeline general

1. **Solicitud** — lead llega por la landing (formulario, WhatsApp, correo) o por canal manual.
2. **Revisión THALEX** — se evalúa la solicitud y se define la viabilidad.
3. **Cotización** — se emite cotización con servicios y condiciones de pago.
4. **Pago** — el cliente paga según el método acordado (ver [payments.md](./payments.md)).
5. **Activación** — servicio marcado como activo y visible en el portal.
6. **Portal del cliente** — el cliente accede a sus servicios, proyectos, documentos y pagos.

## Reglas de negocio principales

- Un cliente solo puede ver su propia información.
- El método de pago es un **dato configurable**, no lógica del sistema (hoy: transferencia y efectivo; futuro: Stripe).
- Todo servicio pasa por un estado de **activación** validado por THALEX.
- El acceso al portal se genera solo para clientes activos.
- Los roles controlan el alcance de la información (ver [roles-and-security.md](./roles-and-security.md)).
