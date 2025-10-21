import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";

export const AdminCrearCupon = () => {
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [discountType, setDiscountType] = useState("percentage");
    const [discountValue, setDiscountValue] = useState("");
    const [maxUses, setMaxUses] = useState("");
    const [expiresAt, setExpiresAt] = useState(null);
    const navigate = useNavigate();

    const crearCupon = async (e) => {
        e.preventDefault();

        if (!code || !discountValue) {
            toast.error("Por favor completa los campos requeridos.");
            return;
        }

        const formData = {
            code,
            description,
            discountType,
            discountValue: parseFloat(discountValue),
            maxUses: maxUses ? parseInt(maxUses) : null,
            expiresAt: expiresAt || null,
        };

        const url = `${Global.url}cupon`;
        const { datos: response } = await Peticion(url, "POST", formData, false, "include");

        if (response?._id) {
            toast.success("Cupón creado correctamente 🎉");
            navigate("/admin/cupones");
        } else {
            toast.error(response?.message || "Error al crear el cupón.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[100dvh] p-6">
            <motion.div
                className="p-6 bg-white rounded-lg shadow-lg max-w-lg w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Crear Nuevo Cupón</h2>

                <form onSubmit={crearCupon}>
                    {/* Código */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Código del cupón</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="create-edit-input-button uppercase"
                            placeholder="EJ: VERANO2025"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">Usa letras mayúsculas y sin espacios.</p>
                    </div>

                    {/* Descripción */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="create-edit-input-button"
                            placeholder="Ej: Descuento especial de verano"
                        />
                    </div>

                    {/* Tipo de descuento */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tipo de descuento</label>
                        <div className="flex gap-6">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="discountType"
                                    value="percentage"
                                    checked={discountType === "percentage"}
                                    onChange={(e) => setDiscountType(e.target.value)}
                                    className="mr-2"
                                />
                                Porcentaje (%)
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="discountType"
                                    value="fixed"
                                    checked={discountType === "fixed"}
                                    onChange={(e) => setDiscountType(e.target.value)}
                                    className="mr-2"
                                />
                                Monto fijo ($)
                            </label>
                        </div>
                    </div>

                    {/* Valor del descuento */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">
                            Valor del descuento {discountType === "percentage" ? "(%)" : "($)"}
                        </label>
                        <input
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            className="create-edit-input-button"
                            min="1"
                            placeholder={discountType === "percentage" ? "Ej: 10" : "Ej: 500"}
                            required
                        />
                    </div>

                    {/* Límite de usos */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Límite de usos (opcional)</label>
                        <input
                            type="number"
                            value={maxUses}
                            onChange={(e) => setMaxUses(e.target.value)}
                            className="create-edit-input-button"
                            min="1"
                            placeholder="Ej: 50"
                        />
                        <p className="text-sm text-gray-500 mt-1">Deja vacío si no tiene límite.</p>
                    </div>

                    {/* Fecha de expiración */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Fecha de expiración (opcional)</label>
                        <input
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="create-edit-input-button"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex items-center gap-4 mt-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-lime-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-lime-700 transition"
                        >
                            Crear Cupón
                        </motion.button>
                        <Link
                            to={"/admin/cupones"}
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
