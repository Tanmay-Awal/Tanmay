import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { addOpportunity } from "../../store/NGO/Ngo_opportunitiesSlice";
import { fetchOpportunities } from "../../store/NGO/Ngo_opportunitiesSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer , toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fetchSingleOpportunity, editOpportunity } from "../../store/NGO/Ngo_opportunitiesSlice";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Upload, X, Calendar, MapPin, Tag, ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import './EditOpportunity.css';

const EditOpportunity = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    location: '',
    tags: [],
    image: null,
    status: 'Open'
  });
  
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
  dispatch(fetchSingleOpportunity(id))
    .unwrap()
    .then((res) => {
      const opp = res.data;
      setFormData({
        title: opp.title,
        description: opp.description,
        startDate: opp.startDate,
        location: opp.location,
        tags: opp.tags,
        image: null, 
        status: opp.status
      });
      if (opp.image) {
        setImagePreview(`http://localhost:5000/uploads/${opp.image}`);
      }
    })
    .catch((err) => {
      console.error(err);
      toast.error("Could not load opportunity");
      navigate("/ngo-opportunities");
    });
}, [dispatch, id, navigate]);



  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};
  if (!formData.title.trim()) newErrors.title = "Title is required";
  if (!formData.description.trim()) newErrors.description = "Description is required";
  if (!formData.location.trim()) newErrors.location = "Location is required";
  if (!imagePreview && !formData.image) newErrors.image = "Image is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsSubmitting(true);
  setErrors({});

  try {
  const formPayload = new FormData();
  formPayload.append("title", formData.title);
  formPayload.append("description", formData.description);
  formPayload.append("startDate", formData.startDate);
  formPayload.append("location", formData.location);
  formData.tags.forEach(tag => formPayload.append("tags[]", tag));
  formPayload.append("status", formData.status);
  formPayload.append("image", formData.image);

  await dispatch(editOpportunity({ id, formData: formPayload })).unwrap();
  await dispatch(fetchOpportunities());


  setFormData({
    title: '',
    description: '',
    startDate: '',
    location: '',
    tags: [],
    image: null,
    status: 'Open'
  });
  setImagePreview(null);
  setTagInput('');
  toast.success("Opportunity updated successfully!");
  navigate("/ngo-opportunities"); 
} catch (err) {
  console.error(err);
  toast.error("Something went wrong!");
} finally {
  setIsSubmitting(false);
}

