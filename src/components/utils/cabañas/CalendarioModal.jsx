import React from 'react'
import { CalendarioReservas } from './CalendarioReservas'

export const CalendarioModal = ({ isOpen, onClose, reservas, onReservar, mensajeError, userId, precioPorNoche }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex bg-black bg-opacity-50 z-50 overflow-auto">
            <div className="max-h-max my-auto w-full flex items-center justify-center bg-gray-100 rounded-xl">
                <CalendarioReservas reservas={reservas} onReservar={onReservar} mensajeError={mensajeError} onClose={onClose} precioPorNoche={precioPorNoche}/>
            </div>
        </div>
    )
}
