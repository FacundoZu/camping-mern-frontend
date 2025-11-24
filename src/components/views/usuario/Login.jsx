import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Peticion } from "../../../helpers/Peticion";
import { Global } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";
import useAuth from "../../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTree, FaCampground, FaArrowLeft } from "react-icons/fa";

export const Login = () => {
  const navigate = useNavigate();
  const { formulario, cambiado } = useForm({});
  const [mensajeError, setMensajeError] = useState(null);
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const googleLogin = () => {
    window.open("http://localhost:3900/api/user/google", "_self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setIsLoading(true);

    const { datos } = await Peticion(Global.url + "user/login", "POST", formulario, false, "include");

    if (datos.status === "success") {
      setAuth(datos.user);
      navigate("/");
    } else {
      setMensajeError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="flex items-center justify-center min-h-screen sm:p-4">
        <div className="w-full p-4 sm:p-0 sm:max-w-2xl lg:max-w-6xl grid h-[80vh] lg:grid-cols-2 items-center bg-white rounded-3xl shadow-2xl border border-gray-100 animate-fade-in">

          {/* Formulario */}
          <div className="relative">
            <Link to="/" className="absolute -top-[2rem] left-[4.2rem] w-10 h-10 bg-lime-600 hover:bg-lime-700 rounded-full flex items-center justify-center">
              <FaArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div className="w-full max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 text-center">Iniciar sesión</h1>
              <p className="text-gray-500 text-center mb-6">
                Ingresa tus datos para acceder a tu cuenta.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lime-500" />
                </div>

                {/* Password */}
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
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lime-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Mensaje de error */}
                {mensajeError && (
                  <div className="bg-red-100 text-red-600 text-sm rounded-lg px-3 py-2 shadow-md">
                    {mensajeError}
                  </div>
                )}

                {/* Botón iniciar sesión */}
                <button
                  type="submit"
                  className="mt-4 w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md"
                >
                  {isLoading ? "Iniciando..." : "Iniciar sesión"}
                </button>
              </form>

              {/* Botón Google */}
              <div className="mt-4">
                <button
                  onClick={googleLogin}
                  className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 bg-white hover:bg-gray-100 transition"
                >
                  <FcGoogle className="text-xl" />
                  <span className="text-gray-700 font-medium">Continuar con Google</span>
                </button>
              </div>

              {/* Link crear cuenta */}
              <div className="text-center mt-4">
                <p className="text-gray-600">¿No tienes una cuenta?</p>
                <Link to="/register" className="text-lime-600 hover:underline font-medium">
                  Crear una cuenta
                </Link>
              </div>

              {/* Olvidé mi contraseña */}
              <div className="text-center mt-2">
                <Link to="/resetpassword" className="text-lime-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

          </div>
          {/* Panel lateral con imagen */}
          <div className="hidden lg:block relative w-full h-full">
            <img
              src="src/assets/login.webp"
              alt="Camping"
              className="w-full h-full object-cover absolute top-0 left-0 rounded-r-3xl"
            />
            <div className="relative p-12 h-full">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaTree className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Camping Cachi</h2>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center">
                  <FaCampground className="w-12 h-12 text-lime-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
