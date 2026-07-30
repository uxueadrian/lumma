import { useState } from 'react'
import { submitLead } from '../services/leadService'

const WHATSAPP_NUMBER = '7772597109'
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola, vi la página de Thalex Systems y quiero solicitar información sobre un proyecto.'
)
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

const services = [
  'Landing Page',
  'Sitio Web Empresarial',
  'Tienda en Línea (E-commerce)',
  'Sistema Web',
  'Aplicación Web',
  'Mantenimiento Web',
  'Otro',
]

const budgets = [
  '$500 - $1,000 MXN',
  '$1,000 - $5,000 MXN',
  '$5,000 - $10,000 MXN',
  '$10,000 - $20,000 MXN',
  '$20,000 - $50,000 MXN',
  'Más de $50,000 MXN',
  'No estoy seguro',
]

const initialState = {
  nombre: '',
  correo: '',
  telefono: '',
  servicio: '',
  presupuesto: '',
  mensaje: '',
}

export default function Contact() {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!form.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      newErrors.correo = 'Correo inválido'
    }
    if (form.telefono && !/^[\d\s\+\-()]{7,}$/.test(form.telefono)) {
      newErrors.telefono = 'Teléfono inválido'
    }
    if (!form.mensaje.trim()) newErrors.mensaje = 'El mensaje es obligatorio'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    try {
      await submitLead(form)
      setStatus('success')
      setForm(initialState)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Contáctanos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Cuéntanos sobre tu proyecto y te enviaremos una cotización personalizada
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-dark mb-6">Solicita tu cotización</h3>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    ¡Gracias! Hemos recibido tu solicitud.
                  </p>
                  <p className="text-gray-600">Nos pondremos en contacto contigo pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.nombre ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 outline-none transition-all`}
                    />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      placeholder="tu@correo.com"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.correo ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 outline-none transition-all`}
                    />
                    {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="+52 777 123 4567"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.telefono ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 outline-none transition-all`}
                    />
                    {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                  </div>

                  <div>
                    <select
                      name="servicio"
                      value={form.servicio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 outline-none transition-all text-gray-600"
                    >
                      <option value="">Selecciona un servicio</option>
                      {services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      ¿Cuál es tu presupuesto aproximado para el proyecto?
                    </label>
                    <select
                      name="presupuesto"
                      value={form.presupuesto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 outline-none transition-all text-gray-600"
                    >
                      <option value="">Selecciona un rango</option>
                      {budgets.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Cuéntanos sobre tu idea o proyecto..."
                      className={`w-full px-4 py-3 rounded-xl border ${errors.mensaje ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 outline-none transition-all resize-none`}
                    />
                    {errors.mensaje && <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-thalex-600 hover:bg-thalex-700 disabled:bg-thalex-300 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-thalex-200 hover:shadow-xl"
                  >
                    {status === 'loading' ? 'Enviando solicitud...' : 'Enviar solicitud'}
                  </button>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center">
                      Hubo un error al enviar tu solicitud. Intenta nuevamente.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-dark mb-4">Información de contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-thalex-100 text-thalex-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="text-gray-800 font-medium">thalexsystems@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="text-gray-800 font-medium">+52 777 259 7109</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-dark mb-3">
                ¿Prefieres escribirnos directamente?
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                Respondemos en menos de 24 horas. Cuéntanos sobre tu proyecto y te daremos una
                cotización sin compromiso.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-200 hover:shadow-xl"
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
    </section>
  )
}
