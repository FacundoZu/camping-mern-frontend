import React, { useState, useEffect } from 'react';
import { Peticion } from '../helpers/Peticion';
import { Global } from '../helpers/Global';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaHome,
    FaCheckCircle,
    FaShieldAlt,
    FaTimes,
    FaCreditCard,
    FaLock
} from 'react-icons/fa';
import {
    BsCurrencyDollar,
    BsCalendar2Check,
    BsPersonFill,
    BsClock
} from 'react-icons/bs';

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
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1); // 1: Info, 2: Payment
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
            setStep(1);
            setErrors({});
        }, 300);
    };

    if (!isOpen) return null;

    const cantidadDeDias = Math.ceil((new Date(fechaFinal) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)) + 1;
    const precioPorDia = precioTotal / cantidadDeDias;
    const isGuest = !auth;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({ ...prev, [name]: value }));

        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;

        if (!guestInfo.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (guestInfo.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!guestInfo.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(guestInfo.email)) {
            newErrors.email = 'Por favor ingresa un email válido';
        }

        if (!guestInfo.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!phoneRegex.test(guestInfo.telefono)) {
            newErrors.telefono = 'Por favor ingresa un número de teléfono válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (isGuest) {
            if (validateForm()) {
                setStep(2);
            }
        } else {
            setStep(2);
        }
    };

    const handlePayment = async () => {
        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }
    
        setIsProcessing(true);
    
        try {
            // 1. Crear reserva temporal en el backend
            const reservaResponse = await Peticion(`${Global.url}reservation/tempReservation`, 'POST', {
                cabaniaId: cabaña._id,
                fechaInicio,
                fechaFinal,
                precioTotal,
                guestInfo: isGuest ? guestInfo : null
            });
    
            if (reservaResponse.datos.status !== "success") {
                throw new Error(reservaResponse.datos.message || "Error al crear reserva temporal");
            }
    
            const tempId = reservaResponse.datos.tempId;
    
            // 2. Crear preferencia de pago en el backend
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
                    success: `http://localhost:5173/reserva-exitosa`,
                    failure: `http://localhost:5173/reserva-fallida`,
                    pending: `http://localhost:5173/reserva-pendiente`
                },
                external_reference: tempId
            });
    
            // 3. Si Mercado Pago devolvió la URL de pago → abrir en nueva pestaña
            if (mpResponse.datos.init_point) {
                window.open(mpResponse.datos.init_point, "_blank");
    
                // 4. Iniciar polling para verificar el estado del pago
                let attempts = 0; // para evitar bucles infinitos
                const interval = setInterval(async () => {
                    try {
                        attempts++;
    
                        const statusResponse = await Peticion(`${Global.url}MP/status/${tempId}`, "GET");
                        console.log(statusResponse);
                        if (statusResponse.status === "success") {
                            if (statusResponse.estado === "approved") {
                                clearInterval(interval);
                                setIsProcessing(false);
                                window.location.href = "/reserva-exitosa";
                            } else if (statusResponse.estado === "rejected") {
                                clearInterval(interval);
                                setIsProcessing(false);
                                window.location.href = "/reserva-fallida";
                            }
                        }
    
                        // Si pasaron 20 intentos (~1 min) y no hay respuesta, cancelamos
                        if (attempts >= 20) {
                            clearInterval(interval);
                            setIsProcessing(false);
                            alert("El pago aún está pendiente. Verifica tu email o vuelve más tarde.");
                            window.location.href = "/";
                        }
                    } catch (err) {
                        console.error("Error consultando estado de pago:", err);
                    }
                }, 3000); // Cada 3 segundos
    
            } else {
                throw new Error("No se recibió URL de pago de Mercado Pago");
            }
    
        } catch (error) {
            console.error("Error en el proceso de pago:", error);
            alert(`Error: ${error.message}`);
            setIsProcessing(false);
        }
    };
    

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHome className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirma tu reserva</h2>
                <p className="text-gray-600">Revisa los detalles antes de proceder al pago</p>
            </div>

            {/* Información de la cabaña */}
            <div className="bg-gradient-to-r from-lime-50 to-green-50 border border-lime-200 rounded-2xl p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <FaHome className="text-lime-600" />
                    {cabaña.nombre || cabaña.descripcion}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <BsCalendar2Check className="text-lime-600 text-lg" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Check-in</p>
                                <p className="text-gray-900 capitalize text-sm">
                                    {formatDate(fechaInicio)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <BsCalendar2Check className="text-lime-600 text-lg" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Check-out</p>
                                <p className="text-gray-900 capitalize text-sm">
                                    {formatDate(fechaFinal)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desglose de precios */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <BsCurrencyDollar className="text-lime-600" />
                    Precios
                </h4>

                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700 flex items-center gap-2">
                            <BsClock className="text-sm text-gray-400" />
                            {cantidadDeDias} {cantidadDeDias === 1 ? 'día' : 'días'} × ${precioPorDia.toFixed(0)}
                        </span>
                        <span className="font-medium text-gray-900">
                            ${precioTotal.toLocaleString()}
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-lime-600">
                                ${precioTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario para invitados */}
            {isGuest && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <BsPersonFill className="text-lime-600" />
                        Información del huésped
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Nombre completo *
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="nombre"
                                    value={guestInfo.nombre}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all ${errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Ingresa tu nombre completo"
                                />
                                {errors.nombre && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <FaTimes className="text-xs" />
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Correo electrónico *
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={guestInfo.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <FaTimes className="text-xs" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Número de teléfono *
                            </label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={guestInfo.telefono}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all ${errors.telefono ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="+54 9 11 1234-5678"
                                />
                                {errors.telefono && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <FaTimes className="text-xs" />
                                        {errors.telefono}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón continuar */}
            <div className="pt-4">
                <button
                    onClick={handleNextStep}
                    className="botton-submit"
                >
                    Continuar con el pago
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCreditCard className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago seguro</h2>
                <p className="text-gray-600">Completa tu reserva con Mercado Pago</p>
            </div>

            {/* Resumen de la reserva */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4">Resumen de tu reserva</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Cabaña:</span>
                        <span className="font-medium text-gray-900">{cabaña.nombre || cabaña.descripcion}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Fechas:</span>
                        <span className="font-medium text-gray-900">
                            {cantidadDeDias} {cantidadDeDias === 1 ? 'día' : 'días'}
                        </span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-3">
                        <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total a pagar:</span>
                            <span className="text-xl font-bold text-lime-600">
                                ${precioTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de Mercado Pago */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <img
                        src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadopago/logo__small@2x.png"
                        alt="Mercado Pago"
                        className="h-10 flex-shrink-0"
                    />
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Pago 100% seguro</h4>
                        <p className="text-sm text-gray-700 mb-3">
                            Serás redirigido a Mercado Pago para completar tu pago de manera segura.
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                                <FaShieldAlt className="text-green-500" />
                                <span>Pago seguro</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaLock className="text-green-500" />
                                <span>Datos protegidos</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaCheckCircle className="text-green-500" />
                                <span>Múltiples métodos de pago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
                <button
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                    Volver
                </button>
                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ flex: 2 }}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                        </>
                    ) : (
                        <>
                            <FaCreditCard />
                            Pagar con Mercado Pago
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className={`bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}>
                {/* Header con botón cerrar */}
                <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-lime-500' : 'bg-gray-300'}`}></div>
                            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <span className="text-sm text-gray-600">Paso {step} de 2</span>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isProcessing}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:cursor-not-allowed"
                    >
                        <FaTimes className="text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6">
                    {step === 1 ? renderStep1() : renderStep2()}
                </div>
            </div>
        </div>
    );
};

export default ReservaInfo;