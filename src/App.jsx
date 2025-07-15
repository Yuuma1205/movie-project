import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";

import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/Home";
import MoviesPage from "./pages/Movies";
import TVShowsPage from "./pages/TVShows";
import MyFavorites from "./pages/MyFavorites";
import SearchPage from "./pages/Search";

const routeList = [
  { path: "/", element: <HomePage /> },
  { path: "/movies", element: <MoviesPage /> },
  { path: "/tv", element: <TVShowsPage /> },
  { path: "/favorites", element: <MyFavorites /> },
  { path: "/search", element: <SearchPage /> },
];

const App = () => {
  return (
    <UserProvider>
      <div className="app">
        <Navbar />
        <Routes>
          {routeList.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </UserProvider>
  );
};

export default App;
