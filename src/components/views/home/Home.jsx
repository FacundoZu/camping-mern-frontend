import React from "react";
import { Link } from "react-router-dom";
import { Actividades } from "../../../common/Actividades.jsx";
import { Preguntas } from "../../../common/Preguntas.jsx";
import Mapa from "../../../common/Mapa.jsx";
import ContactForm from "../../../common/ContactForm.jsx";
import FormularioBusqueda from "../../../common/FormularioBusqueda.jsx";
import { FaArrowRight } from "react-icons/fa";
import VisitasRecientes from "../../../common/VisitasRecientes.jsx";

export const Home = () => {
    return (
        <div className="overflow-x-hidden">
            <div className="relative h-[34rem] flex justify-center shadow-md">
                <img
                    src="https://images.unsplash.com/photo-1533575770077-052fa2c609fc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Imagen principal"
                    className=" bottom-0 w-full h-full object-cover overflow-hidden z-[-1]"
                    style={{ position: "fixed" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                <FormularioBusqueda />
                {/* 
                <Link
                    to="/cabañas"
                    className="mt-4 z-30 absolute flex items-center px-6 py-3 m-auto bottom-5 md:bottom-5 md:right-40 bg-lime-600 text-white text-lg rounded-md shadow-md hover:bg-lime-700 transition-all"
                >
                    Ver todas las cabañas <FaArrowRight className="w-4 h-4 ml-2" />
                </Link> 
                */}
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
