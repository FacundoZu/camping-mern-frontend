import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import useAuth from '../../../../hooks/useAuth';

import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineDisabledByDefault, MdDelete } from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";

export const AdminCupones = () => {
    const { auth } = useAuth();
    const [cupones, setCupones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null });


    // Obtener todos los cupones
    useEffect(() => {
        const obtenerCupones = async () => {
            const url = `${Global.url}cupon`;
            const { datos } = await Peticion(url, "GET", null, false, "include");

            if (datos.length > 0) {
                setCupones(datos);
            } else {
                toast.error("Error al cargar los cupones");
            }
            setCargando(false);
        };
        obtenerCupones();
    }, []);

    const cambiarEstado = async (id, estadoActual) => {
        const nuevoEstado = !estadoActual; // Cambia el booleano
        const { datos } = await Peticion(`${Global.url}cupon/${id}`, "POST", null, false, "include");

        if (datos) {
            toast.success(datos.message);
            setCupones((prev) =>
                prev.map((cupon) =>
                    cupon._id === id ? { ...cupon, active: nuevoEstado } : cupon
                )
            );
        } else {
            toast.error("No se pudo cambiar el estado del cupón");
        }
    };

    const eliminarCupon = async () => {
        const id = modalEliminar.id;
        const { datos } = await Peticion(`${Global.url}cupon/${id}`, "DELETE", null, false, "include");

        if (datos.success) {
            toast.success("Cupón eliminado correctamente");
            setCupones((prev) => prev.filter((c) => c._id !== id));
        } else {
            toast.error("Error al eliminar el cupón");
        }

        setModalEliminar({ visible: false, id: null }); // cerrar modal
    };


    return (
        <motion.div
            className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl max-w-screen-xl mt-6 sm:mt-10 mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-3 gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
                    🎟️ Gestión de Cupones
                </h2>
                <Link
                    to="/admin/CrearCupon"
                    className="flex items-center justify-center px-4 py-2 bg-lime-600 text-white rounded-lg shadow hover:bg-lime-700 transition w-full sm:w-auto"
                >
                    <FiPlusCircle className="mr-2" size={20} />
                    Nuevo Cupón
                </Link>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-100 rounded-lg shadow-md text-sm sm:text-base">
                    <thead>
                        <tr className="text-left">
                            <th className="py-3 px-4">Código</th>
                            <th className="py-3 px-4">Descripción</th>
                            <th className="py-3 px-4">Descuento</th>
                            <th className="py-3 px-4">Usos res.</th>
                            <th className="py-3 px-4">Expira</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {cupones.map((cupon) => (
                                <motion.tr
                                    key={cupon._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white border-b hover:bg-gray-100 transition-colors"
                                >
                                    <td className="py-3 px-4 font-semibold text-gray-800">{cupon.code}</td>
                                    <td className="py-3 px-4 text-gray-600 truncate max-w-[180px]">
                                        {cupon.description || "—"}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">
                                        {cupon.discountType === "percentage"
                                            ? `${cupon.discountValue}%`
                                            : `$${cupon.discountValue}`}
                                    </td>
                                    <td className="py-3 px-4 text-center text-gray-700">{cupon.maxUses - cupon.usedCount}</td>
                                    <td className="py-3 px-4 text-gray-700">
                                        {new Date(cupon.expiresAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                            <button
                                                onClick={() => cambiarEstado(cupon._id, cupon.active)}
                                                className={`flex items-center justify-center text-white py-2 px-3 rounded transition duration-200 text-sm sm:text-base ${cupon.active === true
                                                    ? "bg-lime-500 hover:bg-lime-700"
                                                    : "bg-red-500 hover:bg-red-700"
                                                    }`}
                                            >
                                                {cupon.active === true ? (
                                                    <>
                                                        <FaRegCheckSquare className="mr-2" size={18} /> Habilitado
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdOutlineDisabledByDefault className="mr-2" size={18} /> Deshabilitado
                                                    </>
                                                )}
                                            </button>

                                            {auth.role === "admin" && (
                                                <button
                                                    onClick={() => setModalEliminar({ visible: true, id: cupon._id })}
                                                    title="Eliminar"
                                                    className="flex items-center text-white bg-gray-500 hover:bg-gray-700 py-2 px-3 rounded transition duration-200"
                                                >
                                                    <MdDelete size={18} />
                                                </button>

                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {cargando && <p className="text-center text-gray-500 mt-4">Cargando cupones...</p>}
            {!cargando && cupones.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No hay cupones disponibles.</p>
            )}

            <AnimatePresence>
                {modalEliminar.visible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white p-6 rounded-xl shadow-xl w-80 text-center"
                        >
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">Confirmar eliminación</h3>
                            <p className="text-gray-600 mb-6">¿Seguro que deseas eliminar este cupón?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={eliminarCupon}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => setModalEliminar({ visible: false, id: null })}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};
