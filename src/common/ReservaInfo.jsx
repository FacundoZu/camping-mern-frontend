import React, { useState } from 'react';
import { Peticion } from '../helpers/Peticion';
import { Global } from '../helpers/Global';

const ReservaInfo = ({
    isOpen,
    onClose,
    cabaña,
    auth,
    fechaInicio,
    fechaFinal,
    precioTotal
}) => {
    const [guestInfo, setGuestInfo] = useState({
        nombre: auth?.name || '',
        email: auth?.email || '',
        telefono: auth?.phone || ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const cantidadDeDias = Math.ceil((new Date(fechaFinal) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24) + 1);
    const precioPorDia = precioTotal / cantidadDeDias;
    const isGuest = !auth;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!guestInfo.nombre.trim()) return 'Por favor ingresa tu nombre completo';
        if (!guestInfo.email.trim()) return 'Por favor ingresa tu email';
        if (!emailRegex.test(guestInfo.email)) return 'Por favor ingresa un email válido';
        if (!guestInfo.telefono.trim()) return 'Por favor ingresa tu número de teléfono';
        return null;
    };

    const handlePayment = async () => {
        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Crear reserva temporal
            const reservaResponse = await Peticion(`${Global.url}reservation/tempReservation`, 'POST', {
                cabaniaId: cabaña._id,
                fechaInicio,
                fechaFinal,
                precioTotal,
                guestInfo: isGuest ? guestInfo : null
            });

            if (reservaResponse.datos.status !== 'success') {
                throw new Error(reservaResponse.datos.message || 'Error al crear reserva temporal');
            }

            // 2. Crear preferencia de pago
            const mpResponse = await Peticion(`${Global.url}MP/create-preference`, 'POST', {
                items: [{
                    title: `Reserva en ${cabaña.nombre}`,
                    unit_price: precioTotal,
                    quantity: 1,
                    currency_id: 'ARS'
                }],
                payer: {
                    name: guestInfo.nombre,
                    email: guestInfo.email,
                    phone: { number: guestInfo.telefono.replace(/\D/g, '').slice(-10) }
                },
                back_urls: {
                    success: `${window.location.origin}/reserva-exitosa`,
                    failure: `${window.location.origin}/reserva-fallida`,
                    pending: `${window.location.origin}/reserva-pendiente`
                },
                external_reference: reservaResponse.datos.tempId,
                auto_return: "approved"
            });

            if (mpResponse.datos?.init_point) {
                window.location.href = mpResponse.datos.init_point;
            } else {
                throw new Error('No se recibió URL de pago de Mercado Pago');
            }
        } catch (error) {
            console.error('Error en el proceso de pago:', error);
            alert(`Error: ${error.message}`);
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Reserva</h2>

                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">{cabaña.nombre}</h3>

                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span>Check-in:</span>
                            <span>{new Date(fechaInicio).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Check-out:</span>
                            <span>{new Date(fechaFinal).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Días:</span>
                            <span>{cantidadDeDias}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Precio por día:</span>
                            <span>${precioPorDia.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span className="text-green-600">${precioTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {isGuest && (
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Nombre completo</label>
                            <input
                                type="text"
                                name="nombre"
                                value={guestInfo.nombre}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={guestInfo.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={guestInfo.telefono}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <div className="flex items-center">
                        <img
                            src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadopago/logo__small@2x.png"
                            alt="Mercado Pago"
                            className="h-8 mr-3"
                        />
                        <p className="text-sm text-gray-700">
                            Serás redirigido a Mercado Pago para completar el pago de manera segura.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full py-3 rounded-lg font-medium ${isProcessing ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                    {isProcessing ? 'Procesando...' : 'Pagar con Mercado Pago'}
                </button>
            </div>
        </div>
    );
};

export default ReservaInfo;