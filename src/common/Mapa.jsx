import React from 'react';
import { FaMapMarkerAlt, FaRoute } from 'react-icons/fa';

const Mapa = () => {
    return (
        <div id="ubicacion" className="relative w-full px-4 sm:px-6 lg:px-20 py-4 overflow-hidden mb-6">
            <div className='rounded-md pr-5 flex flex-col md:flex-row gap-8 '>
                <div className="w-full md:w-2/3 h-[300px] md:h-[400px] lg:h-[500px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5108.728927167168!2d-66.17071144597938!3d-25.12159360142212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941c1e42ddb15d41%3A0x9803b9f8f8c718e!2sCamping%20Municipal%20de%20Cachi!5e0!3m2!1ses-419!2sar!4v1731866080054!5m2!1ses-419!2sar"
                        className="w-full h-full border-0 rounded-lg"
                        allowFullScreen=""
                        loading="lazy"
                        title="Mapa del Camping Municipal de Cachi"
                    ></iframe>
                </div>

                <div className="w-full md:w-1/3 flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl md:text-2xl font-bold flex items-center">
                            <FaRoute className="text-lime-600 mr-2" />
                            ¿Cómo llego a Cachi?
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            Para llegar al pueblo se toma la ruta provincial 68 hasta Chicoana y después acceder a la
                            ruta provincial 33 que recorre la quebrada de Escoipe para internarse luego en la
                            serpenteante Cuesta del Obispo flanqueada por montañas y por un vertiginoso precipicio.
                            Luego de recorrer este camino panorámico, atravesamos la recta de Tin Tin (calzada
                            realizada sobre un camino incaico) hasta llegar a la ruta 40, recorremos pocos
                            kilómetros y arribamos al pintoresco pueblo de Payogasta, continuamos por esta ruta
                            nacional y llegamos finalmente a la localidad de Cachi.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl md:text-2xl font-bold  flex items-center">
                            <FaMapMarkerAlt className="text-lime-600 mr-2" />
                            ¿Cómo llego al camping?
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            Para llegar al camping municipal debo continuar desde la plaza por la Avda Guemes, al
                            llegar al final, tomar la salida a la derecha y continuar por Avda Automovil Club
                            Argentino.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mapa;