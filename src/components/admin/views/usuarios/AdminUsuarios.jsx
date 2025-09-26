import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
import { MdModeEdit } from "react-icons/md";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { BotonPDFUsuarios } from "./BotonPDFUsuarios";

export const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [todosLosUsuarios, setTodosLosUsuarios] = useState([]); // Estado para todos los usuarios filtrados
    const [cargando, setCargando] = useState(true);
    const [filtros, setFiltros] = useState({ id: '', name: '', email: '' });
    const [pagina, setPagina] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortRole, setSortRole] = useState('asc');

    useEffect(() => {
        const obtenerUsuarios = async () => {
            let url = `${Global.url}user/getAllUsers?page=${pagina}&limit=9`;

            if (filtros.name) url += `&name=${filtros.name}`;
            if (filtros.email) url += `&email=${filtros.email}`;
            if (sortRole) url += `&sortRole=${sortRole}`;

            const { datos } = await Peticion(url, "GET", null, false, 'include');
            if (datos.status === 'success') {
                setUsuarios(datos.users);
                setTotalPages(datos.totalPages);
                setCargando(false);
            }
        };

        obtenerUsuarios();
    }, [pagina, filtros, sortRole]);

    // Nueva función para cargar todos los usuarios filtrados
    useEffect(() => {
        const cargarTodosLosUsuarios = async () => {
            let url = `${Global.url}user/getAllUsers?limit=1000`; // Ajusta el límite según sea necesario

            // Añadir filtros a la URL
            if (filtros.name) url += `&name=${filtros.name}`;
            if (filtros.email) url += `&email=${filtros.email}`;
            if (sortRole) url += `&sortRole=${sortRole}`;

            const { datos } = await Peticion(url, "GET", null, false, 'include');
            if (datos.status === 'success') {
                setTodosLosUsuarios(datos.users);
            }
        };

        cargarTodosLosUsuarios();
    }, [filtros, sortRole]);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
            setPagina(nuevaPagina);
        }
    };

    const manejarFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            [name]: value,
        }));
    };

    const cambiarOrdenRol = () => {
        setSortRole((prevSortRole) => (prevSortRole === 'asc' ? 'desc' : 'asc'));
    };

    const generarPDF = () => {
        generarPDFUsuarios(todosLosUsuarios, "Lista de Usuarios");
    };

    return (
        <motion.div
            className="p-6 bg-white rounded-2xl shadow-xl max-w-screen-xl mx-auto mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">👥 Gestión de Usuarios</h2>
                <div className="flex flex-wrap gap-3">
                    <BotonPDFUsuarios filtros={filtros} sortRole={sortRole} />
                    <button
                        onClick={cambiarOrdenRol}
                        className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all duration-200"
                    >
                        Ordenar por Rol: {sortRole === 'asc' ? 'Admin' : 'Gerente'}
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    name="name"
                    value={filtros.name}
                    onChange={manejarFiltro}
                    placeholder="Buscar por Nombre"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                />
                <input
                    type="text"
                    name="email"
                    value={filtros.email}
                    onChange={manejarFiltro}
                    placeholder="Buscar por Correo"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                />
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto max-h-[600px] min-h-[600px]">
                <table className="w-full max-h-[600px] min-w-[600px] bg-gray-50 rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 text-left text-gray-700">Nombre</th>
                            <th className="py-3 px-4 text-left text-gray-700">Correo</th>
                            <th className="py-3 px-4 text-center text-gray-700">Rol</th>
                            <th className="py-3 px-4 text-center text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {usuarios.map((usuario) => (
                                <motion.tr
                                    key={usuario.id || usuario._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white border-b hover:bg-gray-100 transition-colors"
                                >
                                    <td className="py-3 px-4 text-gray-700">{usuario.name}</td>
                                    <td className="py-3 px-4 text-gray-700">{usuario.email}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${usuario.role === "admin"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {usuario.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            to={`/admin/EditarUsuario/${usuario.id || usuario._id}`}
                                            title="Editar"
                                            className="inline-flex items-center justify-center text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-all"
                                        >
                                            <MdModeEdit size={20} />
                                        </Link>
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
                    onClick={() => cambiarPagina(pagina - 1)}
                    className="px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300 transition-all"
                    disabled={pagina === 1}
                >
                    <RiArrowLeftSLine size={20} />
                </button>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">
                    {pagina} de {totalPages}
                </span>
                <button
                    onClick={() => cambiarPagina(pagina + 1)}
                    className="px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition-all"
                    disabled={pagina === totalPages}
                >
                    <RiArrowRightSLine size={20} />
                </button>
            </div>

            {cargando && <p className="text-center text-gray-500 mt-4">Cargando usuarios...</p>}
        </motion.div>
    );
};
