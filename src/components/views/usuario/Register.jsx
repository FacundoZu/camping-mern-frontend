import React, { useState } from 'react';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { Link, useNavigate } from 'react-router-dom';
import { useErrorHandling } from '../../../hooks/useErrorHandling';
import useAuth from '../../../hooks/useAuth';
import { useForm } from '../../../hooks/useForm';
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash, FaTree, FaCampground, FaArrowLeft } from 'react-icons/fa';

export const Register = () => {
  const navigate = useNavigate();
  const { formulario, cambiado } = useForm({});
  const { setAuth } = useAuth();
  const { errores, mensajeError, manejarErrores, establecerMensajeError } = useErrorHandling();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    establecerMensajeError(null);

    if (manejarErrores(formulario)) {
      const nuevoUsuario = formulario;
      const { datos } = await Peticion(Global.url + "user/register", "POST", nuevoUsuario, false, 'include');

      if (datos.status === "success") {
        setAuth(datos.user);
        navigate('/');
      } else if (datos.status === "error" && datos.message === "El usuario ya existe") {
        establecerMensajeError("El usuario ya está registrado. Por favor, intenta con otro email.");
      } else {
        establecerMensajeError("Error al registrar el usuario. Inténtalo de nuevo más tarde.");
      }
    }
    setIsLoading(false);
  };

  const googleLogin = () => {
    window.open("http://localhost:3900/api/user/google", "_self");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="flex items-center justify-center min-h-screen sm:p-4 ">
        <div className="w-full p-4 sm:p-0 sm:max-w-2xl lg:max-w-6xl grid h-[80vh] lg:grid-cols-2 items-center bg-white rounded-3xl shadow-2xl border border-gray-100 animate-fade-in">
          {/* Panel lateral */}
          <div className="hidden lg:block relative w-full h-full">
            <img src="https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg" alt="" className="w-full h-full object-cover absolute top-0 left-0 rounded-l-3xl" />
            <div className="relative p-12 h-full">
              <div className="space-y-8 ">
                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaTree className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Camping Cachi</h2>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center">
                  <FaCampground className="w-12 h-12 text-lime-500" />
                </div>
              </div>
            </div>
          </div>
          {/* Formulario */}
          <div className="w-full relative max-w-md mx-auto">
          <Link to="/login" className="absolute -top-[6rem] w-10 h-10 bg-lime-600 hover:bg-lime-700 rounded-full flex items-center justify-center">
              <FaArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <form onSubmit={guardarUsuario} className="space-y-4">

              {/* Nombre + Teléfono */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    className="w-full px-4 py-3 pl-11 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50/50"
                    required
                    onChange={cambiado}
                  />
                  <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errores.name ? 'text-red-400' : 'text-lime-500 group-focus-within:text-lime-600'
                    }`} />
                  {errores.name && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[-105%] ml-2 bg-red-500 text-white text-xs rounded-lg px-3 py-1 shadow-lg z-10">
                      {errores.name}
                      <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-red-500"></div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    className="w-full px-4 py-3 pl-11 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50/50"
                    required
                    onChange={cambiado}
                  />
                  <FaPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errores.phone ? 'text-red-400' : 'text-lime-500 group-focus-within:text-lime-600'
                    }`} />
                  {errores.phone && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-2 bg-red-500 text-white text-xs rounded-lg px-3 py-1 shadow-lg">
                      {errores.phone}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-red-500"></div>
                    </div>
                  )}

                </div>
              </div>

              {/* Dirección */}
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  className="w-full px-4 py-3 pl-11 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50/50"
                  required
                  onChange={cambiado}
                />
                <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errores.address ? 'text-red-400' : 'text-lime-500 group-focus-within:text-lime-600'
                  }`} />
                {errores.address && <span className="error-msg">{errores.address}</span>}
              </div>

              {/* Email */}
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
                <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errores.email ? 'text-red-400' : 'text-lime-500 group-focus-within:text-lime-600'
                  }`} />
                {errores.email && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-2 bg-red-500 text-white text-xs rounded-lg px-3 py-1 shadow-lg">
                    {errores.email}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-red-500"></div>
                  </div>
                )}
              </div>

              {/* Contraseña + Confirmar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    className="w-full px-4 py-3 pl-11 pr-11 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50/50"
                    required
                    onChange={cambiado}
                  />
                  <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errores.password ? 'text-red-400' : 'text-lime-500 group-focus-within:text-lime-600'
                    }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errores.password && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[-105%] ml-2 bg-red-500 text-white text-xs rounded-lg px-3 py-1 shadow-lg z-10">
                      {errores.password}
                      <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-red-500"></div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="password2"
                    type={showPassword2 ? "text" : "password"}
                    name="password2"
                    placeholder="Confirmar"
                    className="w-full px-4 py-3 pl-11 pr-11 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50/50"
                    required
                    onChange={cambiado}
                  />
                  <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errores.password2 ? 'text-red-400' : 'text-lime-500 group-focus-within:text-lime-600'
                    }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500"
                  >
                    {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errores.password2 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-2 bg-red-500 text-white text-xs rounded-lg px-3 py-1 shadow-lg">
                      {errores.password2}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-red-500"></div>
                    </div>
                  )}
                </div>
              </div>

              {mensajeError && <div className="error-msg">{mensajeError}</div>}

              {/* Botón principal */}
              <button
                type="submit"
                className="mt-4 w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md"
              >
                {isLoading ? "Registrando..." : "Registrarse"}
              </button>
            </form>

            {/* Login con Google */}
            <div className="mt-4">
              <button
                onClick={googleLogin}
                className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 bg-white hover:bg-gray-100 transition"
              >
                <FcGoogle className="text-xl" />
                <span className="text-gray-700 font-medium">Continuar con Google</span>
              </button>
            </div>

            {/* Iniciar sesión */}
            <div className="text-center mt-4">
              <p className="text-gray-600">¿Ya tienes una cuenta?</p>
              <Link to='/login' className="text-lime-600 hover:underline font-medium">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
