import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';

import { FaRegCheckCircle, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { toast } from 'react-toastify';

const ReservaExitosa = () => {
  const [searchParams] = useSearchParams();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmarReserva = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        const tempId = searchParams.get('external_reference');

        if (!paymentId || !tempId) {
          toast.error('Faltan parámetros para confirmar la reserva');
          return;
        }

        const response = await Peticion(`${Global.url}reservation/confirmReservation`, 'POST', {
          tempId,
          paymentId
        });

        if (response.datos.status === 'success') {
          setReserva(response.datos.reserva);
        } else {
          toast.error(response.datos.mensaje || 'Error al confirmar reserva');
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    confirmarReserva();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Procesando tu reserva</h2>
        <p className="text-gray-600">Estamos confirmando los detalles, por favor espera...</p>
      </div>
    </div>
  );

  if (!reserva) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <MdErrorOutline className="h-12 w-12 text-red-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error en la reserva</h2>
        <p className="text-red-500 mb-4">Error al confirmar reserva</p>
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center mx-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
        >
          <FaArrowLeft className='mr-2' />
          <p>
                Volver al inicio
              </p>
            </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-lime-500  px-4 py-6 text-center">
            <FaRegCheckCircle className="h-14 w-14 mx-auto text-white my-4 animate-bounce" />
            <h1 className="text-3xl font-bold text-white mb-2">¡Reserva Confirmada!</h1>
            <p className="text-green-100">Recibirás un correo electrónico con los detalles de tu reserva</p>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className=" p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Fechas de estadía</h3>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600">
                    <FaCalendarAlt className="h-5 w-5 mr-2 text-lime-500" />
                    <span className="font-medium mr-2">Check-in:</span>
                    <span>
                      {new Date(reserva.fechaInicio).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaCalendarAlt className="h-5 w-5 mr-2 text-lime-500" />
                    <span className="font-medium mr-2">Check-out:</span>
                    <span>
                      {new Date(reserva.fechaFinal).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </p>

                  <p className="flex items-center text-gray-600">
                    <IoHome className="h-5 w-5 mr-2 text-lime-500" />
                    <span className='font-medium'>
                      {reserva.paymentDetails?.description ? reserva.paymentDetails.description : 'Cabaña'}
                    </span>
                  </p>
                </div>
              </div>

              <div className=" p-4 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Información de pago</h3>
                <div className="space-y-2">
                  <p className="flex justify-between items-center text-gray-600">
                    <span className="font-medium">Total pagado:</span>
                    <span className="text-xl font-bold text-lime-600">${reserva.precioTotal.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between items-center text-gray-600">
                    <span className="font-medium">Código de reserva:</span>
                    <span className="font-mono bg-gray-200 px-2 py-1 rounded">{reserva._id}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border border-blue-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">¿Qué hacer ahora?</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Revisa tu correo electrónico para encontrar los detalles de tu reserva</li>
                <li>Guarda este código de reserva para futuras consultas</li>
                <li>Contáctanos si necesitas hacer cambios en tu reserva</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center">

            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center mx-auto px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition duration-200"
            >
              <FaArrowLeft className='mr-2' />
              <p>
                Volver al inicio
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaExitosa;