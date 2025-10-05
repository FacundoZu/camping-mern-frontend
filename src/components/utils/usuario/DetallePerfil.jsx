import React from 'react';
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { PerfilImagen } from './../usuario/PerfilImagen';

export const Detalleperfil = ({ usuario, handleToggelEdit }) => {
  const campos = [
    { label: "Nombre", valor: usuario.name, icon: <FaUser className="text-gray-500" /> },
    { label: "Correo electrónico", valor: usuario.email, icon: <FaEnvelope className="text-gray-500" /> },
    { label: "Teléfono", valor: usuario.phone || "No registrado", icon: <FaPhone className="text-gray-500" /> },
    { label: "Dirección", valor: usuario.address || "No registrada", icon: <FaMapMarkerAlt className="text-gray-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
      {/* Columna izquierda: foto y botón */}
      <div className="flex flex-col items-center md:items-start space-y-4">
        <PerfilImagen image={usuario.image} />
        <button
          onClick={handleToggelEdit}
          className="botton-submit-2 shadow-md"
        >
          <FaEdit /> Editar perfil
        </button>
      </div>

      {/* Columna derecha: info de usuario */}
      <div className="md:col-span-2 bg-gray-50 rounded-xl shadow-md p-6 space-y-6">
        {campos.map((campo, index) => (
          <div key={index} className="flex items-center gap-3 border-b border-gray-200 pb-3">
            <div className="text-xl">{campo.icon}</div>
            <div>
              <span className="text-sm font-medium text-gray-600 block">{campo.label}</span>
              <span className="text-base text-gray-800 font-semibold">{campo.valor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
