import React, { useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { FaUpload } from "react-icons/fa";
import { PerfilImagen } from './PerfilImagen';

export const EditarPerfil = ({ usuario, setSelectedFile, setPreviewImage, handleSubmit, handleToggelEdit }) => {
    const { formulario, cambiado } = useForm();
    const [isDragging, setIsDragging] = useState(false);

    const onFileChange = (file) => {
        setSelectedFile(file);
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreviewImage(imageURL);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            onFileChange(file);
        }
    };

    const handleInputFileChange = (e) => {
        const file = e.target.files[0];
        onFileChange(file);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formulario);
    };

    return (
        <form onSubmit={onSubmit} className="bg-gray-50 rounded-xl shadow-md p-6 space-y-6 w-full">
            {/* Upload de imagen */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition 
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <PerfilImagen image={usuario.image} />
                <input
                    type="file"
                    id="fileInput"
                    name="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleInputFileChange}
                />
                <label htmlFor="fileInput" className="flex flex-col items-center space-y-2 cursor-pointer">
                    <FaUpload className="text-gray-400 text-2xl" />
                    {isDragging ? (
                        <p className="text-blue-500 font-medium">¡Suelta la imagen aquí!</p>
                    ) : (
                        <p className="text-gray-500">Arrastra una imagen o haz clic para subir</p>
                    )}
                </label>
            </div>

            {/* Campos de formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={usuario.name}
                        onChange={cambiado}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-lime-500 focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">Correo electrónico</label>
                    <input
                        type="text"
                        value={usuario.email}
                        disabled
                        className="w-full mt-1 p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono</label>
                    <input
                        type="text"
                        name="phone"
                        defaultValue={usuario.phone}
                        onChange={cambiado}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-lime-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">Dirección</label>
                    <input
                        type="text"
                        name="address"
                        defaultValue={usuario.address}
                        onChange={cambiado}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-lime-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={handleToggelEdit}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="botton-submit-2"
                >
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
};
