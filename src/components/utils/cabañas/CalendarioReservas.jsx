import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { es } from "date-fns/locale";
import { addDays, isBefore, isWithinInterval } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../../hooks/useAuth";
import { Link, useSearchParams } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { formatDate, parseDate } from "../../../helpers/ParseDate";

export const CalendarioReservas = ({ reservas, onReservar, onClose, precioPorNoche, minimoDias }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fechaInicioSeleccionada, setFechaInicioSeleccionada] = useState(null);
  const [fechaFinSeleccionada, setFechaFinSeleccionada] = useState(null);
  const [hayConflicto, setHayConflicto] = useState(false);


  const [rangoSeleccionado, setRangoSeleccionado] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });

  const fechasReservadas = Array.isArray(reservas)
    ? reservas.flatMap((reserva) => {
      const inicio = new Date(reserva.fechaInicio);
      const fin = new Date(reserva.fechaFinal);
      const fechas = [];
      for (let fecha = inicio; fecha <= fin; fecha.setDate(fecha.getDate() + 1)) {
        fechas.push(new Date(fecha));
      }
      return fechas;
    })
    : [];

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  useEffect(() => {
    if (checkIn && checkOut) {
      const fechaInicio = parseDate(checkIn);
      const fechaFin = parseDate(checkOut);

      setFechaInicioSeleccionada(fechaInicio);
      setFechaFinSeleccionada(fechaFin);

      setRangoSeleccionado({
        startDate: fechaInicio,
        endDate: fechaFin,
        key: "selection",
      });
    }
  }, [checkIn, checkOut]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isBefore(startDate, hoy)) {
      toast.error("No puedes seleccionar fechas anteriores al día de hoy.");
      return;
    }

    setFechaInicioSeleccionada(startDate);
    setFechaFinSeleccionada(endDate);

    const conflicto = Array.isArray(reservas) && reservas.length > 0
      ? reservas.some((reserva) => {
        const reservaInicio = new Date(reserva.fechaInicio);
        const reservaFin = new Date(reserva.fechaFinal);
        return (
          isWithinInterval(startDate, { start: reservaInicio, end: reservaFin }) ||
          isWithinInterval(endDate, { start: reservaInicio, end: reservaFin }) ||
          (startDate <= reservaInicio && endDate >= reservaFin)
        );
      })
      : false;

    setHayConflicto(conflicto);

    if (conflicto) {
      toast.error("Las fechas seleccionadas se superponen con una reserva existente.");
    }

    setRangoSeleccionado(ranges.selection);

    const diasSeleccionados = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    if (startDate != endDate && diasSeleccionados < minimoDias) {
      toast.error(`El mínimo de días de reserva para esta cabaña es ${minimoDias}.`);
      return;
    }

    const nuevosParams = new URLSearchParams(searchParams);
    nuevosParams.set("checkIn", formatDate(startDate));
    nuevosParams.set("checkOut", formatDate(endDate));
    setSearchParams(nuevosParams);
  };

  const handleReservar = async () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada && !hayConflicto) {
      const response = await onReservar({
        fechaInicio: fechaInicioSeleccionada.toISOString(),
        fechaFinal: fechaFinSeleccionada.toISOString(),
      });
      if (response.datos?.status === "success") {
        toast.success("Reserva realizada con éxito.");
        setFechaInicioSeleccionada(null);
        setFechaFinSeleccionada(null);
        setHayConflicto(false);
      } else {
        toast.error("Error al realizar la reserva.");
      }
    }
  };

  const calcularPrecioTotal = () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada && precioPorNoche) {
      const dias = Math.ceil((fechaFinSeleccionada - fechaInicioSeleccionada) / (1000 * 60 * 60 * 24) + 1);
      return dias * precioPorNoche;
    }
    return 0;
  };

  const precioTotal = calcularPrecioTotal();

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h2 className="text-3xl font-bold text-center mb-6">Calendario de Reservas</h2>
      <div className="py-4 flex w-full gap-6 justify-center items-center">
        <div className="flex justify-center">
          <DateRangePicker
            ranges={[rangoSeleccionado]}
            onChange={handleSelect}
            months={2}
            direction="horizontal"
            locale={es}
            minDate={new Date()}
            rangeColors={["#65a30d"]}
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            className="custom-date-range-picker"
            disabledDates={fechasReservadas}
          />
        </div>
        <div className="mt-6 text-center w-full">
          {fechaInicioSeleccionada && fechaFinSeleccionada ? (
            <div className="p-6 w-full h-full flex flex-col justify-between m-auto border shadow-lg rounded-lg">
              <p className="font-semibold text-lime-800">
                Fecha de inicio:
                <br />
                <span className="font-normal text-lime-600">
                  {" "}
                  {fechaInicioSeleccionada.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </p>
              <p className="font-semibold text-lime-800 mt-2">
                Fecha de fin:
                <br />
                <span className="font-normal text-lime-600">
                  {" "}
                  {fechaFinSeleccionada.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </p>
              <p className="font-semibold text-lime-800 mt-2 mb-2">
                Precio por día:
                <span className="font-normal text-lime-600"> ${precioPorNoche}</span>
              </p>
              <p className="font-semibold text-lime-800 mt-2 border-t-2 p-2">
                Precio total:
                <span className="font-normal text-lime-600"> ${precioTotal.toFixed(2)}</span>
              </p>
              
                <button
                  onClick={handleReservar}
                  className={`mt-4 py-3 px-6 rounded-lg ${!fechaInicioSeleccionada || !fechaFinSeleccionada || hayConflicto
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-lime-500 hover:bg-lime-600"
                    } text-white`}
                  disabled={!fechaInicioSeleccionada || !fechaFinSeleccionada || hayConflicto}
                >
                  Reservar
                </button>
              
            </div>
          ) : (
            <p className="p-6 w-full h-full m-auto border shadow-lg rounded-lg">Selecciona un rango de fechas para hacer la reserva.</p>
          )}



          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 bg-lime-500 text-white py-3 px-6 rounded-lg hover:bg-lime-600 ml-10"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};