import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activitySelectors, getMyActivity } from '../../store/Applicant/activitySlice';
import {
  TrendingUp,
  CheckCircle,
  Users,
  Award,
  Target,
  Clock,
  Trophy,
  Activity as ActivityIcon
} from 'lucide-react';
import './Activity.css';

const Activity = () => {
  const dispatch = useDispatch();
  const stats = useSelector(activitySelectors.getStats);
  const loading = useSelector(activitySelectors.getIsLoading);
  const error = useSelector(activitySelectors.getError);

  useEffect(() => {
    dispatch(getMyActivity());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="activity-page">
        <div className="activity-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your activity...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-page">
        <div className="activity-container">
          <div className="loading-state">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-container">
        <div className="activity-header">
          <div className="header-content">
            <ActivityIcon className="page-icon" />
            <div>
              <h1 className="page-title">My Volunteer Activity</h1>
              <p className="page-subtitle">Track your impact and celebrate your achievements</p>
            </div>
          </div>
        </div>


        <div className="stats-section">
          <div className="section-header">
            <TrendingUp className="section-icon" />
            <div>
              <h2 className="section-title">Your Impact</h2>
              <p className="section-subtitle">See how you're making a difference</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon-wrapper">
                <CheckCircle className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.tasksCompleted || 0}</div>
                <div className="stat-label">Tasks Completed</div>
                <div className="stat-trend">
                  <TrendingUp size={16} />
                </div>
              </div>
            </div>

            <div className="stat-card secondary">
              <div className="stat-icon-wrapper">
                <CheckCircle className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.eventsAttended || 0}</div>
                <div className="stat-label">Events Attended</div>
                <div className="stat-trend">
                  <TrendingUp size={16} />
                </div>
              </div>
            </div>

            <div className="stat-card tertiary">
              <div className="stat-icon-wrapper">
                <Users className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.ngosHelped || 0}</div>
                <div className="stat-label">NGOs Helped</div>
                <div className="stat-trend">
                  <TrendingUp size={16} />
                </div>
              </div>
            </div>

            <div className="stat-card quaternary">
              <div className="stat-icon-wrapper">
                <Award className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.impactScore || 0}</div>
                <div className="stat-label">Impact Score</div>
                <div className="stat-trend">
                  <TrendingUp size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="quick-actions-section">
          <div className="section-header">
            <Target className="section-icon" />
            <div>
              <h2 className="section-title">Keep Growing</h2>
              <p className="section-subtitle">Continue your volunteer journey</p>
            </div>
          </div>

          <div className="achievements-grid">
            <div className="achievement-card earned">
              <div className="achievement-icon-wrapper">
                <Clock className="achievement-icon" />
                <div className="earned-badge">✓</div>
              </div>
              <div className="achievement-content">
                <div className="achievement-header">
                  <h3 className="achievement-title">Log More Hours</h3>
                  <span className="rarity-badge rarity-common">Active</span>
                </div>
                <p>Continue making an impact in your community</p>
              </div>
            </div>

            <div className="achievement-card earned">
              <div className="achievement-icon-wrapper">
                <Users className="achievement-icon" />
                <div className="earned-badge">✓</div>
              </div>
              <div className="achievement-content">
                <div className="achievement-header">
                  <h3 className="achievement-title">Join Events</h3>
                  <span className="rarity-badge rarity-uncommon">Popular</span>
                </div>
                <p>Discover new volunteer opportunities</p>
              </div>
            </div>

            <div className="achievement-card locked">
              <div className="achievement-icon-wrapper">
                <Trophy className="achievement-icon" />
              </div>
              <div className="achievement-content">
                <div className="achievement-header">
                  <h3 className="achievement-title">Unlock Badges</h3>
                  <span className="rarity-badge rarity-common">Coming Soon</span>
                </div>
                <p>Complete challenges to earn new achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;