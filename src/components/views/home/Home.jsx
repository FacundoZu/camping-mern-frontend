import React, { useEffect } from "react";
import { Actividades } from "../../../common/Actividades.jsx";
import { Preguntas } from "../../../common/Preguntas.jsx";
import Mapa from "../../../common/Mapa.jsx";
import ContactForm from "../../../common/ContactForm.jsx";
import FormularioBusqueda from "../../../common/FormularioBusqueda.jsx";
import VisitasRecientes from "../../../common/VisitasRecientes.jsx";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';

export const Home = () => {
    useEffect(() => {
        if (window.location.hash) {
            const section = document.querySelector(window.location.hash);
            if (section) {
                // Espera un tick para que el DOM termine de renderizar
                setTimeout(() => {
                    section.scrollIntoView({ behavior: "smooth" });
                }, 300);
            }
        }
    }, []);
    return (
        <div className="overflow-x-hidden">
            <div className="relative h-[45rem] flex justify-center shadow-lg pt-20">
                <div className="bg-image"></div>
                <FormularioBusqueda />
            </div>
            <div className="bg-slate-100 pb-16 py-6 md:px-20">
                <VisitasRecientes />

                <Actividades />

                <Preguntas />

                <Mapa />

                <ContactForm />
            </div>

        </div>
    );
};
