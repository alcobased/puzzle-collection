import React from "react";
import "./App.css";
import Modal from "./components/ui/Modal";
import Notification from "./components/ui/Notification";
import HomePage from "./pages/HomePage";
import PathfinderPage from "./pages/PathfinderPage";
import AboutPage from "./pages/AboutPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


const App = () => {
  return (
    <BrowserRouter>
      <div className="navigation">
        <Link to="/">Home</Link>
        <Link to="/pathfinder">Pathfinder</Link>
        <Link to="about">About</Link>
      </div>
      <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pathfinder" element={<PathfinderPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
        <Notification />

        <Modal />
      </div>
    </BrowserRouter>
  );
}

export default App;
