import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineDisabledByDefault } from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { AnimatePresence, motion } from 'framer-motion';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { generarPDFCabañas } from './pdfCabañas';

export const AdminCabaña = () => {
    const [cabañas, setCabañas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [nombreFiltro, setNombreFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');

    const [orden, setOrden] = useState({ columna: 'nombre', tipo: 'asc' });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 8;

    const obtenerCabañas = async () => {
        setCargando(true);
        let url = `${Global.url}cabin/getCabins?page=${page}&limit=${limit}`;

        if (nombreFiltro) url += `&nombre=${nombreFiltro}`;
        if (estadoFiltro) url += `&estado=${estadoFiltro}`;

        const { datos } = await Peticion(url, "GET", '', false, 'include');

        if (datos) {
            const cabañasConReservas = datos.cabins.map(cabaña => {
                cabaña.reservasHistoricas = cabaña.reservas ? cabaña.reservas.length : 0;
                return cabaña;
            });
            setCabañas(cabañasConReservas);
            setTotalPages(datos.totalPages || 1);
        }
        setCargando(false);
    };

    const obtenerTodasCabañas = async () => {

        let url = `${Global.url}cabin/getCabins`;
        const { datos } = await Peticion(url, "GET", '', false, 'include');
        if (datos) {
            const cabañasConReservas = datos.cabins.map(cabaña => {
                cabaña.reservasHistoricas = cabaña.reservas ? cabaña.reservas.length : 0;
                return cabaña;
            });
            return cabañasConReservas;
        }
        return [];
    };

    useEffect(() => {
        obtenerCabañas();
    }, [page, nombreFiltro, estadoFiltro]);

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

    const generarPDF = async () => {
        generarPDFCabañas(await obtenerTodasCabañas());
    };

    const ordenarCabañas = (columna) => {
        const nuevoOrden = orden.columna === columna && orden.tipo === 'asc' ? 'desc' : 'asc';
        setOrden({ columna, tipo: nuevoOrden });

        const cabañasOrdenadas = [...cabañas].sort((a, b) => {
            if (nuevoOrden === 'asc') {
                return a[columna] < b[columna] ? -1 : 1;
            }
            return a[columna] > b[columna] ? -1 : 1;
        });

        setCabañas(cabañasOrdenadas);
    };

    return (
        <motion.div
            className="p-6 bg-white rounded-2xl shadow-xl max-w-screen-xl mx-auto mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="text-3xl font-bold text-gray-800"> 🏠 Gestión de Cabañas</h2>
                <div className="flex gap-3">
                    <Link
                        to='/admin/CrearCabaña'
                        className="flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg shadow hover:bg-lime-700 transition"
                    >
                        <FiPlusCircle className="mr-2" size={20} />
                        Nueva
                    </Link>
                    <button
                        onClick={generarPDF}
                        className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg shadow hover:bg-slate-700 transition"
                    >
                        <FaRegFilePdf className="mr-2" size={20} />Reporte
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={nombreFiltro}
                    onChange={(e) => { setNombreFiltro(e.target.value); setPage(1); }}
                    className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-lime-400"
                />
                <select
                    value={estadoFiltro}
                    onChange={(e) => { setEstadoFiltro(e.target.value); setPage(1); }}
                    className="p-2 border rounded-lg shadow-sm text-gray-600 focus:ring-2 focus:ring-lime-400"
                >
                    <option value="">Estado</option>
                    <option value="Disponible">Disponible</option>
                    <option value="No Disponible">No Disponible</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto max-h-[600px] min-h-[600px]">
                <table className="w-full max-h-[600px] min-w-[600px] bg-gray-50 rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th
                                className="py-3 px-4 text-left text-gray-700 cursor-pointer hover:text-lime-600"
                                onClick={() => ordenarCabañas('nombre')}
                            >
                                Nombre
                            </th>
                            <th className="py-3 px-4 text-left text-gray-700">Descripción</th>
                            <th className="py-3 px-4 text-left text-gray-700">Reservas</th>
                            <th className="py-3 px-4 text-left text-gray-700">Habitaciones</th>
                            <th className="py-3 px-4 text-left text-gray-700">Baños</th>
                            <th className="py-3 px-4 text-left text-gray-700">Personas</th>
                            <th className="py-3 px-4 text-center text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {cabañas.map((cabaña) => (
                                <motion.tr
                                    key={cabaña._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`bg-white border-b hover:bg-gray-100 transition-colors`}
                                >
                                    <td className="py-3 px-4 text-gray-700">{cabaña.nombre}</td>
                                    <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{cabaña.descripcion}</td>
                                    <td className="py-3 px-4 text-gray-700">{cabaña.reservasHistoricas}</td>
                                    <td className="py-3 px-4 text-gray-700">{cabaña.cantidadHabitaciones}</td>
                                    <td className="py-3 px-4 text-gray-700">{cabaña.cantidadBaños}</td>
                                    <td className="py-3 px-4 text-gray-700">{cabaña.cantidadPersonas}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center gap-3">
                                            <Link
                                                to={`/admin/EditarCabaña/${cabaña._id}`}
                                                title="Editar"
                                                className="flex items-center text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
                                            >
                                                <MdModeEdit size={20} />
                                            </Link>
                                            <Link
                                                to={`/admin/VerCabaña/${cabaña._id}`}
                                                title="Ver"
                                                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
                                            >
                                                <GoGraph size={20} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    cabaña.estado !== 'Disponible'
                                                        ? cambiarEstado(cabaña._id, 'No Disponible')
                                                        : cambiarEstado(cabaña._id, 'Disponible')
                                                }
                                                className={`flex items-center px-3 py-2 rounded-lg text-white shadow transition ${cabaña.estado === 'Disponible'
                                                    ? 'bg-lime-500 hover:bg-lime-600'
                                                    : 'bg-red-500 hover:bg-red-600'
                                                    }`}
                                            >
                                                {cabaña.estado === 'Disponible' ? (
                                                    <>
                                                        <FaRegCheckSquare className="mr-1" size={18} /> Habilitada
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdOutlineDisabledByDefault className="mr-1" size={18} /> Deshabilitada
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>


            {/* Paginación */}
            <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300 transition-all"
                    disabled={page === 1}
                >
                    <RiArrowLeftSLine size={20} />
                </button>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">
                    {page} de {totalPages}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition-all"
                    disabled={page === totalPages}
                >
                    <RiArrowRightSLine size={20} />
                </button>
            </div>

            {cargando && <p className="text-center mt-4 text-gray-500">Cargando...</p>}
        </motion.div>
    );
};
