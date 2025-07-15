import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import "./Navbar.css";
import LoginModal from "../LoginModal/LoginModal";
import DarkMode from "../DarkMode/DarkMode";
import { useUser } from "../../context/UserContext";
import { auth } from "../../firebase";

export default function Navbar() {
  const { user } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function onLoginClick() {
    setShowLogin(true);
  }

  function closeLoginModal() {
    setShowLogin(false);
  }

  function handleLogout() {
    signOut(auth);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setQuery("");
    }
  };

  return (
    <nav className="navbar">
      {/* 標題，點擊回首頁 */}
      <Link to="/" className="navbar_brand">
        Cinema Addict
      </Link>
      <div className="navbar_links">
        {/* 分頁索引 */}
        <NavLink to="/" className="navbar_link">
          Home
        </NavLink>
        <NavLink to="/movies" className="navbar_link">
          Movies
        </NavLink>
        <NavLink to="/tv" className="navbar_link">
          TV Shows
        </NavLink>
        <NavLink to="/favorites" className="navbar_link">
          My Watchlist
        </NavLink>

        {/* 搜尋欄 */}
        <form
          className="navbar_search"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <input
            type="text"
            className="navbar_search_input"
            id="navbar-search"
            name="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <button
            type="submit"
            className="navbar_search_btn"
            aria-label="Search"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffe400"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {/* DarkMode 切換 */}
        <DarkMode />

        {/* 登入/登出 */}
        {user ? (
          <button className="navbar_btn" onClick={handleLogout}>
            Sign out
          </button>
        ) : (
          <button className="navbar_btn" onClick={onLoginClick}>
            Sign in
          </button>
        )}
        {showLogin && <LoginModal onClose={closeLoginModal} />}
      </div>
    </nav>
  );
}
