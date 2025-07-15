import React, { useEffect, useState, useMemo } from "react";
import _ from "lodash";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import "./MovieList.css";
import FilterGroup from "./FilterGroup";
import MovieCarousel from "./MovieCarousel";
import LoginModal from "../LoginModal/LoginModal";
import NotificationToast from "../NotificationToast/NotificationToast";

export default function MovieList({ type, title }) {
  const [movies, setMovies] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState({
    by: "default",
    order: "asc",
  });

  const { user } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });

  function openLoginModal() {
    setShowLogin(true);
  }

  // 一次拉出 user 收藏清單
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    async function fetchFavorites() {
      const favCol = collection(db, "users", user.uid, "favorites");
      const snapshot = await getDocs(favCol);
      const favArr = snapshot.docs.map((doc) => doc.data());
      setFavorites(favArr);
    }
    fetchFavorites();
  }, [user]);

  // 收藏/移除
  async function handleToggleFavorite(movie) {
    if (!user) {
      openLoginModal();
      return;
    }
    const favDocRef = doc(db, "users", user.uid, "favorites", String(movie.id));
    const isFavorite = favorites.some((f) => f.id === movie.id);
    if (isFavorite) {
      await deleteDoc(favDocRef);
      setFavorites(favorites.filter((f) => f.id !== movie.id));
      showToast("Removed from My Watchlist!");
    } else {
      await setDoc(favDocRef, {
        ...movie,
        savedAt: new Date(),
        media_type: movie.media_type || "movie",
      });
      setFavorites([...favorites, movie]);
      showToast("Added to My Watchlist!");
    }
  }

  function showToast(message) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 1000);
  }

  // 取得電影資料
  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line
  }, []);

  const fetchMovies = async () => {
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const urls = [
        `https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}&page=1`,
        `https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}&page=2`,
      ];
      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const data = await Promise.all(responses.map((res) => res.json()));

      const combined = [...data[0].results, ...data[1].results].slice(0, 24);
      const ids = new Set();
      const filtered = combined
        .filter((movie) => {
          if (ids.has(movie.id)) return false;
          ids.add(movie.id);
          return true;
        })
        .map((movie) => ({
          ...movie,
          media_type: "movie",
        }));
      setMovies(filtered);
    } catch (error) {
      console.error("fetchMovies error", error);
    }
  };

  const displayedMovies = useMemo(() => {
    const filtered =
      minRating > 0
        ? movies.filter((movie) => movie.vote_average >= minRating)
        : movies;
    if (sort.by !== "default") {
      return _.orderBy(filtered, [sort.by], [sort.order]);
    }
    return filtered;
  }, [movies, minRating, sort]);

  const handleFilter = (rate) => {
    setMinRating((prev) => (prev === rate ? 0 : rate));
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <section className="movie_list" id={type}>
        <header className="align_center movie_list_header">
          <h2 className="align_center movie_list_heading">{title}</h2>
          <div className="align_center movie_list_fs">
            <FilterGroup
              minRating={minRating}
              onRatingClick={handleFilter}
              ratings={[8, 7, 6]}
            />
            <select
              name="by"
              onChange={handleSort}
              value={sort.by}
              className="movie_sorting"
            >
              <option value="default">SortBy</option>
              <option value="release_date">Date</option>
              <option value="vote_average">Rating</option>
            </select>
            <select
              name="order"
              onChange={handleSort}
              value={sort.order}
              className="movie_sorting"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </header>

        <MovieCarousel
          movies={displayedMovies}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          openLoginModal={openLoginModal}
        />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </section>
      <NotificationToast message={toast.message} show={toast.show} />
    </>
  );
}
