import { getCarePlanById } from '../config/carePlans'

// URL del THALEX Portal. La página oficial y el Portal viven en orígenes
// distintos, por lo que la sesión NO se comparte entre sitios: "Contratar"
// siempre navega al Portal y es el Portal quien decide el flujo (sesión activa
// vs. nuevo interesado). Sobrescribible con VITE_PORTAL_URL en .env/Vercel.
const PORTAL_URL =
  import.meta.env.VITE_PORTAL_URL || 'https://thalexsystems-client-portal.vercel.app'

const WHATSAPP_NUMBER = '7772597109'

export function buildContratarUrl(planId) {
  return `${PORTAL_URL}/care/contratar?plan=${encodeURIComponent(planId)}`
}

export function buildWhatsAppUrl(planId) {
  const plan = getCarePlanById(planId)
  const message = plan
    ? `Hola, quiero contratar ${plan.name} para un sitio o sistema existente.`
    : 'Hola, quiero contratar THALEX Care.'
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
