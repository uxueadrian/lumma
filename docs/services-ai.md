# THALEX AI

## Qué es

THALEX AI es la categoría de servicios de **inteligencia artificial** de THALEX SYSTEMS. **Modelada desde ahora como categoría del catálogo**, aunque su implementación sea futura.

## Soluciones previstas

- **Chatbots** — atención automatizada en sitios y portales.
- **Asistentes inteligentes** — apoyo en consultas, búsqueda y tareas.
- **Automatización con IA** — procesos que usan modelos de lenguaje o predicción.

## Estado

- Categoría de catálogo: `ai` (ver [data-model.md](./data-model.md)).
- Sin funcionalidad implementada. No hay proyectos activos aún.
- El modelo de datos ya contempla la categoría para que las solicitudes y cotizaciones funcionen desde el día uno.

## Ciclo de vida

Sigue el mismo pipeline del negocio:

```
Solicitud → Revisión THALEX → Cotización → Pago → Activación → Portal
```

## Entidades involucradas

- `servicios` (categoría `ai`)
- `servicios_contratados`, `cotizaciones`, `proyectos`, `pagos`
- Futura integración con modelos / proveedores de IA (a definir).

## Reglas

- Las solicitudes de THALEX AI se aceptan y cotizan desde ahora, incluso sin implementación activa.
- Cualquier dependencia externa (API, modelo, proveedor) se documentará antes de su integración.
