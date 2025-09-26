import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
import { motion } from "framer-motion"
import { toast } from 'react-toastify';

export const AdminCrearPregunta = () => {
    const [pregunta, setPregunta] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [estado, setEstado] = useState("Deshabilitado");
    const navigate = useNavigate();

    const crearPregunta = async (e) => {
        e.preventDefault();

        const datosPregunta = { pregunta, respuesta, estado };
        const url = `${Global.url}question/createQuestion`;
        const { datos } = await Peticion(url, "POST", datosPregunta, false, 'include');
        console.log(datos)
        if (datos.status == 'success') {
            toast.success(datos.message);
            navigate("/admin/preguntas");
        } else {
            toast.error(datos.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[100dvh] p-6">
            <motion.div
                className="p-6 bg-white rounded-lg shadow-lg w-full sm:w-1/2 md:w-2/3 lg:w-1/2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Nueva Pregunta</h2>
                <form onSubmit={crearPregunta}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Pregunta</label>
                        <input
                            type="text"
                            value={pregunta}
                            onChange={(e) => setPregunta(e.target.value)}
                            className="create-edit-input-button"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Respuesta</label>
                        <textarea
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                            className="create-edit-input-button"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Estado</label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="create-edit-input-button"
                            required
                        >
                            <option value="Habilitado">Habilitado</option>
                            <option value="Deshabilitado">Deshabilitado</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-lime-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-lime-700 transition"
                        >
                            Crear Pregunta
                        </motion.button>
                        <Link
                            to={"/admin/preguntas"}
                            className="text-lime-600 font-medium hover:underline"
                        >
                            Volver
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
