import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Peticion } from '../../../../helpers/Peticion';
import { Global } from '../../../../helpers/Global';
import { motion, AnimatePresence } from 'framer-motion';

import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { toast } from 'react-toastify';

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export const AdminEditarCabaña = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [modelos, setModelos] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [servicios, setServicios] = useState([]);

    const [formulario, setFormulario] = useState({
        nombre: '',
        modelo: '',
        precio: '',
        descripcion: '',
        cantidadPersonas: 1,
        cantidadBaños: 1,
        cantidadHabitaciones: 1,
        estado: '',
        servicios: [],
        minimoDias: 1,
        ubicacion: null,
        direccion: ''
    });

    const [imagenPrincipal, setImagenPrincipal] = useState(null);
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]); // {id, file?, url?, previewUrl?, isNew, marked}

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDraggingMain, setIsDraggingMain] = useState(false);
    const [isDraggingAdd, setIsDraggingAdd] = useState(false);

    const inputImagenPrincipalRef = useRef(null);
    const inputImagenesAdicionalesRef = useRef(null);
    const idCounter = useRef(0);

    // Helpers
    const nextId = useCallback(() => {
        idCounter.current += 1;
        return String(Date.now()) + '-' + idCounter.current;
    }, []);

    const createPreview = useCallback((file) => URL.createObjectURL(file), []);

    const removeImagenById = useCallback((id) => {
        setImagenesAdicionales(prev => {
            const toRemove = prev.find(i => i.id === id);
            if (toRemove && toRemove.previewUrl) URL.revokeObjectURL(toRemove.previewUrl);
            return prev.filter(i => i.id !== id);
        });
    }, []);

    const toggleMarkImagen = useCallback((id) => {
        setImagenesAdicionales(prev => prev.map(img => {
            if (img.id === id) {
                if (!img.isNew) return { ...img, marked: !img.marked };
                return null;
            }
            return img;
        }).filter(Boolean));
    }, []);


    const addAdditionalImages = useCallback((files) => {
        const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
        setImagenesAdicionales(prev => [
            ...prev,
            ...validFiles.map(file => ({
                id: nextId(),
                file,
                previewUrl: createPreview(file),
                isNew: true,
                marked: false
            }))
        ]);
    }, [createPreview, nextId]);

    const onSetImagenPrincipal = useCallback((file) => {
        if (!file.type.startsWith("image/")) return;
        setImagenPrincipal(prev => {
            if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
            return {
                id: nextId(),
                file,
                previewUrl: createPreview(file)
            };
        });
    }, [createPreview, nextId]);

    // Ubicacion
    const markerIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const LocationPicker = ({ onLocationSelect }) => {
        useMapEvents({
            click(e) {
                onLocationSelect(e.latlng);
            },
        });
        return null;
    };

    const handleLocationSelect = (latlng) => {
        setFormulario({
            ...formulario,
            ubicacion: {
                type: "Point",
                coordinates: [latlng.lng, latlng.lat]
            },
        });
    };

    // Fetch inicial
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cabinRes, opcionesRes, serviciosRes] = await Promise.all([
                    Peticion(`${Global.url}cabin/getCabin/${id}`, 'GET', null, false, 'include'),
                    Peticion(`${Global.url}cabin/opciones`, 'GET', null, false, 'include'),
                    Peticion(`${Global.url}service/getAllServices`, 'GET', null, false, 'include')
                ]);

                if (cabinRes?.datos?.cabin) {
                    const cabin = cabinRes.datos.cabin;
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
                        ubicacion: cabin.ubicacion,
                        direccion: cabin.direccion
                    });

                    // Imagen principal
                    if (cabin.imagenPrincipal) {
                        setImagenPrincipal({
                            id: nextId(),
                            url: cabin.imagenPrincipal,
                            file: null,
                            previewUrl: null,
                        });
                    }

                    // Imágenes adicionales
                    setImagenesAdicionales(
                        (cabin.imagenes || []).map(url => ({
                            id: nextId(),
                            url,
                            file: null,
                            previewUrl: null,
                            isNew: false,
                            marked: false
                        }))
                    );
                }

                setModelos(opcionesRes?.datos?.modelos || []);
                setDisponibilidades(opcionesRes?.datos?.disponibilidades || []);
                setServicios(serviciosRes?.datos?.services || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id, nextId]);

    // Drag & Drop Imagen Principal
    const handleDragOverMain = useCallback((e) => { e.preventDefault(); setIsDraggingMain(true); }, []);
    const handleDragLeaveMain = useCallback(() => setIsDraggingMain(false), []);
    const handleDropMain = useCallback((e) => {
        e.preventDefault();
        setIsDraggingMain(false);
        if (e.dataTransfer.files[0]) onSetImagenPrincipal(e.dataTransfer.files[0]);
    }, [onSetImagenPrincipal]);

    // Drag & Drop Imagenes adicionales
    const handleDragOverAdd = useCallback((e) => { e.preventDefault(); setIsDraggingAdd(true); }, []);
    const handleDragLeaveAdd = useCallback(() => setIsDraggingAdd(false), []);
    const handleDropAdd = useCallback((e) => {
        e.preventDefault();
        setIsDraggingAdd(false);
        addAdditionalImages(e.dataTransfer.files);
    }, [addAdditionalImages]);

    // Inputs
    const handleChange = ({ target: { name, value } }) => {
        setFormulario(prev => ({ ...prev, [name]: value }));
    };
    const handleImageClick = useCallback(() => inputImagenPrincipalRef.current?.click(), []);
    const handleAdditionalImagesClick = useCallback(() => inputImagenesAdicionalesRef.current?.click(), []);

    const handleServicioToggle = (id) => {
        setFormulario(prev => ({
            ...prev,
            servicios: prev.servicios.includes(id)
                ? prev.servicios.filter(s => s !== id)
                : [...prev.servicios, id]
        }));
    };

    // Upload y delete
    const uploadImage = async (cabinId, imageFile, isMain) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('isMain', isMain);
        await Peticion(Global.url + `cabin/uploadImage/${cabinId}`, 'POST', formData, true, 'include');
    };

    const deleteImage = async (cabinId, imageUrl) => {
        await Peticion(`${Global.url}cabin/deleteImage/${cabinId}`, 'DELETE', { imageUrl }, true, 'include');
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { datos } = await Peticion(`${Global.url}cabin/update/${id}`, 'PUT', formulario, false, 'include');

            if (datos?.status === "success") {
                // Imagen principal
                if (imagenPrincipal?.file) {
                    await uploadImage(id, imagenPrincipal.file, true);
                }

                // Imágenes adicionales
                for (const img of imagenesAdicionales) {
                    if (img.marked && img.url) {
                        await deleteImage(id, img.url);
                    } else if (img.isNew && img.file) {
                        await uploadImage(id, img.file, false);
                    }
                }

                toast.success("Cabaña actualizada exitosamente");
                navigate("/admin/cabañas");
            } else {
                toast.error("Error al actualizar la cabaña");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ocurrió un error, revisá la consola.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render
    return (
        <motion.div
            className="p-8 bg-white shadow-xl rounded-2xl max-w-5xl mx-auto my-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <motion.form onSubmit={handleSubmit} className="space-y-8">
                <h2 className="text-3xl font-bold text-center text-slate-700 mb-2">
                    Editar Cabaña

                </h2>

                {/* Campos básicos */}
                {['nombre', 'precio', 'descripcion'].map(field => (
                    <motion.div
                        key={field}
                        className="flex flex-col"
                        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    >
                        <label className="text-gray-600 font-medium mb-2 capitalize">{field}</label>
                        {field === 'descripcion' ? (
                            <textarea
                                name={field}
                                value={formulario[field]}
                                onChange={handleChange}
                                className="px-4 py-3 h-28 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 shadow-sm"
                                required
                            />
                        ) : (
                            <input
                                type={field === 'precio' ? 'number' : 'text'}
                                name={field}
                                value={formulario[field]}
                                onChange={handleChange}
                                required
                                className="create-edit-input-button"
                            />
                        )}
                    </motion.div>
                ))}

                {/* Capacidad */}
                <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    {[
                        { label: "Capacidad", icon: <PiUsersThreeFill className="text-lime-600 w-7 h-7" />, name: 'cantidadPersonas' },
                        { label: "Baños", icon: <PiToiletBold className="text-lime-600 w-7 h-7" />, name: 'cantidadBaños' },
                        { label: "Habitaciones", icon: <MdOutlineBedroomChild className="text-lime-600 w-7 h-7" />, name: 'cantidadHabitaciones' },
                        { label: "Mínimo de días", icon: <HiMiniCalendarDays className="text-lime-600 w-7 h-7" />, name: 'minimoDias' },
                    ].map(({ label, icon, name }) => (
                        <div key={name} className="flex flex-col items-center gap-2">
                            <label className="text-gray-700 font-medium">{label}</label>
                            <div className="flex items-center gap-2">
                                {icon}
                                <input
                                    type="number"
                                    name={name}
                                    value={formulario[name]}
                                    onChange={handleChange}
                                    className="create-edit-input-button max-w-20"
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Selects */}
                <div className="grid md:grid-cols-2 gap-6">
                    {['modelo', 'estado'].map(selectField => (
                        <motion.div key={selectField} className="flex flex-col" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                            <label className="text-gray-700 font-medium capitalize">{selectField}</label>
                            <select
                                name={selectField}
                                value={formulario[selectField]}
                                onChange={handleChange}
                                className="create-edit-input-button"
                            >
                                <option value="">Seleccione una opción...</option>
                                {(selectField === 'modelo' ? modelos : disponibilidades).map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </motion.div>
                    ))}
                </div>

                {/* Servicios */}
                <motion.div className="mb-6" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                    <label className="block text-gray-700 font-medium mb-3">Servicios</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {servicios.map(servicio => (
                            <motion.div
                                key={servicio._id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`border rounded-lg p-4 text-center cursor-pointer shadow-sm transition
                          ${formulario.servicios.includes(servicio._id) ? 'bg-lime-100 border-lime-500' : 'bg-white border-gray-200'}`}
                                onClick={() => handleServicioToggle(servicio._id)}
                            >
                                <img src={servicio.imagen} alt={servicio.nombre} className="h-16 w-16 object-cover mb-2 mx-auto rounded" />
                                <p className="text-gray-800 text-sm font-medium">{servicio.nombre}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Imagen Principal */}
                <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                    <label className="block text-gray-700 font-medium mb-2">Imagen Principal <span className="text-xs text-gray-500">(Arrastra una imagen para cambiar)</span></label>
                    <div
                        className={`border-2 cursor-pointer border-dashed rounded-lg p-6 shadow-inner transition
                    ${isDraggingMain ? 'border-lime-500 bg-lime-50' : 'border-gray-300 bg-gray-50'}`}
                        onDragOver={handleDragOverMain}
                        onDragLeave={handleDragLeaveMain}
                        onDrop={handleDropMain}
                        onClick={handleImageClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleImageClick(); }}
                    >
                        <input
                            type="file"
                            ref={inputImagenPrincipalRef}
                            onChange={(e) => { if (e.target.files && e.target.files[0]) onSetImagenPrincipal(e.target.files[0]); }}
                            accept="image/*"
                            className="hidden"
                        />
                        {imagenPrincipal ? (
                            <motion.img
                                key={imagenPrincipal.id}
                                src={imagenPrincipal.previewUrl || imagenPrincipal.url}
                                alt="Vista previa"
                                className="h-44 w-full object-cover rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        ) : (
                            <p className="text-center text-gray-500">Arrastra y suelta la imagen principal aquí o haz clic para seleccionar.</p>
                        )}
                    </div>
                </motion.div>

                {/* Imágenes Adicionales */}
                <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                    <label className="block text-gray-700 font-medium mb-2">Imágenes Adicionales</label>
                    <div
                        className={`border-2 cursor-pointer border-dashed rounded-lg p-6 shadow-inner transition
                    ${isDraggingAdd ? 'border-lime-500 bg-lime-50' : 'border-gray-300 bg-gray-50'}`}
                        onDragOver={handleDragOverAdd}
                        onDragLeave={handleDragLeaveAdd}
                        onDrop={handleDropAdd}
                        onClick={handleAdditionalImagesClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAdditionalImagesClick(); }}
                    >
                        <input
                            type="file"
                            ref={inputImagenesAdicionalesRef}
                            onChange={(e) => { if (e.target.files) addAdditionalImages(e.target.files); e.target.value = null; }}
                            accept="image/*"
                            className="hidden"
                            multiple
                        />
                        <p className="text-center text-gray-500">Arrastra y suelta las imágenes adicionales aquí o haz clic para seleccionar múltiple.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        <AnimatePresence>
                            {imagenesAdicionales.map(img => (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    layout
                                    className={`relative rounded-lg overflow-hidden shadow-md border ${img.marked ? 'opacity-60' : 'opacity-100'}`}
                                >
                                    <img
                                        src={img.previewUrl || img.url}
                                        alt="preview"
                                        className="h-44 w-full object-cover block"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); toggleMarkImagen(img.id); }}
                                            className={`text-white rounded-full p-2 shadow transition ${img.marked ? 'bg-lime-600' : 'bg-red-600'}`}
                                            title={img.marked ? "Restaurar imagen" : "Eliminar imagen"}
                                        >
                                            {img.marked ? "Restaurar" : "Eliminar"}
                                        </button>

                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Mapa para seleccionar ubicación */}
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Seleccionar ubicación (opcional)</h3>
                    <MapContainer
                        center={[-25.1217, -66.1653]}
                        zoom={13}
                        style={{ height: "300px", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker onLocationSelect={handleLocationSelect} />
                        {formulario.ubicacion && (
                            <Marker
                                position={[formulario.ubicacion?.coordinates[1], formulario.ubicacion?.coordinates[0]]}
                                icon={markerIcon}
                            />
                        )}
                    </MapContainer>

                    {formulario.ubicacion && (
                        <p className="mt-2 text-sm text-gray-600">
                            📍 Lat: {formulario.ubicacion?.coordinates[0]?.toFixed(5)}, Lng:{" "}
                            {formulario.ubicacion?.coordinates[1]?.toFixed(5)}
                        </p>
                    )}
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Dirección (opcional)</label>
                    <input
                        type="text"
                        name="direccion"
                        value={formulario.direccion || ""}
                        onChange={(e) =>
                            setFormulario({
                                ...formulario,
                                direccion: e.target.value,
                            })
                        }
                        className="mt-1 p-2 border rounded-md w-full"
                        placeholder="Ej: Ruta 40 km 15, San Carlos"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-lime-600 hover:bg-lime-700 disabled:bg-lime-700/50 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
                        whileTap={{ scale: 0.97 }}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-3">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Guardando...
                            </div>
                        ) : "Guardar cambios"}
                    </motion.button>
                    <Link
                        to={"/admin/cabañas"}
                        className="text-lime-600 font-medium hover:underline"
                    >
                        Volver
                    </Link>
                </div>
            </motion.form>
        </motion.div>
    );
};
