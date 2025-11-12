import { useDispatch } from 'react-redux';
import { showModal } from '../../../features/ui/uiSlice';

const ShapeControls = () => {
  const dispatch = useDispatch();

  const openShapesManager = () => {
    dispatch(showModal({ type: 'TEXTRIS_SHAPES', props: {} }));
  }
  return (
    <div className="control-section">
      <h4>Create shape</h4>
      <button onClick={openShapesManager}>Manage Shapes</button>
    </div>
  );
};

export default ShapeControls;
