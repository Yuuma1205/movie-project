import React from "react";
import "./MovieCard.css";
import Star from "../../assets/emojis/star.png";
import AddToWatchlistBtn from "../AddToWatchlistBtn/AddToWatchlistBtn";

export default function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
  openLoginModal,
}) {
  return (
    <div className="movie_card">
      {/* 右上角愛心 */}
      <AddToWatchlistBtn
        isFavorite={isFavorite}
        onClick={onToggleFavorite}
        openLoginModal={openLoginModal}
        className="favorite_btn"
      />

      <a
        href={`https://www.themoviedb.org/movie/${movie.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt="movie poster"
          className="movie_poster"
        />
      </a>
      <div className="movie_details">
        <h3 className="movie_details_heading">
          {movie.original_title}
          <span className="media_tag movie">Movie</span>
        </h3>
        <div className="align_center movie_date_rate">
          <p>{movie.release_date}</p>
          <p>
            {movie.vote_average}
            <img src={Star} alt="rating icon" className="card_emoji" />
          </p>
        </div>
        <p className="movie_description">
          {movie.overview.slice(0, 100) + "..."}
        </p>
      </div>
    </div>
  );
}
