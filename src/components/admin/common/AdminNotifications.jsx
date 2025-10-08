import React, { useEffect, useState, useRef } from 'react';
import { Global } from '../../../helpers/Global';
import { FiBell, FiX } from 'react-icons/fi';
import { Peticion } from '../../../helpers/Peticion';
import { Link } from 'react-router-dom';

const AdminNotifications = ({ isExpanded }) => {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const asideRef = useRef();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { datos } = await Peticion(`${Global.url}notifications`, "GET", null, false, "include");
                setNotifications(datos);
            } catch (error) {
                console.error('Error al obtener notificaciones:', error);
            }
        };
        fetchNotifications();
    }, [notifications]);

    // Cerrar panel si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (asideRef.current && !asideRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await Peticion(`${Global.url}notifications/${notificationId}/read`, "PUT", null, false, "include");
            const updatedNotifications = notifications.map(n =>
                n._id === notificationId ? { ...n, isRead: true } : n
            );
            setNotifications(updatedNotifications);
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
        }
    };

    const unreadCount = notifications?.length > 0 ? notifications.filter(n => !n.isRead).length : 0;

    return (
        <div className="relative" ref={asideRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full gap-2 items-center p-2 mb-4 hover:bg-gray-300 rounded-lg transition"
            >
                <FiBell className={`${isExpanded ? "dashboard-icon" : "dashboard-icon mx-auto"}`} />
                {isExpanded && <span className="text-sm font-medium">Notificaciones</span>}
                {unreadCount > 0 && (
                    isExpanded ? (
                        <span className={`ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ${isExpanded ? "" : "hidden"}`}>
                            {unreadCount}
                        </span>
                    ) : (
                        <span className={`ml-auto absolute bg-red-500 text-xs size-2 rounded-full right-2 top-2 ${isExpanded ? "hidden" : ""}`}>
                        </span>
                    )
                )}
            </button>

            {open && (
                <div
                    className="absolute left-full top-0 ml-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                >
                    <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">Notificaciones</h3>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            <FiX className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-3">
                        {!notifications || notifications.length === 0 ? (
                            <p className="text-gray-500 text-sm">Sin notificaciones</p>
                        ) : (
                            notifications.slice(0, 10).map(n => (
                                <div
                                    key={n._id}
                                    className={`p-2 mb-2 rounded-md border ${n.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-100'
                                        }`}
                                >
                                    <p className="text-sm text-gray-700">{n.message}</p>
                                    <button
                                        onClick={() => handleMarkAsRead(n._id)}
                                        className="text-blue-500 hover:text-blue-600 text-xs rounded-lg border border-blue-500 px-2 py-[0.15rem] mt-2"
                                    >
                                        Marcar como leída
                                    </button>
                                    <Link to={`/admin/VerCabaña/${n.cabaniaId}`}>
                                        <button className="text-blue-500 hover:text-blue-600 text-xs ml-2 rounded-lg border border-blue-500 px-2 py-[0.15rem] mt-2">
                                            Ver
                                        </button>
                                    </Link>
                                    <small className="text-gray-400 flex text-xs mt-2">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </small>

                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotifications;
