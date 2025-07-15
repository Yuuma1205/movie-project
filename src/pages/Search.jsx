import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import MediaCard from "../components/MediaList/MediaCard";
import MediaCarousel from "../components/MediaList/MediaCarousel";
import NotificationToast from "../components/NotificationToast/NotificationToast";
import LoginModal from "../components/LoginModal/LoginModal";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery().get("q") || "";
  const { user } = useUser();

  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // 搜尋 API
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&language=zh-TW`
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(
          (data.results || []).filter(
            (item) => item.media_type === "movie" || item.media_type === "tv"
          )
        );
        setLoading(false);
      });
  }, [query]);

  // Trending
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=zh-TW`
    )
      .then((res) => res.json())
      .then((data) => setTrending(data.results || []));
  }, []);

  // 收藏清單
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
  async function handleToggleFavorite(item) {
    if (!user) {
      setShowLogin(true);
      return;
    }
    const favDocRef = doc(db, "users", user.uid, "favorites", String(item.id));
    const isFavorite = favorites.some((f) => f.id === item.id);
    if (isFavorite) {
      await deleteDoc(favDocRef);
      setFavorites(favorites.filter((f) => f.id !== item.id));
      showToast("Removed from My Watchlist!");
    } else {
      await setDoc(favDocRef, {
        ...item,
        savedAt: new Date(),
        media_type: item.media_type || "movie",
      });
      setFavorites([...favorites, item]);
      showToast("Added to My Watchlist!");
    }
  }

  function showToast(message) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 1000);
  }

  return (
    <div style={{ padding: "40px 0", minHeight: "60vh" }}>
      <h2 style={{ color: "#ffe400", fontSize: 28, marginLeft: 40 }}>
        Search Results: {query}
      </h2>
      {loading && (
        <div style={{ color: "#fff", marginLeft: 40 }}>Searching...</div>
      )}
      {!loading && results.length === 0 && (
        <div style={{ color: "#fff", marginLeft: 40 }}>No results found!</div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          marginTop: 20,
          marginLeft: 40,
        }}
      >
        {results.map((item) => (
          <MediaCard
            key={item.id + "-" + item.media_type}
            item={item}
            isFavorite={favorites.some((f) => f.id === item.id)}
            onToggleFavorite={() => handleToggleFavorite(item)}
            openLoginModal={() => setShowLogin(true)}
          />
        ))}
      </div>

      <NotificationToast message={toast.message} show={toast.show} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* 推薦 Trending 區塊 */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ color: "#ffe400", fontSize: 24, marginLeft: 40 }}>
          Recommended
        </h2>
        <MediaCarousel
          items={trending}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          openLoginModal={() => setShowLogin(true)}
        />
      </div>
    </div>
  );
}
