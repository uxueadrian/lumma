# Documentación del Ecosistema THALEX SYSTEMS

Documentación oficial del negocio. Vive en el repositorio `thalexsystems` (Business Core).

## Índice

| Documento | Contenido |
| --- | --- |
| [business-core.md](./business-core.md) | Visión del negocio, catálogo de servicios, flujo principal de clientes, reglas de negocio. |
| [technology-strategy.md](./technology-strategy.md) | Estrategia de evolución tecnológica y desacoplamiento de proveedores. |
| [architecture.md](./architecture.md) | Arquitectura general: repositorios, capas, ubicación de datos, roadmap. |
| [data-model.md](./data-model.md) | Entidades principales, relaciones entre módulos, máquinas de estado, revisión del modelo. |
| [roles-and-security.md](./roles-and-security.md) | Roles del sistema, matriz de permisos, principios de seguridad (RLS). |
| [services-care.md](./services-care.md) | THALEX Care: planes de mantenimiento continuo. |
| [services-automations.md](./services-automations.md) | THALEX Automations: automatización de procesos. |
| [services-ai.md](./services-ai.md) | THALEX AI: soluciones futuras con inteligencia artificial. |
| [services-hosting.md](./services-hosting.md) | THALEX Hosting: infraestructura tecnológica futura (conceptual). |
| [payments.md](./payments.md) | Flujo completo de pagos y activación de servicios. |
| [infrastructure.md](./infrastructure.md) | Modelo de infraestructura de proyectos desacoplado de proveedores. |
| [supabase-design.md](./supabase-design.md) | Propuesta de diseño de Supabase: tablas, RLS, Storage y Edge Functions. |

## Estado de la documentación

- **Fase:** propuesta conceptual aprobada para revisión (sin tablas ni código).
- Los documentos describen el modelo conceptual y las reglas de negocio. La implementación en Supabase (tablas, RLS, Edge Functions) se hará en una fase posterior.

## Reglas de documentación

- Todo cambio de negocio que afecte entidades, estados, roles o flujos debe reflejarse aquí antes de tocar código.
- La documentación es la fuente de verdad del negocio. El código la implementa.
