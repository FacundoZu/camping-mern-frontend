import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reservasService } from "../../../../services/reservasService";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiEye } from "react-icons/fi";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { formatDate } from "../../../../helpers/ParseDate";

export const AdminReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtros, setFiltros] = useState({ estado: '', usuario: '' });
    const [pagina, setPagina] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const obtenerReservas = async () => {
            try {
                const datos = await reservasService.getAllReservations(pagina, filtros);

                if (datos && datos.reservations) {
                    setReservas(datos.reservations);
                    setTotalPages(datos.totalPages);
                } else {
                    toast.error("Error al cargar las reservas");
                }
            } catch (error) {
                toast.error("Error al cargar las reservas");
                console.error(error);
            } finally {
                setCargando(false);
            }
        };
        obtenerReservas();
    }, [pagina, filtros]);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
            setPagina(nuevaPagina);
        }
    };

    const manejarFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            [name]: value,
        }));
        setPagina(1); // Reset to first page when filtering
    };

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

    const formatearFecha = (fecha) => {
        if (!fecha) return "N/A";
        const fechaObj = new Date(fecha);
        return formatDate(fechaObj);
    };

    const obtenerNombreUsuario = (reserva) => {
        if (reserva.usuarioId) {
            return reserva.usuarioId.name || "Usuario";
        } else if (reserva.guestInfo) {
            const nombre = reserva.guestInfo.nombre || "";
            const apellido = reserva.guestInfo.apellido || "";
            return `${nombre} ${apellido}`.trim() || "Invitado";
        }
        return "Invitado";
    };

    return (
        <motion.div
            className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl max-w-screen-xl mt-6 sm:mt-10 mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-3 gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
                    📅 Gestión de Reservas
                </h2>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    name="usuario"
                    value={filtros.usuario}
                    onChange={manejarFiltro}
                    placeholder="Buscar por Usuario"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                />
                <select
                    name="estado"
                    value={filtros.estado}
                    onChange={manejarFiltro}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                >
                    <option value="">Todos los Estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="rechazada">Rechazada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                </select>
            </div>

            <div className="overflow-x-auto max-h-[600px] min-h-[600px]">
                <table className="w-full min-w-[600px] bg-gray-50 rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 text-left text-gray-700">Usuario</th>
                            <th className="py-3 px-4 text-left text-gray-700">Cabaña</th>
                            <th className="py-3 px-4 text-left text-gray-700">Fecha Inicio</th>
                            <th className="py-3 px-4 text-left text-gray-700">Fecha Final</th>
                            <th className="py-3 px-4 text-left text-gray-700">Precio Total</th>
                            <th className="py-3 px-4 text-center text-gray-700">Estado</th>
                            <th className="py-3 px-4 text-center text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {reservas.map((reserva) => (
                                <motion.tr
                                    key={reserva._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white border-b hover:bg-gray-100 transition-colors"
                                >
                                    <td className="py-3 px-4 text-gray-700">
                                        {obtenerNombreUsuario(reserva)}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">
                                        {reserva.cabaniaId?.nombre || "N/A"}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">
                                        {formatearFecha(reserva.fechaInicio)}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">
                                        {formatearFecha(reserva.fechaFinal)}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 font-semibold">
                                        ${reserva.precioTotal?.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadge(
                                                reserva.estadoReserva
                                            )}`}
                                        >
                                            {reserva.estadoReserva}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            to={`/admin/VerReserva/${reserva._id}`}
                                            className="inline-flex items-center justify-center text-white bg-lime-600 hover:bg-lime-700 p-2 rounded-lg transition-all"
                                            title="Ver Detalle"
                                        >
                                            <FiEye size={18} className="mr-1" />
                                            Ver Detalle
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                    onClick={() => cambiarPagina(pagina - 1)}
                    className="px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300 transition-all"
                    disabled={pagina === 1}
                >
                    <RiArrowLeftSLine size={20} />
                </button>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">
                    {pagina} de {totalPages}
                </span>
                <button
                    onClick={() => cambiarPagina(pagina + 1)}
                    className="px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition-all"
                    disabled={pagina === totalPages}
                >
                    <RiArrowRightSLine size={20} />
                </button>
            </div>

            {cargando && <p className="text-center text-gray-500 mt-4">Cargando reservas...</p>}
            {!cargando && reservas.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No hay reservas disponibles.</p>
            )}
        </motion.div>
    );
};

