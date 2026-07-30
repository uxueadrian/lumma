const projects = [
  {
    title: 'Black Iron Studio',
    category: 'Sitio Web - Estudio de Tatuajes',
    link: 'https://estudio-tatuaje-nine.vercel.app/',
    image: '/Black Iron Studio.png',
  },
  {
    title: 'Proyecto Cliente',
    category: 'Landing Page',
    bg: 'bg-gradient-to-br from-thalex-400 to-thalex-600',
    placeholder: true,
  },
  {
    title: 'Proyecto Cliente',
    category: 'Sitio Web Empresarial',
    bg: 'bg-gradient-to-br from-thalex-500 to-thalex-700',
    placeholder: true,
  },
  {
    title: 'Proyecto Cliente',
    category: 'E-commerce',
    bg: 'bg-gradient-to-br from-thalex-600 to-thalex-800',
    placeholder: true,
  },
  {
    title: 'Proyecto Cliente',
    category: 'Sistema Web',
    bg: 'bg-gradient-to-br from-thalex-400 to-thalex-700',
    placeholder: true,
  },
  {
    title: 'Tu proyecto aquí',
    category: 'Contáctanos',
    bg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800',
    placeholder: true,
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-4">Proyectos recientes</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Conoce algunos de los proyectos que hemos desarrollado para nuestros clientes
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
              <div className="relative z-10">
                <span className="text-white/80 text-sm font-medium mb-1 block">
                  {project.category}
                </span>
                <h3 className={`font-bold ${project.placeholder ? 'text-gray-400 dark:text-slate-500' : 'text-white'}`}>
                  {project.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}