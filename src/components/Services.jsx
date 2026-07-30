const services = [
  {
    title: 'Landing Pages',
    description:
      'Páginas de aterrizaje profesionales diseñadas para convertir visitantes en clientes. Ideales para campañas, lanzamientos y promociones.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3V3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9h18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v18" />
      </svg>
    ),
  },
  {
    title: 'Sitios Web Empresariales',
    description:
      'Sitios web corporativos con diseño moderno, optimizados para SEO y con la mejor experiencia de usuario para tu empresa.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.6 9h16.8M3.6 15h16.8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3a16 16 0 010 18 16 16 0 010-18z" />
      </svg>
    ),
  },
  {
    title: 'Tiendas en Línea (E-commerce)',
    description:
      'Tiendas en línea completas con carrito de compras, pasarela de pago y panel administrativo para gestionar tu negocio.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l2 2m0 0l2 8m-2 0h14l1-4H7L5 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a2 2 0 100-4 2 2 0 000 4zM17 21a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
  },
  {
    title: 'Sistemas Web',
    description:
      'Sistemas web a la medida: CRM, paneles administrativos, gestores de contenido y plataformas personalizadas para tu negocio.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Aplicaciones Web',
    description:
      'Aplicaciones web progresivas (PWA) con tecnologías modernas como React, rápidas, seguras y con experiencia nativa.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
      </svg>
    ),
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Nuestros servicios</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Ofrecemos soluciones digitales completas para impulsar tu negocio en el mundo online
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-lumma-200 hover:shadow-lg hover:shadow-lumma-50 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-lumma-50 text-lumma-600 flex items-center justify-center mb-4 group-hover:bg-lumma-100 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold text-dark mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
