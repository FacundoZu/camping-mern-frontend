import React from "react";
import { motion } from "framer-motion";

const AdminDetalleCamperModal = ({ camper, onClose }) => {
    if (!camper) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    Detalle del Acampante
                </h2>

                <div className="space-y-2 text-gray-700">
                    <p><strong>Responsable:</strong> {camper.nombreResponsable}</p>
                    <p><strong>Teléfono:</strong> {camper.telefono}</p>
                    <p><strong>Email:</strong> {camper.email}</p>
                    <p><strong>Adultos:</strong> {camper.cantidadPersonas}</p>
                    <p><strong>Niños:</strong> {camper.cantidadNinos}</p>
                    <p><strong>Días de estancia:</strong> {camper.diasEstancia}</p>
                    <p><strong>Precio por día:</strong> ${camper.precioPorDia}</p>
                    <p><strong>Total:</strong> ${camper.total}</p>
                    <p><strong>Vehículo:</strong> {camper.vehiculo ? "Sí" : "No"}</p>
                    <p><strong>Motorhome:</strong> {camper.motorhome ? "Sí" : "No"}</p>
                    <p><strong>Patente:</strong> {camper.patente ? camper.patente : "N/A"}</p>
                    <p>
                        <strong>Fecha de ingreso:</strong>{" "}
                        {new Date(camper.fechaIngreso).toLocaleDateString()}
                    </p>
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={onClose}
                        className="bg-lime-600 text-white px-5 py-2 rounded-lg hover:bg-lime-700 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDetalleCamperModal;
