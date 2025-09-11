import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { es } from "date-fns/locale";
import { addDays, isBefore, isWithinInterval, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../../hooks/useAuth";
import { Link, useSearchParams } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { formatDate, parseDate } from "../../../helpers/ParseDate";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaUsers,
  FaBed,
  FaHome
} from "react-icons/fa";
import { BsCurrencyDollar, BsCalendar2Check, BsInfoCircle } from "react-icons/bs";
import { MdDateRange, MdEventAvailable, MdBlock } from "react-icons/md";

export const CalendarioReservas = ({ reservas, onReservar, precioPorNoche, minimoDias }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { auth } = useAuth();
  const [fechaInicioSeleccionada, setFechaInicioSeleccionada] = useState(null);
  const [fechaFinSeleccionada, setFechaFinSeleccionada] = useState(null);
  const [hayConflicto, setHayConflicto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [rangoSeleccionado, setRangoSeleccionado] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), minimoDias || 1),
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
      toast.error("No puedes seleccionar fechas anteriores al día de hoy.", {
        position: "top-right",
        autoClose: 3000,
      });
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
      toast.error("Las fechas seleccionadas se superponen con una reserva existente.", {
        position: "top-right",
        autoClose: 4000,
      });
    }

    setRangoSeleccionado(ranges.selection);

    const diasSeleccionados = differenceInDays(endDate, startDate) + 1;

    if (startDate.getTime() !== endDate.getTime() && diasSeleccionados < minimoDias) {
      toast.error(`El mínimo de días de reserva para esta cabaña es ${minimoDias}.`, {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    const nuevosParams = new URLSearchParams(searchParams);
    nuevosParams.set("checkIn", formatDate(startDate));
    nuevosParams.set("checkOut", formatDate(endDate));
    setSearchParams(nuevosParams);
  };

  const handleReservar = async () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada && !hayConflicto) {
      setIsLoading(true);
      try {
        await onReservar({
          fechaInicio: fechaInicioSeleccionada.toISOString(),
          fechaFinal: fechaFinSeleccionada.toISOString(),
        });
      } catch (error) {
        toast.error("Error al realizar la reserva. Intenta nuevamente.", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calcularPrecioTotal = () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada && precioPorNoche) {
      const dias = differenceInDays(fechaFinSeleccionada, fechaInicioSeleccionada) + 1;
      return dias * precioPorNoche;
    }
    return 0;
  };

  const calcularDias = () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada) {
      return differenceInDays(fechaFinSeleccionada, fechaInicioSeleccionada) + 1;
    }
    return 0;
  };

  const precioTotal = calcularPrecioTotal();
  const diasEstancia = calcularDias();

  const formatearFecha = (fecha) => {
    return fecha?.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    });
  };

  const getStatusIcon = () => {
    if (hayConflicto) return <FaExclamationTriangle className="text-red-500 text-lg" />;
    if (fechaInicioSeleccionada && fechaFinSeleccionada && !hayConflicto) {
      return <FaCheckCircle className="text-green-500 text-lg" />;
    }
    return <BsInfoCircle className="text-blue-500 text-lg" />;
  };

  const getStatusMessage = () => {
    if (hayConflicto) return "Fechas no disponibles";
    if (fechaInicioSeleccionada && fechaFinSeleccionada && !hayConflicto) {
      return "Fechas disponibles";
    }
    return "Selecciona tus fechas";
  };

  const getStatusColor = () => {
    if (hayConflicto) return "text-red-600 bg-red-50 border-red-200";
    if (fechaInicioSeleccionada && fechaFinSeleccionada && !hayConflicto) {
      return "text-green-600 bg-green-50 border-green-200";
    }
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  return (
    <div className="w-full space-y-6">
      {/* Header con toggle para móvil */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-lime-100 rounded-lg">
            <FaCalendarAlt className="text-lime-600 text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Selecciona tus fechas</h3>
            <p className="text-sm text-gray-600">Elige las fechas para tu estadía</p>
          </div>
        </div>
      </div>

      {/* Estado actual de la selección */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="font-semibold">{getStatusMessage()}</span>
        {minimoDias > 1 && (
          <span className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded-full ml-auto">
            Mínimo {minimoDias} {minimoDias === 1 ? 'día' : 'días'}
          </span>
        )}
      </div>

      {/* Layout principal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="flex justify-center">
              <DateRangePicker
                ranges={[rangoSeleccionado]}
                onChange={handleSelect}
                direction="horizontal"
                locale={es}
                minDate={new Date()}
                rangeColors={["#65a30d"]}
                showDateDisplay={false}
                showMonthAndYearPickers={false}
                className="custom-date-range-picker"
                disabledDates={fechasReservadas}
                showSelectionPreview={true}
              />
            </div>
            {/* Leyenda del calendario */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-lime-500 rounded"></div>
                  <span className="text-gray-600">Fechas seleccionadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-gray-600">No disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-600">Disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de información y reserva */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
            {fechaInicioSeleccionada && fechaFinSeleccionada ? (
              <div className="space-y-6">
                {/* Fechas seleccionadas */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MdDateRange className="text-lime-600" />
                    Resumen de reserva
                  </h4>

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <BsCalendar2Check className="text-lime-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-1">Check-in</p>
                          <p className="text-gray-900 capitalize">
                            {formatearFecha(fechaInicioSeleccionada)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <BsCalendar2Check className="text-lime-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-1">Check-out</p>
                          <p className="text-gray-900 capitalize">
                            {formatearFecha(fechaFinSeleccionada)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalles de la estadía */}
                <div className="border-t pt-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Detalles de la estadía</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FaClock className="text-sm" />
                        Duración
                      </span>
                      <span className="font-medium text-gray-900">
                        {diasEstancia} {diasEstancia === 1 ? 'día' : 'días'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <BsCurrencyDollar className="text-sm" />
                        Precio por noche
                      </span>
                      <span className="font-medium text-gray-900">
                        ${precioPorNoche?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-6">
                  <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-xl p-4 border border-lime-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-lime-600">
                          ${precioTotal.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {diasEstancia} {diasEstancia === 1 ? 'día' : 'días'} × ${precioPorNoche?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de reserva */}
                <div className="pt-4">
                  {auth?.id ? (
                    <button
                      onClick={handleReservar}
                      disabled={hayConflicto || isLoading}
                      className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${hayConflicto || isLoading
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white"
                      }`}
                    >
                      Confirmar reserva
                    </button>
                  ) : (
                    <button
                      onClick={handleReservar}
                      disabled={hayConflicto || isLoading}
                      className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${hayConflicto || isLoading
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white"
                        }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando...
                        </div>
                      ) : hayConflicto ? (
                        <div className="flex items-center justify-center gap-2">
                          <MdBlock />
                          Fechas no disponibles
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <FaCheckCircle />
                          Confirmar reserva
                        </div>
                      )}
                    </button>
                  )}
                </div>

                {/* Información adicional */}
                <div className="border-t pt-4">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <MdEventAvailable className="text-green-500" />
                      <span>Confirmación inmediata</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Cancelación gratuita 24h antes</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Estado inicial */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="text-2xl text-lime-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecciona tus fechas
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  Elige las fechas de entrada y salida en el calendario para ver el precio total
                </p>

                <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-xl p-4 border border-lime-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-lime-600 mb-1">
                      ${precioPorNoche?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">por noche</div>
                  </div>
                </div>

                {minimoDias > 1 && (
                  <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <BsInfoCircle className="inline mr-1" />
                    Estancia mínima: {minimoDias} {minimoDias === 1 ? 'día' : 'días'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};