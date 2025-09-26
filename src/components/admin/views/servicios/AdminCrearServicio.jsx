import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export const AdminCrearServicio = () => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState(null);
    const [imagenUrl, setImagenUrl] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [opcionImagen, setOpcionImagen] = useState("archivo");
    const inputImagenRef = useRef(null);
    const navigate = useNavigate();

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
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith("image/")) {
            setImagen(files[0]);
        }
    };

    const handleImageClick = () => {
        inputImagenRef.current.click();
    };

    const onFileChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setImagen(file);
        }
    };

    const crearServicio = async (e) => {
        e.preventDefault();

        if (opcionImagen === "archivo" && imagen) {
            const formData = new FormData();
            formData.append("image", imagen);
            const uploadUrl = `${Global.url}service/uploadServiceImage`;
            const { datos: uploadResponse } = await Peticion(uploadUrl, "POST", formData, true, "include");

            if (uploadResponse.status === "success") {
                await crearServicioConImagen(uploadResponse.imageUrl);
            } else {
                toast.error("Error al subir la imagen");
            }
        } else if (opcionImagen === "url" && imagenUrl.trim() !== "") {
            await crearServicioConImagen(imagenUrl);
        } else {
            toast.error("Por favor selecciona una imagen o proporciona una URL válida.");
        }
    };

    const crearServicioConImagen = async (imageUrl) => {
        const formData = { nombre, descripcion, imagen: imageUrl };

        const createUrl = `${Global.url}service/createService`;
        const { datos: createResponse } = await Peticion(createUrl, "POST", formData, false, "include");

        if (createResponse.success) {
            toast.success('Servicio creado correctamente');
            navigate("/admin/servicios");
        } else {
            toast.error("Error al crear el servicio");
        }
    };


    return (
        <div className="flex justify-center items-center min-h-[100dvh] p-6">
            <motion.div
                className="p-6 bg-white rounded-lg shadow-lg mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Nuevo Servicio</h2>
                <form onSubmit={crearServicio}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-lime-400 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Imagen</label>
                        <div className="mb-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="opcionImagen"
                                    value="archivo"
                                    checked={opcionImagen === "archivo"}
                                    onChange={() => setOpcionImagen("archivo")}
                                    className="mr-2"
                                />
                                Subir archivo
                            </label>
                            <label className="inline-flex items-center ml-4">
                                <input
                                    type="radio"
                                    name="opcionImagen"
                                    value="url"
                                    checked={opcionImagen === "url"}
                                    onChange={() => setOpcionImagen("url")}
                                    className="mr-2"
                                />
                                Usar URL
                            </label>
                        </div>

                        {opcionImagen === "archivo" ? (
                            <div
                                className={`border-2 cursor-pointer border-dashed rounded-lg p-4 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleImageClick}
                            >
                                <input
                                    type="file"
                                    ref={inputImagenRef}
                                    onChange={(e) => onFileChange(e.target.files[0])}
                                    accept="image/*"
                                    className="hidden"
                                />
                                {imagen ? (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">Imagen seleccionada: {imagen.name}</p>
                                        <img
                                            src={URL.createObjectURL(imagen)}
                                            alt="Vista previa"
                                            className="h-32 w-32 object-cover rounded-md ml-2"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500">Arrastra y suelta la imagen aquí o haz clic para seleccionar.</p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-2">
                                <label className="block text-gray-700">URL de la imagen</label>
                                <span className="text-gray-700">
                                    Recomendamos esta{" "}
                                    <a href="https://www.flaticon.com/" className="text-lime-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                        página
                                    </a>{" "}
                                    para elegir la imagen.
                                </span>
                                <input
                                    type="url"
                                    value={imagenUrl}
                                    onChange={(e) => setImagenUrl(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-lime-400 focus:outline-none"
                                    placeholder="https://example.com/imagen.jpg"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-lime-400 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-lime-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-lime-700 transition"
                        >
                            Crear Servicio
                        </motion.button>
                        <Link
                            to={"/admin/servicios"}
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
