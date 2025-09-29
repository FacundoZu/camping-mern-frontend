import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Peticion } from '../helpers/Peticion';
import { Global } from '../helpers/Global';
import { Link } from 'react-router-dom';
import { PiToiletBold, PiUsersThreeFill } from 'react-icons/pi';
import { MdOutlineBedroomChild } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';

export default function VisitasRecientes() {
    const { auth } = useAuth();
    const [visitedCabañas, setVisitedCabañas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisitedCabañas = async () => {
            if (!auth || !auth.id) return;
            try {
                const { datos } = await Peticion(
                    `${Global.url}user/registerVisit/${auth.id}`,
                    "GET",
                    null,
                    false,
                    'include'
                );
                const cabañas = datos.map((cabaña) => {
                    const promedioRating = cabaña.comentarios.reduce((total, comentario) => total + comentario.rating, 0) / cabaña.comentarios.length;
                    return {
                        ...cabaña,
                        promedioRating: promedioRating ? promedioRating : 0,
                        reviews: cabaña.comentarios.length,
                    };
                });
                if (cabañas) {
                    setVisitedCabañas(cabañas);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVisitedCabañas();
    }, [auth]);


    if (visitedCabañas.length > 0 && loading) {
        return (
            <div className="md:px-8 w-full m-auto">
                <h2 className='pb-5 text-center text-3xl font-bold'>Cabañas vistas recientemente</h2>
                <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5'>
                    {[1, 2, 3].map((_, index) => (
                        <li key={index} className="animate-pulse">
                            <div className="bg-gray-300 h-64 rounded-xl shadow-md"></div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (visitedCabañas.length > 0)
        return (
            <div className="m-auto w-full px-5 md:px-20 pb-6 pt-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold inline-flex items-center">
                        Cabañas que viste recientemente
                    </h2>
                    <p className="mt-3 text-gray-500">Selecciona una cabaña para ver más información</p>
                </div>

                <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {visitedCabañas.map((cabaña) => (
                        <li key={cabaña._id} className="group relative rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-500">
                            <Link to={`/cabaña/${cabaña._id}`}>
                                {/* Imagen */}
                                <div className="relative h-72 w-full overflow-hidden">
                                    <img
                                        src={cabaña.imagenPrincipal}
                                        alt={cabaña.nombre}
                                        className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                        onLoad={() => setLoading(false)}
                                    />
                                    {/* Overlay oscuro */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                                    {/* Contenido del texto */}
                                    <div className="absolute bottom-0 p-5 w-full text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                                        <h3 className="text-xl font-semibold mb-2 drop-shadow-md">
                                            {cabaña.nombre}
                                        </h3>
                                        <div className="flex justify-between gap-4 text-sm">
                                            <div className="flex gap-2">
                                                <p className="flex items-center gap-1">
                                                    <PiUsersThreeFill className="text-lime-400 size-4" />
                                                    {cabaña.cantidadPersonas}
                                                </p>
                                                <p className="flex items-center gap-1">
                                                    <MdOutlineBedroomChild className="text-lime-400 size-4" />
                                                    {cabaña.cantidadHabitaciones}
                                                </p>
                                                <p className="flex items-center gap-1">
                                                    <PiToiletBold className="text-lime-400 size-4" />
                                                    {cabaña.cantidadBaños}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center mb-1 border-lime-100 border-1">
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <FaStar
                                                            key={index}
                                                            className={`size-4 ${index < Math.round(cabaña.promedioRating) ? "text-yellow-500" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 font-semibold text-white">{cabaña.promedioRating.toFixed(1)}</span>
                                                </div>
                                                <span className="text-sm text-white">{cabaña.reviews || 0} opiniones</span>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );

    return null;
}
