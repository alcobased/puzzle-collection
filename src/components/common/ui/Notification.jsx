import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../../../features/ui/uiSlice';
import { useEffect } from 'react';

const Notification = () => {
  const notification = useSelector(state => state.ui.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) {
    return null;
  }

  return (
    <div className="notification">
      {notification}
    </div>
  );
};

export default Notification;
