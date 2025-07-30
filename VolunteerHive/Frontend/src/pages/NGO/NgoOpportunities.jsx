import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOpportunities } from '../../store/NGO/Ngo_opportunitiesSlice';
import { ngoOpportunitySelectors } from '../../store/NGO/Ngo_opportunitiesSlice';
import { removeOpportunity} from '../../store/NGO/Ngo_opportunitiesSlice';
import { editOpportunity } from '../../store/NGO/Ngo_opportunitiesSlice';
import { toast } from 'react-toastify';

import { useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Filter, Calendar, MapPin, Users, Eye, Upload, X, Tags } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './NgoOpportunities.css';

const NgoOpportunities = () => {


  const dispatch = useDispatch();
  const opportunities = useSelector(ngoOpportunitySelectors.getList);
  console.log("Fetched opportunities:", opportunities);
  const isLoading = useSelector(ngoOpportunitySelectors.getIsLoading);
  const error = useSelector(ngoOpportunitySelectors.getError);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const navigate = useNavigate(); 


  useEffect(() => {
  dispatch(fetchOpportunities());
}, [dispatch]);


  const filteredOpportunities = opportunities.filter((opp) => {
  const matchesStatus =
    statusFilter === 'all' || opp.status.toLowerCase() === statusFilter;

  const matchesSearch =
    searchTerm.trim() === '' ||
    opp.title.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesStatus && matchesSearch;
});


  const handleAddOpportunity = () => {
    navigate('/add-opportunity'); 
  };
  
  const handleEditOpportunity = (id) => {
    navigate(`/edit-opportunity/${id}`); 
  };
  
  const handleDeleteOpportunity = async (id) => {
  if (!window.confirm("Are you sure you want to delete this opportunity?")) return;

  try {
    await dispatch(removeOpportunity(id)).unwrap();
    toast.success("Opportunity deleted successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while deleting.");
  }
};
  
  const handleToggleStatus = async (opportunity) => {
  const newStatus = opportunity.status === 'Open' ? 'Closed' : 'Open';

  try {
    const formPayload = new FormData();
    formPayload.append("title", opportunity.title);
    formPayload.append("description", opportunity.description);
    formPayload.append("startDate", opportunity.startDate);
    formPayload.append("location", opportunity.location);
    opportunity.tags.forEach(tag => formPayload.append("tags[]", tag));
    formPayload.append("status", newStatus);


    await dispatch(editOpportunity({ id: opportunity.id, formData: formPayload })).unwrap();

    toast.success(`Status updated to ${newStatus}!`);
    await dispatch(fetchOpportunities()); 
  } catch (err) {
    console.error(err);
    toast.error("Could not toggle status.");
  }
};

  const handleViewOpportunity = (id) => {
    navigate(`/view-opportunity/${id}`); 
  };


  return (
    <>
      <div className="opportunities-container">
        <div className="opportunities-header">
          <div className="header-content">
            <h1 className="page-title">Volunteer Opportunities</h1>
            <p className="page-subtitle">Manage and track all your volunteer opportunities</p>
          </div>
          <button className="add-opportunity-btn" onClick={handleAddOpportunity}>
            <Plus size={20} />
            Add New Opportunity
          </button>
        </div>

        <div className="opportunities-controls">
          <div className="search-filter-section">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search opportunities..."
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
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="opportunities-grid">
          {filteredOpportunities.length === 0 && (
            <p className="no-results-text">No opportunities found.</p>
          )}
          
          {filteredOpportunities.map(opportunity => (
            <div key={opportunity.id} className="opportunity-cardd">
              <div className="card-image-container">
                <img 
                  src={`http://localhost:5000/uploads/${opportunity.image}`} 
                  alt={opportunity.title}
                  className="card-image"
                />
                <div className={`status-badge ${opportunity.status && opportunity.status.toLowerCase()}`}>
                  {opportunity.status}
                </div>

              </div>
              
              <div className="card-content">
                <h3 className="opportunity-title">{opportunity.title}</h3>
                
                <div className="opportunity-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{opportunity.startDate}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="meta-item tags-item">
                    <Tags size={16} />
                    <span>Tags: {opportunity.tags && opportunity.tags.join(', ')}</span>
                  </div>

                </div>
                
                <div className="card-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => {handleViewOpportunity(opportunity.id)}}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => handleEditOpportunity(opportunity.id)}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button 
                    className="action-btn deletee-btn"
                    onClick={() => handleDeleteOpportunity(opportunity.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <button 
                    className="action-btn toggle-btn"
                    onClick={() => handleToggleStatus(opportunity)}
                  >
                    {opportunity.status === 'Open' ? 
                      <ToggleRight size={16} /> : 
                      <ToggleLeft size={16} />
                    }
                    {opportunity.status === 'Open' ? 'Close' : 'Open'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>{selectedOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-form">
                <div className="form-group">
                  <label htmlFor="title">Opportunity Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter opportunity title"
                    className="form-input"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Enter location"
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter opportunity description"
                    className="form-textarea"
                    rows="4"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="image">Upload Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-input"
                    />
                    <div className="image-upload-area">
                      <Upload size={24} />
                      <span>Click to upload or drag and drop</span>
                    </div>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                    )}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="save-btn">
                    {selectedOpportunity ? 'Update' : 'Create'} Opportunity
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

export default NgoOpportunities;