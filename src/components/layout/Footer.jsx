import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RiLeafFill } from "react-icons/ri"
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowUp
} from "react-icons/fa"

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Mostrar u ocultar el botón de scroll al top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 1600)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Función para hacer scroll al inicio
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    })
  }

  return (
    <>
      <footer className="bg-slate-800 text-white pt-10 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">

            {/* Logo y descripción */}
            <div className="w-2/3 text-center justify-center m-auto">
              <Link to="/" className="flex items-center mb-4 justify-center">
                <RiLeafFill className='text-lime-400 mr-2 h-6 w-6' />
                <span className='text-xl font-bold'>Camping Cachi</span>
              </Link>
              <p className="text-slate-300 mb-4 text-sm">
                Disfruta de la naturaleza en su máximo esplendor. Un lugar único para desconectar y recargar energías.
              </p>
              <div className="flex space-x-4 justify-center">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-lime-400 transition-colors duration-300"
                  aria-label="Visítanos en Facebook"
                >
                  <FaFacebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-lime-400 transition-colors duration-300"
                  aria-label="Síguenos en Instagram"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-lime-400 transition-colors duration-300"
                  aria-label="Escríbenos por WhatsApp"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Información de contacto */}
            <div className='w-1/3 text-center mt-6 md:mt-0 justify-center m-auto'>
              <h3 className="text-lg font-semibold mb-4 text-lime-400">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-center">
                  <FaMapMarkerAlt className="text-lime-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">
                    Ruta 123, Km 45 Cachi, Salta, Argentina
                  </span>
                </li>
                <li className="flex items-center justify-center">
                  <FaPhoneAlt className="text-lime-400 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">+54 387 123-4567</span>
                </li>
                <li className="flex items-center justify-center">
                  <FaEnvelope className="text-lime-400 mr-3 flex-shrink-0" />
                  <a
                    href="mailto:info@campingcachi.com"
                    className="text-slate-300 hover:text-lime-400 transition-colors duration-300 text-sm"
                  >
                    info@campingcachi.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700 mt-8 pt-6 flex justify-center items-center">
            <p className="text-slate-400 text-sm mb-3 md:mb-0">
              © {new Date().getFullYear()} Camping Cachi. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Botón para volver arriba */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-3 right-6 bg-lime-500 hover:bg-lime-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
          aria-label="Volver arriba"
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  )
}

export default Footer