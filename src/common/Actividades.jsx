import React, { useEffect, useState, useRef } from 'react';
import { Global } from '../helpers/Global';
import { Peticion } from '../helpers/Peticion';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, EffectFade } from 'swiper/modules';

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

    const openPopup = (activity) => {
        setSelectedActivity(activity);
    };

    const closePopup = () => {
        setSelectedActivity(null);
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
                <Swiper
                    modules={[Navigation, Pagination, Thumbs, EffectFade]}
                    slidesPerView={1}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    navigation
                    className="h-[350px] md:h-[700px] overflow-hidden w-11/12"
                >
                    {actividades.map((actividad, index) => (
                        <SwiperSlide
                            key={index}
                            onClick={() => openPopup(actividad)}
                            className="relative cursor-pointer group overflow-hidden rounded-2xl"
                        >
                            <img
                                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 aspect-video"
                                src={actividad.imagen}
                                alt={actividad.titulo}
                                loading="lazy"
                            />

                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 md:px-8 md:py-14 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/60">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                    {actividad.titulo}
                                </h3>
                                <p className="text-gray-200 text-xs sm:text-sm md:text-base line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-700 delay-100">
                                    {actividad.descripcion.length > 100
                                        ? actividad.descripcion.substring(0, 100) + "..."
                                        : actividad.descripcion}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
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

            {/* Popup */}
            {selectedActivity && (
                <div onClickCapture={closePopup} className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 animate-fade-in-4">
                    <div
                        className="relative bg-white w-full max-w-full sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg sm:rounded-xl shadow-2xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div className="relative h-48 sm:h-64 md:h-full">
                                <img
                                    className="w-full h-full object-cover"
                                    src={selectedActivity.imagen}
                                    alt={selectedActivity.titulo}
                                />
                            </div>
                            <div className="p-4 sm:p-6 md:p-8">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                                    {selectedActivity.titulo}
                                </h2>
                                <div className="prose prose-sm sm:prose-lg text-gray-600 mb-4 sm:mb-6">
                                    <p>{selectedActivity.descripcion}</p>
                                </div>
                                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    {selectedActivity.duracion && (
                                        <div className="flex items-start">
                                            <FaClock className="text-lime-500 mt-1 mr-3 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Duración</p>
                                                <p className="font-medium text-gray-800">{selectedActivity.duracion}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedActivity.ubicacion && (
                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="text-lime-500 mt-1 mr-3 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Ubicación</p>
                                                <p className="font-medium text-gray-800">{selectedActivity.ubicacion}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

        </div>
    );
};
