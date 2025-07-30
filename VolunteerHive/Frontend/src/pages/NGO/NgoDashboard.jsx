import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  FileText, 
  Bell, 
  User, 
  Settings, 
  BarChart3, 
  LogOut,
  Menu,
  ChevronDown,
  Heart,
  Users,
  Clock,
  Trophy,
  MapPin,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  BarChart3Icon,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { ngoSettingsSelectors } from '../../store/NGO/Ngo_settingsSlice';
import { fetchSettingsProfile } from '../../store/NGO/Ngo_settingsSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNgoNotifications,
  ngoNotificationsSelectors
} from '../../store/NGO/Ngo_notificationsSlice';
import { fetchNGOReports, ngoReportsSelectors } from '../../store/NGO/Ngo_reportsSlice';
import { fetchOpportunities } from '../../store/NGO/Ngo_opportunitiesSlice';
import { ngoOpportunitySelectors } from '../../store/NGO/Ngo_opportunitiesSlice';
import './NgoDashboard.css';
import { authActions } from '../../store/authSlice';

const NgoDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettingsProfile());
    dispatch(fetchNGOReports()); 
    dispatch(fetchOpportunities()); 
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchNgoNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/login');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid time';
      }
      
      // Format for user's local timezone
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const profileData = useSelector(ngoSettingsSelectors.getProfile);
  const ngoNotifications = useSelector(ngoNotificationsSelectors.getList);
  const unreadNgo = ngoNotifications.filter(n => !n.read);
  const unreadCount = unreadNgo.length;
  const topThreeUnread = unreadNgo.slice(0, 3);

  const stats = useSelector(ngoReportsSelectors.getStats);

  const dashboardStats = [
    { title: 'Active Volunteers', value: stats?.totalVolunteers ?? 0, icon: Users, color: 'blue' },
    { title: 'Opportunities Posted', value: stats?.totalOpportunities ?? 0, icon: Calendar, color: 'green' },
    { title: 'Tasks Completed', value: stats?.totalTasksCompleted ?? 0, icon: CheckCircle, color: 'purple' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/ngo-dashboard' },
    { id: 'opportunities', label: 'Opportunities', icon: Calendar, path: '/ngo-opportunities' },
    { id: 'applications', label: 'Applications', icon: FileText, path: '/ngo-applications' },
    { id: 'track', label: 'Track Volunteer', icon: Clock, path: '/ngo-track' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/ngo-notifications' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/ngo-reports' },
    { id: 'profile', label: 'Profile', icon: User, path: '/ngo-profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/ngo-settings' }
  ];

  const opportunities = useSelector(ngoOpportunitySelectors.getList);

  const getUpcomingOpportunities = () => {
    const now = new Date();
    return opportunities
      .filter(opp => {
        const oppDate = new Date(opp.startDate);
        return oppDate >= now;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3);
  };
  const topUpcoming = getUpcomingOpportunities();


  return (
    <>
      <div className={`ngo-dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <nav className="ngo-top-navbar">
          <div className="ngo-navbar-left">
            <button 
              className="ngo-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <div className="ngo-brand">
              <Heart className="ngo-brand-icon" size={24} />
              <span className="ngo-brand-text">VolunteerHive</span>
            </div>
          </div>

          <div className="ngo-navbar-right">
            <div className="ngo-notification-container">
              <button 
                className="ngo-notification-btn"
                onClick={() => setNotificationDropdown(!notificationDropdown)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="ngo-notification-badge">{unreadCount}</span>
                )}
              </button>
              {notificationDropdown && (
                <div className="ngo-notification-dropdown">
                  <div className="ngo-dropdown-header">
                    <h4>Notifications</h4>
                  </div>
                  <div className="ngo-notification-list">
                    {topThreeUnread.length > 0 ? (
                      topThreeUnread.map(notification => (
                        <div key={notification.id} className="ngo-notification-item">
                          <div className="ngo-notification-content">
                            <h5>{notification.title}</h5>
                            <p>{notification.message}</p>
                            <span className="ngo-notification-time">{formatTime(notification.time)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="ngo-no-notifications">
                        <p>No unread notifications</p>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>

            <div className="ngo-profile-containerr">
              <button 
                className="ngo-profile-btn"
                onClick={() => setProfileDropdown(!profileDropdown)}
              >
                <div className="ngo-profile-avatar">
                  <User size={18} />
                </div>
                <div className="ngo-profile-infoo">
                  <span className="ngo-profile-namee">{profileData.contactPersonName || 'Volunteer'}</span>
                  <span className="ngo-profile-rolee">Admin</span>
                </div>
                <ChevronDown size={16} />
              </button>
              {profileDropdown && (
                <div className="ngo-profile-dropdown">
                  <div className="ngo-dropdown-item">
                    <User size={16} />
                    <span onClick={() => navigate('/ngo-profile')}>Account Profile</span>
                  </div>
                  <div className="ngo-dropdown-item">
                    <Settings size={16} />
                    <span onClick={() => navigate('/ngo-settings')}>Preferences</span>
                  </div>
                  <div className="ngo-dropdown-divider"></div>
                  <div className="ngo-dropdown-item ngo-logout">
                    <LogOut size={16} />
                    <span onClick={handleLogout}>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <aside className={`ngo-sidebar ${sidebarOpen ? 'ngo-sidebar-open' : ''}`}>
          <div className="ngo-sidebar-content">
            <nav className="ngo-sidebar-nav">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`ngo-sidebar-item ${activeTab === item.id ? 'ngo-active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      navigate(item.path); // ✅ ✅ ✅ NEW: navigate to the route!
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="ngo-main-content">
          <div className="welcomeee-section">
            <h2>Welcome back, {profileData.contactPersonName || 'Volunteer'}!</h2>
            <p className='welcomeee-section-p'>Ready to make a difference today?</p>
          </div>

          <div className="ngo-stats-grid">
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`ngo-stat-card ngo-${stat.color}`}>
                  <div className="ngo-stat-icon">
                    <Icon size={24} />
                  </div>
                  <div className="ngo-stat-content">
                    <h3>{stat.value}</h3>
                    <p>{stat.title}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="ngo-dashboard-grid">
            <div className="ngo-dashboard-card">
              <div className="ngo-card-header">
                <h3>Upcoming Events</h3>
              </div>
              <div className="ngo-event-list">
                {topUpcoming.length === 0 && (
                  <p className="no-results-text">No upcoming events found.</p>
                )}
                {topUpcoming.map(event => (
                  <div key={event.id} className="ngo-event-item">
                    <div className="ngo-event-date">
                      <span className="ngo-event-day">{new Date(event.startDate).getDate().toString().padStart(2, '0')}</span>
                      <span className="ngo-event-month">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="ngo-event-content">
                      <h4>{event.title}</h4>
                      <div className="ngo-event-meta">
                        <div className="ngo-event-location">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>

        {sidebarOpen && (
          <div 
            className="ngo-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default NgoDashboard;
