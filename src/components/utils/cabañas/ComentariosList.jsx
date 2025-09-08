import React, { useState } from "react";
import { FaStar, FaUser, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Comentarios } from "./Comentarios";

const ComentariosList = ({ reviews = [], onAddReview, userId, onUpdateReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const userHasCommented = Array.isArray(reviews) && reviews.some((review) => review.user._id === userId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      return;
    }
    onAddReview(rating, comment);
    setRating(0);
    setComment("");
    setHoverRating(0);
  };

  const handleUpdateReview = (reviewId, updatedData) => {
    onUpdateReview(reviewId, updatedData);
  };

  const filteredReviews = reviews.filter((review) => review.estado === "Habilitado");

  const sortedReviews = filteredReviews.sort((a, b) => {
    if (a.user._id === userId) return -1;
    if (b.user._id === userId) return 1;
    return 0;
  });

  const totalRatings = filteredReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = filteredReviews.length > 0 ? (totalRatings / filteredReviews.length).toFixed(1) : 0;

  const ratingsCount = filteredReviews.reduce((counts, review) => {
    counts[review.rating] = (counts[review.rating] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="mt-8 space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-lime-50 to-green-50 border border-lime-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-lime-500 rounded-lg">
            <FaChartBar className="text-white text-lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Reseñas de usuarios</h2>
        </div>

        {/* Resumen de calificaciones */}
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Promedio */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-800">{averageRating}</span>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    className={`text-xl ${index < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600">
              Basado en {filteredReviews.length} {filteredReviews.length === 1 ? 'reseña' : 'reseñas'}
            </p>
          </div>

          {/* Distribución de calificaciones */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingsCount[star] || 0;
              const percentage = filteredReviews.length > 0 ? (count / filteredReviews.length) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 w-12 text-gray-600">
                    <span>{star}</span>
                    <FaStar className="text-xs text-yellow-400" />
                  </div>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <span className="w-8 text-xs text-gray-500 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Formulario para nuevo comentario */}
      {!userId ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="p-4 bg-gray-50 rounded-xl mb-4 inline-block">
            <FaUser className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">¿Quieres dejar una reseña?</h3>
          <p className="text-gray-600 mb-4">Inicia sesión para compartir tu experiencia</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Iniciar sesión
          </Link>
        </div>
      ) : (
        !userHasCommented && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Comparte tu experiencia</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Calificación con estrellas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tu calificación
                </label>
                <div className="flex gap-1">
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
                        className={`text-2xl transition-colors ${
                          index < (hoverRating || rating) 
                            ? "text-yellow-400" 
                            : "text-gray-300 hover:text-yellow-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {rating === 5 ? "¡Excelente!" : rating === 4 ? "Muy bueno" : rating === 3 ? "Bueno" : rating === 2 ? "Regular" : "Necesita mejorar"}
                  </p>
                )}
              </div>

              {/* Campo de comentario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tu comentario
                </label>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none transition-all duration-200"
                  placeholder="Comparte los detalles de tu experiencia..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
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

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={rating === 0 || comment.trim().length < 10}
                className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {rating === 0 || comment.trim().length < 10 
                  ? "Completa tu reseña" 
                  : "Publicar reseña"
                }
              </button>
            </form>
          </div>
        )
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {sortedReviews.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Todas las reseñas ({sortedReviews.length})
            </h3>
            {sortedReviews.map((review) => (
              <Comentarios
                key={review._id}
                review={review}
                isEditable={userId && review.user._id === userId}
                onEdit={handleUpdateReview}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="p-4 bg-white rounded-xl mb-4 inline-block shadow-sm">
              <FaStar className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Aún no hay reseñas
            </h3>
            <p className="text-gray-500">
              ¡Sé el primero en compartir tu experiencia!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComentariosList;