import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';

const ReservaFallida = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const actualizarReserva = async () => {
            try {
                // Actualizar estado de la reserva a "cancelada"
                await Peticion(`${Global.url}reservation/updateReservation/${id}`, "PUT", {
                    estadoReserva: 'cancelada'
                });

                const { datos } = await Peticion(`${Global.url}reservation/getReservation/${id}`, "GET");
                setReserva(datos.reserva);
            } catch (error) {
                console.error('Error al actualizar reserva:', error);
            } finally {
                setCargando(false);
            }
        };

        actualizarReserva();
    }, [id]);

    const reintentarPago = () => {
        navigate(`/cabaña/${reserva.cabaniaId._id}?checkIn=${reserva.fechaInicio}&checkOut=${reserva.fechaFinal}`);
    };

    if (cargando) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-4 text-lg">Procesando tu solicitud...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
                <div className="text-center mb-8">
                    <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Pago Rechazado</h1>
                    <p className="mt-2 text-lg text-gray-600">No pudimos procesar tu pago.</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la reserva</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Número de reserva:</span>
                            <span className="font-medium">{reserva._id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Cabaña:</span>
                            <span className="font-medium">{reserva.cabaniaId?.nombre || 'No disponible'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-medium">${reserva.precioTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                    <p className="text-gray-600 mb-4">
                        Por favor, verifica los datos de tu método de pago o intenta con otro medio de pago.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={reintentarPago}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Reintentar pago
                        </button>
                        <button
                            onClick={() => navigate('/contacto')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Contactar soporte
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservaFallida;