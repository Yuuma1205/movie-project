import TVList from "../components/TVList/TVList";

export default function TVShowsPage() {
  return (
    <>
      <TVList type="popular" title="Popular TV Shows" />
      <TVList type="top_rated" title="Top Rated TV Shows" />
      <TVList type="on_the_air" title="On The Air" />
    </>
  );
}
