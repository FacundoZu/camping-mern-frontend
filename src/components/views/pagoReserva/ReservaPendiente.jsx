import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';

const ReservaPendiente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerReserva = async () => {
            try {
                const { datos } = await Peticion(`${Global.url}reservation/getReservation/${id}`, "GET");

                if (datos.status === "success") {
                    setReserva(datos.reserva);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error al obtener reserva:', error);
                navigate('/');
            } finally {
                setCargando(false);
            }
        };

        obtenerReserva();
    }, [id, navigate]);

    if (cargando) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-4 text-lg">Verificando estado de tu pago...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
                <div className="text-center mb-8">
                    <svg className="mx-auto h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Pago Pendiente</h1>
                    <p className="mt-2 text-lg text-gray-600">Estamos procesando tu pago.</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de tu reserva</h2>

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
                        Tu pago está siendo procesado. Te notificaremos por correo electrónico cuando se complete.
                        Este proceso puede tardar hasta 24 horas.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={() => navigate(`/reserva/${id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Ver estado de reserva
                        </button>
                        <button
                            onClick={() => navigate('/contacto')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Contactar soporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservaPendiente;