import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";
import { toast } from "react-toastify";

export const AdminCrearActividad = () => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [imagen, setImagen] = useState("");
    const [imagenFile, setImagenFile] = useState(null);
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
            setImagenFile(files[0]);
        }
    };

    const handleImageClick = () => {
        inputImagenRef.current.click();
    };

    const onFileChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setImagenFile(file);
        }
    };

    const crearActividad = async (e) => {
        e.preventDefault();

        let imagenUrl = "";

        if (opcionImagen === "archivo") {
            if (!imagenFile) {
                toast.error("Por favor selecciona una imagen.");
                return;
            }
            const formData = new FormData();
            formData.append("image", imagenFile);
            const uploadUrl = `${Global.url}activity/uploadActivityImage`;
            const { datos: uploadResponse } = await Peticion(uploadUrl, "POST", formData, true, "include");

            if (uploadResponse.status === "success") {
                imagenUrl = uploadResponse.imageUrl;
            } else {
                toast.error("Error al subir la imagen");
                return;
            }
        } else if (opcionImagen === "url") {
            if (!imagen.trim()) {
                toast.error("Por favor proporciona una URL válida para la imagen.");
                return;
            }
            imagenUrl = imagen;
        }

        const datosActividad = { titulo, descripcion, fechaInicio, fechaFinal, imagen: imagenUrl };
        const url = `${Global.url}activity/createActivity`;
        const { datos } = await Peticion(url, "POST", datosActividad, false, "include");

        if (datos.status == 'success') {
            toast.success("Actividad creada correctamente");
            navigate("/admin/actividades");
        } else {
            toast.error("Error al crear la actividad");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Nueva Actividad</h2>
            <form onSubmit={crearActividad}>
                <div className="mb-4">
                    <label className="block text-gray-700">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
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
                            {imagenFile ? (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Imagen seleccionada: {imagenFile.name}</p>
                                    <img
                                        src={URL.createObjectURL(imagenFile)}
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
                            <input
                                type="url"
                                value={imagen}
                                onChange={(e) => setImagen(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                                placeholder="https://example.com/imagen.jpg"
                                required={opcionImagen === "url"}
                            />
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Fecha de Inicio</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Fecha de Finalización</label>
                    <input
                        type="date"
                        value={fechaFinal}
                        onChange={(e) => setFechaFinal(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                    />
                </div>

                <button type="submit" className="w-full bg-lime-600 text-white p-2 rounded hover:bg-lime-700 transition duration-200">
                    Crear Actividad
                </button>
            </form>
        </div>
    );
};
