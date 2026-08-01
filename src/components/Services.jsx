import { useState } from 'react'
import { featuredService, regularServices, serviceThemes } from '../config/services'
import ServiceModal from './ServiceModal'
import { requestService } from '../services/requestService'

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-thalex-100 dark:bg-thalex-900/50 text-thalex-700 dark:text-thalex-300 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Servicios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">
            Nuestros servicios
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Soluciones digitales completas para impulsar tu negocio. Explora lo que podemos
            construir contigo.
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 text-white p-8 sm:p-12 shadow-2xl shadow-slate-300/40 dark:shadow-thalex-900/30">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-thalex-600/40 blur-3xl rounded-full" />
            <div className="absolute -bottom-32 -left-16 w-72 h-72 bg-violet-600/30 blur-3xl rounded-full" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-10">
              <div className="flex-1">
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
                  <span className="w-1.5 h-1.5 bg-thalex-400 rounded-full animate-pulse" />
                  {featuredService.tagline}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                  {featuredService.name}
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-xl">
                  {featuredService.short}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300 mb-8">
                  {['Diseñado a tu medida', 'Escalable', '100% tuyo'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 text-thalex-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => requestService(featuredService.id)}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-thalex-500 to-violet-600 hover:from-thalex-600 hover:to-violet-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-thalex-900/40 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Solicitar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedService(featuredService)}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors"
                  >
                    Explorar
                  </button>
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-thalex-500/40 blur-2xl rounded-full" />
                  <div className="relative w-44 h-44 rounded-full border border-white/15 flex items-center justify-center">
                    <div className="absolute inset-4 rounded-full border border-white/10" />
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-thalex-300 rotate-3">
                      {featuredService.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularServices.map((service) => {
              const theme = serviceThemes[service.theme] || serviceThemes.indigo
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 text-white p-8 border border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-thalex-900/20 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                      backgroundSize: '22px 22px',
                    }}
                  />
                  <div className={`absolute -top-16 -right-16 w-48 h-48 ${theme.blobA} blur-3xl rounded-full`} />
                  <div className={`absolute -bottom-20 -left-10 w-40 h-40 ${theme.blobB} blur-3xl rounded-full`} />

                  <div className="relative flex flex-col min-h-[330px]">
                    <span className="inline-flex items-center gap-2 self-start bg-white/10 border border-white/15 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-5">
                      <span className={`w-1.5 h-1.5 ${theme.dot} rounded-full animate-pulse`} />
                      {service.label}
                    </span>

                    <div className={`w-14 h-14 rounded-2xl ${theme.tile} border flex items-center justify-center mb-5`}>
                      {service.icon}
                    </div>

                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">{service.short}</p>
                    <p className={`text-xs ${theme.accentText} mb-6 inline-flex items-start gap-1.5`}>
                      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Resuelve: {service.problem}
                    </p>

                    <div className="mt-auto flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          requestService(service.id)
                        }}
                        className={`inline-flex items-center justify-center gap-2 ${theme.button} text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg flex-1`}
                      >
                        Solicitar
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedService(service)
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Explorar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </section>
  )
}
