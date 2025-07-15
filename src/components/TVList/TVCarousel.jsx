import React, { useState, useEffect } from "react";
import TVCard from "./TVCard";
import "./TVCarousel.css";

const cardWidth = 200;
const gap = 20;

export default function TVCarousel({
  tvShows,
  favorites,
  onToggleFavorite,
  openLoginModal,
}) {
  const [current, setCurrent] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [visibleCards, setVisibleCards] = useState(7);
  const [alwaysShowArrow, setAlwaysShowArrow] = useState(false);

  useEffect(() => {
    function updateVisibleCards() {
      const width = window.innerWidth;
      if (width >= 1200) setVisibleCards(7);
      else if (width >= 900) setVisibleCards(4);
      else if (width >= 700) setVisibleCards(3);
      else if (width >= 600) setVisibleCards(2);
      else setVisibleCards(1);
      setAlwaysShowArrow(width <= 900);
    }
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  useEffect(() => {
    setCurrent(0);
  }, [tvShows]);

  const maxIndex = Math.max(0, tvShows.length - visibleCards);
  const cardsToShow = Math.min(visibleCards, tvShows.length);

  const handleMouseMove = (e) => {
    if (alwaysShowArrow) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const showL = x < 80 && current > 0;
    const showR = x > rect.width - 80 && current < maxIndex;
    setShowLeft(showL);
    setShowRight(showR);
  };

  const handleLeave = () => {
    if (alwaysShowArrow) return;
    setShowLeft(false);
    setShowRight(false);
  };

  const scrollBy = (dir) => {
    let next = current + dir * visibleCards;
    if (next < 0) next = 0;
    if (next > maxIndex) next = maxIndex;
    setCurrent(next);
  };

  return (
    <div
      className="tv_carousel_outer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{
        width: `${(cardWidth + gap) * cardsToShow - gap}px`,
        maxWidth: "100%",
        margin: "0 auto",
        minWidth: `${cardWidth}px`,
        position: "relative",
      }}
    >
      {(showLeft || alwaysShowArrow) && current > 0 && (
        <button className="tv_carousel_arrow left" onClick={() => scrollBy(-1)}>
          ◀
        </button>
      )}
      <div className="tv_carousel_window">
        <div
          className="tv_carousel_inner"
          style={{
            transform: `translateX(-${current * (cardWidth + gap)}px)`,
            transition: "transform 0.4s",
          }}
        >
          {tvShows.map((tv, i) => (
            <TVCard
              key={`${tv.id}-${i}`}
              tv={tv}
              isFavorite={favorites.some((f) => f.id === tv.id)}
              onToggleFavorite={() => onToggleFavorite(tv)}
              openLoginModal={openLoginModal}
            />
          ))}
        </div>
      </div>
      {(showRight || alwaysShowArrow) && current < maxIndex && (
        <button className="tv_carousel_arrow right" onClick={() => scrollBy(1)}>
          ▶
        </button>
      )}
    </div>
  );
}
