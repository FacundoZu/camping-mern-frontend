import React, { useEffect, useState } from 'react';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
import { Peticion } from '../../../helpers/Peticion';
import { PerfilImagen } from './../../utils/usuario/PerfilImagen';
import { Loading } from './../../utils/usuario/Loading';
import { EditarPerfil } from './../../utils/usuario/EditarPerfilForm';
import { Detalleperfil } from './../../utils/usuario/DetallePerfil';
import { Link } from 'react-router-dom';

export const Perfil = () => {
  const { auth, setAuth } = useAuth();
  const [usuario, setUsuario] = useState(auth);
  const [mensajeError, setMensajeError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas] = useState();

  const handleToggelEdit = () => {
    setEdit(!edit);
    setPreviewImage(null);
  };

  useEffect(() => {
    const obtenerUsuarioCompleto = async () => {
      const response = await Peticion(Global.url + 'user/completeProfile/', "GET", null, false, 'include');
      if (response && response.datos) {
        setUsuario(response.datos.user);
      }
    };

    const obtenerReservasdeUsuario = async () => {
      const response = await Peticion(Global.url + `reservation/getReservationsUser/${auth.id}`, "GET", null, false, 'include');
      if (response && response.datos && response.datos.success) {
        setReservas(response.datos.reservas);
      }
    };

    obtenerReservasdeUsuario();
    obtenerUsuarioCompleto();
  }, [auth.id]);

  const handleSubmit = async (formulario) => {
    setLoading(true);
    setMensajeError(null);
    const formData = new FormData();
    formData.append('image', selectedFile);

    await Peticion(Global.url + 'user/uploadImage', 'POST', formData, true, 'include');
    const { datos } = await Peticion(Global.url + "user/editUser", "POST", formulario, false, 'include');

    if (datos.status === "success") {
      setAuth(datos.user);
      setUsuario(datos.user);
      setEdit(false);
    } else {
      setMensajeError("Hubo un error al actualizar el perfil. Por favor, inténtalo de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="pt-12">
      <div className="mx-auto p-6 my-14 bg-white shadow-lg rounded-2xl max-w-screen-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Perfil de Usuario</h2>
        {mensajeError && (
          <p className="bg-red-100 text-red-700 text-center p-2 rounded-lg mb-4">
            {mensajeError}
          </p>
        )}

        <div className="flex flex-col items-center">
          {loading ? (
            <Loading />
          ) : edit ? (
            <EditarPerfil
              usuario={usuario}
              setSelectedFile={setSelectedFile}
              setPreviewImage={setPreviewImage}
              handleSubmit={handleSubmit}
              handleToggelEdit={handleToggelEdit}
            />
          ) : (
            <Detalleperfil usuario={usuario} handleToggelEdit={handleToggelEdit} />
          )}
        </div>

        <hr className="my-8" />

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Mis Reservas</h2>

          {reservas && reservas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reservas.map(reserva => (
                reserva.cabaniaId.estado === 'Disponible' && (
                  <div
                    key={reserva._id}
                    className="flex flex-col p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                      {reserva.cabaniaId.nombre}
                    </h3>

                    <p className="text-sm text-gray-600">
                      <strong>Reservaste el:</strong> {new Date(reserva.fechaCreacion).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Inicio:</strong> {new Date(reserva.fechaInicio).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Fin:</strong> {new Date(reserva.fechaFinal).toLocaleDateString()}
                    </p>

                    <span
                      className={`mt-3 self-start px-3 py-1 text-xs font-semibold rounded-full 
                      ${reserva.estadoReserva === 'confirmada'
                          ? 'bg-green-100 text-green-700'
                          : reserva.estadoReserva === 'rechazada'
                            ? 'bg-red-100 text-red-700'
                            : reserva.estadoReserva === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-700'
                              : reserva.estadoReserva === 'completada'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {reserva.estadoReserva.charAt(0).toUpperCase() + reserva.estadoReserva.slice(1)}
                    </span>

                    <p className="text-lg font-semibold text-gray-800 mt-4">
                      Precio Total: ${reserva.precioTotal.toFixed(2)}
                    </p>

                    <Link
                      to={`/cabaña/${reserva.cabaniaId._id}`}
                      className="mt-4 bg-lime-600 text-white text-center py-2 rounded-lg hover:bg-lime-700 transition-colors"
                    >
                      Ver Cabaña
                    </Link>
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-10">No tienes reservas.</p>
          )}
        </section>
      </div>
    </div>
  );
};
