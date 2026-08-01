const PORTFOLIO_URL = 'https://adrian-dev-portfolio-beta.vercel.app/'

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">
            Sobre nosotros
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Detrás de cada proyecto hay una persona que lo hace posible
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-thalex-400 to-thalex-700 text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-thalex-200 dark:shadow-thalex-900/30">
                AU
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-dark dark:text-white mb-1">
                Adrián Uxue Chávez Martínez
              </h3>
              <p className="text-thalex-600 dark:text-thalex-400 font-semibold mb-4">
                Fundador & CEO de Thalex Systems
              </p>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Adrián es el fundador de Thalex Systems, un desarrollador apasionado por crear
                soluciones digitales que ayudan a las empresas a crecer. Su objetivo es combinar
                diseño, tecnología y estrategia para ofrecer productos que generan resultados reales,
                con atención 100% remota a clientes en México y el extranjero.
              </p>

              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-thalex-600 hover:bg-thalex-700 dark:bg-thalex-500 dark:hover:bg-thalex-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-thalex-200 dark:shadow-thalex-900/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                Ver mi portafolio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
