import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export const AdminEditarUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const { datos } = await Peticion(
          `${Global.url}user/profile/${id}`,
          "GET",
          null,
          null,
          "include"
        );
        if (datos.status === "success") {
          setUsuario(datos.user);
          setRol(datos.user.role);
          setCargando(false);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    obtenerUsuario();
  }, [id]);

  const guardarCambios = async () => {
    try {
      const { datos } = await Peticion(
        `${Global.url}user/cambiarRol/${id}`,
        "PUT",
        { role: rol },
        false,
        "include"
      );
      if (datos.status === "success") {
        toast.success(datos.message);
        setUsuario({ ...usuario, role: rol });
      }
    } catch (error) {
      toast.error("Hubo un error al actualizar el rol.");
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Cargando información del usuario...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-6">
      <motion.div
        className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          Detalle del Usuario
        </h2>

        {/* Información del usuario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-gray-600 text-sm font-medium">ID</p>
            <p className="text-gray-900 font-semibold">
              {usuario.id || usuario._id}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-gray-600 text-sm font-medium">Nombre</p>
            <p className="text-gray-900 font-semibold">{usuario.name}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-gray-600 text-sm font-medium">Email</p>
            <p className="text-gray-900 font-semibold">{usuario.email}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-gray-600 text-sm font-medium">Rol Actual</p>
            <p className="text-gray-900 font-semibold capitalize">
              {usuario.role}
            </p>
          </div>
        </div>

        {/* Selector de rol */}
        <div className="mb-6">
          <label
            htmlFor="rol"
            className="block text-gray-700 font-medium mb-2"
          >
            Cambiar Rol
          </label>
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="create-edit-input-button"
          >
            <option value="admin">Admin</option>
            <option value="gerente">Gerente</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={guardarCambios}
            className="bg-lime-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-lime-700 transition"
          >
            Guardar Cambios
          </motion.button>
          <Link
            to={"/admin/usuarios"}
            className="text-lime-600 font-medium hover:underline"
          >
            Volver
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
