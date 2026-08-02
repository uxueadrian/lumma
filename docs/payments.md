# Flujo de pagos y activación

## Principio rector

**El método de pago es un dato, no lógica de negocio.**

Cambiar de método no debe alterar los flujos. Hoy: transferencia bancaria y efectivo presencial. Futuro: Stripe. El sistema se modela con una máquina de estados independiente del método.

## Flujo completo

```
Solicitud → Pago pendiente → Comprobante → Validación THALEX → Servicio activo
```

### Paso a paso

1. **Solicitud** — cotización aprobada o servicio solicitado. Se crea el pago con estado `pendiente`.
2. **Pago pendiente** — el cliente debe pagar según el método acordado.
3. **Comprobante** — el cliente sube el comprobante de pago al portal (Supabase Storage). El pago pasa a `comprobante_subido`.
4. **Validación THALEX** — un ADMIN/OWNER revisa el comprobante. Estado `validando`.
   - Aprobado → pago `aprobado` → **activación del servicio**.
   - Rechazado → pago `rechazado` → se notifica al cliente para corregir.
5. **Servicio activo** — el `servicio_contratado` pasa a `activo` y es visible en el portal del cliente.

## Estados del pago

```
pendiente → comprobante_subido → validando → aprobado | rechazado
```

| Estado | Descripción |
| --- | --- |
| `pendiente` | Esperando el pago del cliente. |
| `comprobante_subido` | Cliente subió comprobante; sin validar. |
| `validando` | THALEX revisando el comprobante. |
| `aprobado` | Pago confirmado → activa el servicio. |
| `rechazado` | Comprobante inválido o insuficiente; el cliente debe reintentar. |

## Métodos de pago

| Método | Estado | Notas |
| --- | --- | --- |
| Transferencia bancaria | Actual | Validación manual del comprobante. |
| Efectivo presencial | Actual | Validación manual. |
| Stripe | Futuro | Integración por Edge Function/webhook; validación automática. |

## Comprobantes

- Se almacenan en **Supabase Storage**; en la base se guardan metadatos (`comprobantes` 1:1 `pagos`).
- Solo el cliente dueño y los roles con permiso (OWNER/ADMIN) pueden verlos.
- MONITOR y CLIENT de otros clientes: sin acceso.

## Activación

- La activación del servicio es una acción **interna** (Edge Function con service role), no ejecutable por el cliente.
- Al aprobarse el pago: `pago.aprobado` → `servicio_contratado.activo`.
- El cliente recibe notificación y el servicio aparece en su portal.

## Reglas

- No existe activación sin pago aprobado.
- Un pago rechazado no bloquea nuevas solicitudes; permite reintento con nuevo comprobante.
- Para THALEX Care, el ciclo de pago aplica a cada período (renovación). Si no se valida, el plan pasa a `suspenso` (ver [services-care.md](./services-care.md)).
- Para THALEX Automations, la implementación del flujo inicia tras la activación (ver [services-automations.md](./services-automations.md)).
