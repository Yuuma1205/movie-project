import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../context/UserContext";
import MediaCard from "../components/MediaList/MediaCard";
import NotificationToast from "../components/NotificationToast/NotificationToast";

export default function MyFavorites() {
  const { user } = useUser();
  const [movies, setMovies] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMovies([]);
      setLoading(false);
      return;
    }
    // 取得所有收藏
    async function fetchFavorites() {
      setLoading(true);
      const colRef = collection(db, "users", user.uid, "favorites");
      const snapshot = await getDocs(colRef);
      const moviesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovies(moviesArr);
      setLoading(false);
    }
    fetchFavorites();
  }, [user]);

  async function handleRemove(id) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "favorites", id));
    setMovies((movies) => movies.filter((m) => String(m.id) !== String(id)));
    showToast("Removed from My Watchlist!");
  }

  function showToast(message) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 1000);
  }

  if (!user)
    return (
      <div style={{ color: "#fff", padding: 32 }}>
        Please log in to view your watchlist.
      </div>
    );

  return (
    <div style={{ padding: "32px 4vw", minHeight: "60vh" }}>
      <h2
        style={{
          color: "#ffe400",
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 20,
        }}
      >
        My Watchlist
      </h2>
      {loading ? (
        <div style={{ color: "#eee", fontSize: 18 }}>Loading...</div>
      ) : movies.length === 0 ? (
        <div style={{ color: "#eee", fontSize: 18 }}>No favorites yet!</div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            alignItems: "flex-start",
          }}
        >
          {movies.map((item) => (
            <MediaCard
              key={item.id + "-" + (item.media_type || "movie")}
              item={item}
              isFavorite={true}
              onToggleFavorite={() => handleRemove(item.id)}
              openLoginModal={() => {}}
            />
          ))}
        </div>
      )}
      <NotificationToast message={toast.message} show={toast.show} />
    </div>
  );
}
