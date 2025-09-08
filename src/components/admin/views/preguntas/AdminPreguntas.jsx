import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
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
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Preguntas</h2>
                <Link
                    to='/admin/CrearPregunta'
                    className="px-4 py-2 flex items-center bg-lime-600 text-white rounded hover:bg-lime-700 transition duration-200"
                >
                    <FiPlusCircle className="mr-2" size={20} />
                    Nueva Pregunta
                </Link>
            </div>
            <table className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <thead>
                    <tr className="text-left">
                        <th className="py-3 px-4">Pregunta</th>
                        <th className="py-3 px-4">Respuesta</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {preguntas.map((pregunta) => (
                        <tr key={pregunta._id} className="bg-white border-b hover:bg-gray-100 transition duration-200">
                            <td className="py-3 px-4 text-gray-700">{pregunta.pregunta}</td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{pregunta.respuesta}</td>
                            <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center">
                                    <Link to={`/admin/EditarPregunta/${pregunta._id}`} className="flex items-center text-gray-700 py-2 px-2 rounded-full hover:bg-gray-300 mr-2 transition duration-200">
                                        <MdModeEdit size={20} />
                                    </Link>
                                    <button
                                        onClick={() => cambiarEstado(pregunta._id, pregunta.estado)}
                                        className={`flex items-center bg-lime-600 text-white py-2 px-2 rounded hover:bg-lime-700 mr-4 transition duration-200 ${pregunta.estado === 'Habilitado'
                                            ? 'bg-red-500 hover:bg-red-700'
                                            : 'bg-lime-600 hover:bg-lime-700'
                                            } transition duration-200`}
                                    >
                                        {pregunta.estado === 'Habilitado' ? (
                                            <>
                                                <MdOutlineDisabledByDefault className="mr-2" size={20} /> Deshabilitar
                                            </>
                                        ) : (
                                            <>
                                                <FaRegCheckSquare className="mr-2" size={20} /> Habilitar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {cargando && <p className="text-center text-gray-500 mt-4">Cargando preguntas...</p>}
        </div>
    );
};
