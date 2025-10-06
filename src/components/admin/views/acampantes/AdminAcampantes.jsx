import React, { useEffect, useState } from "react";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlusCircle } from "react-icons/fi";
import AdminDetalleCamperModal from "./AdminDetalleCamperModal";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

export const AdminAcampantes = () => {
    const [campers, setCampers] = useState([]);
    const [selectedCamper, setSelectedCamper] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const cargarCampers = async () => {
        setCargando(true);
        const url = `${Global.url}camper?page=${page}`;
        const { datos } = await Peticion(url, "GET");
        setCampers(datos.campers);
        setTotalPages(datos.totalPages);
        setCargando(false);
    };

    useEffect(() => {
        cargarCampers();
    }, [page]);


    return (
        <motion.div
            className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl max-w-screen-xl mt-6 sm:mt-10 mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-3 gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
                    🏕️ Control de Acampantes
                </h2>
                <Link
                    to="/admin/CrearAcampante"
                    className="flex items-center justify-center px-4 py-2 bg-lime-600 text-white rounded-lg shadow hover:bg-lime-700 transition w-full sm:w-auto"
                >
                    <FiPlusCircle className="mr-2" size={20} />
                    Nuevo Acampante
                </Link>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-100 rounded-lg shadow-md text-sm sm:text-base">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left">Responsable</th>
                            <th className="py-3 px-4 text-center">Personas</th>
                            <th className="py-3 px-4 text-center">Días</th>
                            <th className="py-3 px-4 text-center">Vehículo</th>
                            <th className="py-3 px-4 text-center">Motorhome</th>
                            <th className="py-3 px-4 text-center">Total ($)</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campers && campers.map((c) => (
                            <tr
                                key={c._id}
                                className="bg-white border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4 text-gray-700">{c.nombreResponsable}</td>
                                <td className="py-3 px-4 text-center">
                                    {c.cantidadPersonas} (+{c.cantidadNinos} niños)
                                </td>
                                <td className="py-3 px-4 text-center">{c.diasEstancia}</td>
                                <td className="py-3 px-4 text-center">{c.vehiculo ? "Sí" : "No"}</td>
                                <td className="py-3 px-4 text-center">{c.motorhome ? "Sí" : "No"}</td>
                                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                                    ${c.total}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => setSelectedCamper(c)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Ver detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

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


                {cargando && (
                    <div className="flex justify-center items-center py-6">
                        <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-3 text-gray-500">Cargando acampantes...</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCamper && (
                    <AdminDetalleCamperModal
                        camper={selectedCamper}
                        onClose={() => setSelectedCamper(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminAcampantes;
