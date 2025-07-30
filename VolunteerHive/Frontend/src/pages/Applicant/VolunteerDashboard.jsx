import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  Settings,
  LogOut,
  Home,
  CheckSquare,
  Search,
  FileText,
  Clock,
  Award,
  Star,
  BarChart3,
  Users
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, profileSelectors } from '../../store/Applicant/profileSlice';
import { activitySelectors } from '../../store/Applicant/activitySlice';
import { getMyActivity } from '../../store/Applicant/activitySlice';
import {
  fetchNotifications,
  notificationsSelectors
} from '../../store/Applicant/notificationsSlice';
import './VolunteerDashboard.css';
import { authActions } from '../../store/authSlice';

const VolunteerDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector(profileSelectors.getProfileForm);
  const notifications = useSelector(notificationsSelectors.getNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const stats = useSelector(activitySelectors.getStats);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(
    window.innerWidth > 768
  );
  


  const email = localStorage.getItem('user_email');

  const maxImpactScore = 100;
  const starRating = Math.max(0, Math.min(5, Math.round((stats.impactScore / maxImpactScore) * 5)));

  useEffect(() => {
    if (email) {
      dispatch(fetchProfile(email));
    }
    dispatch(fetchNotifications(localStorage.getItem("user_id")));
    dispatch(getMyActivity());
  }, [dispatch, email]);


  React.useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
  
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };
  
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };
  
    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (swipeDistance > 50) {
        setIsSidebarOpen(true);
      } else if (swipeDistance < -50) {
        setIsSidebarOpen(false);
      }
    };
  
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
  
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
  

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/volunteer-dashboard' },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, path: '/tasks' },
    { id: 'opportunities', label: 'Available Opportunities', icon: Search, path: '/opportunities' },
    { id: 'applications', label: 'My Applications', icon: FileText, path: '/applications' },
    { id: 'profile', label: 'Profile', icon: User, path: '/volunteer-profile' },
    { id: 'reports', label: 'Reports & Activity', icon: BarChart3, path: '/activity' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <>
      <div className="volunteer-dashboard">
        <header className="dashboard-header">
        <div className="header-left">
          <button
            className="hamburger-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
          ☰
          </button>
          <div className="logo">
            <h1>VolunteerHive</h1>
          </div>
        </div>

          <div className="header-right">
            <div className="notification-icon">
              <Bell onClick={() => navigate('/notifications')} size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}

            </div>
            <div className="user-menu">
              <span className="user-name">{profile?.name || 'Volunteer'}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-body">
          <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <nav className="sidebar-nav">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    className="nav-item"
                    onClick={() => navigate(item.path)}
                  >
                    <IconComponent size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="dashboard-main">
            <div className="dashboard-overview">
              <div className="welcome-section">
                <h2 className='welll'>Welcome back, {profile?.name || 'Volunteer'}!</h2>
                <p>Ready to make a difference today?</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Users />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.ngosHelped || 0}</h3>
                    <p>NGOs Helped</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CheckSquare />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.tasksCompleted || 0}</h3>
                    <p>Tasks Completed</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Star />
                  </div>
                  <div className="stat-content">
                    <h3>{starRating || 0}/5</h3>
                    <p>Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default VolunteerDashboard;