if (formData.startDate) {
  const today = new Date().setHours(0,0,0,0);
  const selected = new Date(formData.startDate).setHours(0,0,0,0);
  if (selected < today) {
    newErrors.startDate = "Start date cannot be in the past";
  }
}
};


  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  }
};


  const handleTagAdd = (e) => {
  if (e.key === "Enter" && tagInput.trim()) {
    e.preventDefault();

    const trimmedNewTag = tagInput.trim();

    const totalLength = formData.tags.reduce((acc, tag) => acc + tag.length, 0);

    const spacesBetween = formData.tags.length > 0 ? formData.tags.length : 0;

    const newTotal = totalLength + spacesBetween + trimmedNewTag.length;

    if (newTotal > 40) {
      toast.error(`❌ Total tag length (including spaces) cannot exceed 40 characters.`);
      return;
    }

    if (!formData.tags.includes(trimmedNewTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedNewTag]
      });
    }

    setTagInput('');
  }
};


  const removeTag = (tagToRemove) => {
  setFormData({
    ...formData,
    tags: formData.tags.filter((tag) => tag !== tagToRemove)
  });
};


  const removeImage = () => {
  setFormData({ ...formData, image: null });
  setImagePreview(null);
};

  const handleback = () => {
    navigate("/ngo-opportunities");
  }

  return (
    <>
      <div className="add-opportunity-container">
        <div className="page-headerr">
          <button className="back-buttonn" onClick={handleback}>
            <ArrowLeft className="back-icon" />
            <span>Back to Opportunities</span>
          </button>
          
          <div className="header-content">
            <h1 className="page-titlee">Edit Opportunity</h1>
            <p className="page-subtitlee">Update the details below to edit this opportunity.</p>
          </div>
        </div>

        <form className="opportunity-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-column">
              <div className="form-groupp">
                <label className="form-labell">
                  <span className="label-text">Opportunity Title</span>
                  <span className="required-indicator">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`form-inputt ${errors.title ? 'error' : ''}`}
                    placeholder="Enter opportunity title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                {errors.title && <span className="error-messagee">{errors.title}</span>}
              </div>

              <div className="form-groupp">
                <label className="form-labell">
                  <span className="label-text">Description</span>
                  <span className="required-indicator">*</span>
                </label>
                <div className="input-wrapper">
                  <textarea
                    className={`form-textareaa ${errors.description ? 'error' : ''}`}
                    placeholder="Describe the opportunity, requirements, and what volunteers will do..."
                    rows="6"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                {errors.description && <span className="error-messagee">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-groupp">
                  <label className="form-labell">
                    <Calendar className="label-icon" />
                    <span className="label-text">Start Date</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      className="form-inputt"
                      value={formData.startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-groupp">
                  <label className="form-labell">
                    <MapPin className="label-icon" />
                    <span className="label-text">Location</span>
                    <span className="required-indicator">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className={`form-inputt ${errors.location ? 'error' : ''}`}
                      placeholder="City, State, Country"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  {errors.location && <span className="error-messagee">{errors.location}</span>}
                </div>
              </div>

              <div className="form-groupp">
                <label className="form-labell">
                  <Tag className="label-icon" />
                  <span className="label-text">Tags</span>
                </label>
                <div className="tags-container">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tagg">
                      {tag}
                      <button type="button" className="tag-remove" onClick={() => removeTag(tag)}>
                        <X className="tag-remove-icon" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="tag-input"
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagAdd}
                  />
                </div>
              </div>
            </div>

            <div className="form-column">
              <div className="form-groupp">
                <label className="form-labell">
                  <ImageIcon className="label-icon" />
                  <span className="label-text">Upload Image</span>
                  <span className="required-indicator">*</span>
                </label>
                
                <p className="upload-note">Recommended size: 470 × 200 pixels</p>

                
                {!imagePreview ? (
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      className="upload-input"
                      onChange={handleImageUpload}
                    />
                    <div className="upload-content">
                      <Upload className="upload-icon" />
                      <p className="upload-text">Click to upload or drag and drop</p>
                      <p className="upload-subtext">JPG, PNG files only</p>
                    </div>
                  </div>
                ) : (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" className="preview-image" />
                    <div className="preview-overlay">
                      <button type="button" className="remove-image" onClick={removeImage}>
                        <X className="remove-icon" />
                      </button>
                    </div>
                    <p className="image-filename">
                      {formData.image?.name || 'Selected Image'}
                    </p>
                  </div>
                )}
                {errors.image && <span className="error-messagee">{errors.image}</span>}
              </div>

              <div className="form-groupp">
                <label className="form-labell">
                  <span className="label-text">Status</span>
                  <span className="required-indicator">*</span>
                </label>
                <div className="status-toggle">
                  <button
                    type="button"
                    className={`status-option ${formData.status === 'Open' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, status: 'Open'})}
                  >
                    <span className="status-indicator open"></span>
                    Open
                  </button>
                  <button
                    type="button"
                    className={`status-option ${formData.status === 'Closed' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, status: 'Closed'})}
                  >
                    <span className="status-indicator closed"></span>
                    Closed
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={handleback}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? (
                  <>
                    <Loader2 className="loading-iconn" />
                    Updating...
                  </>
                ) : (
                  'Update Opportunity'
                )}
            </button>
          </div>
        </form>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
};

export default EditOpportunity;