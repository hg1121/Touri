import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDocument, updateDocument } from '../../firebase/firestore';
import './GuideDetail.css';

const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [guide, setGuide] = useState(location.state?.guide || null);
  const [loading, setLoading] = useState(!guide);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!guide) {
      loadGuide();
    }
  }, [id]);

  const loadGuide = async () => {
    try {
      const fetchedGuide = await getDocument('guides', id);
      setGuide(fetchedGuide);
    } catch (error) {
      console.error('Error loading guide:', error);
      // Fallback to mock data if Firestore fails
      setGuide({
        id: id,
        title: 'Sample Guide',
        destination: 'Sample Destination',
        description: 'This is a sample guide',
        attractions: [],
        tips: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert('Please sign in to like guides');
      navigate('/auth');
      return;
    }

    const newLikes = liked ? guide.likes - 1 : guide.likes + 1;
    setLiked(!liked);
    
    try {
      await updateDocument('guides', guide.id, {
        likes: newLikes
      });
      setGuide({ ...guide, likes: newLikes });
    } catch (error) {
      console.error('Error updating likes:', error);
      setLiked(!liked); // Revert on error
    }
  };

  const handleUseGuide = () => {
    navigate('/search', { state: { destination: guide.destination } });
  };

  if (loading) {
    return <div className="loading-container">Loading guide...</div>;
  }

  if (!guide) {
    return (
      <div className="error-container">
        <p>Guide not found</p>
        <button onClick={() => navigate('/guides')}>Back to Guides</button>
      </div>
    );
  }

  return (
    <div className="guide-detail-container">
      <button className="back-button" onClick={() => navigate('/guides')}>
        ← Back to Guides
      </button>

      <div className="guide-detail-header">
        <div>
          <h1>{guide.title}</h1>
          <div className="guide-location">
            <span className="location-icon">📍</span>
            <span>{guide.destination}</span>
          </div>
        </div>
        
        <div className="guide-actions">
          <button
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            ❤️ {guide.likes || 0}
          </button>
          <button className="use-guide-button" onClick={handleUseGuide}>
            Use This Guide
          </button>
        </div>
      </div>

      <div className="guide-stats">
        <div className="stat-item">
          <span className="stat-icon">⭐</span>
          <span className="stat-value">{guide.rating || 0}</span>
          <span className="stat-label">Rating</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">👁️</span>
          <span className="stat-value">{guide.views || 0}</span>
          <span className="stat-label">Views</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{guide.duration || 'N/A'}</span>
          <span className="stat-label">Duration</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💰</span>
          <span className="stat-value">{guide.budget || 'N/A'}</span>
          <span className="stat-label">Budget</span>
        </div>
      </div>

      <div className="guide-content">
        <div className="guide-description-section">
          <h2>About This Guide</h2>
          <p className="guide-description">{guide.description}</p>
          <div className="guide-author-info">
            <span>Created by <strong>{guide.author || 'Anonymous'}</strong></span>
            {guide.createdAt && (
              <span className="guide-date">
                {new Date(guide.createdAt.seconds ? guide.createdAt.seconds * 1000 : guide.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {guide.attractions && guide.attractions.length > 0 && (
          <div className="guide-section">
            <h2>Must-See Attractions</h2>
            <div className="attractions-list">
              {guide.attractions.map((attraction, index) => (
                <div key={index} className="attraction-item">
                  <span className="attraction-number">{index + 1}</span>
                  <span className="attraction-name">{attraction}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {guide.tips && guide.tips.length > 0 && (
          <div className="guide-section">
            <h2>Travel Tips</h2>
            <div className="tips-list">
              {guide.tips.map((tip, index) => (
                <div key={index} className="tip-item">
                  <span className="tip-icon">💡</span>
                  <span className="tip-text">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="guide-cta">
          <h3>Ready to plan your trip?</h3>
          <p>Use this guide to search for flights and hotels</p>
          <button className="cta-button" onClick={handleUseGuide}>
            Start Planning
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
