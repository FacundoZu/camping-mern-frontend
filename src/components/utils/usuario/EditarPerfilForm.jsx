import React, { useState } from 'react';
import { useForm } from '../../../hooks/useForm';

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
        <form onSubmit={onSubmit} className="space-y-4 flex flex-col">
            <div
                className={`border-2 border-dashed rounded-lg p-4 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'
                    } flex justify-center items-center`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input type="file" id="fileInput" name="image" className="hidden" accept="image/*" onChange={handleInputFileChange} />
                <label htmlFor="fileInput" className="cursor-pointer">
                    {isDragging ? (
                        <p className="text-blue-500">¡Suelta la imagen aquí!</p>
                    ) : (
                        <p className="text-gray-500">Arrastra y suelta una imagen aquí, o haz clic para seleccionarla</p>
                    )}
                </label>
            </div>

            <label> Nombre </label>
            <input type="text" name="name" defaultValue={usuario.name} onChange={cambiado} className="form-input p-2 border border-gray-300 rounded-md shadow-sm" required />
            
            <label className=''> Correo Electronico </label>
            <label className="form-input p-2 border border-gray-300 rounded-md shadow-sm text-gray-400" > {usuario.email} </label>

            <label> Teléfono </label>
            <input type="text" name="phone" defaultValue={usuario.phone} onChange={cambiado} className="form-input p-2 border border-gray-300 rounded-md shadow-sm" />

            <label> Dirección </label>
            <input type="text" name="address" defaultValue={usuario.address} onChange={cambiado} className="form-input p-2 border border-gray-300 rounded-md shadow-sm" />

            <div className="flex space-x-2">
                <button type="submit" className="botton-submit">
                    Guardar Cambios
                </button>
                <button onClick={handleToggelEdit} className='botton-submit'>
                    Cancelar
                </button>
            </div>
        </form>
    );
};
