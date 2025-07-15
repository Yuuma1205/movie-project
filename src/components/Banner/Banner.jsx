import React, { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import "./Banner.css";
import LoginModal from "../LoginModal/LoginModal";
import NotificationToast from "../NotificationToast/NotificationToast";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

export default function Banner() {
  const [movie, setMovie] = useState(null);
  const { user } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });

  // 開啟/關閉登入 modal
  function openLoginModal() {
    setShowLogin(true);
  }
  function closeLoginModal() {
    setShowLogin(false);
  }

  // 取得 Banner 顯示電影
  useEffect(() => {
    async function fetchBannerMovie() {
      const res = await fetch(API_URL);
      const data = await res.json();
      // 隨機選一部有 backdrop 的熱門片
      const movies = data.results.filter((m) => m.backdrop_path);
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setMovie(randomMovie);
    }
    fetchBannerMovie();
  }, []);

  // 取得收藏清單
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

  // 判斷目前 Banner 顯示電影有沒有被收藏
  const isFavorite = user && favorites.some((f) => f.id === movie?.id);

  // 切換收藏（收藏/取消收藏）
  async function handleToggleFavorite() {
    if (!user) {
      openLoginModal();
      return;
    }
    if (!movie) return;

    const favDocRef = doc(db, "users", user.uid, "favorites", String(movie.id));
    if (isFavorite) {
      await deleteDoc(favDocRef);
      setFavorites(favorites.filter((f) => f.id !== movie.id));
      showToast("Removed from My Watchlist!");
    } else {
      await setDoc(favDocRef, {
        ...movie,
        savedAt: new Date(),
        media_type: "movie",
      });
      setFavorites([...favorites, { ...movie, media_type: "movie" }]);
      showToast("Added to My Watchlist!");
    }
  }

  function showToast(message) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 1600);
  }

  if (!movie) return null;

  const bannerUrl = "https://image.tmdb.org/t/p/original" + movie.backdrop_path;
  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`;

  return (
    <>
      <header
        className="banner"
        style={{
          backgroundImage: `url(${bannerUrl})`,
        }}
      >
        <div className="banner_content">
          <h1 className="banner_title">{movie.title || movie.name}</h1>
          <p className="banner_overview">
            {movie.overview && movie.overview.length > 120
              ? movie.overview.slice(0, 120) + "..."
              : movie.overview}
          </p>
          <div className="banner_buttons">
            <button className="banner_button" onClick={handleToggleFavorite}>
              {isFavorite ? "Saved!" : "Add to Watchlist"}
            </button>
            <a
              href={tmdbUrl}
              className="banner_button"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Info
            </a>
          </div>
        </div>
        <div className="banner_fade"></div>
        {showLogin && <LoginModal onClose={closeLoginModal} />}
      </header>
      <NotificationToast message={toast.message} show={toast.show} />
    </>
  );
}
