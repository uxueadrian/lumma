// Catálogo público de planes THALEX Care (página oficial THALEX SYSTEMS).
// Los IDs deben coincidir con el catálogo del THALEX Portal (`carePlans.js`),
// ya que se transportan por URL al cruzar de un sitio a otro.
export const carePlans = [
  {
    id: 'care-basico',
    plan: 'basico',
    name: 'THALEX Care Básico',
    tagline: 'Mantenimiento esencial',
    periodicidad: 'Mensual',
    precio: 999,
    moneda: 'MXN',
    precioNota: 'Precio de referencia',
    short: 'Monitoreo, actualizaciones y soporte para mantener tu sitio o sistema sano.',
    features: [
      'Monitoreo de disponibilidad y rendimiento',
      'Actualizaciones de dependencias y versiones',
      'Respaldo de información',
      'Soporte con respuesta en menos de 24 h',
      'Mejoras básicas incluidas',
    ],
  },
  {
    id: 'care-pro',
    plan: 'pro',
    name: 'THALEX Care Pro',
    tagline: 'El más solicitado',
    periodicidad: 'Mensual',
    precio: 1999,
    moneda: 'MXN',
    precioNota: 'Precio de referencia',
    short: 'Cobertura completa con prioridad: monitoreo, actualizaciones, soporte y reportes.',
    features: [
      'Todo lo del plan Básico',
      'Soporte prioritario',
      'Reportes periódicos de estado',
      'Monitoreo 24/7',
      'Mejoras y ajustes prioritarios',
      'Revisiones de seguridad',
    ],
  },
  {
    id: 'care-empresarial',
    plan: 'empresarial',
    name: 'THALEX Care Empresarial',
    tagline: 'Para operaciones críticas',
    periodicidad: 'Mensual',
    precio: 3499,
    moneda: 'MXN',
    precioNota: 'Precio de referencia',
    short: 'Cobertura integral para sistemas críticos con tiempos de respuesta garantizados.',
    features: [
      'Todo lo del plan Pro',
      'Soporte con respuesta en menos de 4 h',
      'Cobertura ampliada de sistemas',
      'Backups y recuperación ante desastres',
      'SLA de disponibilidad',
      'Atención directa del equipo THALEX',
    ],
  },
]

export function getCarePlanById(id) {
  return carePlans.find((plan) => plan.id === id) || null
}
