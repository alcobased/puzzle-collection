import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGridDimensions } from '../../../features/domino/dominoSlice';

const GridControls = () => {
  const dispatch = useDispatch();
  const { width, height } = useSelector((state) => state.puzzles.domino.grid);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const newDimensions = {
      width,
      height,
      [name]: parseInt(value, 10),
    };
    dispatch(setGridDimensions(newDimensions));
  };

  return (
    <div className="control-section">
      <h4>Grid</h4>
      <label htmlFor="width">Width</label>
      <input
        type="number"
        id="width"
        name="width"
        value={width || ''}
        onChange={handleDimensionChange}
        min="1"
      />
      <label htmlFor="height">Height</label>
      <input
        type="number"
        id="height"
        name="height"
        value={height || ''}
        onChange={handleDimensionChange}
        min="1"
      />
    </div>
  );
};

export default GridControls;
