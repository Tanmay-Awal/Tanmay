import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Search, MapPin, Calendar, Tag, Filter, Grid, List } from 'lucide-react';
import './Opportunities.css';
import { getOpportunities, opportunitiesSelectors } from '../../store/Applicant/opportunitiesSlice';
import { getMyApplications, applicationsSelectors } from '../../store/Applicant/applicationsSlice';
import { canApplyForOpportunity } from '../../services/Applicant/applicationsService';

const Opportunities = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const opportunities = useSelector(opportunitiesSelectors.getOpportunities) || [];
  const isLoading = useSelector(opportunitiesSelectors.getIsLoading) || false;
  const error = useSelector(opportunitiesSelectors.getError);
  const applications = useSelector(applicationsSelectors.getApplicationsList) || [];
  
  const authEmail = useSelector((state) => state.auth?.user?.email);
  console.log(authEmail);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchQuery, setSearchQuery] = useState("");
  const [canApplyMap, setCanApplyMap] = useState({});
  const [loadingCanApply, setLoadingCanApply] = useState({});

  const filteredOpportunities = opportunities.filter((opp) => {
    if (!opp) return false;
    
    const title = opp.title?.toLowerCase() || '';
    const description = opp.description?.toLowerCase() || '';
    const location = opp.location?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return title.includes(query) || 
           description.includes(query) || 
           location.includes(query);
  });

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleApply = (opportunityId) => {
    navigate(`/apply-opportunity/${opportunityId}`);
  };

  const checkCanApply = async (opportunityId) => {
    if (!authEmail) return;
    
    setLoadingCanApply(prev => ({ ...prev, [opportunityId]: true }));
    
    try {
      const result = await canApplyForOpportunity(opportunityId);
      setCanApplyMap(prev => ({ 
        ...prev, 
        [opportunityId]: result.canApply 
      }));
    } catch (error) {
      console.error('Error checking can apply:', error);
      setCanApplyMap(prev => ({ 
        ...prev, 
        [opportunityId]: false 
      }));
    } finally {
      setLoadingCanApply(prev => ({ ...prev, [opportunityId]: false }));
    }
  };

  const hasApplied = (opportunityId) => {
    if (!applications || !Array.isArray(applications)) return false;
    
    const hasAppliedResult = applications.some((app) => {
      const appOpportunityId = app?.opportunity?.id;
      const matches = appOpportunityId === opportunityId || 
                     appOpportunityId === opportunityId?.toString() ||
                     appOpportunityId?.toString() === opportunityId;
      return matches;
    });
    
    return hasAppliedResult;
  };

  const canApply = (opportunityId) => {
    console.log("🔍 Opportunities - canApply called for ID:", opportunityId);
    console.log("🔍 Opportunities - canApplyMap:", canApplyMap);
    console.log("🔍 Opportunities - opportunityId in canApplyMap:", opportunityId in canApplyMap);
    
    if (opportunityId in canApplyMap) {
      console.log("🔍 Opportunities - Using canApplyMap result:", canApplyMap[opportunityId]);
      return canApplyMap[opportunityId];
    }
    
    const fallbackResult = !hasApplied(opportunityId);
    console.log("🔍 Opportunities - Using fallback result:", fallbackResult);
    return fallbackResult;
  };

  useEffect(() => {
    dispatch(getOpportunities());
    if (authEmail) {
      dispatch(getMyApplications(authEmail));
    }
  }, [dispatch, authEmail]);

  useEffect(() => {
    if (authEmail && paginatedOpportunities.length > 0) {
      console.log("🔍 Opportunities - Checking can-apply for opportunities:", paginatedOpportunities.length);
      paginatedOpportunities.forEach(opportunity => {
        const id = opportunity._id || opportunity.id;
        console.log("🔍 Opportunities - Checking opportunity ID:", id);
        if (id && !(id in canApplyMap) && !loadingCanApply[id]) {
          console.log("🔍 Opportunities - Calling checkCanApply for ID:", id);
          checkCanApply(id);
        }
      });
    }
  }, [paginatedOpportunities, authEmail, canApplyMap, loadingCanApply]);

  return (
    <>
      <div className="opportunities-page">
        <div className="opportunities-header">
          <div className="header-content">
            <h1>Volunteer Opportunities</h1>
            <p>Discover meaningful ways to make a difference in your community</p>
          </div>
        </div>

        <div className="opportunities-container">
          <div className="filters-section">
            <div className="search-bar">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search opportunities..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading && <p>Loading opportunities...</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="opportunities-grid">
            {paginatedOpportunities && paginatedOpportunities.length > 0 ? (
              paginatedOpportunities.map(opportunity => {
                if (!opportunity) return null;
                
                console.log(opportunity);

                const id = 
                  (typeof opportunity._id === "object" && opportunity._id?.$oid) ? opportunity._id.$oid :
                  opportunity._id || 
                  opportunity.id || 
                  `temp-${Math.random()}`;

                return (
                  <div key={id} className="opportunity-card">
                    <div className="card-image-container">
                      <img
                        src={
                          opportunity.image
                            ? `http://localhost:5000/uploads/${opportunity.image}`
                            : "https://via.placeholder.com/400x300"
                        }
                        alt={opportunity.title || 'Volunteer Opportunity'}
                        className="card-image"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300";
                        }}
                      />

                      {opportunity.category && (
                        <div className="category-badge">
                          {opportunity.category}
                        </div>
                      )}
                    </div>

                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="opportunity-title">
                          {opportunity.title || 'Untitled Opportunity'}
                        </h3>
                        <div className="organization-info">
                          <span>
                            {typeof opportunity.organization === "string"
                              ? opportunity.organization
                              : "Unknown Organization"}
                          </span>
                        </div>
                      </div>

                      <p className="opportunity-description">
                        {opportunity.description && opportunity.description.length > 56
                          ? `${opportunity.description.slice(0, 56)}...`
                          : (opportunity.description || 'No description available')}
                      </p>

                      <div className="opportunity-detailss">
                        <div className="detail-itemm">
                          <Calendar className="detail-iconn" />
                          <span>
                            Start:{" "}
                            {opportunity.startDate
                              ? new Date(opportunity.startDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail-itemm">
                          <MapPin className="detail-iconn" />
                          <span>{opportunity.location || "N/A"}</span>
                        </div>
                      </div>

                      <div className="tags-containerr">
                        {opportunity.tags && Array.isArray(opportunity.tags) &&
                          opportunity.tags.map((tag, index) => (
                            <span key={`${id}-${index}`} className="tagg">
                              <Tag size={12} /> {tag}
                            </span>
                          ))}
                      </div>

                      {loadingCanApply[id] ? (
                        <button className="apply-btn" disabled>
                          Checking...
                        </button>
                      ) : hasApplied(id) ? (
                        <button className="apply-btn applied-btn" disabled>
                          Applied
                        </button>
                      ) : canApply(id) ? (
                        <button className="apply-btn" onClick={() => handleApply(id)}>
                          Apply Now
                        </button>
                      ) : (
                        <button className="apply-btn applied-btn" disabled>
                          Previously Applied
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              !isLoading && (
                <div className="no-opportunities">
                  <p>No opportunities found matching your search.</p>
                </div>
              )
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageClick(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                {totalPages > 3 && (
                  <>
                    <span className="pagination-dots">...</span>
                    <button
                      className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                      onClick={() => handlePageClick(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                className="pagination-btn"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Opportunities;