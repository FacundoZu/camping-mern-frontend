import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Peticion } from '../../../../helpers/Peticion';
import { Global } from '../../../../helpers/Global';

import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { toast } from 'react-toastify';

export const AdminEditarCabaña = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modelos, setModelos] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [imagenesSeleccionadasEliminar, setImagenesSeleccionadasEliminar] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre: '',
        modelo: '',
        precio: '',
        descripcion: '',
        cantidadPersonas: '',
        cantidadBaños: '',
        cantidadHabitaciones: '',
        estado: '',
        servicios: [],
        minimoDias: ''
    });
    const [imagenPrincipal, setImagenPrincipal] = useState(null);
    const [imagenesAdicionalesInicial, setImagenesAdicionalesIniciales] = useState([]);
    const [imagenPrincipalInicial, setImagenPrincipalInicial] = useState(null);
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const inputImagenPrincipalRef = useRef(null);
    const inputImagenesAdicionalesRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const [cabinData, opcionesData, serviciosData] = await Promise.all([
                Peticion(`${Global.url}cabin/getCabin/${id}`, 'GET', null, false, 'include'),
                Peticion(`${Global.url}cabin/opciones`, 'GET', null, false, 'include'),
                Peticion(`${Global.url}service/getAllServices`, 'GET', null, false, 'include')
            ]);

            if (cabinData.datos.cabin) {
                const cabin = cabinData.datos.cabin;
                setFormulario({
                    nombre: cabin.nombre,
                    modelo: cabin.modelo,
                    precio: cabin.precio,
                    descripcion: cabin.descripcion,
                    cantidadPersonas: cabin.cantidadPersonas,
                    cantidadBaños: cabin.cantidadBaños,
                    cantidadHabitaciones: cabin.cantidadHabitaciones,
                    estado: cabin.estado,
                    servicios: cabin.servicios.map(s => s._id),
                    minimoDias: cabin.minimoDias,
                });
                setImagenPrincipal(cabin.imagenPrincipal);
                setImagenesAdicionales(cabin.imagenes);

            }

            if (opcionesData.datos) {
                setModelos(opcionesData.datos.modelos);
                setDisponibilidades(opcionesData.datos.disponibilidades);
            }

            if (serviciosData.datos.success) {
                setServicios(serviciosData.datos.services);
            }
        };
        fetchData();

    }, [id]);


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
        if (files.length > 0) {
            onFileChange(files[0], true);
        }
    };

    const onFileChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setImagenPrincipal(file);
        }
    };

    const handleAdditionalImagesDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
        setImagenesAdicionales(prev => [...prev, ...newFiles]);
    };

    const handleImageClick = () => {
        inputImagenPrincipalRef.current.click();
    };

    const handleAdditionalImagesClick = () => {
        inputImagenesAdicionalesRef.current.click();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const handleServicioToggle = (servicioId) => {
        setFormulario((prevFormulario) => {
            const serviciosSeleccionados = prevFormulario.servicios.includes(servicioId)
                ? prevFormulario.servicios.filter((id) => id !== servicioId)
                : [...prevFormulario.servicios, servicioId];
            return {
                ...prevFormulario,
                servicios: serviciosSeleccionados,
            };
        });
    };
    const toggleSeleccionEliminar = (index) => {
        if (imagenesSeleccionadasEliminar.includes(index)) {
            setImagenesSeleccionadasEliminar(prev => prev.filter(i => i !== index));
        } else {
            setImagenesSeleccionadasEliminar(prev => [...prev, index]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const url = `${Global.url}cabin/update/${id}`;
        const { datos } = await Peticion(url, 'PUT', formulario, false, 'include');

        if (datos.status == 'success') {
            if (imagenPrincipal && imagenPrincipal !== imagenPrincipalInicial) {
                await uploadImage(id, imagenPrincipal, true);
            }

            if (imagenesAdicionales && imagenesAdicionales.length > 0) {
                const nombresIniciales = new Set(imagenesAdicionalesInicial.map(imagen => typeof imagen === 'string' ? imagen : imagen.name));
                const nuevasImagenes = imagenesAdicionales.filter(image => {
                    const nombre = typeof image === 'string' ? image : image.name;
                    return !nombresIniciales.has(nombre);
                });
                for (const [index, image] of nuevasImagenes.entries()) {
                    if (!imagenesSeleccionadasEliminar.includes(index)) {
                        await uploadImage(id, image, false);
                    }
                }
            }
            if (imagenesSeleccionadasEliminar.length > 0) {
                for (const index of imagenesSeleccionadasEliminar) {
                    const imageUrl = imagenesAdicionales[index];
                    if (typeof imageUrl === 'string') {
                        await deleteImage(id, imageUrl);
                    }
                }
            }
            toast.success('Cabaña actualizada con éxito');
            navigate('/admin/cabañas');

        } else {
            toast.error('Error al actualizar la cabaña');
        }
        setIsSubmitting(false);
    };


    const uploadImage = async (cabinId, imageFile, isMain) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('isMain', isMain);

        const url = Global.url + `cabin/uploadImage/${cabinId}`;
        await Peticion(url, 'POST', formData, true, 'include');
    };

    const deleteImage = async (cabinId, imageUrl) => {
        const response = await Peticion(`${Global.url}cabin/deleteImage/${cabinId}`, 'DELETE', { imageUrl }, true, 'include');
    };

    return (
        <div className='p-6 bg-slate-100 shadow-lg rounded-lg max-w-screen-lg mx-auto'>
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Editar La Cabaña: {formulario.nombre}</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Precio</label>
                    <input type="number" name="precio" value={formulario.precio} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Descripción</label>
                    <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500" />
                </div>
                <div className='flex gap-6 w-4/6 m-auto'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-center'>Capacidad</label>
                        <div className='flex gap-2 items-center' >
                            <PiUsersThreeFill className=' text-lime-700 w-8 h-8' />
                            <input
                                type="number"
                                name='cantidadPersonas'
                                value={formulario.cantidadPersonas}
                                onChange={handleChange}
                                className="px-4 py-2 border max-w-20 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-center'>Baños</label>
                        <div className='flex gap-2 items-center' >
                            <PiToiletBold className=' text-lime-700 w-8 h-8' />
                            <input
                                type="number"
                                name='cantidadBaños'
                                value={formulario.cantidadBaños}
                                onChange={handleChange}
                                className="px-4 py-2 border max-w-20 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-center'>Habitaciones</label>
                        <div className='flex gap-2 items-center' >
                            <MdOutlineBedroomChild className=' text-lime-700 w-8 h-8' />
                            <input
                                type="number"
                                name='cantidadHabitaciones'
                                value={formulario.cantidadHabitaciones}
                                onChange={handleChange}
                                className="px-4 py-2 border max-w-20 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-center'>Minimo de dias</label>
                        <div className='flex gap-2 items-center' >
                            <HiMiniCalendarDays className=' text-lime-700 w-8 h-8' />
                            <input
                                type="number"
                                name='minimoDias'
                                value={formulario.minimoDias}
                                defaultValue={1}
                                onChange={handleChange}
                                className="px-4 py-2 border max-w-20 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Modelo</label>
                    <select name="modelo" value={formulario.modelo} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option value="">Seleccione un modelo...</option>
                        {modelos.map((opcion) => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Estado</label>
                    <select name="estado" value={formulario.estado} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option value="">Seleccione un estado...</option>
                        {disponibilidades.map((opcion) => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Servicios</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {servicios.map((servicio) => (
                            <div
                                key={servicio._id}
                                className={`border rounded-lg p-4 text-center cursor-pointer transition duration-200 hover:border-lime-500
                            ${formulario.servicios.includes(servicio._id) ? 'bg-lime-100 border-lime-500' : 'bg-white border-gray-300'}`}
                                onClick={() => handleServicioToggle(servicio._id)}
                            >
                                <img src={servicio.imagen} alt={servicio.nombre} className="h-16 w-16 object-cover mb-2 rounded m-auto" />
                                <p className="text-gray-800 text-sm">{servicio.nombre}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Imagen Principal</label>
                    <div
                        className={`border-2 cursor-pointer border-dashed rounded-lg p-4 ${isDragging ? 'border-slate-500 bg-slate-50' : 'border-gray-300 bg-gray-100'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleImageClick}
                    >
                        <input
                            type="file"
                            ref={inputImagenPrincipalRef}
                            onChange={(e) => onFileChange(e.target.files[0], true)}
                            accept="image/*"
                            className="hidden"
                        />
                        {imagenPrincipal ? (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Imagen Principal seleccionada: </p>
                                <img src={typeof imagenPrincipal === 'string' ? imagenPrincipal : URL.createObjectURL(imagenPrincipal)} alt="Vista previa" className="h-40 w-60 object-cover rounded-md ml-2" />
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Arrastra y suelta la imagen principal aquí o haz clic para seleccionar.</p>
                        )}
                    </div>
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700">Imágenes Adicionales</label>
                    <div
                        className={`border-2 cursor-pointer border-dashed rounded-lg p-4 ${isDragging ? 'border-slate-500 bg-slate-50' : 'border-gray-300 bg-gray-100'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleAdditionalImagesDrop}
                        onClick={handleAdditionalImagesClick}
                    >
                        <input
                            type="file"
                            ref={inputImagenesAdicionalesRef}
                            onChange={(e) => {
                                const files = e.target.files;
                                const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
                                setImagenesAdicionales(prev => [...prev, ...newFiles]);
                            }}
                            accept="image/*"
                            className="hidden"
                            multiple
                        />
                        <p className="text-center text-gray-500">Arrastra y suelta las imágenes adicionales aquí.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-6">
                        {imagenesAdicionales.map((imag, index) => (
                            <div
                                key={index}
                                className={`relative m-auto ${imagenesSeleccionadasEliminar.includes(index) ? 'opacity-50' : ''}`}
                                onClick={() => toggleSeleccionEliminar(index)}
                            >
                                <img
                                    src={typeof imag === 'string' ? imag : URL.createObjectURL(imag)}
                                    alt={`Vista previa ${index + 1}`}
                                    className="h-44 w-64 object-cover rounded-md cursor-pointer"
                                />
                                {imagenesSeleccionadasEliminar.includes(index) ? (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSeleccionEliminar(index);
                                        }}
                                        className="absolute top-1 right-1 bg-lime-600 text-white rounded-full hover:shadow-neutral-500 p-2 px-4 shadow hover:bg-lime-700 transition duration-200"
                                    >
                                        Restaurar
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => toggleSeleccionEliminar(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full hover:shadow-neutral-500 p-2 px-4 shadow hover:bg-red-600 transition duration-200"
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="botton-submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Editando ...
                        </div>
                    ) : (
                        "Actualizar Cabaña"
                    )}
                </button>
            </form>
        </div>
    );
};