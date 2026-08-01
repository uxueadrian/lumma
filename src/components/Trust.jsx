const CheckIcon = () => (
  <svg className="w-5 h-5 text-thalex-500 dark:text-thalex-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export default function Trust() {
  return (
    <section id="trust" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-thalex-100 dark:bg-thalex-900/50 text-thalex-700 dark:text-thalex-300 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Trabaja sin preocupaciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">
            Todo a distancia, sin riesgos
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Resolvemos las dos dudas más comunes antes de empezar: trabajamos 100% en línea y tu
            inversión está protegida en cada etapa del proyecto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 sm:p-10 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-thalex-100 dark:bg-thalex-900/50 text-thalex-600 dark:text-thalex-400 flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-3">
              Se puede trabajar 100% remoto
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Todo el proceso se realiza en línea. No necesitas desplazarte ni cambiar tu rutina.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-sm">
                <CheckIcon />
                Reuniones por videollamada en tu horario
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-sm">
                <CheckIcon />
                Avances constantes por WhatsApp y correo
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-sm">
                <CheckIcon />
                Atención para clientes en México y el extranjero
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 sm:p-10 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-3">
              Pagos seguros y transparentes
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Nunca pagas todo por adelantado. Dividimos el proyecto en etapas y tú apruebas cada una
              antes de continuar.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-sm">
                <CheckIcon />
                Pago por etapas: un anticipo al inicio y el saldo al entregar
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-sm">
                <CheckIcon />
                Contrato y factura para tu respaldo
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-sm">
                <CheckIcon />
                El método de pago que más te convenga
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-gray-500 dark:text-slate-400">
          Sin importar si estás en México, EE. UU. o cualquier parte del mundo, tenemos todo listo
          para empezar hoy.
        </p>
      </div>
    </section>
  )
}
