import { useState, useEffect } from 'react'
import { submitLead } from '../services/leadService'
import { serviceOptions, getServiceById } from '../config/services'
import { getCarePlanById } from '../config/carePlans'
import { getPendingService, subscribeToServiceSelection } from '../services/requestService'

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
  empresa: '',
  servicio: '',
  presupuesto: '',
  mensaje: '',
}

export default function QuoteForm({ onSuccess }) {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const initial = getPendingService()
    if (initial) {
      setForm((prev) => ({ ...prev, servicio: initial }))
    }
    return subscribeToServiceSelection((id) => {
      setForm((prev) => ({ ...prev, servicio: id }))
    })
  }, [])

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
      const service = getServiceById(form.servicio)
      const carePlan = getCarePlanById(form.servicio)
      const servicioName = service ? service.name : carePlan ? carePlan.name : form.servicio
      const mensaje = [
        form.empresa?.trim() ? `Empresa: ${form.empresa.trim()}` : '',
        form.mensaje.trim(),
      ]
        .filter(Boolean)
        .join('\n')
      const payload = { ...form, servicio: servicioName, mensaje }
      await submitLead(payload)
      setForm(initialState)
      setStatus('idle')
      if (onSuccess) onSuccess()
    } catch {
      setStatus('error')
    }
  }

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border ${hasError ? 'border-red-400' : 'border-gray-200 dark:border-slate-600'} bg-gray-50 dark:bg-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-700 focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 dark:focus:ring-thalex-900/50 outline-none transition-all`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          className={inputClass(errors.nombre)}
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
          className={inputClass(errors.correo)}
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
          className={inputClass(false)}
        />
        {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
      </div>

      <div>
        <input
          type="text"
          name="empresa"
          value={form.empresa}
          onChange={handleChange}
          placeholder="Tu empresa (opcional)"
          className={inputClass(false)}
        />
      </div>

      <div>
        <select
          name="servicio"
          value={form.servicio}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-700 focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 dark:focus:ring-thalex-900/50 outline-none transition-all"
        >
          <option value="">Selecciona un servicio</option>
          {serviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-slate-400 mb-2">
          ¿Cuál es tu presupuesto aproximado para el proyecto?
        </label>
        <select
          name="presupuesto"
          value={form.presupuesto}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-700 focus:border-thalex-400 focus:ring-2 focus:ring-thalex-100 dark:focus:ring-thalex-900/50 outline-none transition-all"
        >
          <option value="">Selecciona un rango</option>
          {budgets.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
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
          className={inputClass(errors.mensaje) + ' resize-none'}
        />
        {errors.mensaje && <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-thalex-600 hover:bg-thalex-700 dark:bg-thalex-500 dark:hover:bg-thalex-600 disabled:bg-thalex-300 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-thalex-200 dark:shadow-thalex-900/30 hover:shadow-xl active:scale-[0.99]"
      >
        {status === 'loading' ? 'Enviando solicitud...' : 'Enviar solicitud'}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">
          Hubo un error al enviar tu solicitud. Intenta nuevamente.
        </p>
      )}
    </form>
  )
}
