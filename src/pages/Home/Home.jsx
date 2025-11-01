import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Plan Your Perfect Journey</h1>
          <p className="hero-subtitle">
            Search flights and hotels, then let AI create your personalized travel itinerary
          </p>
          <button 
            className="hero-button"
            onClick={() => navigate('/search')}
          >
            Start Planning
          </button>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">🌍</div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="features-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Search & Compare</h3>
            <p>Search for flights and hotels with custom filters. Compare top results sorted by your preferences.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Select Options</h3>
            <p>Choose your preferred flight and hotel from the top 3-5 results without any booking commitment.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Planning</h3>
            <p>Get a personalized daily itinerary with activities, dining, and sightseeing suggestions.</p>
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
        <button 
          className="cta-button"
          onClick={() => navigate('/search')}
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;