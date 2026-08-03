import { useState, useEffect, useRef } from 'react'
import QuoteForm from './QuoteForm'
import { getPendingService, subscribeToServiceSelection } from '../services/requestService'
import { getServiceById } from '../config/services'
import { getCarePlanById } from '../config/carePlans'

const WHATSAPP_NUMBER = '7772597109'

function buildWhatsAppUrl(serviceName) {
  const message = serviceName
    ? `Quiero cotizar ${serviceName}`
    : 'Hola, que tal. Quiero cotizar un proyecto'
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const MailIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ArrowIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export default function Contact() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [step, setStep] = useState('chooser')
  const [selectedService, setSelectedService] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    const initial = getPendingService()
    if (initial) {
      setSelectedService(initial)
      setOverlayOpen(true)
    }
    return subscribeToServiceSelection((id) => {
      setSelectedService(id)
      setStep('chooser')
      setOverlayOpen(true)
    })
  }, [])

  const service = selectedService ? getServiceById(selectedService) : null
  const carePlan = selectedService ? getCarePlanById(selectedService) : null
  const serviceName = service ? service.name : carePlan ? carePlan.name : null
  const whatsappUrl = buildWhatsAppUrl(serviceName)

  function showToast(title, sub = '') {
    setToast({ title, sub })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 6000)
  }

  function openOverlay(initialStep = 'chooser') {
    setStep(initialStep)
    setOverlayOpen(true)
  }

  function closeOverlay() {
    setExiting(false)
    setOverlayOpen(false)
  }

  function handleWhatsApp() {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    if (overlayOpen) {
      setExiting(true)
      window.setTimeout(() => {
        setExiting(false)
        setOverlayOpen(false)
        showToast(
          'Te redirigimos a WhatsApp para continuar.',
          'Ahí podemos afinar los detalles de tu cotización.'
        )
      }, 450)
    } else {
      showToast(
        'Te redirigimos a WhatsApp para continuar.',
        'Ahí podemos afinar los detalles de tu cotización.'
      )
    }
  }

  function handleFormSuccess() {
    setExiting(true)
    window.setTimeout(() => {
      setExiting(false)
      setOverlayOpen(false)
      showToast(
        '¡Gracias! Hemos recibido tu solicitud.',
        'Nos comunicaremos contigo lo más rápido posible, en menos de 12 horas.'
      )
    }, 450)
  }

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">Contáctanos</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Elige cómo prefieres contactarnos y te enviaremos una cotización sin compromiso
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-5">
              <WhatsAppIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">WhatsApp</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 flex-1">
              Chatea con nosotros directamente. Es la forma más rápida de recibir una cotización.
            </p>
            <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold">
              Escribir por WhatsApp
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>

          <button
            type="button"
            onClick={() => openOverlay('form')}
            className="group bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-thalex-100 dark:bg-thalex-900/50 text-thalex-600 dark:text-thalex-400 flex items-center justify-center mb-5">
              <MailIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">Correo electrónico</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 flex-1">
              Envíanos los detalles de tu proyecto mediante nuestro formulario y te contactaremos.
            </p>
            <span className="inline-flex items-center gap-2 text-thalex-600 dark:text-thalex-400 text-sm font-semibold">
              Enviar por correo
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-sm text-gray-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <MailIcon className="w-4 h-4 text-thalex-500" />
            thalexsystems@gmail.com
          </span>
          <span className="hidden sm:block text-slate-300 dark:text-slate-600">•</span>
          <span className="inline-flex items-center gap-2">
            <WhatsAppIcon className="w-4 h-4 text-green-500" />
            +52 777 259 7109
          </span>
          <span className="hidden sm:block text-slate-300 dark:text-slate-600">•</span>
          <span className="inline-flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-thalex-500" />
            Respuesta en menos de 12 horas
          </span>
        </div>
      </div>

      {overlayOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
            onClick={closeOverlay}
            aria-hidden="true"
          />
          <div className="relative min-h-full flex items-start justify-center p-4 sm:p-8">
            <div
              className={`relative w-full max-w-lg my-8 ${exiting ? 'animate-form-out' : 'animate-form-in'}`}
            >
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-thalex-500 to-violet-600" />
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-dark dark:text-white">Contáctanos</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        {step === 'chooser'
                          ? 'Elige cómo prefieres contactarnos'
                          : 'Completa el formulario y te contactaremos'}
                      </p>
                    </div>
                    <button
                      onClick={closeOverlay}
                      className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                      aria-label="Cerrar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {step === 'chooser' ? (
                    <div className="space-y-6">
                      {serviceName && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-thalex-100 dark:bg-thalex-900/50 text-thalex-700 dark:text-thalex-300 text-sm font-medium">
                          Quiero cotizar {serviceName}
                        </div>
                      )}

                      <div className="grid gap-4">
                        <button
                          type="button"
                          onClick={handleWhatsApp}
                          className="group flex items-center gap-4 text-left bg-green-500 hover:bg-green-600 text-white p-5 rounded-2xl transition-all shadow-lg shadow-green-200 dark:shadow-green-900/30 hover:shadow-xl"
                        >
                          <span className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                            <WhatsAppIcon className="w-6 h-6" />
                          </span>
                          <span className="flex-1">
                            <span className="block font-semibold">Enviar por WhatsApp</span>
                            <span className="block text-sm text-white/80">Chat directo y respuesta rápida</span>
                          </span>
                          <ArrowIcon className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setStep('form')}
                          className="group flex items-center gap-4 text-left bg-thalex-600 hover:bg-thalex-700 dark:bg-thalex-500 dark:hover:bg-thalex-600 text-white p-5 rounded-2xl transition-all shadow-lg shadow-thalex-200 dark:shadow-thalex-900/30 hover:shadow-xl"
                        >
                          <span className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                            <MailIcon className="w-6 h-6" />
                          </span>
                          <span className="flex-1">
                            <span className="block font-semibold">Enviar por correo</span>
                            <span className="block text-sm text-white/80">Formulario con los detalles del proyecto</span>
                          </span>
                          <ArrowIcon className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>

                      <div className="pt-5 border-t border-gray-100 dark:border-slate-700 space-y-1.5 text-sm text-gray-500 dark:text-slate-400">
                        <p className="flex items-center gap-2">
                          <MailIcon className="w-4 h-4 text-thalex-500" />
                          thalexsystems@gmail.com
                        </p>
                        <p className="flex items-center gap-2">
                          <WhatsAppIcon className="w-4 h-4 text-green-500" />
                          +52 777 259 7109 · respuesta en menos de 12 horas
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => setStep('chooser')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-thalex-600 dark:hover:text-thalex-400 transition-colors mb-5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Volver a las opciones
                      </button>
                      <QuoteForm onSuccess={handleFormSuccess} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 inset-x-0 z-[80] flex justify-center px-4">
          <div className="animate-toast-in inline-flex items-center gap-3 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700 shadow-2xl rounded-2xl px-5 py-4 max-w-md">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">{toast.title}</p>
              {toast.sub && <p className="text-sm text-gray-500 dark:text-slate-400">{toast.sub}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
