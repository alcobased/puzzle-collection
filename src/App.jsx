import React from 'react';
import './App.css'
import Controls from './components/layout/Controls'
import Grid from './components/pathfinder/Grid'
import Modal from './components/ui/Modal';
import Notification from './components/ui/Notification';

function App() {

  return (
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
  )
}

export default App
