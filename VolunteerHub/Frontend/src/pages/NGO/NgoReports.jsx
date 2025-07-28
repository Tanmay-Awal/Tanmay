import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ngoReportsSelectors, fetchNGOReports } from '../../store/NGO/Ngo_reportsSlice';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle, 
  Award
} from 'lucide-react';

import './NgoReports.css';

const NgoReports = () => {
  const dispatch = useDispatch();

  const stats = useSelector(ngoReportsSelectors.getStats);
  const loading = useSelector(ngoReportsSelectors.getIsLoading);
  const error = useSelector(ngoReportsSelectors.getError);

  useEffect(() => {
    dispatch(fetchNGOReports());
  }, [dispatch]);

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ngo-reports-container">
      <div className="reports-header">
        <div className="header-content">
          <h1 className="page-title">
            <Award className="title-icon" />
            NGO Impact Dashboard
          </h1>
          <p className="page-subtitle">
            Comprehensive overview of your organization's volunteer engagement and impact
          </p>
        </div>
      </div>

    
      <div className="stats-grid">
        <div className="stat-card opportunities">
          <div className="stat-icon-wrapper">
            <TrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats?.totalOpportunities ?? 0}</h3>
            <p className="stat-label">Total Opportunities Posted</p>
          </div>
        </div>

        <div className="stat-card applications">
          <div className="stat-icon-wrapper">
            <FileText className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats?.totalApplications ?? 0}</h3>
            <p className="stat-label">Applications Received</p>
          </div>
        </div>

        <div className="stat-card volunteers">
          <div className="stat-icon-wrapper">
            <Users className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats?.totalVolunteers ?? 0}</h3>
            <p className="stat-label">Active Volunteers</p>
          </div>
        </div>

        <div className="stat-card tasks">
          <div className="stat-icon-wrapper">
            <CheckCircle className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats?.totalTasksCompleted ?? 0}</h3>
            <p className="stat-label">Tasks Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoReports;