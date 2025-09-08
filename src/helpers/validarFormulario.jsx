export const validarFormulario = (email, password, password2, name, address, phone) => {
    let errores = {};

    // Validar nombre (no vacío y mínimo 3 caracteres)
    if (!name || name.trim().length < 3) {
        errores.name = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar dirección (no vacía)
    if (!address || address.trim().length === 0) {
        errores.address = "La dirección es requerida";
    }

    // Validar teléfono (no vacío y que sea numérico)
    const regexPhone = /^[0-9]{7,15}$/; // Acepta números de teléfono de entre 7 y 15 dígitos
    if (!phone || !regexPhone.test(phone)) {
        errores.phone = "El número de teléfono no es válido";
    }

    // Validar que el email sea correcto
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        errores.email = "El correo electrónico no es válido";
    }

    // Validar que las contraseñas coincidan
    if (password !== password2) {
        errores.password2 = "Las contraseñas no coinciden";
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
        errores.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return errores;
};