import React from "react";
import "./App.css";
import Controls from "./components/layout/Controls";
import Grid from "./components/pathfinder/Grid";
import Modal from "./components/ui/Modal";
import Notification from "./components/ui/Notification";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Notification />
        <div className="grid-container">
          <Grid />
        </div>
        <div className="controls-container">
          <Controls />
        </div>
        <Modal />
      </div>
    </BrowserRouter>
  );
}

export default App;
