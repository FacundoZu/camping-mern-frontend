import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";

export const AdminCrearAcampante = () => {
    const [form, setForm] = useState({
        nombreResponsable: "",
        telefono: "",
        email: "",
        cantidadPersonas: "",
        cantidadNinos: "",
        diasEstancia: "",
        precioPorDia: "",
        vehiculo: false,
        motorhome: false,
        patente: "",
    });

    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedForm = { ...form, [name]: type === "checkbox" ? checked : value };

        // Recalcular total cuando cambia días o precio
        const dias = parseInt(updatedForm.diasEstancia) || 0;
        const precio = parseInt(updatedForm.precioPorDia) || 0;
        setTotal(dias * precio);

        setForm(updatedForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${Global.url}camper`;

        const { datos } = await Peticion(url, "POST", form);
        if (datos && datos._id) {
            toast.success("Acampante registrado correctamente");
            navigate("/admin/acampantes");
        } else {
            toast.error("Ocurrió un error al registrar el acampante");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[100dvh] p-6">
            <motion.div
                className="p-6 bg-white rounded-2xl shadow-xl mx-auto max-w-lg w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
                    🏕️ Registrar Nuevo Acampante
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Nombre del Responsable</label>
                        <input
                            type="text"
                            name="nombreResponsable"
                            value={form.nombreResponsable}
                            onChange={handleChange}
                            className="create-edit-input-button"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                className="create-edit-input-button"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="create-edit-input-button"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Adultos</label>
                            <input
                                type="number"
                                name="cantidadPersonas"
                                value={form.cantidadPersonas}
                                onChange={handleChange}
                                className="create-edit-input-button"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Niños</label>
                            <input
                                type="number"
                                name="cantidadNinos"
                                value={form.cantidadNinos}
                                onChange={handleChange}
                                className="create-edit-input-button"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Días</label>
                            <input
                                type="number"
                                name="diasEstancia"
                                value={form.diasEstancia}
                                onChange={handleChange}
                                className="create-edit-input-button"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Precio por Día ($)</label>
                            <input
                                type="number"
                                name="precioPorDia"
                                value={form.precioPorDia}
                                onChange={handleChange}
                                className="create-edit-input-button"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-gray-700">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="vehiculo"
                                checked={form.vehiculo}
                                onChange={handleChange}
                            />
                            Vehículo
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="motorhome"
                                checked={form.motorhome}
                                onChange={handleChange}
                            />
                            Motorhome
                        </label>
                    </div>

                    {form.vehiculo || form.motorhome ? (
                        <div>
                            <label className="block text-gray-700 mb-1">Patente</label>
                            <input
                                type="text"
                                name="patente"
                                value={form.patente}
                                onChange={handleChange}
                                className="create-edit-input-button"
                            />
                        </div>
                    ) : null}

                    <div className="bg-gray-50 p-3 rounded-lg text-center text-gray-800 font-medium">
                        Total a Pagar: <span className="text-lime-600 font-bold">${total}</span>
                    </div>

                    <div className="flex items-center gap-4 justify-center mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-lime-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-lime-700 transition"
                        >
                            Registrar Acampante
                        </motion.button>

                        <Link
                            to="/admin/acampantes"
                            className="text-lime-600 font-medium hover:underline"
                        >
                            Volver
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminCrearAcampante;
