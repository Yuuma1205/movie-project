import MovieList from "../components/MovieList/MovieList";

export default function MoviesPage() {
  return (
    <>
      <MovieList type="popular" title="Popular Movies" />
      <MovieList type="top_rated" title="Top Rated Movies" />
      <MovieList type="upcoming" title="Upcoming Movies" />
    </>
  );
}
