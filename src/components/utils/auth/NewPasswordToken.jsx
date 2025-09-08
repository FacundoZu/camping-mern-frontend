import React from 'react';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { PinInput, PinInputField } from "@chakra-ui/pin-input";

export const NewPasswordToken = ({ token, setToken, setIsValidToken }) => {

  const handleChange = (value) => {
    setToken(value);
  }

  const handleComplete = async (value) => {
    setToken(value);
    const { datos } = await Peticion(Global.url + "user/validateToken", "POST", { token: value }, false, '');
    if (datos && datos.success === true) {
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Validar Token</h1>
          <p className="text-gray-500">
            Ingresa el token que enviamos a tu correo electrónico para restablecer tu contraseña.
          </p>
        </div>

        <form className="space-y-6 mt-6">
          <label className="block text-center text-xl font-medium text-gray-700">
            Código de 6 dígitos
          </label>

          <div className="flex justify-center gap-4">
            <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
              {[...Array(6)].map((_, i) => (
                <PinInputField
                  key={i}
                  className="h-12 w-12 text-center rounded-lg border-2 border-lime-600 focus:border-lime-500 focus:outline-none"
                />
              ))}
            </PinInput>
          </div>
        </form>
      </div>
    </div>
  );
};
