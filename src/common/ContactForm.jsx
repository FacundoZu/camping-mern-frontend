import React, { useState, useEffect } from "react";
import { Global } from "../helpers/Global";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 🔹 Estado para la barra de progreso

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${Global.url}enviarEmailConsulta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setProgress(0); // Reiniciamos la barra
        setFormData({ name: "", email: "", message: "" });

        // Ocultamos el mensaje después de 3.5 segundos
        setTimeout(() => {
          setShowSuccess(false);
        }, 3500);
      } else {
        alert("Error al enviar el correo");
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Manejar la animación de la barra de progreso
  useEffect(() => {
    let interval;
    if (showSuccess) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 3; // Velocidad de llenado
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [showSuccess]);

  return (
    <div id="contacto" className="mx-auto w-full px-4 sm:px-6 lg:px-20 py-4">
      <div className="grid md:grid-cols-2 shadow-lg rounded-lg overflow-hidden relative">
        {/* Lado izquierdo */}
        <div className="space-y-6 bg-lime-600 p-9 flex flex-col justify-between text-white">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Contacto</h2>
            <p className="mt-2 text-lg text-lime-100">
              Si tienes alguna pregunta o necesitas ayuda, por favor no dudes en hacernos llegar un mensaje a través de este formulario.
            </p>
            <p className="mt-2 text-lg text-lime-100">
              También puedes hacernos llegar un correo electrónico a{" "}
              <a
                href="mailto:info@campingcachi.com"
                className="text-white hover:underline transition-all"
              >
                info@campingcachi.com
              </a>{" "}
              o llamarnos al{" "}
              <a
                href="tel:+54 387 123-4567"
                className="text-white hover:underline transition-all"
              >
                +54 387 123-4567
              </a>.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Síguenos en redes sociales</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-2 text-white hover:scale-125 transition-all"
              >
                <FaFacebookSquare size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-2 text-white hover:scale-125 transition-all"
              >
                <FaInstagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-9 relative">
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                rows="4"
                placeholder="Escribe tu mensaje"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-lime-600 text-white py-3 rounded-lg shadow-md transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-lime-700"
              }`}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>

          {/* Overlay con blur y mensaje */}
          {showSuccess && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg transition-opacity duration-300">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center relative w-80">
                <h3 className="text-xl font-semibold text-lime-600 justify-center flex items-center gap-2 mb-4">
                  <IoIosCheckmarkCircleOutline size={24} />
                  Correo enviado con éxito
                </h3>
                <p className="text-gray-600 mb-4">
                  Nos pondremos en contacto contigo pronto.
                </p>
                {/* 🔹 Barra de progreso */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                  <div
                    className="h-full bg-lime-600 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
