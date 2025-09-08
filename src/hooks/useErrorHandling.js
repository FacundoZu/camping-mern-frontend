import { useState } from 'react';
import { validarFormulario } from '../helpers/validarFormulario';

export const useErrorHandling = () => {
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState(null);

  const manejarErrores = (formulario) => {
    const erroresValidacion = validarFormulario(
      formulario.email,
      formulario.password,
      formulario.password2,
      formulario.name,
      formulario.address,
      formulario.phone
    );
    setErrores(erroresValidacion);
    return Object.keys(erroresValidacion).length === 0;
  };

  const establecerMensajeError = (mensaje) => {
    setMensajeError(mensaje);
  };

  return {
    errores,
    mensajeError,
    manejarErrores,
    establecerMensajeError
  };
};
