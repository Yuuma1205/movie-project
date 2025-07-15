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
import TVCarousel from "./TVCarousel";
import LoginModal from "../LoginModal/LoginModal";
import FilterGroup from "../MovieList/FilterGroup";
import NotificationToast from "../NotificationToast/NotificationToast";
import "./TVList.css";

export default function TVList({ type, title }) {
  const [tvShows, setTVShows] = useState([]);
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
  async function handleToggleFavorite(tv) {
    if (!user) {
      openLoginModal();
      return;
    }
    const favDocRef = doc(db, "users", user.uid, "favorites", String(tv.id));
    const isFavorite = favorites.some((f) => f.id === tv.id);
    if (isFavorite) {
      await deleteDoc(favDocRef);
      setFavorites(favorites.filter((f) => f.id !== tv.id));
      showToast("Removed from My Watchlist!");
    } else {
      await setDoc(favDocRef, {
        ...tv,
        savedAt: new Date(),
        media_type: tv.media_type || "tv",
      });
      setFavorites([...favorites, tv]);
      showToast("Added to My Watchlist!");
    }
  }

  function showToast(message) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 1000);
  }

  useEffect(() => {
    fetchTVShows();
    // eslint-disable-next-line
  }, []);

  const fetchTVShows = async () => {
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const urls = [
        `https://api.themoviedb.org/3/tv/${type}?api_key=${apiKey}&page=1`,
        `https://api.themoviedb.org/3/tv/${type}?api_key=${apiKey}&page=2`,
      ];
      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const data = await Promise.all(responses.map((res) => res.json()));

      const combined = [...data[0].results, ...data[1].results].slice(0, 24);
      const ids = new Set();
      const filtered = combined
        .filter((tv) => {
          if (ids.has(tv.id)) return false;
          ids.add(tv.id);
          return true;
        })
        .map((tv) => ({
          ...tv,
          media_type: "tv",
        }));
      setTVShows(filtered);
    } catch (error) {
      console.error("fetchTVShows error", error);
    }
  };

  const displayedTVs = useMemo(() => {
    const filtered =
      minRating > 0
        ? tvShows.filter((tv) => tv.vote_average >= minRating)
        : tvShows;
    if (sort.by !== "default") {
      return _.orderBy(filtered, [sort.by], [sort.order]);
    }
    return filtered;
  }, [tvShows, minRating, sort]);

  const handleFilter = (rate) => {
    setMinRating((prev) => (prev === rate ? 0 : rate));
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <section className="tv_list" id={type}>
        <header className="align_center tv_list_header">
          <h2 className="align_center tv_list_heading">{title} </h2>
          <div className="align_center tv_list_fs">
            <FilterGroup
              minRating={minRating}
              onRatingClick={handleFilter}
              ratings={[8, 7, 6]}
            />
            <select
              name="by"
              onChange={handleSort}
              value={sort.by}
              className="tv_sorting"
            >
              <option value="default">SortBy</option>
              <option value="first_air_date">Date</option>
              <option value="vote_average">Rating</option>
            </select>
            <select
              name="order"
              onChange={handleSort}
              value={sort.order}
              className="tv_sorting"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </header>
        <TVCarousel
          tvShows={displayedTVs}
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
