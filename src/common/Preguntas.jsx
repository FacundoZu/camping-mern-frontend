import React, { useEffect, useState } from 'react';
import { Global } from '../helpers/Global';
import { Peticion } from '../helpers/Peticion';
import { FaQuestionCircle, FaCommentDots, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const Preguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await Peticion(Global.url + "question/getAllQuestions", "GET", null, false, 'include');

                if (response && response.datos.preguntas) {
                    setPreguntas(response.datos.preguntas);
                } else {
                    throw new Error('No se encontraron preguntas en la respuesta.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const toggleQuestion = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) {
        return (
            <div className=" bg-gray-50">
                <div className="md:w-5/6 m-auto max-w-4xl shadow-md">
                    <div className="flex justify-center items-center mb-8">
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                        <div className="h-12 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                    </div>

                    <ul className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <li key={index}>
                                <div className="bg-white p-6 shadow rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                                            <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
                                        </div>
                                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div id="preguntas" className="w-4/6 m-auto sm:px-6 lg:px-20 py-4 mb-6">
            <div className="m-auto pb-4 ">
                {preguntas.length > 0 && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold inline-flex items-center">
                            Preguntas Frecuentes
                        </h2>
                        <p className="mt-3 text-gray-500">Selecciona una pregunta para ver la respuesta</p>
                    </div>
                )}

                <ul className="space-y-4">
                    {preguntas.map((pregunta) => (
                        pregunta.estado === "Habilitado" && (
                            <li key={pregunta._id}>
                                <div 
                                    className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer ${expandedId === pregunta._id ? 'ring-2 ring-lime-800' : 'hover:shadow-md'}`}
                                    onClick={() => toggleQuestion(pregunta._id)}
                                >
                                    <div 
                                        className="flex items-center justify-between"
                                        
                                    >
                                        <div className="flex items-center">
                                            <FaCommentDots className="text-lime-600 mr-3 text-lg" />
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {pregunta.pregunta}
                                            </h3>
                                        </div>
                                        {expandedId === pregunta._id ? (
                                            <FaChevronUp className="text-gray-400 transition-transform" />
                                        ) : (
                                            <FaChevronDown className="text-gray-400 transition-transform" />
                                        )}
                                    </div>

                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedId === pregunta._id ? 'max-h-96 pt-4 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="pl-9">
                                            <p className="text-gray-600 leading-relaxed border-l-2 border-lime-800 pl-4 py-2">
                                                {pregunta.respuesta}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    ))}
                </ul>

                {preguntas.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <FaQuestionCircle className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500">No hay preguntas disponibles en este momento</p>
                    </div>
                )}
            </div>
        </div>
    );
};