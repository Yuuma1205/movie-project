import React from "react";
import MediaList from "../components/MediaList/MediaList";
import Banner from "../components/Banner/Banner";
import MovieList from "../components/MovieList/MovieList";
import TVList from "../components/TVList/TVList";

function HomePage() {
  return (
    <>
      <Banner />
      <MediaList title="Trending Now" />
      <MovieList type="popular" title="Popular" />
      <TVList type="popular" title="Popular TV Shows" />
    </>
  );
}

export default HomePage;
