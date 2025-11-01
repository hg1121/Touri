import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const popularGuides = [
    {
      id: '1',
      title: 'Paris in 3 Days - A Complete Guide',
      destination: 'Paris, France',
      author: 'Sarah Johnson',
      rating: 4.9,
      views: 1250,
      likes: 89
    },
    {
      id: '2',
      title: 'Tokyo Adventure: Culture & Technology',
      destination: 'Tokyo, Japan',
      author: 'Mike Chen',
      rating: 4.8,
      views: 980,
      likes: 72
    },
    {
      id: '3',
      title: 'Bali on a Budget',
      destination: 'Bali, Indonesia',
      author: 'Emma Wilson',
      rating: 4.7,
      views: 1560,
      likes: 124
    }
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Plan Your Perfect Journey</h1>
          <p className="hero-subtitle">
            Discover destinations, explore community-created tour guides, and generate personalized itineraries using AI
          </p>
          <div className="hero-buttons">
            <button 
              className="hero-button"
              onClick={() => navigate('/search')}
            >
              Start Planning
            </button>
            <button 
              className="hero-button secondary"
              onClick={() => navigate('/discover')}
            >
              Discover Destinations
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">🌍</div>
        </div>
      </section>

      <section className="popular-guides-section">
        <div className="section-header">
          <h2 className="section-title">Popular Community Guides</h2>
          <button className="view-all-btn" onClick={() => navigate('/guides')}>
            View All Guides →
          </button>
        </div>
        <div className="guides-preview-grid">
          {popularGuides.map(guide => (
            <div
              key={guide.id}
              className="guide-preview-card"
              onClick={() => navigate(`/guides/${guide.id}`)}
            >
              <div className="guide-preview-header">
                <h3>{guide.title}</h3>
                <div className="guide-preview-rating">
                  <span className="stars">{'⭐'.repeat(Math.floor(guide.rating))}</span>
                  <span>{guide.rating}</span>
                </div>
              </div>
              <div className="guide-preview-location">
                <span>📍</span>
                <span>{guide.destination}</span>
              </div>
              <div className="guide-preview-footer">
                <span>By {guide.author}</span>
                <span>❤️ {guide.likes} • 👁️ {guide.views}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2 className="features-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Discover Destinations</h3>
            <p>Browse popular destinations, explore travel guides, and get inspired for your next adventure.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community Guides</h3>
            <p>Explore guides created by fellow travelers or create and share your own travel experiences.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Search & Compare</h3>
            <p>Search for flights and hotels with custom filters. Compare top results sorted by your preferences.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Planning</h3>
            <p>Get a personalized daily itinerary with activities, dining, and sightseeing suggestions.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Share Experiences</h3>
            <p>Share your travel experiences after your trip to help other travelers plan their journeys.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Download & Go</h3>
            <p>Export your complete travel plan as a PDF for offline access during your trip.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to explore?</h2>
        <p>Start planning your next adventure today</p>
        <div className="cta-buttons">
          <button 
            className="cta-button"
            onClick={() => navigate('/search')}
          >
            Plan a Trip
          </button>
          <button 
            className="cta-button secondary"
            onClick={() => navigate('/guides')}
          >
            Browse Guides
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;