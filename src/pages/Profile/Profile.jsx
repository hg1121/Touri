import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { queryDocuments } from '../../firebase/firestore';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedItineraries();
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;