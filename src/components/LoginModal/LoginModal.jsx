import React, { useState } from "react";
import { auth } from "../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "./LoginModal.css";

export default function LoginModal({ onClose }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function clearState() {
    setEmail("");
    setPassword("");
    setErr("");
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="login_modal_bg">
      <div className="login_modal">
        <button className="login_close" onClick={onClose}>
          ×
        </button>
        <div className="login_tabs">
          <button
            className={tab === "login" ? "login_tab active" : "login_tab"}
            onClick={() => {
              setTab("login");
              clearState();
            }}
          >
            Sign in
          </button>
          <button
            className={tab === "register" ? "login_tab active" : "login_tab"}
            onClick={() => {
              setTab("register");
              clearState();
            }}
          >
            Register
          </button>
        </div>
        <form
          onSubmit={tab === "login" ? handleLogin : handleRegister}
          className="login_form"
        >
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
          <button className="login_btn" type="submit">
            {tab === "login" ? "Sign in" : "Register"}
          </button>
          <button
            className="login_btn login_google"
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </button>
        </form>
        {err && <div className="login_err">{err}</div>}
      </div>
    </div>
  );
}
