import React from "react";
import "./App.css";
import Modal from "./components/common/ui/Modal";
import Notification from "./components/common/ui/Notification";
import NavigationBar from "./components/common/ui/NavigationBar";
import AppRoutes from "./components/common/ui/AppRoutes";
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
