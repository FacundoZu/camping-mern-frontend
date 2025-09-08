import React, { useState } from 'react';
import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { SkeletonCabaña } from './SkeletonCabaña';

export const ListadoCabañas = ({ cabañas, cargando, checkIn, checkOut }) => {
    const [imagenesCargadas, setImagenesCargadas] = useState({});

    const handleImageLoad = (id) => {
        setImagenesCargadas((prev) => ({ ...prev, [id]: true }));
    };

    return (
        <div className="w-full">
            {cargando ? (
                <div className="flex flex-col gap-4">
                    <SkeletonCabaña />
                    <SkeletonCabaña />
                    <SkeletonCabaña />
                </div>
            ) : cabañas && cabañas.length === 0 ? (
                <div className="bg-yellow-100 border flex flex-col w-full border-yellow-400 text-yellow-700 p-6 rounded-lg text-center mt-4">
                    <h2 className="font-bold text-xl mb-2">No se encontraron cabañas</h2>
                    <p>Prueba ajustando tus filtros.</p>
                </div>
            ) : (
                <div className='flex flex-col gap-6'>
                    {cabañas.map((cabaña) => (
                        cabaña && cabaña.estado === 'Disponible' && (
                            <Link
                                to={`/cabaña/${cabaña._id}?checkIn=${checkIn}&checkOut=${checkOut}`}
                                key={cabaña._id}
                                className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="flex flex-col lg:flex-row bg-white gap-4">
                                    {/* Imagen */}
                                    <div className="lg:w-1/3 relative h-64 lg:h-auto">
                                        {!imagenesCargadas[cabaña._id] && (
                                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
                                        )}
                                        <img
                                            src={cabaña.imagenPrincipal}
                                            alt={cabaña.nombre}
                                            className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${imagenesCargadas[cabaña._id] ? 'opacity-100' : 'opacity-0'}`}
                                            onLoad={() => handleImageLoad(cabaña._id)}
                                        />
                                    </div>

                                    {/* Información */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1">{cabaña.nombre}</h2>
                                            <p className="text-gray-600 mb-3 line-clamp-3">{cabaña.descripcion}</p>

                                            {/* Características */}
                                            <div className="flex flex-wrap gap-3 mb-3">
                                                <span className="flex items-center gap-1 border-b-1 border-lime-100 ">
                                                    <PiUsersThreeFill /> {cabaña.cantidadPersonas} Personas
                                                </span>
                                                <span className="flex items-center gap-1 border-lime-100 border-b-1">
                                                    <MdOutlineBedroomChild /> {cabaña.cantidadHabitaciones} Habitación(es)
                                                </span>
                                                <span className="flex items-center gap-1 border-lime-100 border-b-1">
                                                    <PiToiletBold /> {cabaña.cantidadBaños} Baño(s)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Servicios y Rating */}
                                        <div className="flex justify-between items-end mt-4 flex-wrap gap-4">
                                            {/* Servicios */}
                                            <div className="flex gap-2 overflow-x-auto pb-1">
                                                {cabaña.servicios.length > 0 ? (
                                                    cabaña.servicios.map((servicio) => (
                                                        servicio.estado === 'Habilitado' && (
                                                            <div key={servicio._id} className="flex-shrink-0 relative">
                                                                <img
                                                                    src={servicio.imagen}
                                                                    alt={servicio.nombre}
                                                                    title={servicio.nombre}
                                                                    className="w-12 h-12 rounded-lg bg-slate-100 p-2 "
                                                                />
                                                            </div>
                                                        )
                                                    ))
                                                ) : (
                                                    <div className="text-gray-400 text-sm">No hay servicios disponibles</div>
                                                )}
                                            </div>

                                            {/* Rating */}
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center mb-1 border-lime-100 border-1">
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <FaStar
                                                            key={index}
                                                            className={`text-xl ${index < Math.round(cabaña.promedioRating) ? "text-yellow-500" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 font-semibold text-gray-700">{cabaña.promedioRating.toFixed(1)}</span>
                                                </div>
                                                <span className="text-sm text-gray-500">{cabaña.reviews?.length || 0} opiniones</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};