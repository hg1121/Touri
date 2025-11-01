import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { queryDocuments } from '../../firebase/firestore';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [sharedExperiences, setSharedExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedItineraries();
    loadSharedExperiences();
  }, []);

  const loadSavedItineraries = async () => {
    try {
      const itineraries = await queryDocuments(
        'itineraries',
        [{ field: 'userId', operator: '==', value: currentUser.uid }],
        'createdAt'
      );
      setSavedItineraries(itineraries);
    } catch (error) {
      console.error('Error loading itineraries:', error);
      setSavedItineraries([]);
    }
  };

  const loadSharedExperiences = async () => {
    try {
      const experiences = await queryDocuments(
        'experiences',
        [{ field: 'userId', operator: '==', value: currentUser.uid }],
        'createdAt'
      );
      setSharedExperiences(experiences);
    } catch (error) {
      console.error('Error loading experiences:', error);
      setSharedExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : '👤'}
        </div>
        <div className="profile-info">
          <h1>{currentUser.displayName || 'Traveler'}</h1>
          <p>{currentUser.email}</p>
        </div>
      </div>

      <div className="profile-content">
        <section className="saved-itineraries">
          <h2>Saved Itineraries</h2>
          
          {loading ? (
            <div className="loading-message">Loading your itineraries...</div>
          ) : savedItineraries.length > 0 ? (
            <div className="itineraries-grid">
              {savedItineraries.map((itinerary) => (
                <div key={itinerary.id} className="itinerary-card">
                  <div className="card-header">
                    <h3>{itinerary.destination}</h3>
                    <span className="card-date">
                      {new Date(itinerary.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="card-content">
                    <p><strong>Flight:</strong> {itinerary.flight?.airline} - {itinerary.flight?.flightNumber}</p>
                    <p><strong>Hotel:</strong> {itinerary.hotel?.name}</p>
                    <p className="card-cost"><strong>Total Cost:</strong> ${itinerary.totalCost}</p>
                  </div>
                  <div className="card-footer">
                    <span className="saved-date">
                      Saved: {new Date(itinerary.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No saved itineraries yet</p>
              <p className="empty-subtitle">Start planning your next adventure!</p>
            </div>
          )}
        </section>

        <section className="shared-experiences">
          <div className="section-header">
            <h2>Shared Experiences</h2>
            <button 
              className="share-experience-btn"
              onClick={() => navigate('/share-experience')}
            >
              + Share Experience
            </button>
          </div>
          
          {sharedExperiences.length > 0 ? (
            <div className="experiences-grid">
              {sharedExperiences.map((experience) => (
                <div key={experience.id} className="experience-card">
                  <div className="experience-header">
                    <h3>{experience.title || experience.destination}</h3>
                    <div className="experience-rating">
                      {'⭐'.repeat(experience.rating || 0)}
                    </div>
                  </div>
                  <div className="experience-meta">
                    <span>📍 {experience.destination}</span>
                    {experience.tripDate && (
                      <span>📅 {new Date(experience.tripDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <p className="experience-description">
                    {experience.description?.substring(0, 150)}...
                  </p>
                  {experience.highlights && experience.highlights.length > 0 && (
                    <div className="experience-highlights">
                      <strong>Highlights:</strong>
                      <div className="highlights-tags">
                        {experience.highlights.slice(0, 3).map((highlight, idx) => (
                          <span key={idx} className="highlight-tag">{highlight}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No shared experiences yet</p>
              <p className="empty-subtitle">Share your travel stories with the community!</p>
              <button 
                className="empty-cta-btn"
                onClick={() => navigate('/share-experience')}
              >
                Share Your First Experience
              </button>
            </div>
          )}
        </section>

        <section className="profile-stats">
          <h2>Travel Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">✈️</span>
              <span className="stat-number">{savedItineraries.length}</span>
              <span className="stat-label">Trips Planned</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🌍</span>
              <span className="stat-number">
                {new Set(savedItineraries.map(i => i.destination)).size}
              </span>
              <span className="stat-label">Destinations</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <span className="stat-number">
                ${savedItineraries.reduce((sum, i) => sum + (i.totalCost || 0), 0)}
              </span>
              <span className="stat-label">Total Budget</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📝</span>
              <span className="stat-number">{sharedExperiences.length}</span>
              <span className="stat-label">Experiences Shared</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;