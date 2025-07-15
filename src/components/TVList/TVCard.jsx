import React from "react";
import "./TVCard.css";
import AddToWatchlistBtn from "../AddToWatchlistBtn/AddToWatchlistBtn";

export default function TVCard({
  tv,
  isFavorite,
  onToggleFavorite,
  openLoginModal,
}) {
  return (
    <div className="tv_card">
      {/* 右上角愛心 */}
      <AddToWatchlistBtn
        isFavorite={isFavorite}
        onClick={onToggleFavorite}
        openLoginModal={openLoginModal}
        className="favorite_btn"
      />
      <a
        href={`https://www.themoviedb.org/tv/${tv.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={
            tv.poster_path
              ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt="tv poster"
          className="tv_poster"
        />
      </a>
      <div className="tv_details">
        <h3 className="tv_details_heading">
          {tv.name}
          <span className="media_tag tv">TV</span>
        </h3>
        <div className="align_center tv_date_rate">
          <p>{tv.first_air_date}</p>
          <p>
            {tv.vote_average}
            <span className="tv_card_star">★</span>
          </p>
        </div>
        <p className="tv_description">
          {tv.overview ? tv.overview.slice(0, 100) + "..." : ""}
        </p>
      </div>
    </div>
  );
}
