import React from 'react';
import { FaEdit } from "react-icons/fa";

export const Detalleperfil = ({ usuario, handleToggelEdit }) => {
    return (
        <div className="space-y-3 flex flex-col">
            <label> Nombre </label>
            <label className="w-full p-2 border border-gray-300 rounded-md h-10">{usuario.name}</label>
            <label> Correo Electronico </label>
            <label className="w-full p-2 border border-gray-300 rounded-md h-10">{usuario.email}</label>
            <label> Telefono </label>
            <label className="w-full p-2 border border-gray-300 rounded-md h-10">{usuario.phone}</label>
            <label> Dirección </label>
            <label className="w-full p-2 border border-gray-300 rounded-md h-10">{usuario.address}</label>
            <button onClick={handleToggelEdit} className='flex items-center botton-submit max-w-20 justify-center'>
                <FaEdit className='mr-1' />Editar
            </button>
        </div>
    );
};
