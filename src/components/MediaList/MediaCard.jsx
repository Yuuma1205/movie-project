import React from "react";
import "./MediaCard.css";
import AddToWatchlistBtn from "../AddToWatchlistBtn/AddToWatchlistBtn";

export default function MediaCard({
  item,
  isFavorite,
  onToggleFavorite,
  openLoginModal,
}) {
  const isMovie = item.media_type === "movie";
  const title = isMovie ? item.original_title || item.title : item.name;
  const date = isMovie ? item.release_date : item.first_air_date;
  const detailUrl = `https://www.themoviedb.org/${item.media_type}/${item.id}`;

  return (
    <div className="media_card">
      <AddToWatchlistBtn
        isFavorite={isFavorite}
        onClick={onToggleFavorite}
        openLoginModal={openLoginModal}
        className="favorite_btn"
      />
      <a href={detailUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "https://via.placeholder.com/200x300?text=No+Image"
          }
          alt="poster"
          className="media_poster"
        />
      </a>
      <div className="media_details">
        <h3 className="media_details_heading">
          {title}
          <span className={`media_tag ${isMovie ? "movie" : "tv"}`}>
            {isMovie ? "Movie" : "TV"}
          </span>
        </h3>
        <div className="align_center media_date_rate">
          <p>{date}</p>
          <p>
            {item.vote_average}
            <span className="media_card_star">★</span>
          </p>
        </div>
        <p className="media_description">
          {item.overview ? item.overview.slice(0, 100) + "..." : ""}
        </p>
      </div>
    </div>
  );
}
