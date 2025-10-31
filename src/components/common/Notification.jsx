import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../../features/ui/uiSlice';
import { useEffect } from 'react';
import './Notification.css';


const Notification = () => {
  const { message, type } = useSelector(state => state.ui.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) {
    return null;
  }

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

export default Notification;
