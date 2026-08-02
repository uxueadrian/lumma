# Infraestructura de proyectos

## Modelo de infraestructura desacoplado

Los proyectos **no dependen de proveedores específicos** como parte de la lógica principal. No existen diseños acoplados a Supabase, Vercel, AWS u otros proveedores.

Existe un concepto general: **Infraestructura del proyecto** (`infraestructura_proyecto`), que describe dónde y cómo vive el proyecto, sin fijar tecnología.

## Datos de la infraestructura

`infraestructura_proyecto` registra:

| Campo | Descripción |
| --- | --- |
| `tipo` | `thalex` \| `cliente` |
| `proveedor` | Referencia al proveedor (catálogo de proveedores) |
| `dominio` | Dominio(s) del proyecto |
| `hosting` | Dónde se aloja |
| `base_de_datos` | Dónde vive la base de datos |
| `estado` | Estado operativo de la infraestructura |
| `responsable` | Quién administra (THALEX, cliente, proveedor) |
| `informacion_tecnica` | Datos técnicos necesarios (versiones, URLs, etc.) |

> **Importante:** la infraestructura guarda información técnica, **nunca credenciales** (contraseñas, tokens). Los secretos viven en un gestor externo.

## Servicios externos (sub-entidad)

Los servicios externos se modelan como **sub-entidad propia** (`servicios_externos`) relacionada con los proyectos, no como campo libre de la infraestructura.

- Un proyecto puede tener **múltiples** servicios externos.
- Cada servicio externo pertenece a un **proveedor**.
- Son **configurables por proyecto**: no todas las soluciones THALEX usan los mismos servicios.

Ejemplos:

| Proyecto | Servicios externos |
| --- | --- |
| Inmobiliario | Google Maps API, Google Places API, Resend |
| Restaurante | WhatsApp API, Google Calendar API, Stripe, Resend |
| Empresarial | OpenAI API, AWS S3, servicios fiscales, firma electrónica |

Campos de `servicios_externos`: proveedor, servicio, tipo, estado, referencia segura del secreto e información operativa.

**Seguridad de secretos:** las credenciales reales **no** viven en la base de datos. La base solo almacena la **referencia segura del secreto**; el valor reside en variables de entorno, gestores de secretos o configuración segura de infraestructura.

## Tipos de infraestructura

### 1. Infraestructura THALEX SYSTEMS

Para proyectos sencillos (landing pages, sitios pequeños). THALEX administra su propia infraestructura.

### 2. Infraestructura del cliente

Para proyectos empresariales (sistemas web, e-commerce, software personalizado). El cliente es dueño de dominio, hosting, base de datos y servicios externos. THALEX configura y desarrolla.

### 3. Infraestructura cloud externa (futuro)

Infraestructura en nube de terceros (AWS, etc.) administrada por THALEX o por el proveedor.

## Proveedores

| Estado | Proveedor |
| --- | --- |
| Actual | Supabase |
| Futuro | THALEX Hosting |
| Futuro | AWS |
| Futuro | Infraestructura propia del cliente |

## Reglas

- El tipo de infraestructura no cambia la lógica del negocio: solo define dónde vive y quién la administra.
- La migración entre proveedores o tipos se registra como cambio del proyecto.
- La información de infraestructura es visible para OWNER/ADMIN. El cliente solo ve URLs públicas de sus proyectos.
- Los servicios externos se registran por proyecto como sub-entidad; jamás se guardan credenciales en la base de datos (solo referencias seguras).
