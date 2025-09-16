import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Buscador } from "./Buscador";
import { ListadoCabañas } from "./ListadoCabañas";
import { Global } from "../../../helpers/Global";
import { Peticion } from "../../../helpers/Peticion";

export const Cabañas = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [cabañas, setCabañas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [servicios, setServicios] = useState([]);

    // Obtener filtros desde la URL o valores por defecto
    const obtenerFiltroDesdeUrl = (param, defaultValue = "") => {
        const value = searchParams.get(param);
        return value !== null ? value : defaultValue;
    };

    // Estado de filtros adaptado
    const [filtros, setFiltros] = useState({
        checkIn: obtenerFiltroDesdeUrl("checkIn"),
        checkOut: obtenerFiltroDesdeUrl("checkOut"),
        adultos: obtenerFiltroDesdeUrl("adultos", "0"),
        ninos: obtenerFiltroDesdeUrl("ninos", "0"),
        habitaciones: obtenerFiltroDesdeUrl("habitaciones", "0"),
        servicios: obtenerFiltroDesdeUrl("servicios", []),
        estrellas: obtenerFiltroDesdeUrl("estrellas", "0"),
    });

    // Actualiza la URL cada vez que cambian los filtros
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value && value !== "0") params.set(key, value); // No ponemos filtros vacíos o en cero
        });
        navigate(`?${params.toString()}`, { replace: true });
    }, [filtros, navigate]);

    // Obtener cabañas filtradas desde la API
    const obtenerCabañas = async () => {
        setCargando(true);
        let url = Global.url + "cabin/getActiveCabins";

        const paramsPeticion = {
            checkIn: filtros.checkIn,
            checkOut: filtros.checkOut,
            cantidadPersonas: Number(filtros.adultos) + Number(filtros.ninos),
            cantidadHabitaciones: Number(filtros.habitaciones),
            ...(filtros.servicios && { servicios: filtros.servicios }),
        };

        try {
            const { datos } = await Peticion(url, "GET", paramsPeticion, true, "include");

            if (datos && datos.cabins) {
                const cabañasConRatings = await Promise.all(
                    datos.cabins.map(async (cabaña) => {
                        try {
                            if (cabaña.comentarios?.length > 0) {
                                const reviewsUrl = `${Global.url}reviews/getReviewsByCabin/${cabaña._id}`;
                                const reviewsResponse = await Peticion(reviewsUrl, "GET", "", false, "include");

                                const reviews = reviewsResponse?.datos?.reviews || [];
                                const ratings = reviews
                                    .map((review) => Number(review.rating))
                                    .filter((rating) => !isNaN(rating));

                                const promedioRating =
                                    ratings.length > 0
                                        ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length
                                        : 0;

                                return {
                                    ...cabaña,
                                    promedioRating: parseFloat(promedioRating.toFixed(2)),
                                    reviews,
                                };
                            }
                            return { ...cabaña, promedioRating: 0 };
                        } catch (error) {
                            console.error("Error obteniendo reviews:", error);
                            return { ...cabaña, promedioRating: 0 };
                        }
                    })
                );

                // 🔹 Filtrar por disponibilidad y por puntuación mínima
                const cabañasFiltradas = cabañasConRatings.filter(
                    (cabaña) =>
                        cabaña.promedioRating >= Number(filtros.estrellas || 0)
                );

                setCabañas(cabañasFiltradas);
            }
        } catch (error) {
            console.error("Error obteniendo cabañas:", error);
        } finally {
            setCargando(false);
        }
    };

    // Obtener filtros dinámicos
    const obtenerServicios = async () => {
        let url = Global.url + "cabin/getServices";
        try {
            const { datos } = await Peticion(url, "GET", null, false);
            if (datos && datos.services) {
                setServicios(datos.services);
            }
        } catch (error) {
            console.error("Error obteniendo filtros:", error);
        }
    };

    // Ejecutar búsquedas cuando cambian los filtros
    useEffect(() => {
        obtenerCabañas();
    }, [filtros]);

    // Obtener todas las cabañas al cargar la página
    useEffect(() => {
        obtenerServicios();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row my-8 pt-24 mx-6 md:mx-24 gap-6">
            <div className="lg:w-1/4 w-full self-start bg-white p-4 rounded-lg shadow-md">
                <Buscador
                    setFiltros={setFiltros}
                    filtros={filtros}
                    todasLasCabañas={cabañas}
                    cabañas={cabañas}
                    servicios={servicios}
                />
            </div>

            <div className="lg:w-3/4 min-h-screen">
                <ListadoCabañas
                    cabañas={cabañas}
                    cargando={cargando}
                    checkIn={filtros.checkIn}
                    checkOut={filtros.checkOut}
                />
            </div>
        </div>
    );
};
