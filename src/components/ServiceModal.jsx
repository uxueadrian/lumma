import { useEffect } from 'react'
import ServiceCarousel from './ServiceCarousel'
import { requestService } from '../services/requestService'

function SectionTitle({ children }) {
  return (
    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
      {children}
    </h4>
  )
}

export default function ServiceModal({ service, onClose }) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function handleRequest() {
    requestService(service.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative min-h-full flex items-start justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-3xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className={`h-1.5 bg-gradient-to-r ${service.gradient}`} />

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-thalex-50 dark:bg-thalex-900/50 text-thalex-600 dark:text-thalex-400 flex items-center justify-center shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-dark dark:text-white">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                    {service.tagline || service.problem}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-8">
              {service.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div>
                <SectionTitle>
                  <svg className="w-5 h-5 text-thalex-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Beneficios
                </SectionTitle>
                <ul className="space-y-2.5">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-slate-400">
                      <svg className="w-5 h-5 text-thalex-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <SectionTitle>
                  <svg className="w-5 h-5 text-thalex-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Casos ideales
                </SectionTitle>
                <ul className="space-y-2.5">
                  {service.useCases.map((useCase) => (
                    <li key={useCase} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-thalex-500 shrink-0 mt-2" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <SectionTitle>
                <svg className="w-5 h-5 text-thalex-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Características incluidas
              </SectionTitle>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-sm px-3 py-1.5 rounded-full bg-thalex-50 dark:bg-thalex-900/40 text-thalex-700 dark:text-thalex-300 border border-thalex-100 dark:border-thalex-900/50"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <ServiceCarousel projects={service.projects} serviceId={service.id} />
            </div>

            <div className="rounded-2xl bg-thalex-50 dark:bg-thalex-900/30 border border-thalex-100 dark:border-thalex-800 p-6 sm:p-8 text-center">
              <h4 className="text-xl font-bold text-dark dark:text-white mb-2">
                {service.cta.headline}
              </h4>
              <p className="text-gray-600 dark:text-slate-400 mb-6">{service.cta.body}</p>
              <button
                onClick={handleRequest}
                className="inline-flex items-center gap-2 bg-thalex-600 hover:bg-thalex-700 dark:bg-thalex-500 dark:hover:bg-thalex-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-thalex-200 dark:shadow-thalex-900/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                {service.cta.button}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
