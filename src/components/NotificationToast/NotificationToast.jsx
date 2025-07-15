import React from "react";

export default function NotificationToast({ message, show }) {
  return (
    <div
      className={`toast_notification${show ? " show" : ""}`}
      style={{
        position: "fixed",
        top: "32px",
        left: "50%",
        background: "rgba(32,32,32,0.98)",
        color: "#ffe400",
        padding: "15px 32px",
        borderRadius: 14,
        fontWeight: 600,
        fontSize: 18,
        zIndex: 9999,
        boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
        opacity: show ? 1 : 0,
        pointerEvents: "none",
        transition:
          "opacity 0.5s cubic-bezier(.6,0,.4,1), transform 0.5s cubic-bezier(.6,0,.4,1)",
        transform: show
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(-24px)",
      }}
    >
      {message}
    </div>
  );
}
