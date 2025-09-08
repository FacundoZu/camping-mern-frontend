import React, { useEffect, useRef, useState } from 'react';
import { Peticion } from '../../../../helpers/Peticion';
import { Global } from '../../../../helpers/Global';
import { useNavigate } from 'react-router-dom';

import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { toast } from 'react-toastify';

export const AdminCrearCabaña = () => {
    const [modelos, setModelos] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [formulario, setFormulario] = useState({
        nombre: '', modelo: '', precio: '', descripcion: '',
        cantidadPersonas: '', cantidadBaños: '', cantidadHabitaciones: '', estado: '', servicios: [],
        minimoDias: 1
    });
    const [imagenPrincipal, setImagenPrincipal] = useState(null);
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
    const [imagenesSeleccionadasEliminar, setImagenesSeleccionadasEliminar] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputImagenPrincipalRef = useRef(null);
    const inputImagenesAdicionalesRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const { datos: opciones } = await Peticion(`${Global.url}cabin/opciones`, "GET", null, false, 'include');
            const { datos: serviciosData } = await Peticion(`${Global.url}service/getAllServices`, "GET", null, false, 'include');
            setModelos(opciones?.modelos || []);
            setDisponibilidades(opciones?.disponibilidades || []);
            setServicios(serviciosData?.services || []);
        };
        fetchData();
    }, []);

    const handleChange = ({ target: { name, value } }) =>
        setFormulario(prev => ({ ...prev, [name]: value }));

    const onFileChange = (file, isMain = false) => {
        if (file) {
            const imageURL = URL.createObjectURL(file);
            if (isMain) {
                setImagenPrincipal(file);
            } else {
                setImagenesAdicionales(prev => [...prev, file]);
            }
        }
    };

    const handleServicioToggle = (id) =>
        setFormulario(prev => ({
            ...prev, servicios: prev.servicios.includes(id) ? prev.servicios.filter(s => s !== id) : [...prev.servicios, id]
        }));

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const url = Global.url + "cabin/create";
        const { datos } = await Peticion(url, "POST", formulario, false, 'include');

        if (datos.status == 'success') {

            if (imagenPrincipal) {
                await uploadImage(datos.cabin._id, imagenPrincipal, true);
            }

            if (imagenesAdicionales && imagenesAdicionales.length > 0) {
                for (const [index, image] of imagenesAdicionales.entries()) {
                    if (!imagenesSeleccionadasEliminar.includes(index)) {
                        await uploadImage(datos.cabin._id, image, false);
                    }
                }
            }
            toast.success('Cabaña creada Exitosamente');
            navigate("/admin/cabañas");
        } else {
            toast.error('Error al crear la cabaña');
        }
        setIsSubmitting(false);
    };

    const toggleSeleccionEliminar = (index) => {
        if (imagenesSeleccionadasEliminar.includes(index)) {
            setImagenesSeleccionadasEliminar(prev => prev.filter(i => i !== index));
        } else {
            setImagenesSeleccionadasEliminar(prev => [...prev, index]);
        }
    };

    const uploadImage = async (cabinId, imageFile, isMain) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('isMain', isMain);

        const url = Global.url + `cabin/uploadImage/${cabinId}`;
        await Peticion(url, 'POST', formData, true, 'include');
    };

    return (
        <div className="p-6 bg-slate-100 shadow-lg rounded-lg max-w-screen-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Crear Nueva Cabaña</h2>

                {['nombre', 'precio', 'descripcion'].map(field => (
                    <div key={field} className="flex flex-col">
                        <label className="text-gray-700 capitalize">{field.replace('cantidad', 'Cantidad de ')}</label>
                        {field === 'descripcion' ? (
                            <textarea
                                name={field}
                                value={formulario[field]}
                                onChange={handleChange}
                                className="px-4 py-2 h-36 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                                rows="4"
                                required
                            />
                        ) : (
                            <input
                                type={field === 'precio' ? 'number' : 'text'}
                                name={field}
                                value={formulario[field]}
                                onChange={handleChange}
                                required
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                        )}
                    </div>
                ))}
                <div className='flex gap-6 w-4/6 m-auto'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-center'>Capacidad</label>
                        <div className='flex gap-2 items-center' >
                            <PiUsersThreeFill className=' text-lime-700 w-8 h-8' />
                            <input
                                type="number"
                                name='cantidadPersonas'
                                value={formulario['cantidadPersonas']}
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
                                value={formulario['cantidadBaños']}
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
                                value={formulario['cantidadHabitaciones']}
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
                                value={formulario['minimoDias']}
                                onChange={handleChange}
                                className="px-4 py-2 border max-w-20 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                        </div>
                    </div>

                </div>
                {['modelo', 'estado'].map(selectField => (
                    <div key={selectField} className="flex flex-col">
                        <label className="text-gray-700 capitalize">{selectField}</label>
                        <select
                            name={selectField}
                            value={formulario[selectField]}
                            onChange={handleChange}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                            <option value="">Seleccione una opción...</option>
                            {(selectField === 'modelo' ? modelos : disponibilidades).map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}
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
                                <img src={servicio.imagen} alt={servicio.nombre} className="h-16 w-16 object-cover mb-2 mx-auto rounded" />
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
                                <img src={URL.createObjectURL(imagenPrincipal)} alt="Vista previa" className="h-40 w-60 object-cover rounded-md ml-2" />
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
                                        className="absolute top-1 right-1 bg-slate-600 text-white rounded-full hover:shadow-neutral-500 p-2 px-4 shadow hover:bg-slate-700 transition duration-200"
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
                            Creando...
                        </div>
                    ) : (
                        "Crear Cabaña"
                    )}
                </button>

            </form >
        </div >
    );
};
