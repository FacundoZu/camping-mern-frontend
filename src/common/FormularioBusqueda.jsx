import React, { useState, useRef, useEffect } from "react";
import { RiLeafFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { formatDate } from "../helpers/ParseDate";
import { es } from 'date-fns/locale';

const FormularioBusqueda = () => {
    const navigate = useNavigate();

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [hasSelectedDates, setHasSelectedDates] = useState(false);

    const [showCalendar, setShowCalendar] = useState(false);
    const [showTravelersModal, setShowTravelersModal] = useState(false);
    const [cantidadAdultos, setCantidadAdultos] = useState(0);
    const [cantidadNinos, setCantidadNinos] = useState(0);
    const [cantidadHabitaciones, setCantidadHabitaciones] = useState(0);
    const calendarRef = useRef(null);
    const travelersRef = useRef(null);

    const formatDateLong = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        }).toLowerCase();
    };

    const getDefaultDateRange = () => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        return `${formatDateLong(today)} — ${formatDateLong(tomorrow)}`;
    };

    const dateRangeConfig = {
        locale: es,
        showDateDisplay: false,
        moveRangeOnFirstSelection: false,
        rangeColors: ["#65a30d"],
        minDate: new Date(),
        className: "w-full"
    };

    const handleSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setState([{ startDate, endDate, key: "selection" }]);
        setHasSelectedDates(!!startDate && !!endDate);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams({
            checkIn: hasSelectedDates && state[0].startDate ? formatDate(state[0].startDate) : '',
            checkOut: hasSelectedDates && state[0].endDate ? formatDate(state[0].endDate) : '',
            adultos: cantidadAdultos,
            ninos: cantidadNinos,
            habitaciones: cantidadHabitaciones
        }).toString();

        navigate(`/cabañas?${queryParams}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
            if (travelersRef.current && !travelersRef.current.contains(event.target)) {
                setShowTravelersModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex relative z-10 text-center items-center justify-center my-auto pb-10 h-full bg-cover bg-center px-4 sm:px-6 lg:px-8 w-full">
            <div className="w-full max-w-5xl text-center">
                <h1 className="flex flex-col sm:flex-row items-center justify-center font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 sm:mb-8">
                    <RiLeafFill className="text-lime-600 text-5xl sm:text-6xl lg:text-7xl mr-0 sm:mr-2 mb-2 sm:mb-0" />
                    <span className="text-white">Camping</span>
                    <span className="text-lime-400 ml-0 sm:ml-2">Cachi</span>
                </h1>

                <section className="rounded-2xl sm:rounded-xl p-4 shadow-lg backdrop-blur-[4px] relative w-full max-w-[57rem] mx-auto">
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                            {/* Fechas */}
                            <div className="flex flex-col w-full ">
                                <input
                                    type="text"
                                    id="fechas"
                                    value={
                                        hasSelectedDates && state[0].startDate && state[0].endDate
                                            ? `${formatDateLong(state[0].startDate)} — ${formatDateLong(state[0].endDate)}`
                                            : ""
                                    }
                                    readOnly
                                    placeholder={getDefaultDateRange()}
                                    onClick={() => setShowCalendar(true)}
                                    className="p-2 text-sm text-center sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer w-full placeholder-gray-400"
                                />
                            </div>

                            {/* Viajeros */}
                            <div className="flex flex-col w-full relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="viajeros"
                                        value={
                                            cantidadAdultos > 0 || cantidadNinos > 0
                                                ? `${cantidadAdultos} adulto${cantidadAdultos !== 1 ? 's' : ''} · ${cantidadNinos} niño${cantidadNinos !== 1 ? 's' : ''} · ${cantidadHabitaciones} Habitacion${cantidadHabitaciones !== 1 ? 'es' : ''}`
                                                : ""
                                        }
                                        placeholder="adultos · niños · habitaciones"
                                        readOnly
                                        onClick={() => setShowTravelersModal(!showTravelersModal)}
                                        className="p-2 text-sm text-center sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer w-full placeholder-gray-400 pr-8"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-1">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {showTravelersModal && (
                                    <div ref={travelersRef} className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-4 w-full top-full left-0">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm sm:text-base">Adultos</span>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCantidadAdultos(prev => Math.max(1, prev - 1))}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base disabled:opacity-50"
                                                        disabled={cantidadAdultos <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm sm:text-base w-6 text-center">{cantidadAdultos}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCantidadAdultos(prev => prev + 1)}
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
                                                        onClick={() => setCantidadNinos(prev => Math.max(0, prev - 1))}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base disabled:opacity-50"
                                                        disabled={cantidadNinos <= 0}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm sm:text-base w-6 text-center">{cantidadNinos}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCantidadNinos(prev => prev + 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm sm:text-base">Habitaciones</span>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCantidadHabitaciones(prev => Math.max(0, prev - 1))}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base disabled:opacity-50"
                                                        disabled={cantidadHabitaciones <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm sm:text-base w-6 text-center">{cantidadHabitaciones}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCantidadHabitaciones(prev => prev + 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-sm sm:text-base"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="px-4 sm:px-6 py-2 text-sm sm:text-base font-bold bg-lime-600 text-white rounded-md transition-all duration-150 ease-in-out hover:bg-lime-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-lime-400 focus:shadow-md active:bg-lime-800 active:shadow-inner active:text-white/80 w-full md:w-auto flex items-center justify-center"
                            >
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                Buscar
                            </button>
                        </div>
                    </form>

                    {showCalendar && (
                        <div ref={calendarRef} className="absolute z-10 my-2 bg-white px-3 rounded-md shadow-lg">
                            <DateRange
                                {...dateRangeConfig}
                                editableDateInputs={true}
                                onChange={handleSelect}
                                ranges={state}
                            />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default FormularioBusqueda;