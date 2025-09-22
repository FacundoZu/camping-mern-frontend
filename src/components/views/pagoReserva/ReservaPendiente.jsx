import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ReservaPendiente = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-yellow-50 px-4">
            <div className="w-full max-w-lg bg-white border border-yellow-100 rounded-2xl shadow-xl p-8">
                {/* Icono + título */}
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                    >
                        <svg
                            className="mx-auto h-20 w-20 text-yellow-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </motion.div>

                    <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Pago Pendiente
                    </h1>
                    <p className="mt-2 text-gray-600 text-lg">
                        Estamos procesando tu pago.
                    </p>
                </div>

                {/* Mensaje */}
                <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-800">
                    ⏳ Tu pago está siendo procesado. Te notificaremos por correo
                    electrónico cuando se complete.
                    <br />Este proceso puede tardar hasta <strong>24 horas</strong>.
                </div>

                {/* Botón */}
                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/#contacto")}
                        className="px-6 py-3 bg-yellow-500 text-white font-medium rounded-lg shadow hover:bg-yellow-600 transition-colors"
                    >
                        Contactar soporte
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full sm:w-auto px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg shadow hover:bg-gray-200 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservaPendiente;
