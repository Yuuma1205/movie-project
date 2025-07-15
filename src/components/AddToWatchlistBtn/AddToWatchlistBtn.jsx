import { useUser } from "../../context/UserContext";

import "./AddToWatchlistBtn.css";

export default function AddToWatchlistBtn({
  isFavorite = false, // 收藏狀態
  onClick,
  openLoginModal,
  className,
}) {
  const { user } = useUser();

  if (!user) {
    // 未登入顯示登入提示
    return (
      <button
        className={`favorite_btn ${className || ""}`}
        onClick={openLoginModal}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(180,180,180,0.42)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    );
  }

  // 已登入可收藏
  return (
    <button
      className={`favorite_btn ${isFavorite ? "active" : ""} ${
        className || ""
      }`}
      onClick={onClick}
      aria-label={
        isFavorite ? "Remove from My Watchlist" : "Add to My Watchlist"
      }
      title={isFavorite ? "Remove from My Watchlist" : "Add to My Watchlist"}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill={isFavorite ? "#ff3d47" : "none"}
        stroke={isFavorite ? "#ff3d47" : "rgba(180,180,180,0.42)"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}
