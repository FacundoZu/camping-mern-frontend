import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Global } from '../helpers/Global';
import { Peticion } from '../helpers/Peticion';
import { FaMapMarkerAlt, FaClock, FaTimes } from 'react-icons/fa';



export const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await Peticion(Global.url + "activity/getActivities", "GET", null, false, 'include');
                if (!response.datos) {
                    throw new Error('Error al obtener actividades');
                }
                setActividades(response.datos.activities);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const openPopup = (activity, index) => {
        setSelectedActivity({ ...activity, index });
        document.body.style.overflow = 'hidden';
    };

    const closePopup = () => {
        setSelectedActivity(null);
        document.body.style.overflow = 'unset';
    };

    if (loading) {
        return (
            <div className="relative w-full min-h-[500px] bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-10 bg-gray-300 rounded-lg w-48 mx-auto mb-6 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-64 mx-auto animate-pulse aspect-video"></div>
                </div>
            </div>
        );
    }

    return (
        <div id="eventos" className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-6 sm:py-8">
            {/* Título principal */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold inline-flex items-center">
                    Experiencias en la Naturaleza
                </h2>
                <p className="mt-3 text-gray-500">Selecciona una actividad para ver más información</p>
            </div>
            {actividades.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mx-auto">
                    {actividades.map((actividad, index) => {
                        const isSelected = selectedActivity?.index === index;
                        return (
                            <motion.div
                                key={index}
                                layoutId={`activity-${index}`}
                                onClick={() => openPopup(actividad, index)}
                                className="relative cursor-pointer group rounded-2xl shadow-lg hover:shadow-xl"
                            >
                                {/* Imagen de la card */}
                                <div className="relative h-48 sm:h-56 lg:h-64">
                                    <img
                                        className="object-cover w-full h-full rounded-2xl transform group-hover:scale-110 transition-transform"
                                        src={actividad.imagen}
                                        alt={actividad.titulo}
                                        loading="lazy"
                                    />
                                </div>

                                {/* Contenido de la card */}
                                {!isSelected && (
                                    <div
                                        className="absolute bottom-0 w-full p-4 sm:p-5"
                                    >
                                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 transform translate-y-1 group-hover:translate-y-0 transition-all">
                                            {actividad.titulo}
                                        </h3>
                                        <p className="text-gray-200 text-xs sm:text-sm line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                            {actividad.descripcion.length > 80
                                                ? actividad.descripcion.substring(0, 80) + "..."
                                                : actividad.descripcion}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
                        Próximamente nuevas experiencias
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base">
                        Estamos preparando actividades especiales para ti
                    </p>
                </div>
            )}

            {/* Modal con animación */}
            <AnimatePresence>
                {selectedActivity && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50"
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                    >
                        <motion.div
                            className="relative bg-white w-full max-w-full sm:max-w-2xl lg:max-w-4xl max-h-[90vh] rounded-lg sm:rounded-xl shadow-2xl"
                            layoutId={`activity-${selectedActivity.index}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Botón de cerrar */}
                            <button
                                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-lg"
                                onClick={closePopup}
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                {/* Imagen con animación compartida */}
                                <div className="relative h-48 sm:h-64 md:h-full">
                                    <img
                                        className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none z-40"
                                        src={selectedActivity.imagen}
                                        alt={selectedActivity.titulo}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 p-4">
                                        {selectedActivity.titulo}
                                    </h2>

                                    <div
                                        className="text-gray-600 mb-4 sm:mb-6 px-4"
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.25, duration: 0.3 }}
                                    >
                                        <p>
                                            {selectedActivity.descripcion}
                                        </p>
                                    </div>

                                    <div
                                        className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"
                                    >
                                        {selectedActivity.duracion && (
                                            <div className="flex items-start">
                                                <FaClock className="text-lime-500 mt-1 mr-3 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Duración</p>
                                                    <p className="font-medium text-gray-800">
                                                        {selectedActivity.duracion}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedActivity.ubicacion && (
                                            <div className="flex items-start">
                                                <FaMapMarkerAlt className="text-lime-500 mt-1 mr-3 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Ubicación</p>
                                                    <p className="font-medium text-gray-800">
                                                        {selectedActivity.ubicacion}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};