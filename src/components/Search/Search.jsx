import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchType, setSearchType] = useState('flight');
  const [loading, setLoading] = useState(false);

  const [flightSearch, setFlightSearch] = useState({
    origin: '',
    destination: location.state?.destination || '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    sortBy: 'price'
  });

  const [hotelSearch, setHotelSearch] = useState({
    location: location.state?.destination || '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    sortBy: 'price'
  });

  useEffect(() => {
    if (location.state?.destination) {
      // If destination is provided, suggest hotel search
      if (!location.state.destination.includes(',')) {
        setSearchType('hotel');
      }
    }
  }, [location.state]);

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setFlightSearch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelSearch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const searchData = {
        type: searchType,
        ...(searchType === 'flight' ? flightSearch : hotelSearch)
      };
      
      sessionStorage.setItem('searchData', JSON.stringify(searchData));
      
      setLoading(false);
      navigate('/results');
    }, 1000);
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Search Your Travel Options</h1>
        <p>Find the perfect flights and hotels for your journey</p>
      </div>

      <div className="search-tabs">
        <button
          className={`tab-button ${searchType === 'flight' ? 'active' : ''}`}
          onClick={() => setSearchType('flight')}
        >
          ✈️ Flights
        </button>
        <button
          className={`tab-button ${searchType === 'hotel' ? 'active' : ''}`}
          onClick={() => setSearchType('hotel')}
        >
          🏨 Hotels
        </button>
      </div>

      <div className="search-form-container">
        {searchType === 'flight' ? (
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label>Origin</label>
                <input
                  type="text"
                  name="origin"
                  value={flightSearch.origin}
                  onChange={handleFlightChange}
                  placeholder="e.g., Boston (BOS)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={flightSearch.destination}
                  onChange={handleFlightChange}
                  placeholder="e.g., New York (JFK)"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  name="departDate"
                  value={flightSearch.departDate}
                  onChange={handleFlightChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Return Date</label>
                <input
                  type="date"
                  name="returnDate"
                  value={flightSearch.returnDate}
                  onChange={handleFlightChange}
                  min={flightSearch.departDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Passengers</label>
                <input
                  type="number"
                  name="passengers"
                  value={flightSearch.passengers}
                  onChange={handleFlightChange}
                  min="1"
                  max="9"
                  required
                />
              </div>
              <div className="form-group">
                <label>Sort By</label>
                <select
                  name="sortBy"
                  value={flightSearch.sortBy}
                  onChange={handleFlightChange}
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="duration">Duration (Shortest)</option>
                  <option value="stops">Stops (Fewest)</option>
                  <option value="departure">Departure Time</option>
                </select>
              </div>
            </div>

            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group full-width">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={hotelSearch.location}
                  onChange={handleHotelChange}
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={hotelSearch.checkIn}
                  onChange={handleHotelChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={hotelSearch.checkOut}
                  onChange={handleHotelChange}
                  min={hotelSearch.checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={hotelSearch.guests}
                  onChange={handleHotelChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
              <div className="form-group">
                <label>Rooms</label>
                <input
                  type="number"
                  name="rooms"
                  value={hotelSearch.rooms}
                  onChange={handleHotelChange}
                  min="1"
                  max="5"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Sort By</label>
                <select
                  name="sortBy"
                  value={hotelSearch.sortBy}
                  onChange={handleHotelChange}
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="distance">Distance from Center</option>
                </select>
              </div>
            </div>

            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search Hotels'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Search;