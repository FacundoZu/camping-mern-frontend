import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";
import { motion } from "framer-motion"
import { toast } from "react-toastify";

export const AdminEditarActividad = () => {
    const { id } = useParams();
    const [titulo, setTitulo] = useState("");
    const [imagen, setImagen] = useState("");
    const [imagenFile, setImagenFile] = useState(null);
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [opcionImagen, setOpcionImagen] = useState("archivo"); // "url" o "archivo"
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();
    const inputImagenRef = useRef(null);

    useEffect(() => {
        const obtenerActividad = async () => {
            const url = `${Global.url}activity/getActivity/${id}`;
            const { datos } = await Peticion(url, "GET", null, false, "include");

            if (datos.status === "success") {
                setTitulo(datos.activity.titulo);
                setImagen(datos.activity.imagen);
                setDescripcion(datos.activity.descripcion);
                const fechaInicioFormateada = new Date(datos.activity.fechaInicio).toISOString().split("T")[0];
                const fechaFinalFormateada = new Date(datos.activity.fechaFinal).toISOString().split("T")[0];
                setFechaInicio(fechaInicioFormateada);
                setFechaFinal(fechaFinalFormateada);
            } else {
                toast.error("Actividad no encontrada");
                navigate("/admin/actividades");
            }
        };
        obtenerActividad();
    }, [id, navigate]);

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

    const actualizarActividad = async (e) => {
        e.preventDefault();
        let imagenUrl = imagen;

        if (opcionImagen === "archivo" && imagenFile) {
            const formData = new FormData();
            formData.append("image", imagenFile);
            const uploadUrl = `${Global.url}activity/uploadActivityImage`;
            const { datos: uploadResponse } = await Peticion(uploadUrl, "POST", formData, true, "include");

            if (uploadResponse.status === "success") {
                imagenUrl = uploadResponse.imageUrl;
            } else {
                toast.error("Error al subir la imagen: " + uploadResponse.message);
                return;
            }
        } else if (opcionImagen === "url" && !imagen.trim()) {
            toast.error("Por favor proporciona una URL válida para la imagen.");
            return;
        }

        const datosActividad = { titulo, imagen: imagenUrl, descripcion, fechaInicio, fechaFinal };
        const url = `${Global.url}activity/updateActivity/${id}`;
        const { datos } = await Peticion(url, "PUT", datosActividad, false, "include");

        if (datos && datos.status === "success") {
            toast.success(datos.mensaje);
            navigate("/admin/actividades");
        } else {
            toast.error(datos.mensaje);
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editar Actividad</h2>
                <form onSubmit={actualizarActividad}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="create-edit-input-button"
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
                                    className="create-edit-input-button"
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
                            className="create-edit-input-button"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Fecha de Inicio</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="create-edit-input-button"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Fecha de Finalización</label>
                        <input
                            type="date"
                            value={fechaFinal}
                            onChange={(e) => setFechaFinal(e.target.value)}
                            className="create-edit-input-button"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-lime-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-lime-700 transition"
                        >
                            Guardar Cambios
                        </motion.button>
                        <Link
                            to={"/admin/actividades"}
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
