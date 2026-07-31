const projects = [
  {
    title: 'Black Iron Studio',
    category: 'Sitio Web - Estudio de Tatuajes',
    link: 'https://estudio-tatuaje-nine.vercel.app/',
    image: '/Black Iron Studio.png',
    live: true,
  },
  {
    title: 'Portafolio Adrián',
    category: 'Sitio Web - Portafolio Personal',
    link: 'https://adrian-dev-portfolio-beta.vercel.app/',
    image: '/Portafolio Adrian.png',
    live: true,
  },
  {
    title: 'Cafetería',
    category: 'Sitio Web - Cafetería',
    bg: 'bg-gradient-to-br from-amber-500 to-rose-600',
  },
  {
    title: 'Gimnasio',
    category: 'Sitio Web - Gimnasio',
    bg: 'bg-gradient-to-br from-orange-500 to-red-600',
  },
  {
    title: 'Restaurante',
    category: 'Sitio Web - Restaurante',
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
  },
  {
    title: 'Boutique',
    category: 'Sitio Web - Boutique',
    bg: 'bg-gradient-to-br from-pink-500 to-purple-700',
  },
  {
    title: 'Tu negocio aquí',
    category: 'Contáctanos',
    bg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800',
    muted: true,
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">Nuestro trabajo</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Explora proyectos completamente funcionales desarrollados por THALEX SYSTEMS.
            Cada sitio refleja nuestro enfoque en diseño, rendimiento y experiencia de
            usuario. El próximo puede ser el tuyo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.title + project.category}
              href={project.link || '#contact'}
              target={project.link ? '_blank' : undefined}
              rel={project.link ? 'noopener noreferrer' : undefined}
              className={`${
                project.image
                  ? 'relative overflow-hidden rounded-2xl'
                  : `${project.bg} rounded-2xl`
              } p-8 h-64 flex flex-col justify-end relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1`}
            >
              {project.image ? (
                <>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/5 transition-colors" />
              )}
              {project.live && (
                <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  En vivo
                </span>
              )}
              <div className="relative z-10">
                <span className="text-white/80 text-sm font-medium mb-1 block">
                  {project.category}
                </span>
                <h3 className={`font-bold ${project.muted ? 'text-gray-400 dark:text-slate-500' : 'text-white'}`}>
                  {project.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-thalex-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Desarrollo a la medida
          </span>
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-thalex-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Sitios 100% funcionales
          </span>
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-thalex-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Diseño y soporte profesional
          </span>
        </div>
      </div>
    </section>
  )
}