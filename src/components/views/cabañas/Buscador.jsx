import { useEffect, useRef, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import { DateRange } from "react-date-range";
import { formatDate } from "../../../helpers/ParseDate";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { parseDate } from "../../../helpers/ParseDate";
import { es } from "date-fns/locale";
import { FaStar } from "react-icons/fa";
import { MdOutlineBedroomChild } from "react-icons/md";
import { PiToiletBold } from "react-icons/pi";

export const Buscador = ({ setFiltros, cabañas, filtros, servicios }) => {

    const { formulario, cambiado, setFormulario } = useForm({
        checkIn: filtros.checkIn || "",
        checkOut: filtros.checkOut || "",
        adultos: filtros.adultos || "0",
        ninos: filtros.ninos || "0",
        habitaciones: filtros.habitaciones || "0",
        servicios: filtros.servicios || [],
        estrellas: filtros.estrellas || "0",
    });

    const [showCalendar, setShowCalendar] = useState(false);
    const [opcionesCapacidad, setOpcionesCapacidad] = useState([]);
    const [opcionesHabitaciones, setOpcionesHabitaciones] = useState([]);
    const [opcionesBaños, setOpcionesBaños] = useState([]);
    const calendarRef = useRef(null);

    const [dateRange, setDateRange] = useState([
        {
            startDate: filtros.checkIn ? parseDate(filtros.checkIn) : new Date(),
            endDate: filtros.checkOut ? parseDate(filtros.checkOut) : new Date(),
            key: "selection",
        },
    ]);

    const formatDateLong = (dateString) => {
        if (!dateString) return "";

        const parts = dateString.split("-");
        let date;

        if (parts.length === 3) {
            const [day, month, year] = parts;
            date = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
            date = new Date(dateString);
        }

        if (isNaN(date.getTime())) return dateString;

        return date
            .toLocaleDateString("es-ES", {
                weekday: "short",
                day: "numeric",
                month: "short",
            })
            .toLowerCase();
    };

    const dateRangeConfig = {
        locale: es,
        showDateDisplay: false,
        moveRangeOnFirstSelection: false,
        rangeColors: ["#65a30d"],
        minDate: new Date(),
        className: "w-full rounded-md",
    };

    const handleSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setDateRange([{ startDate, endDate, key: "selection" }]);

        const checkInFormatted = formatDate(startDate);
        const checkOutFormatted = formatDate(endDate);

        setFiltros((prev) => ({
            ...prev,
            checkIn: checkInFormatted,
            checkOut: checkOutFormatted,
        }));

        setFormulario((prev) => ({
            ...prev,
            checkIn: checkInFormatted,
            checkOut: checkOutFormatted,
        }));
    };

    const actualizarOpcionesDinamicas = () => {
        if (cabañas) {
            let cabañasFiltradas = cabañas;

            const totalPersonas = parseInt(formulario.adultos) + parseInt(formulario.ninos);
            if (totalPersonas > 0) {
                cabañasFiltradas = cabañasFiltradas.filter(
                    (c) => c.cantidadPersonas >= totalPersonas
                );
            }

            if (parseInt(formulario.puntuacion) > 0) {
                cabañasFiltradas = cabañasFiltradas.filter(
                    (c) => c.puntuacion >= parseInt(formulario.puntuacion)
                );
            }

            const nuevasHabitaciones = [...new Set(cabañasFiltradas.map((c) => c.cantidadHabitaciones))];
            const nuevosBaños = [...new Set(cabañasFiltradas.map((c) => c.cantidadBaños))];

            setOpcionesHabitaciones(nuevasHabitaciones.sort((a, b) => a - b));
            setOpcionesBaños(nuevosBaños.sort((a, b) => a - b));
        }
    };

    const manejarCambios = (e) => {
        const { name, value } = e.target;
        cambiado(e);

        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));

        if ((name === "adultos" || name === "ninos") && value === "0") {
            const habitaciones = [...new Set(cabañas.map((c) => c.cantidadHabitaciones))];
            const baños = [...new Set(cabañas.map((c) => c.cantidadBaños))];

            setOpcionesHabitaciones(habitaciones.sort((a, b) => a - b));
            setOpcionesBaños(baños.sort((a, b) => a - b));
        } else if (name === "adultos" || name === "ninos") {
            actualizarOpcionesDinamicas();
        }
    };

    useEffect(() => {
        if (cabañas) {
            const capacidades = [...new Set(cabañas.map((c) => c.cantidadPersonas))];
            const habitaciones = [...new Set((cabañas || []).map((c) => c.cantidadHabitaciones))];
            const baños = [...new Set((cabañas || []).map((c) => c.cantidadBaños))];

            setOpcionesCapacidad(capacidades.sort((a, b) => a - b));
            setOpcionesHabitaciones(habitaciones.sort((a, b) => a - b));
            setOpcionesBaños(baños.sort((a, b) => a - b));
        }
    }, [cabañas]);


    useEffect(() => {
        actualizarOpcionesDinamicas();
    }, [formulario.adultos, formulario.ninos, formulario.habitaciones, formulario.baños, formulario.puntuacion]);

    useEffect(() => {
        setFormulario((prev) => ({
            ...prev,
            habitaciones: "0",
            baños: "0"
        }));
        setFiltros((prev) => ({
            ...prev,
            habitaciones: "0",
            baños: "0"
        }));
    }, [formulario.adultos, formulario.ninos]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full bg-white p-6 rounded-md">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col md:col-span-2">
                    <label htmlFor="fechas" className="text-sm font-medium mb-1 mx-auto">
                        Fechas
                    </label>
                    <input
                        type="text"
                        id="fechas"
                        value={
                            formulario.checkIn && formulario.checkOut
                                ? `${formatDateLong(formulario.checkIn)} — ${formatDateLong(formulario.checkOut)}`
                                : ""
                        }
                        placeholder="Selecciona fechas"
                        readOnly
                        onClick={() => setShowCalendar(true)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-500 cursor-pointer text-center focus:outline-none"
                    />
                </div>

                {showCalendar && (
                    <div ref={calendarRef} className="absolute mt-20 mx-auto z-50">
                        <DateRange {...dateRangeConfig} onChange={handleSelect} ranges={dateRange} />
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Adultos</span>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => manejarCambios({ target: { name: "adultos", value: parseInt(formulario.adultos) - 1 } })}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base disabled:opacity-50"
                            disabled={formulario.adultos <= 1}
                        >
                            -
                        </button>
                        <span className="text-sm sm:text-base w-6 text-center">{formulario.adultos}</span>
                        <button
                            type="button"
                            onClick={() => manejarCambios({ target: { name: "adultos", value: parseInt(formulario.adultos) + 1 } })}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Niños</span>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => manejarCambios({ target: { name: "ninos", value: parseInt(formulario.ninos) - 1 } })}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base disabled:opacity-50"
                            disabled={formulario.ninos <= 1}
                        >
                            -
                        </button>
                        <span className="text-sm sm:text-base w-6 text-center">{formulario.ninos}</span>
                        <button
                            type="button"
                            onClick={() => manejarCambios({ target: { name: "ninos", value: parseInt(formulario.ninos) + 1 } })}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* <div className="flex flex-col">
                    <label htmlFor="adultos" className="text-sm font-medium mb-1 mx-auto">
                        Adultos
                    </label>
                    <select
                        name="adultos"
                        value={formulario.adultos}
                        onChange={manejarCambios}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 cursor-pointer text-center"
                    >
                        <option value="0" className="">-</option>
                        {opcionesCapacidad.map((capacidad) => (
                            <option key={capacidad} value={capacidad}>
                                {capacidad}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="ninos" className="text-sm font-medium mb-1 mx-auto">
                        Niños
                    </label>
                    <select
                        name="ninos"
                        value={formulario.ninos}
                        onChange={manejarCambios}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 cursor-pointer text-center"
                    >
                        <option value="0">-</option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>
                </div> */}

                {/* Select Habitaciones */}
                <div className="flex items-center border border-gray-300 rounded-md">
                    <label htmlFor="habitaciones" className="pl-2">
                        <MdOutlineBedroomChild size={24} title="Habitaciones" className="text-gray-600" />
                    </label>
                    <select
                        name="habitaciones"
                        value={formulario.habitaciones}
                        onChange={manejarCambios}
                        className="p-2 w-full cursor-pointer text-center focus:outline-none"
                    >
                        <option value="0">-</option>
                        {opcionesHabitaciones.map((habitacion) => (
                            <option key={habitacion} value={habitacion}>
                                {habitacion}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Baños */}
                <div className="flex items-center border border-gray-300 rounded-md">
                    <label htmlFor="cantidadBaños" className="pl-2">
                        <PiToiletBold size={24} title="Baños" className="text-gray-600" />
                    </label>
                    <select
                        name="cantidadBaños"
                        value={formulario.cantidadBaños}
                        onChange={manejarCambios}
                        className="p-2 w-full cursor-pointer text-center focus:outline-none"
                    >
                        <option value="0">-</option>
                        {opcionesBaños.map((baño) => (
                            <option key={baño} value={baño}>
                                {baño}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Estrellas */}
                <div className="flex flex-col items-center md:col-span-2 mt-2">
                    <label className="text-sm font-medium mb-1">Puntuación mínima</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                onClick={() => {
                                    // Si el usuario vuelve a presionar la misma estrella, se limpia el filtro
                                    const nuevaSeleccion =
                                        formulario.estrellas === String(star) ? "0" : String(star);

                                    manejarCambios({
                                        target: { name: "estrellas", value: nuevaSeleccion },
                                    });

                                    setFiltros((prev) => ({
                                        ...prev,
                                        estrellas: nuevaSeleccion,
                                    }));
                                }}
                                className={`cursor-pointer transition-colors duration-200 ${star <= Number(formulario.estrellas)
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                    }`}
                                size={28} // Ajusta el tamaño de la estrella
                            />
                        ))}
                    </div>
                    <span className="mt-1 text-xs text-gray-500">
                        {formulario.estrellas > 0
                            ? `${formulario.estrellas} estrellas o más`
                            : "Todas las estrellas"}
                    </span>
                </div>

                <div className="flex flex-col md:col-span-2 mt-2">
                    <label className="text-sm font-medium mb-2 text-center">Servicios</label>
                    <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {servicios.map((servicio) => {
                            const isSelected = filtros.servicios.includes(servicio._id);

                            return (
                                <div
                                    key={servicio._id}
                                    onClick={() => {
                                        setFiltros((prev) => {
                                            const serviciosSeleccionados = prev.servicios.includes(servicio._id)
                                                ? prev.servicios.filter((s) => s !== servicio._id)
                                                : [...prev.servicios, servicio._id];
                                            return { ...prev, servicios: serviciosSeleccionados };
                                        });
                                    }}
                                    className={`cursor-pointer rounded-lg p-2 border-[1px] transition 
                        ${isSelected ? "border-gray-300 shadow-md scale-105" : "border-transparent hover:shadow-md hover:scale-105"}
                    `}
                                >
                                    <img
                                        src={servicio.imagen}
                                        alt={servicio.nombre}
                                        className={`w-full h-16 object-contain rounded-lg transition 
                            ${isSelected ? "opacity-100" : "opacity-70 hover:opacity-90"}
                        `}
                                    />
                                    <p className="text-center text-xs font-medium">{servicio.nombre}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </form>
        </div>
    );
};
