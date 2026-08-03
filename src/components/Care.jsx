import { carePlans } from '../config/carePlans'
import { buildContratarUrl, buildWhatsAppUrl } from '../services/careService'
import { requestService } from '../services/requestService'

const CheckIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ArrowIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export default function Care() {
  return (
    <section id="care" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-thalex-100 dark:bg-thalex-900/50 text-thalex-700 dark:text-thalex-300 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            THALEX Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">
            Planes de mantenimiento continuo
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Mantén tu sitio o sistema siempre actualizado, seguro y funcionando. Ideal para
            proyectos existentes, desarrollados por THALEX o por otra agencia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {carePlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl bg-slate-900 dark:bg-slate-950 text-white p-8 border shadow-lg ${
                index === 1
                  ? 'border-thalex-500/60 shadow-thalex-900/30 md:-translate-y-2'
                  : 'border-white/10 shadow-slate-200/40 dark:shadow-thalex-900/20'
              }`}
            >
              {index === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-gradient-to-r from-thalex-500 to-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                  MÁS SOLICITADO
                </span>
              )}

              <span className="text-xs font-semibold tracking-wide uppercase text-thalex-400 mb-2">
                {plan.tagline}
              </span>
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>

              <div className="flex items-end gap-1.5 mb-4">
                <span className="text-4xl font-extrabold">
                  {plan.moneda === 'MXN' ? '$' : ''}
                  {plan.precio.toLocaleString('es-MX')}
                </span>
                <span className="text-sm text-slate-400 mb-1.5">/{plan.periodicidad.toLowerCase()}</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">{plan.precioNota} · sujeto a evaluación</p>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">{plan.short}</p>

              <ul className="space-y-2.5 text-sm text-slate-300 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckIcon className="w-4 h-4 text-thalex-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-2.5">
                <button
                  onClick={() => window.location.assign(buildContratarUrl(plan.id))}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                    index === 1
                      ? 'bg-gradient-to-r from-thalex-500 to-violet-600 hover:from-thalex-600 hover:to-violet-700 text-white'
                      : 'bg-thalex-600 hover:bg-thalex-700 dark:bg-thalex-500 dark:hover:bg-thalex-600 text-white'
                  }`}
                >
                  Contratar
                  <ArrowIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => requestService(plan.id)}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Solicitar evaluación
                </button>
                <a
                  href={buildWhatsAppUrl(plan.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-center text-sm text-slate-400 hover:text-thalex-400 transition-colors"
                >
                  ¿Dudas? Escríbenos por WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto text-center text-sm text-gray-500 dark:text-slate-400 space-y-2">
          <p>
            <strong className="text-gray-700 dark:text-slate-200">¿Ya eres cliente de THALEX?</strong>{' '}
            Al presionar «Contratar» llegarás al THALEX Portal con el plan seleccionado y podrás
            continuar tu solicitud con tu cuenta.
          </p>
          <p>
            <strong className="text-gray-700 dark:text-slate-200">¿Aún no tienes cuenta?</strong>{' '}
            No se requiere registrarse para contratar: primero realizamos una evaluación comercial
            y técnica de tu caso, y después habilitamos tu acceso al Portal.
          </p>
        </div>
      </div>
    </section>
  )
}
