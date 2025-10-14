import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Peticion } from "../../../../helpers/Peticion";
import { Global } from "../../../../helpers/Global";
import { isValid, parse } from "date-fns";

const AdminCrearReserva = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    const [reservaData, setReservaData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        documento: "",
        fechaInicio: checkIn || "",
        fechaFinal: checkOut || "",
        precioTotal: 0,
        metodoPago: "efectivo",
    });

    const [loading, setLoading] = useState(false);
    const [precioPorNoche, setPrecioPorNoche] = useState(0);

    const parseDate = (dateString) => {
        if (!dateString) return null;

        let parsed = parse(dateString, "dd-MM-yyyy", new Date());

        if (!isValid(parsed)) {
            parsed = parse(dateString, "yyyy-MM-dd", new Date());
        }

        return isValid(parsed) ? parsed : null;
    };

    useEffect(() => {
        const fetchCabinData = async () => {
            try {
                const { datos } = await Peticion(`${Global.url}cabin/getCabin/${id}`, "GET");

                if (!datos?.cabin) {
                    toast.error("No se encontró la cabaña seleccionada.");
                    return;
                }

                setPrecioPorNoche(datos.cabin.precio);

                const [diaI, mesI, anioI] = reservaData.fechaInicio.split("-").map(Number);
                const [diaF, mesF, anioF] = reservaData.fechaFinal.split("-").map(Number);

                const start = new Date(anioI, mesI - 1, diaI);
                const end = new Date(anioF, mesF - 1, diaF);
                const noches = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24))) + 1;

                setReservaData(prev => ({
                    ...prev,
                    precioTotal: noches * datos.cabin.precio,
                }));
            } catch (error) {
                console.error(error);
                toast.error("Error al obtener los datos de la cabaña.");
            }
        };

        if (id && reservaData.fechaInicio && reservaData.fechaFinal) {
            fetchCabinData();
        }
    }, [id, reservaData.fechaInicio, reservaData.fechaFinal]);

    const handleChange = e => {
        setReservaData({ ...reservaData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const fechaInicioParsed = parseDate(reservaData.fechaInicio);
        const fechaFinalParsed = parseDate(reservaData.fechaFinal);

        if (!fechaInicioParsed || !fechaFinalParsed) {
            toast.error("Fechas inválidas, verifica el formato (dd-MM-yyyy)");
            setLoading(false);
            return;
        }

        const body = {
            cabaniaId: id,
            fechaInicio: fechaInicioParsed.toISOString(),
            fechaFinal: fechaFinalParsed.toISOString(),
            guestInfo: {
                nombre: reservaData.nombre,
                apellido: reservaData.apellido,
                email: reservaData.email,
                telefono: reservaData.telefono,
                documento: reservaData.documento,
            },
            metodoPago: reservaData.metodoPago,
            precioTotal: reservaData.precioTotal,
        };

        const res = await Peticion(`${Global.url}reservation/createCashReservation`, "POST", body);
        setLoading(false);

        if (res.datos.status === "success") {
            toast.success(res.datos.message);
            setTimeout(() => navigate(`/cabaña/${id}`), 2000);
        } else {
            toast.error(res.datos.message || "Error al guardar la reserva");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[100dvh] p-6">
            <motion.div
                className="p-6 bg-white rounded-2xl shadow-xl mx-auto max-w-lg w-full border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
                    Registrar Reserva
                </h2>

                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-5 text-gray-700 text-sm">
                    <p><strong>Cabaña ID:</strong> {id}</p>
                    <p><strong>Check-in:</strong> {reservaData.fechaInicio}</p>
                    <p><strong>Check-out:</strong> {reservaData.fechaFinal}</p>
                    <p><strong>Precio por noche:</strong> ${precioPorNoche || "—"}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Nombre del Cliente</label>
                        <input
                            type="text"
                            name="nombre"
                            value={reservaData.nombre}
                            onChange={handleChange}
                            className="create-edit-input-button"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Apellido del Cliente</label>
                        <input
                            type="text"
                            name="apellido"
                            value={reservaData.apellido}
                            onChange={handleChange}
                            className="create-edit-input-button"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-gray-700 mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={reservaData.email}
                                onChange={handleChange}
                                className="create-edit-input-button"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1 font-medium">Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={reservaData.telefono}
                                onChange={handleChange}
                                className="create-edit-input-button"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium">Documento</label>
                            <input
                                type="text"
                                name="documento"
                                value={reservaData.documento}
                                onChange={handleChange}
                                className="create-edit-input-button"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg text-center text-gray-800 font-medium border">
                        Total a Pagar:{" "}
                        <span className="text-lime-600 font-bold">
                            {reservaData.precioTotal > 0 ? `$${reservaData.precioTotal}` : "—"}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 justify-center mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading}
                            className={`py-2 px-6 rounded-lg shadow-md font-semibold text-white transition ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-lime-600 hover:bg-lime-700"
                                }`}
                        >
                            {loading ? "Guardando..." : "Confirmar Reserva"}
                        </motion.button>

                        <Link
                            to={`/cabaña/${id}`}
                            className="text-lime-600 font-medium hover:underline"
                        >
                            Volver
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminCrearReserva;
