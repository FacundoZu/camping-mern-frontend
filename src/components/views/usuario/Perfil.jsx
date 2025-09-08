import React, { useEffect, useState } from 'react';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
import { FaEdit } from "react-icons/fa";
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
    setPreviewImage(null)
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

    const respuestaImagen = await Peticion(Global.url + 'user/uploadImage', 'POST', formData, true, 'include');
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
    <div className="mx-auto my-6 p-6 bg-white shadow-md rounded-lg mt-5 max-w-screen-lg">
      <h2 className="text-xl font-bold text-center mb-4">Perfil de Usuario</h2>
      {mensajeError && <ErrorMensaje message={mensajeError} />}

      <PerfilImagen image={auth.image} previewImage={previewImage} />

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

      <hr className=' my-4 mt-8 ' />
      <section className="mt-8 px-4 sm:px-8 lg:px-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mis Reservas</h2>

        {reservas && reservas.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {reservas.map(reserva => (
              reserva.cabaniaId.estado == 'Disponible' &&
              <div
                key={reserva._id}
                className="flex flex-col p-6 bg-white rounded-lg shadow-md border border-gray-200 flex-grow max-w-full sm:max-w-[48%] md:max-w-[31%] lg:max-w-[30%] min-w-64 m-auto"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Reservaste: {reserva.cabaniaId.nombre}
                </h3>

                <p className="text-sm text-gray-500 mb-1">
                  <strong>Reservaste el día:</strong> {new Date(reserva.fechaCreacion).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Fecha de inicio:</strong> {new Date(reserva.fechaInicio).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Fecha de finalización:</strong> {new Date(reserva.fechaFinal).toLocaleDateString()}
                </p>
                <p
                  className={`text-sm font-medium mt-3 inline-block px-3 py-1 rounded-full ${reserva.estadoReserva === 'confirmada'
                    ? 'bg-green-100 text-green-600'
                    : reserva.estadoReserva === 'rechazada'
                      ? 'bg-red-100 text-red-600'
                      : reserva.estadoReserva === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-600'
                        : reserva.estadoReserva === 'completada'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  Estado: {reserva.estadoReserva.charAt(0).toUpperCase() + reserva.estadoReserva.slice(1)}
                </p>
                <p className="text-lg font-semibold text-gray-800 mt-4">
                  Precio Total: ${reserva.precioTotal.toFixed(2)}
                </p>
                <Link to={`/cabaña/${reserva.cabaniaId._id}`} className='m-auto text-center bg-lime-100 border border-lime-500 p-1 mt-2 rounded-lg'>Ver Cabaña</Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">No tienes reservas.</p>
        )}
      </section>


    </div>
  );
};
