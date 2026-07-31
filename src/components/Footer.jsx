export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <img
              src="/THALEX SYSTEMS LOGO BLANCO.png"
              alt="Thalex Systems"
              className="h-14 w-auto mb-3"
            />
            <p className="text-sm leading-relaxed text-gray-400 dark:text-slate-500">
              Soluciones digitales modernas para impulsar tu negocio en el mundo online.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  Proceso
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white transition-colors">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>thalexsystems@gmail.com</li>
              <li>+52 777 259 7109</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-slate-800 pt-8 text-center text-sm text-gray-400 dark:text-slate-600">
          <p>&copy; {new Date().getFullYear()} Thalex Systems. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}