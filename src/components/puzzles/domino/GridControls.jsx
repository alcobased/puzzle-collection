import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGridDimensions } from '../../../features/domino/dominoSlice';
import './GridControls.css';

const GridControls = () => {
  const dispatch = useDispatch();
  const { width, height, cellSize } = useSelector((state) => state.puzzles.domino.grid);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const newDimensions = {
      width,
      height,
      cellSize,
      [name]: parseInt(value, 10),
    };
    dispatch(setGridDimensions(newDimensions));
  };

  return (
    <fieldset>
      <legend>Grid</legend>
      <div className="control-group">
        <label htmlFor="width">Width: {width}</label>
        <input
          type="range"
          id="width"
          name="width"
          min="5"
          max="50"
          value={width}
          onChange={handleDimensionChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="height">Height: {height}</label>
        <input
          type="range"
          id="height"
          name="height"
          min="5"
          max="50"
          value={height}
          onChange={handleDimensionChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="cellSize">Cell Size: {cellSize}</label>
        <input
          type="range"
          id="cellSize"
          name="cellSize"
          min="10"
          max="100"
          value={cellSize}
          onChange={handleDimensionChange}
        />
      </div>
    </fieldset>
  );
};

export default GridControls;
