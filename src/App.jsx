import React from 'react';
import './App.css'
import Controls from './components/Controls/Controls'
import Grid from './components/Grid/Grid'
import Modal from './components/Modal/Modal';
import Notification from './components/Notification';

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
