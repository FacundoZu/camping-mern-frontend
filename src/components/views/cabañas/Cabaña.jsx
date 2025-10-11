import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import {
    PiUsersThreeFill,
    PiToiletBold,
    PiStarFill
} from "react-icons/pi";
import {
    MdOutlineBedroomChild
} from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import ComentariosList from '../../../components/utils/cabañas/ComentariosList.jsx';
import { CalendarioReservas } from '../../../components/utils/cabañas/CalendarioReservas.jsx';
import { CabañaSwiper } from '../../../components/utils/cabañas/CabañaSwiper.jsx';
import Modal from '../../../common/Modal.jsx';
import ReservaInfo from '../../../common/ReservaInfo.jsx';
import useAuth from '../../../hooks/useAuth';

export const Cabaña = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [cabaña, setCabaña] = useState(null);
    const [reservas, setReservas] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para reserva
    const [reservaData, setReservaData] = useState({
        fechaInicio: searchParams.get('checkIn'),
        fechaFinal: searchParams.get('checkOut'),
        precioTotal: 0,
        showModal: false
    });

    // Estado para modales
    const [modal, setModal] = useState({
        show: false,
        title: '',
        message: ''
    });

    const fetchData = async () => {
        if (!id) {
            setError("ID de cabaña no válido.");
            setLoading(false);
            return;
        }

        try {
            const [cabaniaData, reservasData, comentariosData] = await Promise.all([
                Peticion(`${Global.url}cabin/getCabin/${id}`, "GET", null, false, "include"),
                Peticion(`${Global.url}reservation/getReservations/${id}`, "GET", null, false, "include"),
                Peticion(`${Global.url}reviews/getReviewsByCabin/${id}`, "GET", null, false, "include")
            ]);

            setCabaña(cabaniaData.datos?.cabin || null);
            setReservas(reservasData.datos?.reservas || []);
            setComentarios(comentariosData.datos?.reviews || []);
            setLoading(false);
        } catch (err) {
            setError("Error al cargar los datos de la cabaña.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!cabaña) return;

        const timer = setTimeout(async () => {
            try {
                await Peticion(`${Global.url}user/registerVisit`, "POST", {
                    userId: auth?.id || null,
                    cabinId: id
                }, false, "include");
            } catch (error) {
                console.error("Error registrando visita:", error);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [cabaña, id, auth?.id]);

    const handleReservar = (fechas) => {
        const diasDeEstancia = (new Date(fechas.fechaFinal) - new Date(fechas.fechaInicio)) / (1000 * 60 * 60 * 24) + 1;
        const precioTotal = diasDeEstancia * cabaña.precio;

        setReservaData({
            fechaInicio: fechas.fechaInicio,
            fechaFinal: fechas.fechaFinal,
            precioTotal,
            showModal: true
        });
    };

    const handleAddReview = async (rating, comment) => {
        if (!auth?.id) {
            setModal({
                show: true,
                title: 'Error',
                message: 'Debes iniciar sesión para dejar un comentario.'
            });
            return;
        }

        try {
            const { datos } = await Peticion(
                `${Global.url}reservation/getUserReservations/${auth.id}/${cabaña._id}`,
                "GET"
            );

            if (!datos?.reservas?.length) {
                setModal({
                    show: true,
                    title: 'Error',
                    message: 'Solo los usuarios que hayan reservado esta cabaña pueden dejar un comentario.'
                });
                return;
            }

            const reservaPasada = datos.reservas.some(
                (reserva) => new Date(reserva.fechaFinal) < new Date()
            );

            if (!reservaPasada) {
                setModal({
                    show: true,
                    title: 'Error',
                    message: 'Solo puedes comentar una vez que tu reserva haya finalizado.'
                });
                return;
            }

            const result = await Peticion(
                `${Global.url}reviews/createReview`,
                "POST",
                {
                    rating,
                    comment,
                    user: auth.id,
                    cabin: cabaña._id,
                },
                false,
                "include"
            );

            if (result.datos?.success) {
                // 🔄 Refrescamos las reviews desde el servidor
                const updatedReviews = await Peticion(
                    `${Global.url}reviews/getReviewsByCabin/${cabaña._id}`,
                    "GET",
                    null,
                    false,
                    "include"
                );

                setComentarios(updatedReviews.datos?.reviews || []);

                setModal({
                    show: true,
                    title: 'Éxito',
                    message: '¡Gracias por dejar tu comentario!'
                });
            } else {
                setModal({
                    show: true,
                    title: 'Error',
                    message: result.datos?.message || 'No se pudo crear la reseña.'
                });
            }
        } catch (err) {
            console.error("Error al crear la reseña:", err);
            setModal({
                show: true,
                title: 'Error',
                message: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
            });
        }
    };

    const handleUpdateReview = async (reviewId, updatedData) => {
        try {
            const result = await Peticion(`${Global.url}reviews/updateReview/${reviewId}`, "POST", updatedData, false, "include");

            if (result.datos?.success) {
                setComentarios(prev =>
                    prev.map(comment =>
                        comment._id === reviewId
                            ? { ...comment, rating: updatedData.rating, comments: [{ text: updatedData.comment }] }
                            : comment
                    )
                );
                setModal({
                    show: true,
                    title: 'Éxito',
                    message: 'Tu reseña ha sido actualizada correctamente.'
                });
            }
        } catch (err) {
            setModal({
                show: true,
                title: 'Error',
                message: 'No se pudo actualizar la reseña. Intenta nuevamente.'
            });
        }
    };

    const calculateAverageRating = () => {
        if (!comentarios.length) return 0;
        const total = comentarios.reduce((sum, comment) => sum + comment.rating, 0);
        return (total / comentarios.length).toFixed(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando información de la cabaña...</p>
                </div>
            </div>
        );
    }

    if (error || !cabaña) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-red-500">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error || "No se encontró la cabaña."}</p>
                    <button
                        onClick={() => navigate('/cabañas')}
                        className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        Ver todas las cabañas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Hero Section */}
                <section className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">

                    <CabañaSwiper cabaña={cabaña} />

                    <div className="p-6 lg:p-8">
                        {/* Título y rating */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                    {cabaña.descripcion}
                                </h1>

                                <div className="flex items-center gap-4 flex-wrap mb-4">
                                    {comentarios.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <PiStarFill className="text-yellow-400" />
                                                <span className="font-semibold text-gray-800">
                                                    {calculateAverageRating()}
                                                </span>
                                            </div>
                                            <span className="text-gray-600">
                                                ({comentarios.length} {comentarios.length === 1 ? 'reseña' : 'reseñas'})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Precio destacado */}
                            <div className="bg-gradient-to-r from-lime-50 to-green-50 p-6 rounded-2xl border border-lime-200 text-center lg:text-right min-w-max">
                                <div className="flex items-center justify-center lg:justify-end gap-1 mb-1">
                                    <BsCurrencyDollar className="text-2xl text-lime-600" />
                                    <span className="text-3xl font-bold text-gray-900">
                                        {cabaña.precio?.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm">por noche</p>
                                {cabaña.minimoDias > 1 && (
                                    <p className="text-xs text-lime-600 mt-1 font-medium">
                                        Mínimo {cabaña.minimoDias} noches
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Características principales */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                                <PiUsersThreeFill className="text-3xl text-lime-600 mx-auto mb-2" />
                                <p className="font-semibold text-gray-800">{cabaña.cantidadPersonas}</p>
                                <p className="text-sm text-gray-600">Personas</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                                <MdOutlineBedroomChild className="text-3xl text-lime-600 mx-auto mb-2" />
                                <p className="font-semibold text-gray-800">{cabaña.cantidadHabitaciones}</p>
                                <p className="text-sm text-gray-600">Habitaciones</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                                <PiToiletBold className="text-3xl text-lime-600 mx-auto mb-2" />
                                <p className="font-semibold text-gray-800">{cabaña.cantidadBaños}</p>
                                <p className="text-sm text-gray-600">Baños</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Servicios */}
                {cabaña.servicios && cabaña.servicios.some(s => s.estado === 'Habilitado') && (
                    <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Servicios incluidos
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {cabaña.servicios.map(servicio => (
                                servicio.estado === 'Habilitado' && (
                                    <div
                                        key={servicio._id}
                                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
                                    >
                                        <div className="flex flex-col items-center text-center h-full">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                                <img
                                                    src={servicio.imagen}
                                                    alt={servicio.nombre}
                                                    className="w-10 h-10 object-contain"
                                                />
                                            </div>
                                            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                                                {servicio.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {servicio.descripcion}
                                            </p>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </section>
                )}

                {/* Layout responsivo para calendario y comentarios */}
                <div className="3 gap-8">
                    {/* Calendario de reservas */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg lg:p-8 mb-8">
                            <CalendarioReservas
                                reservas={reservas}
                                onReservar={handleReservar}
                                precioPorNoche={cabaña.precio}
                                minimoDias={cabaña.minimoDias}
                            />
                        </div>
                    </div>
                </div>

                {cabaña?.ubicacion?.coordinates &&
                    cabaña.ubicacion.coordinates.length === 2 &&
                    !isNaN(cabaña.ubicacion.coordinates[0]) &&
                    !isNaN(cabaña.ubicacion.coordinates[1]) && (
                        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] mb-6 rounded-lg overflow-hidden bg-gray-100">
                            <iframe
                                src={`https://www.google.com/maps?q=${cabaña.ubicacion.coordinates[1]},${cabaña.ubicacion.coordinates[0]}&hl=es;z=15&output=embed`}
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                title={`Mapa de ${cabaña.nombre}`}
                            ></iframe>
                        </div>
                    )}

                <ComentariosList
                    reviews={comentarios}
                    resumenIa={cabaña.resumenIa}
                    onAddReview={handleAddReview}
                    onUpdateReview={handleUpdateReview}
                    userId={auth?.id}
                />
            </div>

            {/* Modales */}
            <ReservaInfo
                isOpen={reservaData.showModal}
                onClose={() => setReservaData(prev => ({ ...prev, showModal: false }))}
                cabaña={cabaña}
                auth={auth}
                fechaInicio={reservaData.fechaInicio}
                fechaFinal={reservaData.fechaFinal}
                precioTotal={reservaData.precioTotal}
                setReservaData={setReservaData}
            />

            <Modal
                isOpen={modal.show}
                onClose={() => setModal(prev => ({ ...prev, show: false }))}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
};