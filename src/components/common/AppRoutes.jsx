import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PathfinderPage from "../puzzles/pathfinder/PathfinderPage";
import DominoPage from "../puzzles/domino/DominoPage";
import TextrisPage from "../puzzles/textris/TextrisPage";
import AboutPage from "../pages/AboutPage";
import ImageProcessingPage from "../pages/ImageProcessingPage";
import ManualProcessingPage from "../pages/ManualProcessingPage";

const AppRoutes = () => {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pathfinder" element={<PathfinderPage />} />
        <Route path="/domino" element={<DominoPage />} />
        <Route path="/textris" element={<TextrisPage />} />
        <Route path="/image-processing" element={<ImageProcessingPage />} />
        <Route path="/manual-processing" element={<ManualProcessingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
