export const Peticion = async (url, metodo, datosGuardar = "", archivos = false, credentials = "same-origin") => {
    let cargando = true;

    let opciones = {
        method: metodo,
        credentials: credentials || "same-origin",
    };

    if (metodo === "GET" || metodo === "DELETE") {
        if (metodo === "GET" && datosGuardar && Object.keys(datosGuardar).length > 0) {
            const queryParams = new URLSearchParams(datosGuardar).toString();
            url += `?${queryParams}`;
        }
        if (metodo === "DELETE" && archivos) {
            opciones.body = JSON.stringify(datosGuardar),
                opciones.headers = { "Content-Type": "application/json" }
        }
    }

    if (metodo === "POST" || metodo === "PUT") {
        if (archivos) {
            opciones.body = datosGuardar
        } else if (datosGuardar) {
            opciones.body = JSON.stringify(datosGuardar),
                opciones.headers = { "Content-Type": "application/json" }
        } else {
            opciones.body = null
        }
    }

    try {
        const peticion = await fetch(url, opciones);
        const datos = await peticion.json();
        cargando = false;
        return {
            datos,
            cargando,
            error: null,
        };
    } catch (error) {
        cargando = false;
        return {
            datos: null,
            cargando,
            error: error.message,
        };
    }
};
