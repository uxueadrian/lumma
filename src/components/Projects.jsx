const projects = [
  {
    title: 'Proyecto Cliente',
    category: 'Landing Page',
    bg: 'bg-gradient-to-br from-thalex-400 to-thalex-600',
  },
  {
    title: 'Proyecto Cliente',
    category: 'Sitio Web Empresarial',
    bg: 'bg-gradient-to-br from-thalex-500 to-thalex-700',
  },
  {
    title: 'Proyecto Cliente',
    category: 'E-commerce',
    bg: 'bg-gradient-to-br from-thalex-600 to-thalex-800',
  },
  {
    title: 'Proyecto Cliente',
    category: 'Sistema Web',
    bg: 'bg-gradient-to-br from-thalex-400 to-thalex-700',
  },
  {
    title: 'Proyecto Cliente',
    category: 'Aplicación Web',
    bg: 'bg-gradient-to-br from-thalex-500 to-thalex-800',
  },
  {
    title: 'Tu proyecto aquí',
    category: 'Contáctanos',
    bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
    placeholder: true,
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Proyectos recientes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Conoce algunos de los proyectos que hemos desarrollado para nuestros clientes
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title + project.category}
              className={`${project.bg} rounded-2xl p-8 h-64 flex flex-col justify-end relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="relative z-10">
                <span className="text-white/80 text-sm font-medium mb-1 block">
                  {project.category}
                </span>
                <h3 className="text-white text-xl font-bold">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
