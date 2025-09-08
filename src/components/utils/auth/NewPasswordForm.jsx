import React, { useState } from 'react';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { useForm } from '../../../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export const NewPasswordForm = ({ token }) => {
  const { formulario, cambiado } = useForm({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formulario.password !== formulario.password_confirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }

    formulario.token = token;
    const { datos } = await Peticion(Global.url + "user/updatePassword/" + token, "POST", formulario, false, '');
    if (datos && datos.success === true) {
      navigate('/login');
      toast.success('Contraseña restablecida correctamente');
    } else {
      toast.error('Error al restablecer la contraseña');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Restablecer Contraseña</h1>
          <p className="text-gray-500">Ingresa la nueva contraseña</p>
        </div>

        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Tu contraseña"
              onChange={cambiado}
              required
              className="w-full px-4 py-3 pl-11 pr-11 border-2 rounded-xl focus:outline-none focus:ring-0 border-gray-300"
            />
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5" />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <input
              id="password_confirmation"
              type={showPasswordConfirm ? "text" : "password"}
              name="password_confirmation"
              placeholder="Confirmar contraseña"
              onChange={cambiado}
              required
              className="w-full px-4 py-3 pl-11 pr-11 border-2 rounded-xl focus:outline-none focus:ring-0 border-gray-300"
            />
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5" />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
            {error && (
              <div className="absolute top-3 right-0 translate-x-full ml-2 bg-red-500 text-white text-xs rounded-lg px-3 py-1 shadow-lg z-10">
                {error}
                <div className="absolute top-[0.8rem] -translate-y-1/2 -left-1 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-red-500"></div>
              </div>
            )}
          </div>


          <button
            type="submit"
            className="w-full bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md"
          >
            Restablecer contraseña
          </button>

        </form>
      </div>
    </div>
  );
};
