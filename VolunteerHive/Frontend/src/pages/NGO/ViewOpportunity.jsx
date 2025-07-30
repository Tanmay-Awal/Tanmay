import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeOpportunity } from "../../store/NGO/Ngo_opportunitiesSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Eye, Edit, Trash2 } from 'lucide-react';

import { fetchSingleOpportunity } from "../../store/NGO/Ngo_opportunitiesSlice";

import './ViewOpportunity.css';

const ViewOpportunity = () => {

   const { id } = useParams();
const dispatch = useDispatch();
const navigate = useNavigate();

const [opportunityData, setOpportunityData] = React.useState(null);

useEffect(() => {
  dispatch(fetchSingleOpportunity(id))
    .unwrap()
    .then(res => setOpportunityData(res.data))
    .catch(err => {
      console.error(err);
      navigate("/ngo-opportunities");
    });
}, [dispatch, id, navigate]);

if (!opportunityData) return <div>Loading...</div>;



  return (
    <div className="view-opportunity-container">
      <div className="view-opportunity-header">
        <button className="back-btn" onClick={() => navigate("/ngo-opportunities")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Opportunities
        </button>
        <div className="header-actions">
          <button className="action-btn edit-btn" onClick={() => navigate(`/edit-opportunity/${id}`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button
            className="action-btn delete-btn"
            onClick={async () => {
                if (window.confirm("Are you sure you want to delete this?")) {
                try {
                    await dispatch(removeOpportunity(id)).unwrap();
                    toast.success("Deleted!");
                    navigate("/ngo-opportunities");
                } catch (err) {
                    console.error(err);
                    toast.error("Error deleting.");
                }
                }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="view-opportunity-content">
        <div className="opportunity-main">
          <div className="opportunity-image-section">
            <img 
              src={`http://localhost:5000/uploads/${opportunityData.image}`}  
              alt={opportunityData.title}
              className="opportunity-image"
            />
            <div className="status-badge-container">
              <span className={`status-badge ${opportunityData.status.toLowerCase()}`}>
                {opportunityData.status}
              </span>
            </div>
          </div>

          <div className="opportunity-details">
            <div className="title-section">
              <h1 className="opportunity-titlee">{opportunityData.title}</h1>
              <div className="meta-info">
                <span className="created-date">Posted on {opportunityData.createdDate}</span>
                <span className="posted-by">by {opportunityData.postedBy}</span>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <div className="detail-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  <h3>Start Date</h3>
                </div>
                <p className="detail-value">{opportunityData.startDate}</p>
              </div>

              <div className="detail-card">
                <div className="detail-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <h3>Location</h3>
                </div>
                <p className="detail-value">{opportunityData.location}</p>
              </div>

              <div className="detail-card">
                <div className="detail-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <h3>Current Status</h3>
                </div>
                <p className="detail-value status-text">
                    {opportunityData.status === "Open" ? "Active" : "Inactive"}
                </p>

              </div>
            </div>

            <div className="description-section">
              <h3 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                Full Description
              </h3>
              <div className="description-content">
                <p>{opportunityData.description}</p>
              </div>
            </div>

            <div className="tags-section">
              <h3 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Tags
              </h3>
              <div className="tags-container">
                {opportunityData.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOpportunity;