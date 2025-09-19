import React from 'react';

export const SkeletonCabaña = () => {
    return (
        <div className="flex flex-col rounded-lg my-1 bg-white shadow-md lg:flex-row animate-pulse">
            {/* Imagen principal */}
            <div className="w-full lg:w-1/3 bg-gray-200 rounded-md"></div>

            {/* Contenido */}
            <div className="p-4 flex-1 w-full">
                {/* Título */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>

                {/* Descripción */}
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>

                {/* Detalles (personas, habitaciones, baños) */}
                <div className="flex m-2 gap-2">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>

                {/* Servicios */}
                <div className='flex'>
                    <div className="flex gap-4 m-2 ml-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* Rating y opiniones */}
                    <div className="flex flex-col items-center ml-auto mb-4">
                        <div className="flex items-center">
                            <div className="h-5 w-5 bg-gray-200 rounded-full mr-1"></div>
                            <div className="h-5 w-5 bg-gray-200 rounded-full mr-1"></div>
                            <div className="h-5 w-5 bg-gray-200 rounded-full mr-1"></div>
                            <div className="h-5 w-5 bg-gray-200 rounded-full mr-1"></div>
                            <div className="h-5 w-5 bg-gray-200 rounded-full mr-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-8 ml-2"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};