import React, { useState } from "react";
import { FaStar, FaEdit, FaSave, FaTimes, FaUser } from "react-icons/fa";

export const Comentarios = ({ review, isEditable, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(review.rating);
    const [comment, setComment] = useState(review.comments?.[0]?.text || "");
    const [hoverRating, setHoverRating] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const userName = review.user?.name || "Usuario desconocido";
    const userImage = review.user?.imageUrl || null;
    const isCurrentUser = isEditable;

    const handleSave = async () => {
        if (rating === 0 || comment.trim().length < 10) return;
        
        setIsSaving(true);
        try {
            await onEdit(review._id, { rating, comment });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving review:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setRating(review.rating);
        setComment(review.comments?.[0]?.text || "");
        setHoverRating(0);
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha no disponible";
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
            isCurrentUser ? 'ring-2 ring-lime-200 bg-gradient-to-r from-lime-50 to-green-50' : ''
        }`}>
            {/* Header del comentario */}
            <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {userImage ? (
                        <img
                            src={userImage}
                            alt={userName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div 
                        className={`w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white font-semibold text-lg ${
                            userImage ? 'hidden' : 'flex'
                        }`}
                    >
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Info del usuario y calificación */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                {userName}
                                {isCurrentUser && (
                                    <span className="text-xs bg-lime-500 text-white px-2 py-1 rounded-full">
                                        Tu reseña
                                    </span>
                                )}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                            </p>
                        </div>
                        
                        {/* Botón de editar (solo en vista normal) */}
                        {isEditable && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 text-lime-600 hover:text-lime-700 font-medium text-sm transition-colors p-2 hover:bg-lime-50 rounded-lg"
                            >
                                <FaEdit className="size-6" />
                                <span className="hidden sm:inline">Editar</span>
                            </button>
                        )}
                    </div>

                    {/* Calificación */}
                    <div className="flex items-center gap-2 mb-3">
                        {!isEditing ? (
                            <>
                                <div className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <FaStar
                                            key={index}
                                            className={`text-lg ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                    {review.rating}/5
                                </span>
                            </>
                        ) : (
                            <div>
                                <div className="flex gap-1 mb-2">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setRating(index + 1)}
                                            onMouseEnter={() => setHoverRating(index + 1)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 transition-transform hover:scale-110"
                                        >
                                            <FaStar
                                                className={`text-xl transition-colors ${
                                                    index < (hoverRating || rating) 
                                                        ? "text-yellow-400" 
                                                        : "text-gray-300 hover:text-yellow-200"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-600">
                                    Haz clic en las estrellas para calificar
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido del comentario */}
            <div className="lg:ml-16">
                {!isEditing ? (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-gray-800 leading-relaxed">
                            {comment || "Sin comentarios adicionales."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none transition-all duration-200"
                                placeholder="Comparte los detalles de tu experiencia..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">
                                    Mínimo 10 caracteres
                                </span>
                                <span className="text-xs text-gray-500">
                                    {comment.length}/500
                                </span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleSave}
                                disabled={rating === 0 || comment.trim().length < 10 || isSaving}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FaSave className="text-sm" />
                                )}
                                <span>{isSaving ? "Guardando..." : "Guardar cambios"}</span>
                            </button>
                            
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                            >
                                <FaTimes className="text-sm" />
                                <span>Cancelar</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};