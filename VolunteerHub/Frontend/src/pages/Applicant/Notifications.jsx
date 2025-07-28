import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Info,
  Star
} from 'lucide-react';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteVolunteerNotification,
  notificationsSelectors
} from '../../store/Applicant/notificationsSlice';
import './Notifications.css';

const Notifications = () => {
  const dispatch = useDispatch();

  const userId = localStorage.getItem("user_id");


  const notifications = useSelector(notificationsSelectors.getNotifications);
  const loading = useSelector(notificationsSelectors.getLoading);

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications(userId));
    }
  }, [dispatch, userId]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    if (userId) {
      dispatch(markAllAsRead(userId));
    }
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteVolunteerNotification(id));
};



  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <Check className="notification-icon success" />;
      case 'warning': return <AlertCircle className="notification-icon warning" />;
      case 'info': return <Info className="notification-icon info" />;
      case 'achievement': return <Star className="notification-icon achievement" />;
      default: return <Bell className="notification-icon default" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="notifications-header">
            <div className="header-content">
              <div className="header-left">
                <Bell className="page-icon" />
                <div>
                  <h1 className="page-title">Notifications</h1>
                  <p className="page-subtitle">Stay updated with your volunteer activities</p>
                </div>
              </div>
              <button 
                className="mark-all-btn"
                onClick={handleMarkAllAsRead}
                disabled={loading}
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            </div>
          </div>

          <div className="notifications-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <Bell className="empty-icon" />
                <h3>No notifications yet</h3>
                <p>You're all caught up! New notifications will appear here.</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-icon-wrapper">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="notification-content">
                      <div className="notification-header">
                        <h4 className="notification-title">{notification.title}</h4>
                        <div className="notification-meta">
                          <Clock size={14} />
                          <span className="notification-time">
                            {formatTime(notification.time)}
                          </span>
                        </div>
                      </div>

                      <p className="notification-message">{notification.message}</p>

                      <div className="notification-actions">
  {!notification.read && (
    <button
      className="mark-read-btn"
      onClick={() => handleMarkAsRead(notification.id)}
    >
      <Check size={16} />
      Mark as Read
    </button>
  )}

  <button
    className="notification-delete-btn"
    onClick={() => handleDeleteNotification(notification.id)}
  >
    🗑️ Delete
  </button>
</div>

                    </div>

                    {!notification.read && <div className="unread-indicator"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
