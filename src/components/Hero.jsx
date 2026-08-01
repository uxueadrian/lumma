import { requestContact } from '../services/requestService'

const WHATSAPP_NUMBER = '7772597109'
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola, vi la página de Thalex Systems y quiero solicitar información sobre un proyecto.'
)
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-thalex-50 dark:from-slate-900 dark:via-slate-900 dark:to-thalex-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-thalex-200/20 via-transparent to-transparent dark:from-thalex-500/10" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-thalex-100 dark:bg-thalex-900/50 text-thalex-700 dark:text-thalex-300 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-thalex-500 rounded-full animate-pulse" />
          Transformamos ideas en soluciones digitales
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark dark:text-white leading-tight mb-6">
          Creamos soluciones digitales{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-thalex-500 to-thalex-700 dark:from-thalex-400 dark:to-thalex-600">
            modernas
          </span>{' '}
          para impulsar tu negocio
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          En Thalex Systems desarrollamos landing pages, sitios web, tiendas en línea y sistemas web
          que ayudan a tu negocio a crecer y destacar en el mundo digital.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={requestContact}
            className="bg-thalex-600 hover:bg-thalex-700 dark:bg-thalex-500 dark:hover:bg-thalex-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-lg shadow-thalex-200 dark:shadow-thalex-900/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            Solicitar cotización
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-lg shadow-green-200 dark:shadow-green-900/30 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribenos por WhatsApp
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-slate-400">
          {['100% remoto', 'Pagos por etapas', 'Soporte incluido'].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}