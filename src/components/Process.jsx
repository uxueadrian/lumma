const steps = [
  {
    number: '01',
    title: 'Idea inicial',
    description:
      'Nos reunimos para entender tu visión, objetivos y necesidades. Definimos juntos el alcance del proyecto.',
    color: 'bg-lumma-500',
  },
  {
    number: '02',
    title: 'Planeación',
    description:
      'Creamos una estrategia detallada: diseño, tecnologías, tiempos y presupuesto. Tú apruebas cada paso.',
    color: 'bg-lumma-600',
  },
  {
    number: '03',
    title: 'Desarrollo',
    description:
      'Construimos tu solución con tecnologías modernas. Te mantenemos informado con avances constantes.',
    color: 'bg-lumma-700',
  },
  {
    number: '04',
    title: 'Lanzamiento',
    description:
      'Desplegamos tu proyecto, te capacitamos y brindamos soporte continuo para garantizar tu éxito.',
    color: 'bg-lumma-800',
  },
]

export default function Process() {
  return (
    <section id="process" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Cómo trabajamos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Un proceso claro y transparente para llevar tu proyecto del concepto a la realidad
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-lumma-200" />
              )}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 ${step.color} text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-6 shadow-lg`}
                >
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-dark mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
