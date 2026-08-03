import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Care from './components/Care'
import Process from './components/Process'
import Trust from './components/Trust'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Care />
        <Process />
        <Trust />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
