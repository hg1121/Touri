import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockFlights = [
    {
      id: 'FL001',
      airline: 'Delta Airlines',
      flightNumber: 'DL 1234',
      departure: '08:00 AM',
      arrival: '10:30 AM',
      duration: '2h 30m',
      stops: 0,
      price: 245,
      aircraft: 'Boeing 737'
    },
    {
      id: 'FL002',
      airline: 'American Airlines',
      flightNumber: 'AA 5678',
      departure: '10:15 AM',
      arrival: '01:00 PM',
      duration: '2h 45m',
      stops: 0,
      price: 198,
      aircraft: 'Airbus A320'
    },
    {
      id: 'FL003',
      airline: 'JetBlue',
      flightNumber: 'B6 9012',
      departure: '02:30 PM',
      arrival: '05:15 PM',
      duration: '2h 45m',
      stops: 0,
      price: 215,
      aircraft: 'Airbus A321'
    },
    {
      id: 'FL004',
      airline: 'United Airlines',
      flightNumber: 'UA 3456',
      departure: '06:00 PM',
      arrival: '10:45 PM',
      duration: '4h 45m',
      stops: 1,
      price: 175,
      aircraft: 'Boeing 737'
    },
    {
      id: 'FL005',
      airline: 'Southwest',
      flightNumber: 'WN 7890',
      departure: '07:30 AM',
      arrival: '10:00 AM',
      duration: '2h 30m',
      stops: 0,
      price: 230,
      aircraft: 'Boeing 737 MAX'
    }
  ];

  const mockHotels = [
    {
      id: 'HT001',
      name: 'Grand Plaza Hotel',
      rating: 4.5,
      stars: 4,
      distance: '0.5 miles from center',
      pricePerNight: 189,
      amenities: ['Free WiFi', 'Pool', 'Gym', 'Breakfast'],
      image: '🏨'
    },
    {
      id: 'HT002',
      name: 'City Center Inn',
      rating: 4.2,
      stars: 3,
      distance: '0.8 miles from center',
      pricePerNight: 125,
      amenities: ['Free WiFi', 'Parking', 'Breakfast'],
      image: '🏨'
    },
    {
      id: 'HT003',
      name: 'Luxury Suites Downtown',
      rating: 4.8,
      stars: 5,
      distance: '0.3 miles from center',
      pricePerNight: 299,
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
      image: '🏨'
    },
    {
      id: 'HT004',
      name: 'Budget Stay Express',
      rating: 3.9,
      stars: 2,
      distance: '2.1 miles from center',
      pricePerNight: 89,
      amenities: ['Free WiFi', 'Parking'],
      image: '🏨'
    },
    {
      id: 'HT005',
      name: 'Boutique Hotel Central',
      rating: 4.6,
      stars: 4,
      distance: '0.6 miles from center',
      pricePerNight: 210,
      amenities: ['Free WiFi', 'Gym', 'Restaurant', 'Room Service'],
      image: '🏨'
    }
  ];

  useEffect(() => {
    const data = sessionStorage.getItem('searchData');
    if (data) {
      setSearchData(JSON.parse(data));
      setLoading(false);
    } else {
      navigate('/search');
    }
  }, [navigate]);

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleGenerateItinerary = () => {
    if (selectedFlight && selectedHotel) {
      const selections = {
        flight: selectedFlight,
        hotel: selectedHotel,
        searchData: searchData
      };
      sessionStorage.setItem('selections', JSON.stringify(selections));
      navigate('/itinerary');
    } else {
      alert('Please select both a flight and a hotel to generate your itinerary.');
    }
  };

  if (loading) {
    return <div className="loading-container">Loading results...</div>;
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Search Results</h1>
        <button 
          className="new-search-button"
          onClick={() => navigate('/search')}
        >
          New Search
        </button>
      </div>

      <div className="results-content">
        <section className="results-section">
          <h2>Available Flights</h2>
          <p className="results-subtitle">
            Showing top {mockFlights.length} results for {searchData?.origin || 'Origin'} → {searchData?.destination || 'Destination'}
          </p>
          
          <div className="results-list">
            {mockFlights.slice(0, 5).map(flight => (
              <div 
                key={flight.id} 
                className={`result-card ${selectedFlight?.id === flight.id ? 'selected' : ''}`}
                onClick={() => handleSelectFlight(flight)}
              >
                <div className="result-card-header">
                  <h3>{flight.airline}</h3>
                  <span className="flight-number">{flight.flightNumber}</span>
                </div>
                
                <div className="result-card-body">
                  <div className="flight-details">
                    <div className="flight-time">
                      <span className="time">{flight.departure}</span>
                      <span className="label">Departure</span>
                    </div>
                    <div className="flight-info">
                      <span className="duration">{flight.duration}</span>
                      <div className="flight-line">
                        <div className="line"></div>
                        <span className="plane-icon">✈️</span>
                      </div>
                      <span className="stops">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}</span>
                    </div>
                    <div className="flight-time">
                      <span className="time">{flight.arrival}</span>
                      <span className="label">Arrival</span>
                    </div>
                  </div>
                  
                  <div className="result-footer">
                    <span className="aircraft">{flight.aircraft}</span>
                    <span className="price">${flight.price}</span>
                  </div>
                </div>
                
                {selectedFlight?.id === flight.id && (
                  <div className="selected-badge">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="results-section">
          <h2>Available Hotels</h2>
          <p className="results-subtitle">
            Showing top {mockHotels.length} results in {searchData?.location || searchData?.destination || 'Location'}
          </p>
          
          <div className="results-list">
            {mockHotels.slice(0, 5).map(hotel => (
              <div 
                key={hotel.id} 
                className={`result-card ${selectedHotel?.id === hotel.id ? 'selected' : ''}`}
                onClick={() => handleSelectHotel(hotel)}
              >
                <div className="result-card-header">
                  <div>
                    <h3>{hotel.name}</h3>
                    <div className="hotel-rating">
                      <span className="stars">{'⭐'.repeat(hotel.stars)}</span>
                      <span className="rating-score">{hotel.rating}/5</span>
                    </div>
                  </div>
                  <span className="hotel-icon">{hotel.image}</span>
                </div>
                
                <div className="result-card-body">
                  <div className="hotel-details">
                    <p className="distance">📍 {hotel.distance}</p>
                    <div className="amenities">
                      {hotel.amenities.map((amenity, index) => (
                        <span key={index} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="result-footer">
                    <span className="price-label">Per night</span>
                    <span className="price">${hotel.pricePerNight}</span>
                  </div>
                </div>
                
                {selectedHotel?.id === hotel.id && (
                  <div className="selected-badge">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="generate-section">
        <div className="selection-summary">
          <div className="summary-item">
            <span className="summary-label">Selected Flight:</span>
            <span className="summary-value">
              {selectedFlight ? `${selectedFlight.airline} - $${selectedFlight.price}` : 'None'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Selected Hotel:</span>
            <span className="summary-value">
              {selectedHotel ? `${selectedHotel.name} - $${selectedHotel.pricePerNight}/night` : 'None'}
            </span>
          </div>
        </div>
        
        <button 
          className="generate-button"
          onClick={handleGenerateItinerary}
          disabled={!selectedFlight || !selectedHotel}
        >
          Generate My Itinerary 🤖
        </button>
      </div>
    </div>
  );
};

export default Results;