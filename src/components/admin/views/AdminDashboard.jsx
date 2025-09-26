import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Global } from '../../../helpers/Global';
import { Peticion } from '../../../helpers/Peticion';
import { jsPDF } from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export const AdminDashboard = () => {
  const [estadisticas, setEstadisticas] = useState({
    cabañasDisponibles: 0,
    reservasTotales: 0,
    ingresosTotales: 0,
  });
  const [cabañas, setCabañas] = useState([]);
  const [reservasMensuales, setReservasMensuales] = useState(new Array(12).fill(0));
  const [reservasPorCabaña, setReservasPorCabaña] = useState([]);
  const [metodosPago, setMetodosPago] = useState({});
  const [añosDisponibles, setAñosDisponibles] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());

  useEffect(() => {
    const obtenerDatos = async () => {
      let urlCabañas = Global.url + "cabin/getCabins";
      const { datos: cabañasData } = await Peticion(urlCabañas, "GET", '', false, 'include');
      setCabañas(cabañasData.cabins);

      let urlReservas = Global.url + "reservation/getAllReservations";
      const { datos: reservasData } = await Peticion(urlReservas, "GET", '', false, 'include');

      // --- obtener años únicos ---
      const años = [
        ...new Set(reservasData.reservations.map(r => new Date(r.fechaInicio).getFullYear()))
      ].sort((a, b) => b - a);
      setAñosDisponibles(años);

      const reservasFiltradas = reservasData.reservations.filter(reserva => {
        const añoReserva = new Date(reserva.fechaInicio).getFullYear();
        return añoReserva === añoSeleccionado;
      });

      const cabañasDisponibles = cabañasData.cabins.filter(c => c.estado === 'Disponible').length;
      const reservasTotales = reservasFiltradas.length;
      const ingresosTotales = reservasFiltradas.reduce((acc, r) => acc + (r.precioTotal || 0), 0);

      const reservasPorMes = new Array(12).fill(0);
      const reservasCountPorCabaña = {};
      const metodosPagoCount = {};

      cabañasData.cabins.forEach(c => { reservasCountPorCabaña[c._id] = 0 });

      reservasFiltradas.forEach(reserva => {
        const fecha = new Date(reserva.fechaInicio);
        reservasPorMes[fecha.getMonth()]++;
        
        if (reserva.cabaniaId && reservasCountPorCabaña[reserva.cabaniaId._id] !== undefined) {
          reservasCountPorCabaña[reserva.cabaniaId._id]++;
        }

        if (reserva.metodoPago) {
          metodosPagoCount[reserva.metodoPago] = (metodosPagoCount[reserva.metodoPago] || 0) + 1;
        }
      });

      const reservasPorCabañaData = cabañasData.cabins.map(c => reservasCountPorCabaña[c._id]);
      setReservasPorCabaña(reservasPorCabañaData);
      setMetodosPago(metodosPagoCount);
      setEstadisticas({ cabañasDisponibles, reservasTotales, ingresosTotales });
      setReservasMensuales(reservasPorMes);
    };

    obtenerDatos();
  }, [añoSeleccionado]);

  const handleAñoChange = (e) => setAñoSeleccionado(parseInt(e.target.value));

  const dataReservasMensuales = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      label: 'Reservas',
      data: reservasMensuales,
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54,162,235,0.2)',
      tension: 0.3,
    }],
  };

  const dataReservasPorCabaña = {
    labels: cabañas.map(c => c.nombre),
    datasets: [{
      data: reservasPorCabaña,
      backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF', '#36A2EB', '#FF6384', '#FFCE56'],
      borderColor: '#fff',
    }],
  };

  const dataMetodosPago = {
    labels: Object.keys(metodosPago),
    datasets: [{
      data: Object.values(metodosPago),
      backgroundColor: ['#36A2EB', '#4BC0C0', '#9966FF', '#FF6384', '#FFCE56'],
    }],
  };

  const opcionesGrafico = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
          <p className="text-gray-600">Resumen general de reservas y cabañas</p>
        </div>
        <div className="mt-3 sm:mt-0">
          <label className="mr-2 font-semibold">Año:</label>
          <select
            value={añoSeleccionado}
            onChange={handleAñoChange}
            className="border border-gray-300 rounded-lg p-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-lime-500"
          >
            {añosDisponibles.map(año => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-gray-600">Cabañas Disponibles</h3>
          <p className="text-3xl font-bold text-lime-600">{estadisticas.cabañasDisponibles}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-gray-600">Cabañas Ocupadas</h3>
          <p className="text-3xl font-bold text-red-500">{cabañas.length - estadisticas.cabañasDisponibles}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-gray-600">Reservas Totales</h3>
          <p className="text-3xl font-bold text-blue-500">{estadisticas.reservasTotales}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-gray-600">Ingresos Estimados</h3>
          <p className="text-3xl font-bold text-amber-600">${estadisticas.ingresosTotales.toLocaleString()}</p>
        </div>
      </div>

      {/* Gráfico principal */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h3 className="text-xl font-semibold mb-4">Reservas Mensuales</h3>
        <div style={{ height: '300px' }}>
          <Line data={dataReservasMensuales} options={opcionesGrafico} />
        </div>
      </div>

      {/* Gráficos secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold text-center mb-4">Reservas por Cabaña</h3>
          <div style={{ height: '300px' }}>
            {cabañas.length > 0 && reservasPorCabaña.length > 0
              ? <Pie data={dataReservasPorCabaña} options={opcionesGrafico} />
              : <p className="text-center text-gray-500">Cargando datos...</p>}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold text-center mb-4">Métodos de Pago</h3>
          <div style={{ height: '300px' }}>
            {Object.keys(metodosPago).length > 0
              ? <Pie data={dataMetodosPago} options={opcionesGrafico} />
              : <p className="text-center text-gray-500">Cargando datos...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
