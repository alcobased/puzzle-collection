import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PathfinderPage from "../puzzles/pathfinder/PathfinderPage";
import DominoPage from "../puzzles/domino/DominoPage";
import AboutPage from "../pages/AboutPage";

const AppRoutes = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pathfinder" element={<PathfinderPage />} />
        <Route path="/domino" element={<DominoPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
