import { useState, useEffect } from 'react'
import QuoteForm from './QuoteForm'
import { getPendingService, subscribeToServiceSelection } from '../services/requestService'

const WHATSAPP_NUMBER = '7772597109'
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola, vi la página de Thalex Systems y quiero solicitar información sobre un proyecto.'
)
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

export default function Contact() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (getPendingService()) {
      setOverlayOpen(true)
    }
    return subscribeToServiceSelection(() => {
      setOverlayOpen(true)
    })
  }, [])

  function showToast() {
    setToast(true)
    window.setTimeout(() => setToast(false), 6000)
  }

  function handleFormSuccess() {
    if (overlayOpen) {
      setExiting(true)
      window.setTimeout(() => {
        setExiting(false)
        setOverlayOpen(false)
        showToast()
      }, 450)
    } else {
      showToast()
    }
  }

  function closeOverlay() {
    setExiting(false)
    setOverlayOpen(false)
  }

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">Contáctanos</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Cuéntanos sobre tu proyecto y te enviaremos una cotización personalizada
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">Solicita tu cotización</h3>
              <QuoteForm onSuccess={handleFormSuccess} />
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">Información de contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-thalex-100 dark:bg-thalex-900/50 text-thalex-600 dark:text-thalex-400 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500">Correo electrónico</p>
                    <p className="text-gray-800 dark:text-slate-200 font-medium">thalexsystems@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500">WhatsApp</p>
                    <p className="text-gray-800 dark:text-slate-200 font-medium">+52 777 259 7109</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-3">
                ¿Prefieres escribirnos directamente?
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6 text-sm">
                Respondemos en menos de 12 horas. Cuéntanos sobre tu proyecto y te daremos una
                cotización sin compromiso.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-200 dark:shadow-green-900/30 hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escribenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {overlayOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={closeOverlay}
            aria-hidden="true"
          />
          <div className="relative min-h-full flex items-start justify-center p-4 sm:p-8">
            <div
              className={`relative w-full max-w-xl my-8 ${exiting ? 'animate-form-out' : 'animate-form-in'}`}
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-thalex-500 to-violet-600" />
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-dark dark:text-white">
                        Solicita tu cotización
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        Te respondemos en menos de 12 horas
                      </p>
                    </div>
                    <button
                      onClick={closeOverlay}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                      aria-label="Cerrar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <QuoteForm onSuccess={handleFormSuccess} />
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
              <p className="font-semibold">¡Gracias! Hemos recibido tu solicitud.</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Nos comunicaremos contigo lo más rápido posible, en menos de 12 horas.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
