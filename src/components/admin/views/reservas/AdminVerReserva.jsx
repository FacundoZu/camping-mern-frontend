import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reservasService } from "../../../../services/reservasService";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiArrowLeft, FiCalendar, FiDollarSign, FiUser, FiHome, FiCreditCard } from "react-icons/fi";
import { formatDate } from "../../../../helpers/ParseDate";

const AdminVerReserva = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerReserva = async () => {
            try {
                const datos = await reservasService.getReservationById(id);

                if (datos && datos.reserva) {
                    setReserva(datos.reserva);
                } else {
                    toast.error("No se encontró la reserva");
                    navigate("/admin/reservas");
                }
            } catch (error) {
                toast.error("Error al cargar la reserva");
                console.error(error);
                navigate("/admin/reservas");
            } finally {
                setCargando(false);
            }
        };
        obtenerReserva();
    }, [id, navigate]);

    const getEstadoBadge = (estado) => {
        const estados = {
            pendiente: "bg-yellow-100 text-yellow-700",
            confirmada: "bg-green-100 text-green-700",
            rechazada: "bg-red-100 text-red-700",
            completada: "bg-blue-100 text-blue-700",
            cancelada: "bg-gray-100 text-gray-700"
        };
        return estados[estado] || "bg-gray-100 text-gray-700";
    };

    if (cargando) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-600">Cargando reserva...</p>
            </div>
        );
    }

    if (!reserva) {
        return null;
    }

    const usuario = reserva.usuarioId || reserva.guestInfo;
    const nombreUsuario = reserva.usuarioId
        ? reserva.usuarioId.name
        : `${reserva.guestInfo?.nombre} ${reserva.guestInfo?.apellido}`;
    const emailUsuario = reserva.usuarioId
        ? reserva.usuarioId.email
        : reserva.guestInfo?.email;
    const telefonoUsuario = reserva.usuarioId
        ? reserva.usuarioId.telefono
        : reserva.guestInfo?.telefono;

    return (
        <motion.div
            className="p-6 bg-white rounded-2xl shadow-xl max-w-4xl mx-auto mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-800">Detalle de Reserva</h2>
                <button
                    onClick={() => navigate("/admin/reservas")}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
                >
                    <FiArrowLeft size={20} />
                    Volver
                </button>
            </div>

            {/* Estado */}
            <div className="mb-6">
                <span
                    className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getEstadoBadge(
                        reserva.estadoReserva
                    )}`}
                >
                    Estado: {reserva.estadoReserva.toUpperCase()}
                </span>
            </div>

            {/* Información en Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Usuario */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <FiUser className="text-lime-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-800">Información del Usuario</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Nombre:</span> {nombreUsuario}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Email:</span> {emailUsuario || "N/A"}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Teléfono:</span> {telefonoUsuario || "N/A"}
                        </p>
                        {reserva.guestInfo?.documento && (
                            <p className="text-gray-700">
                                <span className="font-medium">Documento:</span> {reserva.guestInfo.documento}
                            </p>
                        )}
                    </div>
                </div>

                {/* Cabaña */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <FiHome className="text-lime-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-800">Información de la Cabaña</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Nombre:</span> {reserva.cabaniaId?.nombre || "N/A"}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Capacidad:</span> {reserva.cabaniaId?.cantidadPersonas || "N/A"} personas
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Precio por noche:</span> ${reserva.cabaniaId?.precio?.toLocaleString() || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Fechas */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <FiCalendar className="text-lime-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-800">Fechas de Reserva</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Fecha Inicio:</span> {formatDate(new Date(reserva.fechaInicio))}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Fecha Final:</span> {formatDate(new Date(reserva.fechaFinal))}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Creada:</span> {formatDate(new Date(reserva.createdAt))}
                        </p>
                    </div>
                </div>

                {/* Pago */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <FiDollarSign className="text-lime-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-800">Información de Pago</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Precio Total:</span> ${reserva.precioTotal?.toLocaleString()}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Método de Pago:</span> {reserva.metodoPago || "N/A"}
                        </p>
                        {reserva.paymentId && (
                            <p className="text-gray-700">
                                <span className="font-medium">ID de Pago:</span> {reserva.paymentId}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Detalles de Pago (si existen) */}
            {reserva.paymentDetails && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <FiCreditCard className="text-lime-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-800">Detalles del Pago</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Estado del Pago:</span> {reserva.paymentDetails.status || "N/A"}
                        </p>
                        {reserva.paymentDetails.payment_method_id && (
                            <p className="text-gray-700">
                                <span className="font-medium">Método:</span> {reserva.paymentDetails.payment_method_id}
                            </p>
                        )}
                        {reserva.paymentDetails.transaction_amount && (
                            <p className="text-gray-700">
                                <span className="font-medium">Monto:</span> ${reserva.paymentDetails.transaction_amount}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AdminVerReserva;
