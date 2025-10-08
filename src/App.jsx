import React from "react";
import "./App.css";
import ModalManager from "./components/common/Modal/ModalManager";
import Notification from "./components/common/Notification";
import NavigationBar from "./components/common/NavigationBar";
import AppRoutes from "./components/common/AppRoutes";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <NavigationBar />
      <AppRoutes />
      <Notification />
      <ModalManager />
    </BrowserRouter>
  );
};

export default App;
