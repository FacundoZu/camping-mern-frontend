import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
import { motion } from "framer-motion"

import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineDisabledByDefault } from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";


export const AdminPreguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerPreguntas = async () => {
            const { datos } = await Peticion(Global.url + 'question/getAllQuestions', "GET", null, false, 'include');

            if (datos.status == 'success') {
                setPreguntas(datos.preguntas);
                setCargando(false);
            }
        };
        obtenerPreguntas();
    }, []);

    const cambiarEstado = async (id, estadoActual) => {
        let url = Global.url + `question/cambiarEstado/${id}`;
        const nuevoEstado = estadoActual === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';

        const { datos } = await Peticion(url, "PUT", { estado: nuevoEstado }, false, 'include');

        if (datos && datos.status === 'success') {
            setPreguntas((prevPreguntas) =>
                prevPreguntas.map((pregunta) =>
                    pregunta._id === id ? { ...pregunta, estado: datos.question.estado } : pregunta
                )
            );
        } else {
            console.error("No se pudo actualizar el estado de la pregunta");
        }
    };

    return (
        <motion.div
            className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl max-w-screen-xl mx-auto mt-6 sm:mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-3 gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
                    ❔Gestión de Preguntas
                </h2>
                <Link
                    to="/admin/CrearPregunta"
                    className="flex items-center justify-center px-4 py-2 bg-lime-600 text-white rounded-lg shadow hover:bg-lime-700 transition w-full sm:w-auto"
                >
                    <FiPlusCircle className="mr-2" size={20} />
                    Nueva Pregunta
                </Link>
            </div>

            {/* Tabla responsive */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-100 rounded-lg shadow-md text-sm sm:text-base">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left">Pregunta</th>
                            <th className="py-3 px-4 text-left">Respuesta</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {preguntas.map((pregunta) => (
                            <tr
                                key={pregunta._id}
                                className="bg-white border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4 text-gray-700">{pregunta.pregunta}</td>
                                <td className="py-3 px-4 text-gray-600 truncate max-w-[150px] sm:max-w-xs">
                                    {pregunta.respuesta}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                        {/* Botón editar */}
                                        <Link
                                            to={`/admin/EditarPregunta/${pregunta._id}`}
                                            className="flex items-center text-gray-700 py-2 px-3 rounded-full hover:bg-gray-200 transition duration-200"
                                            title="Editar"
                                        >
                                            <MdModeEdit size={20} />
                                        </Link>

                                        {/* Botón habilitar/deshabilitar */}
                                        <button
                                            onClick={() =>
                                                cambiarEstado(pregunta._id, pregunta.estado)
                                            }
                                            className={`flex items-center justify-center text-white py-2 px-3 rounded transition duration-200 text-sm sm:text-base ${pregunta.estado === "Habilitado"
                                                ? "bg-lime-500 hover:bg-lime-700"
                                                : "bg-red-600 hover:bg-red-700"
                                                }`}
                                        >
                                            {pregunta.estado === "Habilitado" ? (
                                                <>
                                                    <FaRegCheckSquare
                                                        className="mr-2"
                                                        size={18}
                                                    />{" "}
                                                    Habilitada
                                                </>
                                            ) : (
                                                <>
                                                    <MdOutlineDisabledByDefault
                                                        className="mr-2"
                                                        size={18}
                                                    />{" "}
                                                    Deshabilitada
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {cargando && (
                <p className="text-center text-gray-500 mt-4">
                    Cargando preguntas...
                </p>
            )}
        </motion.div>
    );

};
