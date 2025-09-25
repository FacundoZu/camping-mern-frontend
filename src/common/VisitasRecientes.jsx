import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Peticion } from '../helpers/Peticion';
import { Global } from '../helpers/Global';
import { Link } from 'react-router-dom';
import { PiToiletBold, PiUsersThreeFill } from 'react-icons/pi';
import { MdOutlineBedroomChild } from 'react-icons/md';

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

                if (datos) {
                    setVisitedCabañas(datos);
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
                        Cabañas viste recientemente
                    </h2>
                    <p className="mt-3 text-gray-500">Selecciona una cabaña para ver más información</p>
                </div>

                <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {visitedCabañas.map((cabaña) => (
                        <li key={cabaña._id} className="group relative rounded-2xl shadow-lg overflow-hidden">
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
                                        <div className="flex gap-4 text-sm">
                                            <p className="flex items-center gap-1">
                                                <PiUsersThreeFill className="text-lime-400" />
                                                {cabaña.cantidadPersonas}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <MdOutlineBedroomChild className="text-lime-400" />
                                                {cabaña.cantidadHabitaciones}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <PiToiletBold className="text-lime-400" />
                                                {cabaña.cantidadBaños}
                                            </p>
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
