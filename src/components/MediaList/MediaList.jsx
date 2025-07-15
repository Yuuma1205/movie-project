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
import "./MediaList.css";
import FilterGroup from "../MovieList/FilterGroup";
import MediaCarousel from "./MediaCarousel";
import LoginModal from "../LoginModal/LoginModal";
import NotificationToast from "../NotificationToast/NotificationToast";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export default function MediaList({ title }) {
  const [items, setItems] = useState([]);
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
  async function handleToggleFavorite(item) {
    if (!user) {
      openLoginModal();
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

  // 取得 Trending All
  useEffect(() => {
    async function fetchTrending() {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`
      );
      const data = await res.json();
      setItems(data.results || []);
    }
    fetchTrending();
  }, []);

  // 分數、排序邏輯
  const displayedItems = useMemo(() => {
    let filtered =
      minRating > 0
        ? items.filter((item) => item.vote_average >= minRating)
        : items;

    // 根據 media_type 動態支援 release_date/first_air_date 排序
    if (sort.by === "release_date" || sort.by === "first_air_date") {
      // 兩種都考慮
      return _.orderBy(
        filtered,
        [
          (item) =>
            item[sort.by] || item.release_date || item.first_air_date || "", // 有的item只有其中一個日期
        ],
        [sort.order]
      );
    }

    if (sort.by !== "default") {
      return _.orderBy(filtered, [sort.by], [sort.order]);
    }
    return filtered;
  }, [items, minRating, sort]);

  const handleFilter = (rate) => {
    setMinRating((prev) => (prev === rate ? 0 : rate));
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <section className="media_list">
        <header className="align_center media_list_header">
          <h2 className="align_center media_list_heading">{title}</h2>
          <div className="align_center media_list_fs">
            <FilterGroup
              minRating={minRating}
              onRatingClick={handleFilter}
              ratings={[8, 7, 6]}
            />
            <select
              name="by"
              onChange={handleSort}
              value={sort.by}
              className="media_sorting"
            >
              <option value="default">SortBy</option>
              <option value="release_date">Movie Date</option>
              <option value="first_air_date">TV Date</option>
              <option value="vote_average">Rating</option>
            </select>
            <select
              name="order"
              onChange={handleSort}
              value={sort.order}
              className="media_sorting"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </header>
        <MediaCarousel
          items={displayedItems}
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
