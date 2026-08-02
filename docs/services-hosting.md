# THALEX Hosting

## Qué es

THALEX Hosting es la futura categoría de **infraestructura tecnológica** administrada por THALEX SYSTEMS. **Definición conceptual solamente; no se implementa todavía.**

## Categoría

- Infraestructura tecnológica (`infraestructura`).
- Entrada futura del catálogo de servicios (`servicios`, categoría `hosting`).

## Servicios que puede incluir

- Hosting administrado.
- VPS.
- Configuración de servidores.
- Dominios.
- SSL.
- Backups.
- Monitoreo.
- Migraciones.
- Administración de infraestructura.

## Relaciones conceptuales

THALEX Hosting se relaciona con:

- **Proyectos** — aloja la infraestructura de los proyectos.
- **Servicios contratados** — el hosting se contrata como servicio.
- **THALEX Care** — el mantenimiento de la infraestructura puede cubrirse con un plan de care.

## Ciclo de vida

Sigue el pipeline general del negocio:

```
Solicitud → Revisión THALEX → Cotización → Pago → Activación → Portal
```

## Entidades involucradas (conceptual)

- `servicios` (categoría `hosting`)
- `servicios_contratados`
- `infraestructura_proyecto` (proveedor = THALEX Hosting)
- `proyectos`, `pagos`, `contratos`
- `THALEX Care` (mantenimiento)

## Reglas

- La contratación de hosting no obliga a que el proyecto use infraestructura THALEX; coexisten los distintos tipos (ver [infrastructure.md](./infrastructure.md)).
- Se documenta como servicio futuro para que el modelo de datos lo contemple sin implementarlo.
