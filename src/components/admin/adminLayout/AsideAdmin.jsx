import React, { useState } from "react";
import {
    FiMenu, FiX, FiHome, FiUsers, FiSettings, FiActivity, FiHelpCircle, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import { FaCampground, FaUser } from "react-icons/fa";
import { RiCoupon3Line, RiLeafFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { MdDashboardCustomize } from "react-icons/md";
import AdminNotifications from "../common/AdminNotifications";

const AsideAdmin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [isExpanded, setIsExpanded] = useState(true);
    const { auth } = useAuth();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <>
            {/* Botón toggle móvil */}
            <button
                className={`text-2xl p-3 fixed top-4 z-50 bg-gray-200 rounded-lg transition-all duration-300 ease-in-out lg:hidden
                ${isSidebarOpen ? "left-60" : "left-4"}`}
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 bg-gray-100 transform transition-all duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:static lg:flex-shrink-0
                ${isExpanded ? "w-64" : "w-20"} 
                `}
            >
                <div className="flex flex-col h-full justify-between p-4">

                    {/* Header con botón expand/collapse */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Link
                                to="/"
                                className="flex items-center hover:bg-gray-300 p-2 rounded-md transition-all w-full mr-2"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <RiLeafFill className="text-lime-600 h-8 w-8" />
                                {isExpanded && (
                                    <>
                                        <span className="text-slate-800 font-bold">Camping</span>
                                        <span className="text-slate-800 font-semibold">Cachi</span>
                                    </>
                                )}
                            </Link>
                            {/* Botón expand/collapse solo en desktop */}
                            <button
                                onClick={toggleExpand}
                                className="hidden lg:block p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in-out"
                            >
                                {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
                            </button>

                        </div>
                        <AdminNotifications isExpanded={isExpanded}/>
                        <hr className="border-gray-400 mb-2" />
                        {/* Navegación */}
                        <nav>
                            <ul className="space-y-2">
                                {auth.role === "admin" && (
                                    <>
                                        <li>
                                            <Link
                                                to="/admin/dashboard"
                                                className="dashboard-button"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <MdDashboardCustomize className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                                                {isExpanded && <span>Dashboard</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/usuarios"
                                                className="dashboard-button"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <FiUsers className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                                                {isExpanded && <span>Usuarios</span>}
                                            </Link>
                                        </li>
                                        <hr className="border-gray-400"/>
                                    </>
                                )}
                                {(auth.role === "admin" || auth.role === "gerente") && (
                                    <>
                                        <li>
                                            <Link
                                                to="/admin/cabañas"
                                                className="dashboard-button"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <FiHome className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                                                {isExpanded && <span>Cabañas</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/acampantes"
                                                className="dashboard-button"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <FaCampground className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                                                {isExpanded && <span>Acampantes</span>}
                                            </Link>
                                        </li>
                                        <hr className="border-gray-400" />
                                        <li>
                                            <Link
                                                to="/admin/servicios"
                                                className="dashboard-button"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <FiSettings className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                                                {isExpanded && <span>Servicios</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/actividades"
                                                className="dashboard-button"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <FiActivity className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                                                {isExpanded && <span>Actividades</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/preguntas"
                                                className="dashboard-button"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <FiHelpCircle className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                                                {isExpanded && <span>Preguntas</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/cupones"
                                                className="dashboard-button"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <RiCoupon3Line className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                                                {isExpanded && <span>Cupones</span>}
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>


                    {/* Perfil */}
                    <div className="border-t border-gray-400 pt-4">
                        <Link
                            to="/perfil"
                            className="flex items-center gap-3 hover:bg-gray-300 p-2 rounded-md transition-all"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {auth.image ? (
                                <img
                                    src={auth.image}
                                    alt="Perfil"
                                    className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                                />
                            ) : (
                                <FaUser className="w-9 h-9 p-1 rounded-full border border-gray-300 shadow-sm text-gray-400" />
                            )}
                            {isExpanded && (
                                <div>
                                    <p className="text-lime-600 font-medium text-sm truncate">{auth.name}</p>
                                    <p className="text-gray-600 font-medium text-sm truncate">{auth.role}</p>
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Overlay móvil */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default AsideAdmin;
