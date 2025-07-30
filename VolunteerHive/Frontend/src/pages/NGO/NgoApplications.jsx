import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchApplications, ngoApplicationsSelectors } from '../../store/NGO/Ngo_applicationsSlice';
import { changeApplicationStatus } from '../../store/NGO/Ngo_applicationsSlice';
import { Search, Filter, Check, X, Mail, User, Calendar, MapPin, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deleteApplication } from '../../store/NGO/Ngo_applicationsSlice';
import { Trash2 } from 'lucide-react';
import './NgoApplications.css';

const NgoApplications = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const applications = useSelector(ngoApplicationsSelectors.getList);
  const isLoading = useSelector(ngoApplicationsSelectors.getIsLoading);
  const error = useSelector(ngoApplicationsSelectors.getError);
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status.toLowerCase() === 'pending').length;
  const approvedApplications = applications.filter(app => app.status.toLowerCase() === 'approved').length;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedApplication, setSelectedApplication] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
  dispatch(fetchApplications());
}, [dispatch]);

  

  const handleApprove = (id) => {
    dispatch(changeApplicationStatus({ appId: id, status: "Approved" })).then(() => {
    dispatch(fetchApplications());
  });
};

  const handleReject = (id) => {
    dispatch(changeApplicationStatus({ appId: id, status: "Rejected" })).then(() => {
      dispatch(fetchApplications());
    });
  };

  
  const handleViewDetails = (application) => {
  navigate(`/view-applications/${application.id}/${application.opportunityId}`);
};



  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const handleDelete = (id) => {
  dispatch(deleteApplication(id)).then(() => {
    dispatch(fetchApplications());
  });
};


const filteredApplications = applications.filter((app) => {
  const matchesStatus =
    statusFilter === 'all' || app.status.toLowerCase() === statusFilter;

  const matchesSearch =
    searchTerm.trim() === '' ||
    app.volunteerEmail.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesStatus && matchesSearch;
});

  const handleExportCSV = () => {
  if (filteredApplications.length === 0) {
    toast.info("No applications to export!");
    return;
  }

  const headers = ['Volunteer Name', 'Email', 'Opportunity', 'Applied Date', 'Status'];
  
  const rows = filteredApplications.map(app => {

    const formattedDate = `'${new Date(app.appliedDate).toISOString().split('T')[0]}'`;



    const volunteerName = `"${app.volunteerName}"`;
    const volunteerEmail = `"${app.volunteerEmail}"`;
    const opportunityTitle = `"${app.opportunityTitle}"`;
    const status = `"${app.status}"`;

    return [volunteerName, volunteerEmail, opportunityTitle, formattedDate, status].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');


  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute('download', 'applications.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success("CSV file exported!");
};

  return (
    <>
      <div className="applications-container">
        <div className="applications-header">
          <div className="header-content">
            <h1 className="page-title">Volunteer Applications</h1>
            <p className="page-subtitle">Review and manage volunteer applications for your opportunities</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{totalApplications}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pendingApplications}</div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{approvedApplications}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
        </div>

        <div className="applications-controls">
          <div className="search-filter-section">
            <div className="search-container">
              <Search size={20} className="searchh-icon" />
              <input
                type="text"
                placeholder="Search by volunteer email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-container">
              <Filter size={18} className="filter-icon" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <button className="export-btn" onClick={handleExportCSV}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="applications-table-container">
          <div className="table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Contact</th>
                  <th>Opportunity</th>
                  <th className='appdate'>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
    {isLoading ? (
      <tr>
        <td colSpan="6">Loading...</td>
      </tr>
    ) : applications.length === 0 ? (
      <tr>
        <td colSpan="6">No applications found</td>
      </tr>
    ) : (
      filteredApplications.map(application => {
        console.log(application); // ✅ log each application

        return (
          <tr key={application.id} className="table-row">
            <td className="volunteer-cell">
              <div className="volunteer-info">
                <div className="volunteer-avatar">
                  <User size={20} />
                </div>
                <div className="volunteer-details">
                  <div className="volunteer-name">{application.volunteerName}</div>
                </div>
              </div>
            </td>
            <td className="contact-cell">
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={14} />
                  <span>{application.volunteerEmail}</span>
                </div>
              </div>
            </td>
            <td className="opportunity-cell">
              <div className="opportunity-title">{application.opportunityTitle}</div>
            </td>
            <td className="date-cell">
              <div className="date-info">
                <Calendar size={14} />
                <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
            </td>
            <td className="status-celll">
              <span className={`status-badgee ${getStatusColor(application.status)}`}>
                {getStatusText(application.status)}
              </span>
            </td>
            <td className="actions-cell">
              <div className="action-buttonss">
                <button
                  className="action-btn view-btn"
                  onClick={() => handleViewDetails(application)}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                {application.status.toLowerCase() === 'pending' ? (
                  <>
                  <button
                    className="action-btn approve-btn"
                    onClick={() => handleApprove(application.id)}
                    title="Approve"
                  >
                  <Check size={16} />
                  </button>
                  <button
                    className="action-btn reject-btn"
                    onClick={() => handleReject(application.id)}
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(application.id)}
                  title="Delete"
                >
                <Trash2 size={16} />
                </button>
              )}
              </div>
            </td>
          </tr>
        );
      })
    )}
  </tbody>

            </table>
          </div>
        </div>


        {showModal && selectedApplication && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Application Details</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-content">
                <div className="application-details">
                  <div className="detail-section">
                    <h3>Volunteer Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Name</label>
                        <span>{selectedApplication.volunteerName}</span>
                      </div>
                      <div className="detail-item">
                        <label>Email</label>
                        <span>{selectedApplication.volunteerEmail}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Application Details</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Opportunity</label>
                        <span>{selectedApplication.opportunityTitle}</span>
                      </div>
                      <div className="detail-item">
                        <label>Status</label>
                        <span className={`status-badge ${getStatusColor(selectedApplication.status)}`}>
                          {getStatusText(selectedApplication.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Motivation</h3>
                    <div className="motivation-text">
                      {selectedApplication.motivation}
                    </div>
                  </div>
                </div>
                
                <div className="modal-actions">
                  {selectedApplication.status === 'pending' && (
                    <>
                      <button 
                        className="approve-btn-modal"
                        onClick={() => handleApprove(selectedApplication.id)}
                      >
                        <Check size={18} />
                        Approve Application
                      </button>
                      <button 
                        className="reject-btn-modal"
                        onClick={() => handleReject(selectedApplication.id)}
                      >
                        <X size={18} />
                        Reject Application
                      </button>
                    </>
                  )}
                  <button className="close-btn" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="toast-container">

        </div>
      </div>
    </>
  );
};

export default NgoApplications;