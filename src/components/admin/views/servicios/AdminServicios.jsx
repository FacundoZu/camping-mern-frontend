import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
import { AnimatePresence, motion } from 'framer-motion';

import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineDisabledByDefault } from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";



export const AdminServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerServicios = async () => {
            let url = `${Global.url}service/getAllServices`;
            const { datos } = await Peticion(url, "GET", null, false, 'include');

            if (datos.success) {
                setServicios(datos.services);
                setCargando(false);
            }
        };
        obtenerServicios();
    }, []);

    const cambiarEstado = async (id, estadoActual) => {
        let url = Global.url + `service/cambiarEstado/${id}`;

        const nuevoEstado = estadoActual === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';

        const { datos } = await Peticion(url, "PUT", { estado: nuevoEstado }, false, 'include');

        if (datos && datos.status === 'success') {
            setServicios((prevServicios) =>
                prevServicios.map((servicio) =>
                    servicio._id === id ? { ...servicio, estado: datos.service.estado } : servicio
                )
            );
        } else {
            console.error("No se pudo actualizar el estado del servicio");
        }
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
                    📊 Gestión de Servicios
                </h2>
                <Link
                    to='/admin/CrearServicio'
                    className="flex items-center justify-center px-4 py-2 bg-lime-600 text-white rounded-lg shadow hover:bg-lime-700 transition w-full sm:w-auto"
                >
                    <FiPlusCircle className="mr-2" size={20} />
                    Nuevo Servicio
                </Link>
            </div>

            {/* Tabla responsive */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-100 rounded-lg shadow-md text-sm sm:text-base">
                    <thead>
                        <tr className="text-left">
                            <th className="py-3 px-4">Nombre</th>
                            <th className="py-3 px-4">Descripción</th>
                            <th className="py-3 px-4">Imagen</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {servicios.map((servicio) => (
                                <motion.tr
                                    key={servicio._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white border-b hover:bg-gray-100 transition-colors"
                                >
                                    <td className="py-3 px-4 text-gray-700">{servicio.nombre}</td>
                                    <td className="py-3 px-4 text-gray-600 truncate max-w-[150px] sm:max-w-xs">{servicio.descripcion}</td>
                                    <td className="py-3 px-4">
                                        <img
                                            src={servicio.imagen}
                                            alt={servicio.nombre}
                                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded mx-auto"
                                        />
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                            <Link
                                                to={`/admin/EditarServicio/${servicio._id}`}
                                                title="Editar"
                                                className="flex items-center text-gray-700 py-2 px-2 rounded-full hover:bg-gray-300 transition duration-200"
                                            >
                                                <MdModeEdit size={20} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    servicio.estado !== 'Habilitado'
                                                        ? cambiarEstado(servicio._id, 'Deshabilitado')
                                                        : cambiarEstado(servicio._id, 'Habilitado')
                                                }
                                                className={`flex items-center justify-center text-white py-2 px-3 rounded transition duration-200 text-sm sm:text-base ${servicio.estado === 'Habilitado'
                                                    ? 'bg-lime-500 hover:bg-lime-700'
                                                    : 'bg-red-500 hover:bg-red-700'
                                                    }`}
                                            >
                                                {servicio.estado === 'Habilitado' ? (
                                                    <>
                                                        <FaRegCheckSquare className="mr-2" size={18} /> Habilitado
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdOutlineDisabledByDefault className="mr-2" size={18} /> Deshabilitado
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {cargando && <p className="text-center text-gray-500 mt-4">Cargando servicios...</p>}
        </motion.div>
    );

};
