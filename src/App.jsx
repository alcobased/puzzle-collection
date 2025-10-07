import React from "react";
import "./App.css";
import Modal from "./components/ui/Modal";
import Notification from "./components/ui/Notification";
import NavigationBar from "./components/ui/NavigationBar";
import AppRoutes from "./components/ui/AppRoutes";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <NavigationBar />
      <AppRoutes />
      <Notification />
      <Modal />
    </BrowserRouter>
  );
};

export default App;
