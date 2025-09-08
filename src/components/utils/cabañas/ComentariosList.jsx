import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Comentarios = ({ review, isEditable, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comments?.[0]?.text || "");

  const userName = review.user?.name || "Usuario desconocido";
  const userImage = review.user?.imageUrl || "/default-avatar.png";

  const handleSave = () => {
    onEdit(review._id, { rating, comment });
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <img
          src={userImage}
          alt={userName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-semibold">{userName}</h4>
          {!isEditing ? (
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                  key={index}
                  className={`${index < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex mb-4">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                  key={index}
                  onClick={() => setRating(index + 1)}
                  className={`cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {!isEditing ? (
        <p className="text-gray-700">{comment || "Sin comentarios."}</p>
      ) : (
        <textarea
          className="w-full p-2 border rounded-lg mb-4"
          placeholder="Escribe tu comentario aquí..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      )}

      {isEditable && (
        <div className="flex justify-end">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 bg-lime-500 hover:bg-lime-700 text-white font-bold py-1 px-3 rounded"
            >
              Editar
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="mt-2 bg-lime-500 hover:bg-lime-700 text-white font-bold py-1 px-3 rounded mr-2"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="mt-2 bg-gray-300 hover:bg-gray-500 text-gray-700 font-bold py-1 px-3 rounded"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const ComentariosList = ({ reviews = [], onAddReview, userId, onUpdateReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const userHasCommented = Array.isArray(reviews) && reviews.some((review) => review.user._id === userId);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      return;
    }
    onAddReview(rating, comment);
    setRating(0);
    setComment("");
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
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-lime-700 text-center">Reseñas</h2>
      <hr className="mt-4" />

      <div className="text-center mt-4">
        <h3 className="text-lg font-bold mb-4">Promedio de puntuaciones: {averageRating} / 5</h3>
        <div className="space-y-2 max-w-md mx-auto">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingsCount[star] || 0;
            const percentage = filteredReviews.length > 0 ? (count / filteredReviews.length) * 100 : 0;

            return (
              <div key={star} className="flex items-center text-sm">
                <div className="flex items-center w-14">
                  {star} <FaStar className="ml-1 text-yellow-500" />
                </div>

                <div className="flex-1 bg-gray-200 rounded-lg h-2 mx-2 relative max-w-sm">
                  <div
                    className="bg-yellow-500 h-2 rounded-lg"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <span className="w-8 text-gray-700">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {!userId ? (
        <div className="text-center mt-8">
          <Link
            to="/login"
            className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
          >
            Iniciar sesión para dejar un comentario
          </Link>
        </div>
      ) : (
        !userHasCommented && (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 mt-8">
            <h3 className="text-lg font-bold mb-2">Deja tu comentario</h3>
            <div className="flex mb-4">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                  key={index}
                  onClick={() => setRating(index + 1)}
                  className={`cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <textarea
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Escribe tu comentario aquí..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
            >
              Enviar Comentario
            </button>
          </form>
        )
      )}
      {sortedReviews.length > 0 ? (
        sortedReviews.map((review) => (
          <Comentarios
            key={review._id}
            review={review}
            isEditable={userId && review.user._id === userId}
            onEdit={handleUpdateReview}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center">No hay reseñas aún.</p>
      )}
    </div>
  );
};

export default ComentariosList;
