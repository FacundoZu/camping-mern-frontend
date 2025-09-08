import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { useForm } from '../../../hooks/useForm';
import { toast } from 'react-toastify';
import { FaEnvelope } from 'react-icons/fa';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { formulario, cambiado } = useForm({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { datos } = await Peticion(Global.url + "user/forgotpassword", "POST", formulario, false, 'include');

    if (datos && datos.success === true) {
      toast.success("Se envió un correo con las instrucciones para restablecer su contraseña");
    } else {
      toast.error("Error al restablecer la contraseña. Por favor, inténtalo de nuevo.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Restablecer contraseña</h1>
        <p className="text-gray-500 text-center mb-6">
          Ingresa tu correo electrónico para recibir instrucciones.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-3 pl-11 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50/50"
              required
              onChange={cambiado}
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lime-500" />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md"
          >
            {isLoading ? "Enviando..." : "Restablecer contraseña"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            ¿Recordaste tu contraseña? 
            <button onClick={() => navigate('/login')} className="text-lime-600 hover:underline ml-1">
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
