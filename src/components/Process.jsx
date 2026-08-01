import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'Idea inicial',
    description:
      'Nos reunimos para entender tu visión, objetivos y necesidades. Definimos juntos el alcance del proyecto.',
    color: 'bg-thalex-500',
  },
  {
    number: '02',
    title: 'Planeación',
    description:
      'Creamos una estrategia detallada: diseño, tecnologías, tiempos y presupuesto. Tú apruebas cada paso.',
    color: 'bg-thalex-600',
  },
  {
    number: '03',
    title: 'Desarrollo',
    description:
      'Construimos tu solución con tecnologías modernas. Te mantenemos informado con avances constantes.',
    color: 'bg-thalex-700',
  },
  {
    number: '04',
    title: 'Lanzamiento',
    description:
      'Desplegamos tu proyecto, te capacitamos y brindamos soporte continuo para garantizar tu éxito.',
    color: 'bg-thalex-800',
  },
]

export default function Process() {
  const gridRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    function update() {
      const grid = gridRef.current
      if (!grid) return
      const rect = grid.getBoundingClientRect()
      const viewport = window.innerHeight
      const total = rect.height + viewport * 0.3
      const passed = viewport * 0.7 - rect.top
      const next = Math.min(1, Math.max(0, passed / total))
      setProgress(next)
    }

    function onScroll() {
      if (frameRef.current) return
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <section id="process" className="py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">Cómo trabajamos</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Un proceso claro y transparente para llevar tu proyecto del concepto a la realidad
          </p>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8" ref={gridRef}>
          <div className="absolute top-8 left-[12.5%] right-[12.5%] hidden lg:block h-0.5">
            <div className="h-full w-full rounded-full bg-thalex-100 dark:bg-thalex-800/60" />
            <div
              className="absolute top-0 left-0 h-full w-full origin-left rounded-full bg-gradient-to-r from-thalex-500 to-violet-500"
              style={{ transform: `scaleX(${progress})` }}
            />
            <div
              className="absolute top-1/2 w-3.5 h-3.5 -translate-y-1/2"
              style={{ left: `${progress * 100}%`, transform: `translate(-50%, -50%)` }}
            >
              <span className="absolute inset-0 rounded-full bg-thalex-400 opacity-75 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-thalex-500 shadow-[0_0_12px_rgba(99,102,241,0.9)]" />
            </div>
          </div>

          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 ${step.color} dark:opacity-90 text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-6 shadow-lg dark:shadow-thalex-900/30`}
                >
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}