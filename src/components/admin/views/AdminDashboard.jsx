import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Global } from '../../../helpers/Global';
import { Peticion } from '../../../helpers/Peticion';
import { jsPDF } from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const AdminDashboard = () => {
  const [estadisticas, setEstadisticas] = useState({
    cabañasDisponibles: 0,
    reservasTotales: 0,
  });
  const [cabañas, setCabañas] = useState([]);
  const [reservasMensuales, setReservasMensuales] = useState(new Array(12).fill(0));
  const [reservasPorCabaña, setReservasPorCabaña] = useState([]);
  const [metodosPago, setMetodosPago] = useState({});
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());

  const añosDisponibles = [2022, 2023, 2024];

  useEffect(() => {
    const obtenerDatos = async () => {
      let urlCabañas = Global.url + "cabin/getCabins";
      const { datos: cabañasData } = await Peticion(urlCabañas, "GET", '', false, 'include');
      setCabañas(cabañasData.cabins);

      let urlReservas = Global.url + "reservation/getAllReservations";
      const { datos: reservasData } = await Peticion(urlReservas, "GET", '', false, 'include');

      const cabañasDisponibles = cabañasData.cabins.filter(cabaña => cabaña.estado === 'Disponible').length;
      const reservasTotales = reservasData.reservations.filter(reserva => {
        const añoReserva = new Date(reserva.fechaInicio).getFullYear();
        return añoReserva === añoSeleccionado;
      }).length;

      const reservasPorMes = new Array(12).fill(0);
      const reservasCountPorCabaña = {};
      const metodosPagoCount = {};

      cabañasData.cabins.forEach(cabaña => {
        reservasCountPorCabaña[cabaña._id] = 0;
      });

      reservasData.reservations.forEach(reserva => {
        const fechaReserva = new Date(reserva.fechaInicio);
        const año = fechaReserva.getFullYear();
        if (año === añoSeleccionado) {
          const mes = fechaReserva.getMonth();
          reservasPorMes[mes]++;

          const cabañaId = reserva.cabaniaId ? reserva.cabaniaId._id : null;
          if (cabañaId && reservasCountPorCabaña[cabañaId] !== undefined) {
            reservasCountPorCabaña[cabañaId]++;
          }

          const metodoPago = reserva.metodoPago;
          metodosPagoCount[metodoPago] = (metodosPagoCount[metodoPago] || 0) + 1;
        }
      });

      const reservasPorCabañaData = cabañasData.cabins.map(cabaña => reservasCountPorCabaña[cabaña._id]);
      setReservasPorCabaña(reservasPorCabañaData);
      setMetodosPago(metodosPagoCount);
      setEstadisticas({ cabañasDisponibles, reservasTotales });
      setReservasMensuales(reservasPorMes);
    };

    obtenerDatos();
  }, [añoSeleccionado]);

  const handleAñoChange = (e) => {
    setAñoSeleccionado(parseInt(e.target.value));
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('Resumen de Estadísticas', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text('Cabañas Disponibles:', 14, 40);
    doc.text(`${estadisticas.cabañasDisponibles}`, 70, 40);

    doc.text('Cabañas No Disponibles:', 14, 50);
    doc.text(`${cabañas.length - estadisticas.cabañasDisponibles}`, 80, 50);

    doc.text('Reservas Totales:', 14, 60);
    doc.text(`${estadisticas.reservasTotales}`, 70, 60);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 70, doc.internal.pageSize.width - 14, 70);

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Reservas por Mes', 14, 80);

    reservasMensuales.forEach((reserva, index) => {
      const mes = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ][index];
      doc.setFontSize(12);
      doc.text(`${mes}: ${reserva}`, 14, 90 + index * 10);
    });

    const lastMonthlyY = 90 + reservasMensuales.length * 10;

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Métodos de Pago', 14, lastMonthlyY + 10);

    Object.entries(metodosPago).forEach(([metodo, cantidad], index) => {
      doc.setFontSize(12);
      doc.text(`${metodo}: ${cantidad}`, 14, lastMonthlyY + 20 + index * 10);
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };


  const dataReservasMensuales = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Reservas Mensuales',
        data: reservasMensuales,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1,
      },
    ],
  };

  const dataCabañasEstado = {
    labels: ['Disponible', 'No Disponible'],
    datasets: [
      {
        label: 'Cabañas por Estado',
        data: [estadisticas.cabañasDisponibles, cabañas.length - estadisticas.cabañasDisponibles],
        backgroundColor: ['rgba(75,192,192,0.2)', 'rgba(255,99,132,0.2)'],
        borderColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)'],
        borderWidth: 1,
      },
    ],
  };

  const dataMetodosPago = {
    labels: Object.keys(metodosPago),
    datasets: [
      {
        label: 'Métodos de Pago',
        data: Object.values(metodosPago),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const dataReservasPorCabaña = {
    labels: cabañas.map(cabaña => cabaña.nombre),
    datasets: [
      {
        label: 'Reservas por Cabaña',
        data: reservasPorCabaña,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
          '#C9DE00', '#D8A48F', '#AF7AC5', '#F1948A', '#5DADE2'
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const opcionesGrafico = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h1>
      <p className='text-xl font-semibold mb-4'>Esta es la página principal de administración.</p>

      <div className="text-right mb-4">
        <button
          className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 transition"
          onClick={generarPDF}
        >
          Resumen en PDF
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-lime-600 p-4 text-white rounded shadow-lg text-center">
          <h3 className="text-lg font-semibold">Cabañas Disponibles</h3>
          <p className="text-3xl">{estadisticas.cabañasDisponibles}</p>
        </div>
        <div className="bg-lime-800 p-4 text-white rounded shadow-lg text-center">
          <h3 className="text-lg font-semibold">Reservas Totales</h3>
          <p className="text-3xl">{estadisticas.reservasTotales}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Gráfico de Cabañas por Estado</h3>
        <div style={{ height: '300px' }}>
          <Bar data={dataCabañasEstado} options={opcionesGrafico} />
        </div>
      </div>

      <hr className='my-4'/>

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

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Reservas Mensuales</h3>
        <div style={{ height: '300px' }}>
          <Line data={dataReservasMensuales} options={opcionesGrafico} />
        </div>
      </div>


      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-center mb-4">Reservas por Cabaña</h3>
          <div style={{ height: '300px' }}>
            {cabañas.length > 0 && reservasPorCabaña.length > 0 ? (
              <Pie data={dataReservasPorCabaña} options={opcionesGrafico} />
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-center mb-4">Métodos de Pago</h3>
          <div style={{ height: '300px' }}>
            {Object.keys(metodosPago).length > 0 ? (
              <Pie data={dataMetodosPago} options={opcionesGrafico} />
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
