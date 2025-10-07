import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import PathfinderPage from "../../pages/PathfinderPage";
import AboutPage from "../../pages/AboutPage";

const AppRoutes = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pathfinder" element={<PathfinderPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
