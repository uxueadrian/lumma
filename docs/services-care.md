# THALEX Care

## Qué es

THALEX Care son **planes de mantenimiento continuo** para sitios y sistemas ya desarrollados. Garantizan que el producto permanezca actualizado, seguro y funcionando.

## Cobertura

- **Monitoreo** — vigilancia de disponibilidad y rendimiento.
- **Actualizaciones** — mantenimiento de dependencias, versiones y contenido.
- **Soporte** — atención y resolución de incidencias.
- **Mejoras básicas** — cambios menores y ajustes dentro del plan.

## Tipo de servicio

- Categoría de catálogo: `care` (ver [data-model.md](./data-model.md)).
- THALEX Care opera como **servicio recurrente**, no como servicio único.
- Entidades:
  - `care_plans` — catálogo de planes (periodicidad, precio de referencia, estado).
  - `care_features` — beneficios incluidos por plan (monitoreo, actualizaciones, soporte, mejoras básicas, backups, reportes).
  - `care_subscriptions` — suscripción recurrente de un cliente a un plan; especialización 1:1 de `servicios_contratados`.
  - `care_subscription_historial` — historial de cambios de la suscripción.

## Datos clave de la suscripción

- `estado`: `pendiente_activacion | activo | suspenso | cancelado`.
- `fecha_inicio` — cuándo inició la cobertura.
- `fecha_renovacion` — cuándo toca renovar el período.
- `fecha_cancelacion` — cuándo terminó (si aplica).
- `ciclo_actual` — referencia al pago que cubre el período vigente.
- Plan y beneficios activos del período.

## Ciclo de vida

```
Solicitud (portal / landing) → Revisión THALEX → Cotización → Pago inicial
→ Validación → Activación (fecha_inicio y fecha_renovacion fijadas)
→ Vigencia (plan recurrente) → Renovación | Suspensión | Cancelación
```

### Estados

```
pendiente_activacion → activo → suspenso | cancelado
                      └── renovación (pago del período validado) ──► activo
```

- **Activo:** cobertura vigente; se ejecutan monitoreo, actualizaciones y soporte. La cobertura es válida hasta `fecha_renovacion`.
- **Suspenso:** pagos atrasados o pausa acordada; se detiene el servicio.
- **Cancelado:** plan finalizado por decisión del cliente o de THALEX.

## Vigencia y renovación

- Cada plan tiene una `periodicidad` (mensual, trimestral, anual) definida en `care_plans`.
- En `fecha_renovacion` se genera un nuevo pago del período (ver [payments.md](./payments.md)).
- Al validarse el pago: se actualiza `fecha_renovacion` al siguiente ciclo y se registra la renovación en el historial.
- Si el pago de renovación no se valida, el plan pasa a `suspenso`.
- Un cliente puede cambiar de plan; el cambio queda registrado en el historial.

## Entidades involucradas

- `clientes` → `servicios_contratados` (tipo `care`) → `care_subscriptions` (1:1)
- `care_plans` y `care_features` (catálogo del plan)
- `pagos` / `comprobantes` para cada período (inicio y renovaciones)
- `care_subscription_historial` (historial de cambios)
- `proyectos` en estado `mantenimiento` asociados al plan
- `contratos` del plan

## Reglas

- Las mejoras básicas están dentro del plan; cambios mayores se cotizan por separado.
- No hay activación ni renovación sin pago aprobado.
- El cliente ve su plan, beneficios, vigencia y estado desde el portal.
- MONITOR no ve información de pagos del plan.
