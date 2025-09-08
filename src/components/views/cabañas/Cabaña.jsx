import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import ComentariosList from '../../../components/utils/cabañas/ComentariosList.jsx';
import { CalendarioReservas } from '../../../components/utils/cabañas/CalendarioReservas.jsx';
import { CabañaSwiper } from '../../../components/utils/cabañas/CabañaSwiper.jsx';
import { CalendarioModal } from '../../../components/utils/cabañas/CalendarioModal.jsx';
import Modal from '../../../common/Modal.jsx';
import ReservaInfo from '../../../common/ReservaInfo.jsx';
import useAuth from '../../../hooks/useAuth';

export const Cabaña = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
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
    const [showCalModal, setShowCalModal] = useState(false);

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
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();

        const timer = setTimeout(async () => {
            if (cabaña) {
                await Peticion(`${Global.url}user/registerVisit`, "POST", {
                    userId: auth?.id || null,
                    cabinId: id
                });
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [id]);

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

            const reservaPasada = datos.reservas.some(reserva => 
                new Date(reserva.fechaFinal) < new Date()
            );

            if (!reservaPasada) {
                setModal({
                    show: true,
                    title: 'Error',
                    message: 'Solo puedes comentar una vez que tu reserva haya finalizado.'
                });
                return;
            }

            const result = await Peticion(`${Global.url}reviews/createReview`, "POST", {
                rating,
                comment,
                user: auth.id,
                cabin: cabaña._id,
            });

            if (result.datos?.success) {
                setComentarios(prev => [...prev, result.datos.review]);
                setModal({
                    show: true,
                    title: 'Éxito',
                    message: '¡Gracias por dejar tu comentario!'
                });
            }
        } catch (err) {
            console.error("Error al agregar reseña:", err);
            setModal({
                show: true,
                title: 'Error',
                message: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
            });
        }
    };

    if (loading) return <div className="text-center text-gray-500 text-xl py-8">Cargando información...</div>;
    if (!cabaña) return <div className="text-center text-gray-500">No se encontró la cabaña.</div>;

    return (
        <div className="container mx-auto p-6 max-w-screen-xl">
            <section className="bg-white rounded-lg shadow-md overflow-hidden">
                <CabañaSwiper cabaña={cabaña} />
                <h1 className="text-2xl font-semibold text-center pt-12">{cabaña.descripcion}</h1>
                <div className="p-4 max-w-5xl mx-auto">
                    {cabaña.servicios && (
                        <div className="mt-6">
                            <div className="flex flex-wrap">
                                {cabaña.servicios.map(servicio => (
                                    servicio.estado === 'Habilitado' && (
                                        <div key={servicio._id} className="grid grid-rows-3 gap-0 p-4 bg-white m-auto h-44 w-60">
                                            <img src={servicio.imagen} alt={servicio.nombre} className="w-12 h-12 mx-auto mb-2 object-cover" />
                                            <p className="text-base text-gray-700 font-medium text-center my-auto">
                                                {servicio.nombre}
                                            </p>
                                            <p className="text-sm text-gray-400 font-medium text-center leading-snug mt-1">
                                                {servicio.descripcion}
                                            </p>
                                        </div>
                                    )
                                ))}
                            </div>
                            <div className='flex flex-wrap gap-4 mt-4 mx-10'>
                                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 flex-1 border border-lime-300">
                                    <PiUsersThreeFill className="text-2xl text-lime-600" />
                                    <p className="text-gray-700">{cabaña.cantidadPersonas} Personas</p>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 flex-1 border border-lime-300">
                                    <MdOutlineBedroomChild className="text-2xl text-lime-600" />
                                    <p className="text-gray-700">{cabaña.cantidadHabitaciones} Habitaciones</p>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 flex-1 border border-lime-300">
                                    <PiToiletBold className="text-2xl text-lime-600" />
                                    <p className="text-gray-700">{cabaña.cantidadBaños} Baños</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="min-h-screen items-center justify-center bg-gray-100 hidden sm:inline">
                        <CalendarioReservas 
                            reservas={reservas} 
                            onReservar={handleReservar} 
                            precioPorNoche={cabaña.precio} 
                            minimoDias={cabaña.minimoDias} 
                        />
                    </div>
                    
                    <div className='sm:hidden mt-4'>
                        <button 
                            onClick={() => setShowCalModal(true)} 
                            className='flex items-center m-auto bg-lime-400 hover:bg-lime-600 p-3 rounded-lg text-center'
                        >
                            <FaCalendarAlt className='mr-2' />
                            Ver calendario de reservas
                        </button>
                        <CalendarioModal 
                            isOpen={showCalModal} 
                            onClose={() => setShowCalModal(false)} 
                            reservas={reservas} 
                            onReservar={handleReservar} 
                            precioPorNoche={cabaña.precio} 
                        />
                    </div>

                    <div className='mt-4'>
                        <ComentariosList
                            reviews={comentarios}
                            onAddReview={handleAddReview}
                            userId={auth?.id}
                        />
                    </div>
                </div>
            </section>

            <ReservaInfo
                isOpen={reservaData.showModal}
                onClose={() => setReservaData(prev => ({...prev, showModal: false}))}
                cabaña={cabaña}
                auth={auth}
                fechaInicio={reservaData.fechaInicio}
                fechaFinal={reservaData.fechaFinal}
                precioTotal={reservaData.precioTotal}
            />

            <Modal
                isOpen={modal.show}
                onClose={() => setModal(prev => ({...prev, show: false}))}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
};