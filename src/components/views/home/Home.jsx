import React from "react";
import { Actividades } from "../../../common/Actividades.jsx";
import { Preguntas } from "../../../common/Preguntas.jsx";
import Mapa from "../../../common/Mapa.jsx";
import ContactForm from "../../../common/ContactForm.jsx";
import FormularioBusqueda from "../../../common/FormularioBusqueda.jsx";
import VisitasRecientes from "../../../common/VisitasRecientes.jsx";

export const Home = () => {
    return (
        <div className="overflow-x-hidden">
            <div className="relative h-[45rem] flex justify-center shadow-md pt-20">
                <div className="bg-image"></div>
                <FormularioBusqueda />
            </div>
            <div className="bg-slate-100 pb-16 py-6 px-6 md:px-20">
                <VisitasRecientes />

                <Actividades />

                <Preguntas />

                <Mapa />

                <ContactForm />
            </div>

        </div>
    );
};
