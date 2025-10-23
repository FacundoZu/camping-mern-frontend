import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Peticion } from "../../../../helpers/Peticion";
import { Global } from "../../../../helpers/Global";
import { CalendarioConReservas } from "./CalendarioConReservas";
import { FaStar } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

const AdminVerCabaña = () => {
    const { id } = useParams();
    const [cabaña, setCabaña] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [reservas, setReservas] = useState([]);
    const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
    const [comentarios, setComentarios] = useState([]);
    const [reservasMensuales, setReservasMensuales] = useState(Array(12).fill(0));
    const [gananciasTotales, setGananciasTotales] = useState(0);
    const [añosDisponibles, setAñosDisponibles] = useState([]);
    const [cargandoResumen, setCargandoResumen] = useState(false);

    // Obtener cabaña, reservas y comentarios
    const obtenerCabañaYReservas = async () => {
        try {
            const { datos: datosCabania } = await Peticion(`${Global.url}cabin/getCabin/${id}`, "GET", null, false, "include");
            if (datosCabania?.cabin) {
                setCabaña(datosCabania.cabin);

                const { datos } = await Peticion(`${Global.url}reservation/getAllReservationsCabin/${id}`, "GET", null, false, "include");
                if (datos?.reservas) {
                    setReservas(datos.reservas);

                    // Generar años dinámicos
                    const años = Array.from(new Set(datos.reservas.map(r => new Date(r.fechaInicio).getFullYear())))
                        .sort((a, b) => b - a);
                    setAñosDisponibles(años);
                    setAñoSeleccionado(años[0] || new Date().getFullYear());

                    calcularReservasMensuales(datos.reservas, años[0] || new Date().getFullYear());
                }

                const { datos: comentariosData } = await Peticion(`${Global.url}reviews/getReviewsByCabin/${id}`, "GET", null, false, "include");
                if (comentariosData?.reviews) setComentarios(comentariosData.reviews);

                setCargando(false);
            }
        } catch (err) {
            console.error(err);
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerCabañaYReservas();
    }, [id]);

    useEffect(() => {
        if (reservas.length > 0 && añoSeleccionado) {
            calcularReservasMensuales(reservas, añoSeleccionado);
        }
    }, [añoSeleccionado, reservas]);

    const calcularReservasMensuales = (reservas, año) => {
        const mensualidades = Array(12).fill(0);
        let total = 0;

        reservas.forEach(reserva => {
            const fechaInicio = new Date(reserva.fechaInicio);
            if (fechaInicio.getFullYear() === parseInt(año, 10)) {
                mensualidades[fechaInicio.getMonth()] += reserva.precioTotal;
                total += reserva.precioTotal;
            }
        });

        setReservasMensuales(mensualidades);
        setGananciasTotales(total);
    };

    const regenerarResumen = async (id) => {
        try {
            setCargandoResumen(true);
            const response = await Peticion(`${Global.url}cabin/regenerateSummary/${id}`, "PUT", '', false, 'include');

            if (response.datos.resumen) {
                obtenerCabañaYReservas();
                toast.success('Resumen regenerado correctamente');
                setCargandoResumen(false);
            }
        } catch {
            console.error('Error al regenerar resumen');
            setCargandoResumen(false);
        }
    };

    const handleAñoChange = (e) => setAñoSeleccionado(parseInt(e.target.value));

    const obtenerUsuarioPorId = async (usuarioId) => {
        try {
            const response = await Peticion(`${Global.url}user/profile/${usuarioId}`, "GET", '', false, 'include');
            if (response.datos.status === 'success') {
                return {
                    usuario: response.datos.user.name,
                    correo: response.datos.user.email,
                    phone: response.datos.user.phone,
                };
            }
            return { usuario: 'Usuario desconocido', correo: 'No disponible', phone: 'No disponible' };
        } catch {
            return { usuario: 'Usuario desconocido', correo: 'No disponible', phone: 'No disponible' };
        }
    };

    const generarPdfCabaña = () => {
        const doc = new jsPDF();
        const fechaReporte = new Date().toLocaleDateString("es-ES");

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de la Cabaña", 105, 20, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(10, 25, 200, 25);

        if (cabaña) {
            doc.setFontSize(14);
            doc.text("Información General", 10, 35);
            doc.setFontSize(12);
            doc.text(`Nombre: ${cabaña.nombre}`, 10, 45);
            doc.text(`Precio por Noche: $${cabaña.precio}`, 10, 55);
            doc.text(`Descripción: ${cabaña.descripcion}`, 10, 65);
            doc.text(`Estado: ${cabaña.estado}`, 10, 75);
            doc.text(`Capacidad: ${cabaña.cantidadPersonas} personas`, 10, 85);
            doc.text(`Habitaciones: ${cabaña.cantidadHabitaciones}`, 10, 95);
            doc.text(`Baños: ${cabaña.cantidadBaños}`, 10, 105);

            doc.setFont("helvetica", "bold");
            doc.text("Datos Anuales", 10, 120);
            doc.setFont("helvetica", "normal");
            doc.text(`Año: ${añoSeleccionado}`, 10, 130);
            doc.text(`Ganancias Totales: $${gananciasTotales.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`, 10, 140);
            doc.text(`Cantidad de Reservas: ${reservas.filter(r => new Date(r.fechaInicio).getFullYear() === añoSeleccionado).length}`, 10, 150);
        }

        doc.setFontSize(10);
        doc.text(`Fecha del reporte: ${fechaReporte}`, 10, 290);
        doc.text("Reporte generado automáticamente", 105, 290, { align: "center" });
        doc.output("dataurlnewwindow");
    };

    const generarPdfReservas = async () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Reservas de la Cabaña", 10, 10);
        doc.line(10, 12, 200, 12);

        if (cabaña) {
            doc.setFontSize(12);
            doc.text(`ID: ${cabaña._id}`, 10, 20);
            doc.text(`Nombre: ${cabaña.nombre}`, 10, 30);
            doc.line(10, 35, 200, 35);
        }

        const reservasConUsuarios = await Promise.all(
            reservas.map(async (reserva, index) => {
                const { usuario, correo, phone } = await obtenerUsuarioPorId(reserva.usuarioId);
                return {
                    usuario,
                    correo,
                    phone,
                    fechaInicio: new Date(reserva.fechaInicio).toLocaleDateString(),
                    fechaFin: new Date(reserva.fechaFinal).toLocaleDateString(),
                    index
                };
            })
        );

        reservasConUsuarios.forEach(({ usuario, correo, phone = "-", fechaInicio, fechaFin, index }) => {
            const y = 50 + index * 20;
            doc.text(`${index + 1}. Usuario: ${usuario}`, 10, y);
            doc.text(`Correo: ${correo}`, 50, y);
            doc.text(`Telefono: ${phone}`, 120, y);
            doc.text(`Fechas: ${fechaInicio} - ${fechaFin}`, 10, y + 10);
        });

        doc.output("dataurlnewwindow");
    };

    const cambiarEstado = async (idComentario, estadoActual) => {
        try {
            const { datos } = await Peticion(`${Global.url}reviews/cambiarEstado/${idComentario}`, "PUT", { estado: estadoActual === 'Habilitado' ? 'Deshabilitado' : 'Habilitado' }, false, 'include');
            if (datos?.status === 'success') {
                setComentarios(prev => prev.map(c => c._id === idComentario ? { ...c, estado: datos.review.estado } : c));
            }
        } catch (err) {
            console.error("No se pudo actualizar el estado del comentario", err);
        }
    };

    if (cargando) return <p className="text-center mt-6">Cargando...</p>;

    const dataReservasMensuales = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
            label: 'Ingresos Mensuales ($)',
            data: reservasMensuales,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.1,
        }],
    };

    return (
        <motion.div
            className="p-8 bg-white rounded-2xl shadow-xl max-w-screen-xl mx-auto space-y-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* CABECERA */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                    Detalles de la Cabaña
                </h2>
                <Link
                    to="/admin/cabañas"
                    className="text-lime-700 hover:text-lime-800 font-medium transition-colors"
                >
                    ← Volver al listado
                </Link>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Link
                    to={`/admin/EditarCabaña/${id}`}
                    className="bg-lime-600 hover:bg-lime-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                >
                    Editar Cabaña
                </Link>
                <button
                    onClick={generarPdfCabaña}
                    className="bg-lime-600 hover:bg-lime-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                >
                    Descargar PDF
                </button>
                <button
                    onClick={generarPdfReservas}
                    className="bg-lime-600 hover:bg-lime-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                >
                    PDF de Reservas
                </button>
            </motion.div>

            {/* INFORMACIÓN DE LA CABAÑA */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Información General
                </h3>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
                    <p><span className="font-semibold text-gray-900">Nombre:</span> {cabaña.nombre}</p>
                    <p><span className="font-semibold text-gray-900">Precio por noche:</span> ${cabaña.precio}</p>
                    <p><span className="font-semibold text-gray-900">Estado:</span> {cabaña.estado}</p>
                    <p><span className="font-semibold text-gray-900">Capacidad:</span> {cabaña.cantidadPersonas} personas</p>
                    <p><span className="font-semibold text-gray-900">Habitaciones:</span> {cabaña.cantidadHabitaciones}</p>
                    <p><span className="font-semibold text-gray-900">Baños:</span> {cabaña.cantidadBaños}</p>
                </div>

                <div className="mt-6 border-t pt-4">
                    <p className="text-gray-700 mb-2">{añoSeleccionado}</p>
                    <p>
                        <strong>Reservas:</strong>{" "}
                        {reservas.filter(r => new Date(r.fechaInicio).getFullYear() === añoSeleccionado).length}
                    </p>
                    <p className="mt-2 text-lg font-medium text-gray-800">
                        Ganancias Anuales:{" "}
                        <span className="text-lime-600 font-semibold">
                            ${gananciasTotales.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </span>
                    </p>
                </div>
            </div>

            {/* FILTRO DE AÑO */}


            {/* GRÁFICO */}
            <div className="mt-4">
                <div className="flex justify-between text-xl font-semibold text-gray-900 gap-6 p-2">
                    <h3 className="align-center text-center">
                        Ingresos por Mes
                    </h3>
                    <div className="flex gap-2">
                        <label htmlFor="año" className="font-semibold">Filtrar por año:</label>
                        <select
                            id="año"
                            value={añoSeleccionado}
                            onChange={handleAñoChange}
                            className="rounded-lg px-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400"
                        >
                            {añosDisponibles.map(año => (
                                <option key={año} value={año}>{año}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto">
                    <Line
                        data={dataReservasMensuales}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: 'top' } }
                        }}
                    />
                </div>
            </div>
            <div className="bg-gray-100 rounded-xl py-6 hidden sm:flex justify-center">
                <CalendarioConReservas reservas={reservas} />
            </div>

            <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="text-2xl font-bold text-lime-700 text-center">
                    Comentarios
                </h3>

                {cabaña.resumenIa && (
                    <div className="bg-gradient-to-br from-lime-50 to-green-50 border border-lime-100 rounded-xl p-5 shadow-md">
                        <div className="flex-1 mb-3">
                            <p className="text-gray-700 italic mb-3">“{cabaña.resumenIa}”</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => regenerarResumen(cabaña._id)}
                                    className="text-sm font-medium justify-end py-2 px-4 rounded-lg bg-lime-600 hover:bg-lime-700 text-white transition disabled:animate-pulse"
                                    disabled={cargandoResumen}
                                >
                                    {cargandoResumen ? "Regenerando..." : "Regenerar Resumen"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                            <motion.div
                                key={comentario._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-sm text-gray-500">
                                        <strong>Usuario:</strong> {comentario.user?.name || "Desconocido"}
                                    </p>
                                    <p className={`text-sm font-medium ${comentario.estado === "Habilitado" ? "text-lime-600" : "text-red-600"}`}>
                                        {comentario.estado}
                                    </p>
                                </div>

                                <div className="flex mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`h-5 w-5 ${i < comentario.rating ? "text-yellow-500" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-700 mb-4">{comentario.comments?.[0]?.text || "Sin comentarios"}</p>

                                <div className="text-right">
                                    <button
                                        onClick={() => cambiarEstado(comentario._id, comentario.estado)}
                                        className={`text-sm font-medium py-2 px-4 rounded-lg transition ${comentario.estado === "Habilitado"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-lime-500 hover:bg-lime-600 text-white"
                                            }`}
                                    >
                                        {comentario.estado === "Habilitado" ? "Deshabilitar" : "Habilitar"}
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.p
                            className="text-gray-500 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No hay comentarios para esta cabaña.
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );

};

export default AdminVerCabaña;
