import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
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
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Nueva Pregunta</h2>
            <form onSubmit={crearPregunta}>
                <div className="mb-4">
                    <label className="block text-gray-700">Pregunta</label>
                    <input
                        type="text"
                        value={pregunta}
                        onChange={(e) => setPregunta(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Respuesta</label>
                    <textarea
                        value={respuesta}
                        onChange={(e) => setRespuesta(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    >
                        <option value="Habilitado">Habilitado</option>
                        <option value="Deshabilitado">Deshabilitado</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-lime-600 text-white p-2 rounded hover:bg-lime-700 transition duration-200">
                    Crear Pregunta
                </button>
            </form>
        </div>
    );
};
