import { useState } from "react";

export const useForm = (objetoInicial = {}) => {

    const [formulario, setFormulario] = useState(objetoInicial);

    const serializarFormulario = (formulario) => {
        const formData = new FormData(formulario);
        const objeto_completo = {};
        for (let [name, value] of formData) {
            objeto_completo[name] = value;
        }
        return objeto_completo;
    };

    const enviado = (e) => {
        e.preventDefault();
        let curso = serializarFormulario(e.target);
        setFormulario(curso);

        document.querySelector(".codigo").classList.add("enviado");
    }

    const cambiado = ({ target }) => {
        const { name, value } = target
        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    return {
        formulario,
        setFormulario,
        enviado,
        cambiado
    }
} 