import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
import { jsPDF } from 'jspdf';
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineDisabledByDefault } from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";


export const AdminCabaña = () => {
    const [cabañas, setCabañas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [nombreFiltro, setNombreFiltro] = useState('');
    const [reservasFiltro, setReservasFiltro] = useState('');
    const [habitacionesFiltro, setHabitacionesFiltro] = useState('');
    const [bañosFiltro, setBañosFiltro] = useState('');
    const [personasFiltro, setPersonasFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');

    const [orden, setOrden] = useState({ columna: 'nombre', tipo: 'asc' });

    useEffect(() => {
        const todasLasCabañas = async () => {
            let url = Global.url + "cabin/getCabins";
            const { datos } = await Peticion(url, "GET", '', false, 'include');
            if (datos) {
                const cabañasConReservas = datos.cabins.map(cabaña => {
                    cabaña.reservasHistoricas = cabaña.reservas ? cabaña.reservas.length : 0;
                    return cabaña;
                });
                setCabañas(cabañasConReservas);
                setCargando(false);
            }
        };
        todasLasCabañas();
    }, []);

    const cabañasFiltradas = cabañas.filter(cabaña => {
        return (
            (!nombreFiltro || cabaña.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())) &&
            (!reservasFiltro || cabaña.reservasHistoricas >= parseInt(reservasFiltro)) &&
            (!habitacionesFiltro || cabaña.cantidadHabitaciones >= parseInt(habitacionesFiltro)) &&
            (!bañosFiltro || cabaña.cantidadBaños >= parseInt(bañosFiltro)) &&
            (!personasFiltro || cabaña.cantidadPersonas >= parseInt(personasFiltro)) &&
            (!estadoFiltro || cabaña.estado.toLowerCase() === estadoFiltro.toLowerCase())
        );
    });

    const cambiarEstado = async (id, estado) => {
        let url = Global.url + `cabin/cambiarEstado/${id}`;

        const { datos } = await Peticion(url, "PUT", { estado: estado }, false, 'include');

        if (datos) {
            setCabañas((prevCabañas) =>
                prevCabañas.map((cabaña) =>
                    cabaña._id === id ? { ...cabaña, estado: datos.cabin.estado } : cabaña
                )
            );
        }
    };

    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(0, 102, 51);
        doc.text('Lista de Cabañas', 20, 20);

        let yPosition = 30;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('ID', 20, yPosition);
        doc.text('Nombre', 80, yPosition);
        doc.text('Estado', 130, yPosition);
        doc.text('Reservas Históricas', 165, yPosition);

        yPosition += 10;

        doc.setFont('helvetica', 'normal');
        cabañasFiltradas.forEach((cabaña) => {
            doc.text(cabaña._id, 20, yPosition);
            doc.text(cabaña.nombre, 80, yPosition);
            doc.text(cabaña.estado, 130, yPosition);
            doc.text(cabaña.reservasHistoricas.toString(), 180, yPosition);
            yPosition += 10;
        });

        const pdfDataUri = doc.output('bloburl');
        window.open(pdfDataUri, '_blank');
    };

    const ordenarCabañas = (columna) => {
        const nuevoOrden = orden.columna === columna && orden.tipo === 'asc' ? 'desc' : 'asc';
        setOrden({ columna, tipo: nuevoOrden });

        const cabañasOrdenadas = [...cabañasFiltradas].sort((a, b) => {
            if (nuevoOrden === 'asc') {
                return a[columna] < b[columna] ? -1 : 1;
            }
            return a[columna] > b[columna] ? -1 : 1;
        });

        setCabañas(cabañasOrdenadas);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Cabañas</h2>
                <div className="flex gap-4">
                    <Link
                        to='/admin/CrearCabaña'
                        className="flex items-center px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700 transition duration-200"
                    >
                        <FiPlusCircle className="mr-2" size={20} />
                        Nueva Cabaña
                    </Link>
                    <button
                        onClick={generarPDF}
                        className="flex items-center px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition duration-200"
                    >
                        <FaRegFilePdf className="mr-2" size={20} />Reporte
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={nombreFiltro}
                    onChange={(e) => setNombreFiltro(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Mín. reservas"
                    value={reservasFiltro}
                    onChange={(e) => setReservasFiltro(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Mín. habitaciones"
                    value={habitacionesFiltro}
                    onChange={(e) => setHabitacionesFiltro(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Mín. baños"
                    value={bañosFiltro}
                    onChange={(e) => setBañosFiltro(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Mín. personas"
                    value={personasFiltro}
                    onChange={(e) => setPersonasFiltro(e.target.value)}
                    className="p-2 border rounded"
                />
                <select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    className="p-2 border rounded text-gray-400"
                >
                    <option value="" >Filtrar por estado</option>
                    <option value="Disponible">Disponible</option>
                    <option value="No Disponible">No Disponible</option>
                </select>
            </div>

            <table className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <thead>
                    <tr>
                        <th
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => ordenarCabañas('nombre')}
                        >
                            Nombre
                        </th>
                        <th
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => ordenarCabañas('descripcion')}
                        >
                            Descripción
                        </th>
                        <th
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => ordenarCabañas('reservasHistoricas')}
                        >
                            Reservas
                        </th>
                        <th
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => ordenarCabañas('cantidadHabitaciones')}
                        >
                            Habitaciones
                        </th>
                        <th
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => ordenarCabañas('cantidadBaños')}
                        >
                            Baños
                        </th>
                        <th
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => ordenarCabañas('cantidadPersonas')}
                        >
                            Personas
                        </th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cabañasFiltradas.map((cabaña) => (
                        <tr
                            key={cabaña._id}
                            className={`border-b hover:bg-gray-100 transition duration-200 ${cabaña.estado !== 'Disponible' ? 'bg-gray-200' : 'bg-white'} `}
                        >
                            <td className="py-3 px-4 text-gray-700">{cabaña.nombre}</td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{cabaña.descripcion}</td>
                            <td className="py-3 px-4 text-gray-700">{cabaña.reservasHistoricas}</td>
                            <td className="py-3 px-4 text-gray-700">{cabaña.cantidadHabitaciones}</td>
                            <td className="py-3 px-4 text-gray-700">{cabaña.cantidadBaños}</td>
                            <td className="py-3 px-4 text-gray-700">{cabaña.cantidadPersonas}</td>
                            <td className="py-3 px-4 text-center">
                                <div className="flex justify-center items-center gap-4">
                                    <div className="flex items-center justify-center">
                                        <Link
                                            to={`/admin/EditarCabaña/${cabaña._id}`}
                                            title="Editar"
                                            className="flex items-center text-gray-700 py-2 px-2 rounded-full hover:bg-gray-300 mr-2 transition duration-200"
                                        >
                                            <MdModeEdit size={20} />
                                        </Link>
                                        <Link to={`/admin/VerCabaña/${cabaña._id}`} title="Ver" className='text-blue-500 hover:text-blue-700 py-2 px-2 mr-2 hover:bg-blue-200 rounded-full transition duration-200'>
                                            <GoGraph size={20} />
                                        </Link>
                                        <button
                                            onClick={() => cabaña.estado !== 'Disponible' ? cambiarEstado(cabaña._id, 'No Disponible') : cambiarEstado(cabaña._id, 'Disponible')}
                                            className={`flex items-center text-white py-2 px-2 rounded transition duration-200 ${cabaña.estado === 'Disponible'
                                                ? 'bg-red-500 hover:bg-red-700'
                                                : 'bg-lime-600 hover:bg-lime-700'
                                                } transition duration-200`}
                                        >
                                            {cabaña.estado === 'Disponible' ? (
                                                <>
                                                    <MdOutlineDisabledByDefault className="mr-2" size={20} /> Deshabilitar
                                                </>
                                            ) : (
                                                <>
                                                    <FaRegCheckSquare className="mr-2" size={20} /> Habilitar
                                                </>
                                            )}
                                        </button>

                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {cargando && <p className="text-center mt-4">Cargando...</p>}
        </div>
    );
};