export const services = [
  {
    id: 'software-a-medida',
    name: 'Software a la medida',
    featured: true,
    tagline: '¿No encuentras exactamente lo que buscas?',
    short:
      'No importa la idea que tengas. Diseñamos y desarrollamos soluciones completamente personalizadas para tu negocio.',
    problem: 'Cualquier necesidad específica que no encaja en un servicio estándar.',
    description:
      'Cuando tu negocio requiere algo que no existe en un catálogo, lo construimos desde cero. Analizamos tu operación, diseñamos la solución, la desarrollamos a la medida y la acompañamos durante todo su ciclo de vida.',
    benefits: [
      'Adaptado 100% a tu proceso de negocio',
      'Escalable conforme tu empresa crece',
      'Sin funciones innecesarias ni genéricas',
      'Propiedad total del código y de la solución',
      'Acompañamiento en todo el ciclo de vida',
    ],
    features: [
      'Diseño y arquitectura personalizada',
      'Base de datos a la medida',
      'Panel administrativo',
      'Integraciones con tus herramientas',
      'Seguridad y respaldos',
      'Documentación y capacitación',
    ],
    useCases: [
      'Procesos internos únicos que no se resuelven con software genérico',
      'Automatización de tareas repetitivas de tu operación',
      'Portales y plataformas exclusivas para tu modelo de negocio',
      'Sistemas de gestión de inventario, clientes o reportes',
    ],
    cta: {
      headline: '¿Tienes una idea que no encaja en ningún molde?',
      body: 'Hablemos de ella. La analizamos, diseñamos y desarrollamos desde cero, a la medida de tu negocio.',
      button: 'Solicitar Software a la medida',
    },
    gradient: 'from-indigo-500 via-violet-500 to-fuchsia-600',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    projects: [],
  },
  {
    id: 'landing-pages',
    name: 'Landing Pages',
    theme: 'sky',
    label: 'Captación y conversión',
    short: 'Páginas de aterrizaje diseñadas para convertir visitantes en clientes.',
    problem: 'Tienes una campaña o producto y necesitas captar clientes rápidamente.',
    description:
      'Páginas enfocadas en un solo objetivo: convertir. Diseño persuasivo, llamados a la acción claros y optimización constante para que cada visita cuente.',
    benefits: [
      'Convierte visitas en clientes potenciales',
      'Carga rápida en cualquier dispositivo',
      'Lista para campañas de publicidad',
      'Fácil de actualizar y escalar',
    ],
    features: [
      'Diseño personalizado',
      'Responsive',
      'Optimización SEO',
      'Integración con WhatsApp',
      'Formulario de contacto',
      'Alto rendimiento',
      'Hosting opcional',
      'Dominio opcional',
    ],
    useCases: [
      'Lanzamientos de productos o promociones',
      'Captación de clientes para servicios locales',
      'Registro de eventos o webinars',
      'Validación de una nueva idea de negocio',
    ],
    cta: {
      headline: '¿Te gusta este tipo de proyecto?',
      body: 'Creamos Landing Pages completamente personalizadas para tu negocio.',
      button: 'Quiero una Landing Page',
    },
    gradient: 'from-sky-500 to-cyan-600',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3V3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9h18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v18" />
      </svg>
    ),
    projects: [
      {
        name: 'Portafolio Adrián',
        url: 'https://adrian-dev-portfolio-beta.vercel.app/',
        image: '/Portafolio Adrian.png',
        technologies: ['React', 'Tailwind CSS', 'Vercel'],
      },
    ],
  },
  {
    id: 'sitios-web-corporativos',
    name: 'Sitios Web Corporativos',
    theme: 'indigo',
    label: 'Presencia digital',
    short: 'La presencia digital profesional que tu empresa merece.',
    problem: 'Tu empresa no transmite confianza en línea o no aparece en Google.',
    description:
      'Sitios que comunican la seriedad y la calidad de tu empresa. Diseño moderno, optimización SEO y la mejor experiencia para tus visitantes.',
    benefits: [
      'Proyecta profesionalismo y confianza',
      'Posicionamiento en Google',
      'Experiencia impecable en cualquier dispositivo',
      'Fácil de mantener',
    ],
    features: [
      'Diseño personalizado',
      'Responsive',
      'Optimización SEO',
      'Secciones informativas',
      'Formulario de contacto',
      'Integración con WhatsApp',
      'Alto rendimiento',
      'Hosting opcional',
      'Dominio opcional',
    ],
    useCases: [
      'Empresas que quieren proyectar profesionalismo',
      'Negocios sin presencia o con sitio desactualizado',
      'Equipos que buscan atraer clientes y talento',
    ],
    cta: {
      headline: '¿Quieres que tu empresa se vea tan profesional como es?',
      body: 'Creamos Sitios Web Corporativos a la altura de tu marca.',
      button: 'Quiero un Sitio Web Corporativo',
    },
    gradient: 'from-indigo-500 to-violet-600',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.6 9h16.8M3.6 15h16.8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3a16 16 0 010 18 16 16 0 010-18z" />
      </svg>
    ),
    projects: [
      {
        name: 'Black Iron Studio',
        url: 'https://estudio-tatuaje-nine.vercel.app/',
        image: '/Black Iron Studio.png',
        technologies: ['React', 'Tailwind CSS', 'Vercel'],
      },
    ],
  },
  {
    id: 'tiendas-en-linea',
    name: 'Tiendas en Línea',
    theme: 'emerald',
    label: 'Ventas en línea',
    short: 'Vende tus productos en internet las 24 horas, sin intermediarios.',
    problem: 'Quieres vender en línea pero no sabes por dónde empezar.',
    description:
      'Tiendas completas con catálogo, carrito de compras, pagos en línea y panel administrativo para gestionar tu negocio desde donde estés.',
    benefits: [
      'Vende sin horarios ni intermediarios',
      'Cobra en línea de forma segura',
      'Controla pedidos e inventario en un solo lugar',
      'Llega a clientes fuera de tu ciudad',
    ],
    features: [
      'Catálogo y carrito de compras',
      'Pasarela de pagos',
      'Panel administrativo',
      'Gestión de pedidos e inventario',
      'Responsive',
      'SEO y rendimiento',
      'Hosting opcional',
      'Dominio opcional',
    ],
    useCases: [
      'Negocios físicos que quieren vender en línea',
      'Emprendedores con productos propios',
      'Marcas que buscan crecer fuera de su ciudad',
    ],
    cta: {
      headline: '¿Listo para vender en línea?',
      body: 'Creamos tu Tienda en Línea lista para operar desde el día uno.',
      button: 'Quiero una Tienda en Línea',
    },
    gradient: 'from-emerald-500 to-teal-600',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l2 2m0 0l2 8m-2 0h14l1-4H7L5 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a2 2 0 100-4 2 2 0 000 4zM17 21a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
    projects: [],
  },
  {
    id: 'sistemas-web',
    name: 'Sistemas Web',
    theme: 'fuchsia',
    label: 'Control y automatización',
    short: 'Sistemas a la medida para controlar la operación de tu negocio.',
    problem: 'Todavía controlas tus procesos con hojas de cálculo y correos.',
    description:
      'CRM, paneles administrativos, gestores de contenido y plataformas que centralizan y automatizan tu operación en un solo sistema.',
    benefits: [
      'Información centralizada y confiable',
      'Ahorro de tiempo en tareas manuales',
      'Decisiones basadas en datos reales',
      'Control de accesos para tu equipo',
    ],
    features: [
      'Módulos según tu operación',
      'Panel administrativo',
      'Base de datos centralizada',
      'Reportes y estadísticas',
      'Control de accesos y roles',
      'Integraciones',
    ],
    useCases: [
      'Control de clientes y ventas (CRM)',
      'Gestión de inventario y pedidos',
      'Automatización de procesos internos',
      'Portales para tu equipo',
    ],
    cta: {
      headline: '¿Controlas tu negocio con archivos sueltos?',
      body: 'Creamos Sistemas Web que centralizan y automatizan tu operación.',
      button: 'Quiero un Sistema Web',
    },
    gradient: 'from-fuchsia-500 to-pink-600',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    projects: [],
  },
  {
    id: 'aplicaciones-web',
    name: 'Aplicaciones Web',
    theme: 'amber',
    label: 'Experiencia moderna',
    short: 'Aplicaciones modernas que se sienten nativas desde el navegador.',
    problem: 'Necesitas una app potente sin la complejidad de instalar nada.',
    description:
      'Aplicaciones web progresivas construidas con tecnologías modernas como React: rápidas, seguras y con la experiencia de una app nativa.',
    benefits: [
      'Funciona en cualquier dispositivo sin instalar',
      'Rendimiento de aplicación nativa',
      'Experiencia de usuario fluida',
      'Escalable a medida que crece',
    ],
    features: [
      'Tecnología moderna (React)',
      'Funciona en cualquier dispositivo',
      'Rendimiento de app nativa',
      'Notificaciones',
      'Diseño centrado en el usuario',
      'Escalable',
    ],
    useCases: [
      'Plataformas con funcionalidad compleja',
      'Dashboards y herramientas de trabajo',
      'Apps de uso frecuente',
      'Productos digitales para tus usuarios',
    ],
    cta: {
      headline: '¿Necesitas una aplicación web?',
      body: 'Creamos Aplicaciones Web rápidas, seguras y profesionales.',
      button: 'Quiero una Aplicación Web',
    },
    gradient: 'from-amber-500 to-orange-600',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
      </svg>
    ),
    projects: [],
  },
  {
    id: 'mantenimiento-web',
    name: 'Mantenimiento Web',
    theme: 'rose',
    label: 'Soporte continuo',
    short: 'Tu sitio siempre actualizado, seguro y funcionando.',
    problem: 'Tu sitio existe pero está lento, desactualizado o sin soporte.',
    description:
      'Plan de soporte para mantener tu sitio o sistema web actualizado, con respaldos, seguridad y mejoras continuas.',
    benefits: [
      'Tu sitio siempre al día',
      'Menos riesgos de seguridad',
      'Cambios de contenido sin preocuparte',
      'Soporte prioritario cuando lo necesites',
    ],
    features: [
      'Actualizaciones y mejoras',
      'Seguridad y respaldos',
      'Monitoreo y rendimiento',
      'Cambios de contenido',
      'Soporte prioritario',
    ],
    useCases: [
      'Sitios lanzados recientemente',
      'Sitios desactualizados o vulnerables',
      'Negocios que quieren apoyo continuo',
    ],
    cta: {
      headline: '¿Tu sitio necesita atención constante?',
      body: 'Creamos un plan de mantenimiento a la medida de tu sitio.',
      button: 'Quiero Mantenimiento Web',
    },
    gradient: 'from-rose-500 to-red-600',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    projects: [],
  },
]

