import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Filter } from 'lucide-react';
import { getMyApplications, deleteApplication } from '../../store/Applicant/applicationsSlice';
import './MyApplications.css';

const MyApplications = () => {
  const dispatch = useDispatch();
  const applications = useSelector((state) => state.applications?.list || []);
  const isLoading = useSelector((state) => state.applications?.isLoading || false);
  const error = useSelector((state) => state.applications?.error);
  const [statusFilter, setStatusFilter] = React.useState('all');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const email = localStorage.getItem('user_email');
        if (email) {
          dispatch(getMyApplications(email));
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [dispatch]);

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="status-icon" />;
    
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="status-icon approved" />;
      case 'rejected':
        return <XCircle className="status-icon rejected" />;
      case 'pending':
        return <AlertCircle className="status-icon pending" />;
      default:
        return <Clock className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status ? status.toLowerCase() : 'unknown'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date) ? "N/A" : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "N/A";
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await dispatch(deleteApplication(applicationId));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const pendingCount = applications.filter((a) => a.status?.toLowerCase() === 'pending').length;
  const approvedCount = applications.filter((a) => a.status?.toLowerCase() === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status?.toLowerCase() === 'rejected').length;
  const successRate = applications.length > 0
    ? Math.round((approvedCount / applications.length) * 100)
    : 0;

  const filteredApplications = applications.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status?.toLowerCase() === statusFilter;
  });

  if (isLoading) {
    return (
      <>
        <div className="applications-page">
          <div className="loading-container">
            <p>Loading your applications...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="applications-page">
          <div className="error-container">
            <p>Error loading applications: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="applications-page">
        <div className="applications-header">
          <div className="header-content">
            <h1>My Applications</h1>
            <p>Track the status of your volunteer applications</p>
          </div>
        </div>

        <div className="applications-container">
          <div className="filters-section">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                <Filter size={18} />
                All Applications
                <span className="count">{applications.length}</span>
              </button>

              <button
                className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                <AlertCircle size={18} />
                Pending
                <span className="count">{pendingCount}</span>
              </button>

              <button
                className={`filter-tab ${statusFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setStatusFilter('approved')}
              >
                <CheckCircle size={18} />
                Approved
                <span className="count">{approvedCount}</span>
              </button>

              <button
                className={`filter-tab ${statusFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setStatusFilter('rejected')}
              >
                <XCircle size={18} />
                Rejected
                <span className="count">{rejectedCount}</span>
              </button>
            </div>
          </div>

          <div className="applications-list">
            {filteredApplications.length === 0 ? (
              <div className="no-applications">
                <p>No applications found.</p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div key={application.id} className="application-card">
                  <div className="card-left">
                    <img
                      src={application.opportunity?.image 
                        ? `http://localhost:5000/uploads/${application.opportunity.image}`
                        : '/placeholder-image.jpg'
                      }
                      alt={application.opportunity?.title || 'Volunteer Opportunity'}
                      className="card-image"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>

                  <div className="card-right">
                    <div className="card-header">
                      <div className="title-section">
                        <h3 className="application-title">
                          {application.opportunity?.title || 'Unknown Opportunity'}
                        </h3>
                        <p className="organization-name">
                          {application.opportunity?.organization || 'Unknown Organization'}
                        </p>
                      </div>
                      <div className={getStatusClass(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="status-text">
                          {application.status 
                            ? application.status.charAt(0).toUpperCase() + application.status.slice(1)
                            : 'Unknown'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="application-details">
                      <div className="detail-row">
                        <Calendar className="detail-icon" />
                        <span>Applied: {formatDate(application.appliedDate)}</span>
                      </div>
                      <div className="detail-row">
                        <Clock className="detail-icon" />
                        <span>Starts: {formatDate(application.opportunity?.startDate)}</span>
                      </div>
                      <div className="detail-row">
                        <MapPin className="detail-icon" />
                        <span>{application.opportunity?.location || 'Location TBD'}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      {(application.status?.toLowerCase() === 'approved' || 
                        application.status?.toLowerCase() === 'rejected') && (
                        <button
                          className="withdraw-btn"
                          onClick={() => handleDeleteApplication(application.id)}
                        >
                          <Trash2 size={16} />
                          Delete Application
                        </button>
                      )}
                      {application.status?.toLowerCase() === 'pending' && (
                        <button
                          className="withdraw-btn"
                          onClick={() => handleDeleteApplication(application.id)}
                        >
                          <Trash2 size={16} />
                          Withdraw Application
                        </button>
                      )}

                      {application.status === 'approved' && (
                        <div className="approved-message">
                          <CheckCircle size={16} />
                          <span>Congratulations! You've been selected.</span>
                        </div>
                      )}
                      {application.status === 'rejected' && (
                        <div className="rejected-message">
                          <XCircle size={16} />
                          <span>Unfortunately, you were not selected.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="applications-stats">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Filter className="icon" />
                </div>
                <div className="stat-content">
                  <h3>{applications.length}</h3>
                  <p>Total Applications</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon pending">
                  <AlertCircle className="icon" />
                </div>
                <div className="stat-content">
                  <h3>{pendingCount}</h3>
                  <p>Under Review</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon approved">
                  <CheckCircle className="icon" />
                </div>
                <div className="stat-content">
                  <h3>{approvedCount}</h3>
                  <p>Approved</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon rejected">
                  <XCircle className="icon" />
                </div>
                <div className="stat-content">
                  <h3>{successRate}%</h3>
                  <p>Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyApplications;