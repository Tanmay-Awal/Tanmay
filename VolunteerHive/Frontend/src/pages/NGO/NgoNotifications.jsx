import React, { useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNgoNotifications,
  markNgoNotifRead,
  markNgoAllNotifRead,
  deleteNgoNotificationThunk,
  ngoNotificationsSelectors
} from '../../store/NGO/Ngo_notificationsSlice';

import './NgoNotifications.css';

const NgoNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(ngoNotificationsSelectors.getList);
  const loading = useSelector(ngoNotificationsSelectors.getIsLoading);
  const error = useSelector(ngoNotificationsSelectors.getError);
  const success = null; 

  useEffect(() => {
    dispatch(fetchNgoNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNgoNotifRead(notificationId)).then(() => {
      dispatch(fetchNgoNotifications());
    });
  };

  const handleMarkAllAsRead = () => {
    dispatch(markNgoAllNotifRead()).then(() => {
      dispatch(fetchNgoNotifications());
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    console.log("🔍 NgoNotifications formatTime called with timestamp:", timestamp);
    
    try {
      // Ensure timestamp is treated as UTC if it has 'Z' suffix
      const date = new Date(timestamp);
      console.log("🔍 NgoNotifications Parsed date:", date);
      console.log("🔍 NgoNotifications Date.getTime():", date.getTime());
      console.log("🔍 NgoNotifications Is NaN:", isNaN(date.getTime()));
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.log("🔍 NgoNotifications Invalid date detected");
        return 'Invalid time';
      }
      
      // Format for user's local timezone (this will automatically convert UTC to local)
      const formatted = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      console.log("🔍 NgoNotifications Formatted result:", formatted);
      return formatted;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const handleDeleteNgoNotification = (id) => {
    dispatch(deleteNgoNotificationThunk(id));
  };

  return (
    <>
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="header-content">
            <div className="header-title">
              <Bell className="header-icon" />
              <h1>Notifications</h1>
            </div>
            <button 
              className="mark-all-btn"
              onClick={handleMarkAllAsRead}
              disabled={loading}
            >
              <CheckCheck className="btn-icon" />
              Mark All as Read
            </button>
          </div>
        </div>

        <div className="notifications-content">
          {success && (
            <div className="alert alert-success">
              <CheckCircle className="alert-icon" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          )}

          <div className="notifications-list">
            {notifications.length === 0 && !loading ? (
              <div className="empty-state">
                <Bell className="empty-icon" />
                <h3>No notifications yet</h3>
                <p>You'll see notifications from volunteers and system updates here.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="notification-indicator">
                    {!notification.read && <div className="unread-dot"></div>}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3 className="notification-title">{notification.title}</h3>
                      <div className="notification-meta">
                        <Clock className="meta-icon" />
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
                          disabled={loading}
                        >
                          <Check className="btn-icon" />
                          Mark as Read
                        </button>
                      )}

                      <button
                        className="ngo-notification-delete-btn"
                        onClick={() => handleDeleteNgoNotification(notification.id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>

                      <span className={`status-badge ${notification.read ? 'read' : 'unread'}`}>
                        {notification.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NgoNotifications;