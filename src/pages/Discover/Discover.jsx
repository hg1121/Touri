import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Discover.css';

const Discover = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const popularDestinations = [
    {
      id: '1',
      name: 'Paris, France',
      image: '🗼',
      description: 'The City of Light - Romantic architecture, world-class museums, and exquisite cuisine',
      category: 'European',
      rating: 4.8,
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River'],
      bestTime: 'April - October',
      avgCost: '$$$'
    },
    {
      id: '2',
      name: 'Tokyo, Japan',
      image: '🌸',
      description: 'Where tradition meets innovation - Ancient temples alongside futuristic technology',
      category: 'Asian',
      rating: 4.9,
      attractions: ['Shibuya Crossing', 'Tokyo Skytree', 'Senso-ji Temple', 'Tsukiji Market'],
      bestTime: 'March - May, September - November',
      avgCost: '$$$'
    },
    {
      id: '3',
      name: 'New York, USA',
      image: '🗽',
      description: 'The city that never sleeps - Iconic landmarks and endless entertainment',
      category: 'North American',
      rating: 4.7,
      attractions: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
      bestTime: 'April - June, September - November',
      avgCost: '$$$$'
    },
    {
      id: '4',
      name: 'Bali, Indonesia',
      image: '🏝️',
      description: 'Tropical paradise - Beautiful beaches, ancient temples, and lush rice terraces',
      category: 'Southeast Asian',
      rating: 4.8,
      attractions: ['Tanah Lot Temple', 'Ubud Monkey Forest', 'Tegallalang Rice Terrace', 'Seminyak Beach'],
      bestTime: 'April - October',
      avgCost: '$'
    },
    {
      id: '5',
      name: 'Santorini, Greece',
      image: '🌅',
      description: 'Stunning sunsets and white-washed buildings overlooking the Aegean Sea',
      category: 'European',
      rating: 4.9,
      attractions: ['Oia Village', 'Red Beach', 'Ancient Thera', 'Wine Tasting Tours'],
      bestTime: 'May - September',
      avgCost: '$$$'
    },
    {
      id: '6',
      name: 'Iceland',
      image: '🧊',
      description: 'Land of fire and ice - Geysers, glaciers, and the Northern Lights',
      category: 'European',
      rating: 4.8,
      attractions: ['Blue Lagoon', 'Golden Circle', 'Northern Lights', 'Jökulsárlón Glacier'],
      bestTime: 'June - August, September - March (Northern Lights)',
      avgCost: '$$$'
    },
    {
      id: '7',
      name: 'Dubai, UAE',
      image: '🏜️',
      description: 'Luxury and innovation in the desert - Skyscrapers, shopping, and adventure',
      category: 'Middle Eastern',
      rating: 4.6,
      attractions: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
      bestTime: 'November - March',
      avgCost: '$$$'
    },
    {
      id: '8',
      name: 'Sydney, Australia',
      image: '🇦🇺',
      description: 'Harbor city with iconic Opera House and world-famous beaches',
      category: 'Australian',
      rating: 4.7,
      attractions: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'Royal Botanic Gardens'],
      bestTime: 'September - November, March - May',
      avgCost: '$$$'
    }
  ];

  const categories = ['All', 'European', 'Asian', 'North American', 'Southeast Asian', 'Middle Eastern', 'Australian'];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDestinations = popularDestinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExploreDestination = (destination) => {
    navigate('/search', { state: { destination: destination.name } });
  };

  const handleViewGuides = (destination) => {
    navigate('/guides', { state: { destination: destination.name } });
  };

  return (
    <div className="discover-container">
      <div className="discover-header">
        <h1>Discover Amazing Destinations</h1>
        <p>Explore popular travel destinations and get inspired for your next adventure</p>
      </div>

      <div className="discover-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="destinations-grid">
        {filteredDestinations.map(destination => (
          <div key={destination.id} className="destination-card">
            <div className="destination-header">
              <div className="destination-icon">{destination.image}</div>
              <div className="destination-rating">
                <span className="stars">{'⭐'.repeat(Math.floor(destination.rating))}</span>
                <span className="rating-number">{destination.rating}</span>
              </div>
            </div>
            
            <div className="destination-content">
              <h3>{destination.name}</h3>
              <p className="destination-description">{destination.description}</p>
              
              <div className="destination-meta">
                <span className="meta-tag">{destination.category}</span>
                <span className="meta-tag">{destination.avgCost}</span>
              </div>

              <div className="destination-attractions">
                <strong>Must See:</strong>
                <ul>
                  {destination.attractions.slice(0, 3).map((attraction, idx) => (
                    <li key={idx}>{attraction}</li>
                  ))}
                </ul>
              </div>

              <div className="destination-timing">
                <span className="timing-icon">📅</span>
                <span>Best Time: {destination.bestTime}</span>
              </div>
            </div>

            <div className="destination-actions">
              <button
                className="action-btn primary"
                onClick={() => handleExploreDestination(destination)}
              >
                Plan Trip
              </button>
              <button
                className="action-btn secondary"
                onClick={() => handleViewGuides(destination)}
              >
                View Guides
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="no-results">
          <p>No destinations found matching your criteria.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Discover;
