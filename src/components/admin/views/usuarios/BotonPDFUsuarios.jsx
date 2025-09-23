import React, { useState } from 'react';
import { FaRegFilePdf } from 'react-icons/fa6';
import { Peticion } from '../../../../helpers/Peticion';
import { Global } from '../../../../helpers/Global';
import { generarPDFUsuarios } from './pdfUsuarios';

export const BotonPDFUsuarios = ({ filtros = {}, sortRole = 'asc' }) => {
    const [cargando, setCargando] = useState(false);

    const handleClick = async () => {
        setCargando(true);
        try {
            let url = `${Global.url}user/getAllUsers?limit=1000`;

            // Aplicar filtros
            if (filtros.name) url += `&name=${filtros.name}`;
            if (filtros.email) url += `&email=${filtros.email}`;
            if (sortRole) url += `&sortRole=${sortRole}`;

            const { datos } = await Peticion(url, 'GET', null, false, 'include');

            if (datos.status === 'success') {
                generarPDFUsuarios(datos.users, 'Lista de Usuarios');
            } else {
                console.error('Error al obtener los usuarios para el PDF');
            }
        } catch (err) {
            console.error('Error al generar el PDF:', err);
        } finally {
            setCargando(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
            disabled={cargando}
        >
            <FaRegFilePdf className="mr-2" size={20} />
            {cargando ? 'Generando...' : 'Generar PDF'}
        </button>
    );
};
