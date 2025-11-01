import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { addDocument } from '../../firebase/firestore';
import './ShareExperience.css';

const ShareExperience = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState({
    destination: '',
    tripDate: '',
    title: '',
    description: '',
    highlights: [''],
    photos: [''],
    rating: 5,
    tips: ['']
  });

  const handleChange = (field, value) => {
    setExperience(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setExperience(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setExperience(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setExperience(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please sign in to share your experience');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const experienceData = {
        ...experience,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email,
        highlights: experience.highlights.filter(h => h.trim() !== ''),
        tips: experience.tips.filter(t => t.trim() !== ''),
        photos: experience.photos.filter(p => p.trim() !== '')
      };

      await addDocument('experiences', experienceData);
      alert('Experience shared successfully! Thank you for contributing to our community.');
      navigate('/profile');
    } catch (error) {
      console.error('Error sharing experience:', error);
      alert('Failed to share experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-required">
        <h2>Sign In Required</h2>
        <p>Please sign in to share your travel experience</p>
        <button onClick={() => navigate('/auth')}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="share-experience-container">
      <div className="share-header">
        <h1>Share Your Travel Experience</h1>
        <p>Help fellow travelers by sharing your journey and insights</p>
      </div>

      <form onSubmit={handleSubmit} className="experience-form">
        <div className="form-section">
          <h2>Trip Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Destination *</label>
              <input
                type="text"
                value={experience.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
                placeholder="e.g., Paris, France"
                required
              />
            </div>
            <div className="form-group">
              <label>Trip Date *</label>
              <input
                type="date"
                value={experience.tripDate}
                onChange={(e) => handleChange('tripDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Experience Title *</label>
            <input
              type="text"
              value={experience.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Amazing 3-Day Trip to Paris"
              required
            />
          </div>

          <div className="form-group">
            <label>Overall Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`rating-star ${experience.rating >= rating ? 'active' : ''}`}
                  onClick={() => handleChange('rating', rating)}
                >
                  ⭐
                </button>
              ))}
              <span className="rating-text">{experience.rating} / 5</span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Your Story</h2>
          
          <div className="form-group">
            <label>Describe Your Experience *</label>
            <textarea
              value={experience.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tell us about your trip - what made it special, what you enjoyed most, any surprises..."
              rows="6"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Trip Highlights</h2>
          
          {experience.highlights.map((highlight, index) => (
            <div key={index} className="array-input-group">
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                placeholder={`Highlight ${index + 1}`}
                className="array-input"
              />
              {experience.highlights.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayField('highlights', index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="add-field-btn"
            onClick={() => addArrayField('highlights')}
          >
            + Add Highlight
          </button>
        </div>

        <div className="form-section">
          <h2>Tips for Future Travelers</h2>
          
          {experience.tips.map((tip, index) => (
            <div key={index} className="array-input-group">
              <input
                type="text"
                value={tip}
                onChange={(e) => handleArrayChange('tips', index, e.target.value)}
                placeholder={`Tip ${index + 1}`}
                className="array-input"
              />
              {experience.tips.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayField('tips', index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="add-field-btn"
            onClick={() => addArrayField('tips')}
          >
            + Add Tip
          </button>
        </div>

        <div className="form-section">
          <h2>Photos (Optional)</h2>
          <p className="helper-text">Add photo URLs to showcase your trip</p>
          
          {experience.photos.map((photo, index) => (
            <div key={index} className="array-input-group">
              <input
                type="url"
                value={photo}
                onChange={(e) => handleArrayChange('photos', index, e.target.value)}
                placeholder={`Photo URL ${index + 1}`}
                className="array-input"
              />
              {experience.photos.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayField('photos', index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="add-field-btn"
            onClick={() => addArrayField('photos')}
          >
            + Add Photo URL
          </button>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Sharing...' : 'Share Experience'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShareExperience;
