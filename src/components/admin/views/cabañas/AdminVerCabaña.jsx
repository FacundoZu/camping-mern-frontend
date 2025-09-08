import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Peticion } from "../../../../helpers/Peticion";
import { Global } from "../../../../helpers/Global";
import { CalendarioConReservas } from "./CalendarioConReservas";
import { FaStar } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

const AdminVerCabaña = () => {
    const { id } = useParams();
    const [cabaña, setCabaña] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [reservas, setReservas] = useState([]);
    const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
    const [comentarios, setComentarios] = useState([])
    const [reservasMensuales, setReservasMensuales] = useState(Array(12).fill(0));

    const [gananciasTotales, setGananciasTotales] = useState(0)

    const añosDisponibles = [2022, 2023, 2024];

    const obtenerCabañaYReservas = async () => {
        const urlCabania = `${Global.url}cabin/getCabin/${id}`;
        const { datos: datosCabania } = await Peticion(
            urlCabania,
            "GET",
            null,
            false,
            "include"
        );

        if (datosCabania) {
            setCabaña(datosCabania.cabin);
            setCargando(false);

            const urlReservas = `${Global.url}reservation/getAllReservationsCabin/${id}`;
            const { datos } = await Peticion(urlReservas, "GET", null, false, "include");
            if (datos.reservas) {
                setReservas(datos.reservas);
                calcularReservasMensuales(datos.reservas, new Date().getFullYear());
            }

            const urlComentarios = `${Global.url}reviews/getReviewsByCabin/${id}`;
            const data = await Peticion(
                urlComentarios,
                "GET",
                null,
                false,
                "include"
            );

            if (data.datos.reviews) {
                setComentarios(data.datos.reviews);
            }
        }
    };

    useEffect(() => {
        if (reservas.length > 0) {
            calcularReservasMensuales(reservas, añoSeleccionado);
        }
    }, [añoSeleccionado, reservas]);

    useEffect(() => {
        obtenerCabañaYReservas();
    }, [id]);

    const calcularReservasMensuales = (reservas, año) => {
        const mensualidades = Array(12).fill(0);
        let gananciasTotales = 0;

        reservas.forEach((reserva) => {
            const fechaInicio = new Date(reserva.fechaInicio);
            if (fechaInicio.getFullYear() === parseInt(año, 10)) {
                mensualidades[fechaInicio.getMonth()] += reserva.precioTotal;
                gananciasTotales += reserva.precioTotal;
            }
        });

        setGananciasTotales(gananciasTotales);
        setReservasMensuales(mensualidades);
    };

    const dataReservasMensuales = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
            {
                label: 'Ingresos Mensuales ($)',
                data: reservasMensuales,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.1,
            },
        ],
    };

    const opcionesGrafico = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    const handleAñoChange = (e) => {
        setAñoSeleccionado(parseInt(e.target.value));
    };

    const obtenerUsuarioPorId = async (usuarioId) => {
        try {
            const urlUser = `${Global.url}user/profile/${usuarioId}`;
            const response = await Peticion(urlUser, "GET", '', false, 'include');

            if (response.datos.status === 'success') {
                return {
                    usuario: response.datos.user.name,
                    correo: response.datos.user.email,
                    phone: response.datos.user.phone,
                };
            }
            return { usuario: 'Usuario desconocido', correo: 'No disponible' };
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return { usuario: 'Usuario desconocido', correo: 'No disponible' };
        }
    };

    const generarPdfCabaña = () => {
        const doc = new jsPDF();
        const fechaReporte = new Date();
        const fechaFormateada = fechaReporte.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de la Cabaña", 105, 20, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(10, 25, 200, 25);

        if (cabaña) {
            doc.setFontSize(14);
            doc.text("Información General", 10, 35);
            doc.setLineWidth(0.2);
            doc.line(10, 37, 60, 37);

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Nombre: ${cabaña.nombre}`, 10, 45);
            doc.text(`Precio por Noche: $${cabaña.precio}`, 10, 55);
            doc.text(`Descripción: ${cabaña.descripcion}`, 10, 65);
            doc.text(`Estado: ${cabaña.estado}`, 10, 75);
            doc.text(`Capacidad: ${cabaña.cantidadPersonas} personas`, 10, 85);
            doc.text(`Habitaciones: ${cabaña.cantidadHabitaciones}`, 10, 95);
            doc.text(`Baños: ${cabaña.cantidadBaños}`, 10, 105);

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Datos Anuales", 10, 120);
            doc.setLineWidth(0.2);
            doc.line(10, 122, 60, 122);

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Año: ${añoSeleccionado}`, 10, 130);
            doc.text(
                `Ganancias Totales: ${gananciasTotales.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`,
                10,
                140
            );
            doc.text(`Cantidad de Reservas: ${reservas.length}`, 10, 150);
        }

        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`Fecha del reporte: ${fechaFormateada}`, 10, 290);
        doc.text("Reporte generado automáticamente", 105, 290, { align: "center" });

        doc.output("dataurlnewwindow");
    };



    const generarPdfReservas = async () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Reservas de la Cabaña", 10, 10);
        doc.setLineWidth(0.5);
        doc.line(10, 12, 200, 12);

        if (cabaña) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`ID de la Cabaña: ${cabaña._id}`, 10, 20);
            doc.text(`Nombre de la Cabaña: ${cabaña.nombre}`, 10, 30);
            doc.setLineWidth(0.5);
            doc.line(10, 35, 200, 35);
        }

        doc.text("Reservas:", 10, 40);
        doc.setLineWidth(0.5);
        doc.line(10, 42, 200, 42);

        const reservasConUsuarios = await Promise.all(
            reservas.map(async (reserva, index) => {
                const { usuario, correo, phone } = await obtenerUsuarioPorId(reserva.usuarioId);
                const fechaInicio = new Date(reserva.fechaInicio).toLocaleDateString();
                const fechaFin = new Date(reserva.fechaFinal).toLocaleDateString();

                return {
                    usuario,
                    correo,
                    phone,
                    fechaInicio,
                    fechaFin,
                    index,
                };
            })
        );

        if (reservasConUsuarios.length > 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");

            reservasConUsuarios.forEach(({ usuario, correo, phone, fechaInicio, fechaFin, index }) => {
                const yPosition = 50 + index * 20;

                doc.text(
                    `${index + 1}. Usuario: ${usuario}`,
                    10,
                    yPosition
                );
                doc.text(
                    `Correo: ${correo}`,
                    50,
                    yPosition
                );
                doc.text(
                    `Telefono: ${phone}`,
                    120,
                    yPosition
                );
                doc.text(
                    `Fecha de inicio: ${fechaInicio}, Fecha de fin: ${fechaFin}`,
                    10,
                    yPosition + 10
                );
            });
        } else {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("No hay reservas para esta cabaña.", 10, 50);
        }

        const pdfData = doc.output('dataurlnewwindow');
    };

    const cambiarEstado = async (id, estadoActual) => {
        let url = Global.url + `reviews/cambiarEstado/${id}`;

        const nuevoEstado = estadoActual === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';

        const { datos } = await Peticion(url, "PUT", { estado: nuevoEstado }, false, 'include');

        if (datos && datos.status === 'success') {
            setComentarios((prevComentarios) =>
                prevComentarios.map((comentarios) =>
                    comentarios._id === id ? { ...comentarios, estado: datos.review.estado } : comentarios
                )
            );
        } else {
            console.error("No se pudo actualizar el estado del comentarios");
        }
    };

    if (cargando) return <p>Cargando...</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Detalles de la Cabaña</h2>
                <Link
                    to="/admin/cabañas"
                    className="text-lime-600 hover:text-lime-700 transition duration-200"
                >
                    Volver al listado
                </Link>
            </div>
            <hr className="mb-6 "/>
            <div className="flex mb-6">
                <div className="mx-auto space-x-4">
                    <Link
                        to={`/admin/EditarCabaña/${id}`}
                        className="bg-lime-600 hover:bg-lime-700 text-white transition duration-200 rounded-lg p-2"
                    >
                        Editar esta Cabaña
                    </Link>
                    <button
                        onClick={generarPdfCabaña}
                        className="bg-lime-600 hover:bg-lime-700 text-white transition duration-200 rounded-lg p-2"
                    >
                        Descargar PDF de la Cabaña
                    </button>
                    <button
                        onClick={generarPdfReservas}
                        className="bg-lime-600 hover:bg-lime-700 text-white transition duration-200 rounded-lg p-2"
                    >
                        Descargar PDF de Reservas
                    </button>
                </div>
            </div>
            <hr className="mb-6"/>

            <div className="flex mb-6">
                <div className="bg-white p-6 border border-gray-300 rounded-lg mx-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Información de la Cabaña</h3>
                    <div className="space-y-2">
                        <p className="text-gray-600"><strong className="text-gray-800">Nombre:</strong> {cabaña.nombre}</p>
                        <p className="text-gray-600"><strong className="text-gray-800">Precio por Noche:</strong> ${cabaña.precio}</p>
                        <p className="text-gray-600"><strong className="text-gray-800">Descripción:</strong> {cabaña.descripcion}</p>
                        <p className="text-gray-600"><strong className="text-gray-800">Estado:</strong> {cabaña.estado}</p>
                        <p className="text-gray-600"><strong className="text-gray-800">Capacidad:</strong> {cabaña.cantidadPersonas} personas</p>
                        <p className="text-gray-600"><strong className="text-gray-800">Habitaciones:</strong> {cabaña.cantidadHabitaciones}</p>
                        <p className="text-gray-600"><strong className="text-gray-800">Baños:</strong> {cabaña.cantidadBaños}</p>
                        <hr />
                        <p className="text-lg font-semibold text-gray-800">
                            <span className="text-gray-600 font-bold">Ganancias Totales Anual: </span>
                            <span className="text-lime-600">
                                ${gananciasTotales.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-6">
                <div className="bg-lime-600 p-4 rounded-lg shadow-md flex items-center">
                    <label htmlFor="año" className="mr-4 font-semibold text-white">Filtrar por año:</label>
                    <select
                        id="año"
                        value={añoSeleccionado}
                        onChange={handleAñoChange}
                        className="border border-gray-300 rounded-lg p-2 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
                    >
                        {añosDisponibles.map((año) => (
                            <option key={año} value={año}>{año}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-8 flex flex-col justify-center items-center">
                <h3 className="text-xl font-semibold text-center mb-4">Ingresos por Mes</h3>
                <div style={{ height: '300px', width: '100%' }} className="flex justify-center items-center">
                    <div className="w-full max-w-xl">
                        <Line data={dataReservasMensuales} options={opcionesGrafico} />
                    </div>
                </div>
            </div>

            <div className="min-h-screen items-center justify-center bg-gray-100 hidden sm:inline">
                <CalendarioConReservas reservas={reservas} />
            </div>

            <div className="mt-8">
                <h3 className="text-2xl font-bold text-lime-700 mb-6 text-center">Comentarios</h3>
                {comentarios.length > 0 ? (
                    comentarios.map((comentario) => (
                        <div
                            key={comentario._id}
                            className="bg-white border border-gray-200 p-5 rounded-lg shadow-lg mb-5 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="mb-3">
                                <p className="text-sm text-gray-500">
                                    <strong className="text-gray-700">Usuario:</strong> {comentario.user?.name || "Usuario desconocido"}
                                </p>
                            </div>
                            <div className="flex mb-4">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <FaStar
                                        key={index}
                                        className={`cursor-pointer ${index < comentario.rating ? "text-yellow-500" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <div className="mb-3">
                                <p className="text-gray-700">
                                    <strong>Comentario:</strong> {comentario.comments?.[0]?.text || "Sin comentarios"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">
                                    <strong>Estado:</strong>{" "}
                                    <span
                                        className={`font-semibold ${comentario.estado === "Habilitado" ? "text-lime-600" : "text-red-600"}`}
                                    >
                                        {comentario.estado}
                                    </span>
                                </p>
                                <button
                                    onClick={() =>
                                        comentario.estado !== "Habilitado"
                                            ? cambiarEstado(comentario._id, "Deshabilitado")
                                            : cambiarEstado(comentario._id, "Habilitado")
                                    }
                                    className={`text-sm font-semibold py-2 px-4 rounded transition duration-200 focus:outline-none ${comentario.estado === "Habilitado"
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-lime-500 hover:bg-lime-600 text-white"
                                        }`}
                                >
                                    {comentario.estado === "Habilitado" ? "Deshabilitar" : "Habilitar"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No hay comentarios para esta cabaña.</p>
                )}
            </div>

        </div>
    );
};

export default AdminVerCabaña;