export const featuredService = services.find((service) => service.featured) || services[0]

export const regularServices = services.filter((service) => !service.featured)

export const serviceOptions = [
  ...services.map((service) => ({ value: service.id, label: service.name })),
  { value: 'Otro', label: 'Otro' },
]

export function getServiceById(id) {
  return services.find((service) => service.id === id)
}

export const serviceThemes = {
  sky: {
    dot: 'bg-sky-400',
    tile: 'bg-sky-500/15 border-sky-400/25 text-sky-300',
    blobA: 'bg-sky-600/30',
    blobB: 'bg-cyan-600/20',
    button: 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700',
    accentText: 'text-sky-300',
  },
  indigo: {
    dot: 'bg-indigo-400',
    tile: 'bg-indigo-500/15 border-indigo-400/25 text-indigo-300',
    blobA: 'bg-indigo-600/30',
    blobB: 'bg-violet-600/20',
    button: 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700',
    accentText: 'text-indigo-300',
  },
  emerald: {
    dot: 'bg-emerald-400',
    tile: 'bg-emerald-500/15 border-emerald-400/25 text-emerald-300',
    blobA: 'bg-emerald-600/30',
    blobB: 'bg-teal-600/20',
    button: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    accentText: 'text-emerald-300',
  },
  fuchsia: {
    dot: 'bg-fuchsia-400',
    tile: 'bg-fuchsia-500/15 border-fuchsia-400/25 text-fuchsia-300',
    blobA: 'bg-fuchsia-600/30',
    blobB: 'bg-pink-600/20',
    button: 'bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700',
    accentText: 'text-fuchsia-300',
  },
  amber: {
    dot: 'bg-amber-400',
    tile: 'bg-amber-500/15 border-amber-400/25 text-amber-300',
    blobA: 'bg-amber-600/30',
    blobB: 'bg-orange-600/20',
    button: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    accentText: 'text-amber-300',
  },
  rose: {
    dot: 'bg-rose-400',
    tile: 'bg-rose-500/15 border-rose-400/25 text-rose-300',
    blobA: 'bg-rose-600/30',
    blobB: 'bg-red-600/20',
    button: 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700',
    accentText: 'text-rose-300',
  },
}
