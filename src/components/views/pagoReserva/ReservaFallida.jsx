import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';

const ReservaFallida = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cancelarReserva = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        const tempId = searchParams.get('external_reference');

        if (!paymentId || !tempId) {
          throw new Error('Faltan parámetros para confirmar la reserva');
        }

        const response = await Peticion(`${Global.url}reservation/confirmReservation`, 'POST', {
          tempId,
          paymentId
        });

        if (response.datos.status !== 'success') {
          throw new Error(response.datos.message || 'Error al confirmar reserva');
        }
      } catch (err) {
        throw new Error(err.message);
      }
    };

    cancelarReserva();
  }, []);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 px-4">
        <div className="w-full max-w-lg bg-white border border-red-100 rounded-2xl shadow-xl p-8">
          {/* Icono + título */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6 }}
            >
              <svg
                className="mx-auto h-20 w-20 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>

            <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
              Pago Rechazado
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              No pudimos procesar tu pago.
            </p>
          </div>

          {/* Mensaje */}
          <div className="mt-8 bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-700">
            ⚠️ Verifica los datos de tu método de pago o intenta con otro medio.
          </div>

          {/* Botones */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/#contacto")}
              className="w-full sm:w-auto px-5 py-3 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition-colors"
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

  export default ReservaFallida;
