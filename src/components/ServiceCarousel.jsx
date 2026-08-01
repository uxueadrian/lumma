import { useRef } from 'react'
import { requestService } from '../services/requestService'

function LiveBadge() {
  return (
    <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg shadow-green-900/30">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
      </span>
      EN VIVO
    </span>
  )
}

export default function ServiceCarousel({ projects, serviceId }) {
  const trackRef = useRef(null)

  function scroll(direction) {
    const track = trackRef.current
    if (track) {
      track.scrollBy({ left: direction * 320, behavior: 'smooth' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-dark dark:text-white">Proyectos relacionados</h4>
        {projects.length > 1 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:bg-thalex-50 dark:hover:bg-slate-700 hover:text-thalex-600 dark:hover:text-thalex-400 flex items-center justify-center transition-colors"
              aria-label="Anterior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:bg-thalex-50 dark:hover:bg-slate-700 hover:text-thalex-600 dark:hover:text-thalex-400 flex items-center justify-center transition-colors"
              aria-label="Siguiente"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/30 p-8 text-center">
          <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
            Aún no publicamos un ejemplo de este tipo de proyecto, pero ya lo hemos desarrollado.
            Escríbenos y te mostramos casos similares.
          </p>
          <button
            onClick={() => requestService(serviceId)}
            className="inline-flex items-center gap-2 text-thalex-600 dark:text-thalex-400 font-semibold text-sm hover:underline"
          >
            Pedir un ejemplo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scroll-smooth"
          >
            {projects.map((project) => (
              <div
                key={project.name}
                className="snap-start shrink-0 w-[280px] rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <div className="relative h-40 bg-gray-100 dark:bg-slate-700">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-400 dark:text-slate-400">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <LiveBadge />
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-dark dark:text-white mb-2">{project.name}</h5>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-thalex-50 dark:bg-thalex-900/50 text-thalex-600 dark:text-thalex-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-thalex-600 hover:bg-thalex-700 dark:bg-thalex-500 dark:hover:bg-thalex-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    Ver proyecto
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
