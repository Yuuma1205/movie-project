import React, { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase 監聽登入狀態
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
