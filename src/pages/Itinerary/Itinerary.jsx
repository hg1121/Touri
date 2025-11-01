import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { addDocument } from '../../firebase/firestore';
import './Itinerary.css';

const Itinerary = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selections, setSelections] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('selections');
    if (data) {
      const parsedData = JSON.parse(data);
      setSelections(parsedData);
      generateItinerary(parsedData);
    } else {
      navigate('/results');
    }
  }, [navigate]);

  const generateItinerary = (data) => {
    setTimeout(() => {
      const mockItinerary = {
        id: `ITN-${Date.now()}`,
        destination: data.searchData?.destination || data.searchData?.location || 'Destination',
        startDate: data.searchData?.departDate || data.searchData?.checkIn,
        endDate: data.searchData?.returnDate || data.searchData?.checkOut,
        flight: data.flight,
        hotel: data.hotel,
        dailyPlans: [
          {
            day: 1,
            title: 'Arrival & City Exploration',
            activities: [
              {
                time: '09:00 AM',
                activity: 'Arrival & Hotel Check-in',
                description: `Arrive at ${data.hotel.name}, check-in and freshen up`,
                type: 'accommodation'
              },
              {
                time: '11:00 AM',
                activity: 'Local Breakfast',
                description: 'Try authentic local cuisine at a nearby café',
                type: 'dining'
              },
              {
                time: '01:00 PM',
                activity: 'City Center Walking Tour',
                description: 'Explore the historic downtown area and main attractions',
                type: 'sightseeing'
              },
              {
                time: '06:00 PM',
                activity: 'Welcome Dinner',
                description: 'Dinner at a recommended local restaurant',
                type: 'dining'
              }
            ]
          },
          {
            day: 2,
            title: 'Cultural Immersion',
            activities: [
              {
                time: '08:00 AM',
                activity: 'Breakfast at Hotel',
                description: 'Enjoy breakfast included in your stay',
                type: 'dining'
              },
              {
                time: '09:30 AM',
                activity: 'Museum Visit',
                description: 'Visit the local art and history museum',
                type: 'sightseeing'
              },
              {
                time: '12:30 PM',
                activity: 'Lunch Break',
                description: 'Lunch at a popular local spot',
                type: 'dining'
              },
              {
                time: '02:00 PM',
                activity: 'Shopping District',
                description: 'Browse local markets and shops for souvenirs',
                type: 'activity'
              },
              {
                time: '07:00 PM',
                activity: 'Evening Entertainment',
                description: 'Local theater show or live music venue',
                type: 'activity'
              }
            ]
          },
          {
            day: 3,
            title: 'Departure Day',
            activities: [
              {
                time: '08:00 AM',
                activity: 'Breakfast & Check-out',
                description: 'Final breakfast and hotel check-out',
                type: 'accommodation'
              },
              {
                time: '10:00 AM',
                activity: 'Last-minute Sightseeing',
                description: 'Visit any remaining attractions on your list',
                type: 'sightseeing'
              },
              {
                time: '12:00 PM',
                activity: 'Lunch',
                description: 'Final meal before departure',
                type: 'dining'
              },
              {
                time: '02:00 PM',
                activity: 'Airport Transfer',
                description: `Depart for airport for ${data.flight.flightNumber} flight`,
                type: 'transport'
              }
            ]
          }
        ],
        totalCost: data.flight.price + (data.hotel.pricePerNight * 2),
        createdAt: new Date().toISOString()
      };

      setItinerary(mockItinerary);
      setLoading(false);
    }, 2000);
  };

  const handleSaveItinerary = async () => {
    if (!currentUser) {
      alert('Please sign in to save your itinerary');
      navigate('/auth');
      return;
    }

    setSaving(true);
    try {
      await addDocument('itineraries', {
        ...itinerary,
        userId: currentUser.uid,
        userEmail: currentUser.email
      });
      alert('Itinerary saved successfully!');
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Failed to save itinerary. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF download feature coming soon! This will generate a downloadable PDF of your itinerary.');
  };

  const getActivityIcon = (type) => {
    const icons = {
      accommodation: '🏨',
      dining: '🍽️',
      sightseeing: '🏛️',
      activity: '🎭',
      transport: '🚗'
    };
    return icons[type] || '📍';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Generating your personalized itinerary...</p>
      </div>
    );
  }

  return (
    <div className="itinerary-container">
      <div className="itinerary-header">
        <div className="header-content">
          <h1>Your Travel Itinerary</h1>
          <p className="destination">{itinerary.destination}</p>
          <p className="dates">
            {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="header-actions">
          <button className="action-button save" onClick={handleSaveItinerary} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Itinerary'}
          </button>
          <button className="action-button download" onClick={handleDownloadPDF}>
            📄 Download PDF
          </button>
        </div>
      </div>

      <div className="travel-summary">
        <div className="summary-card">
          <h3>Flight Details</h3>
          <div className="summary-details">
            <p><strong>{itinerary.flight.airline}</strong></p>
            <p>Flight: {itinerary.flight.flightNumber}</p>
            <p>Departure: {itinerary.flight.departure}</p>
            <p>Arrival: {itinerary.flight.arrival}</p>
            <p className="price">${itinerary.flight.price}</p>
          </div>
        </div>

        <div className="summary-card">
          <h3>Accommodation</h3>
          <div className="summary-details">
            <p><strong>{itinerary.hotel.name}</strong></p>
            <p>Rating: {'⭐'.repeat(itinerary.hotel.stars)} ({itinerary.hotel.rating}/5)</p>
            <p>{itinerary.hotel.distance}</p>
            <p className="price">${itinerary.hotel.pricePerNight} per night</p>
          </div>
        </div>

        <div className="summary-card total">
          <h3>Total Estimated Cost</h3>
          <p className="total-price">${itinerary.totalCost}</p>
          <p className="price-note">*Approximate cost for flights and accommodation</p>
        </div>
      </div>

      <div className="daily-itinerary">
        <h2>Daily Schedule</h2>
        
        {itinerary.dailyPlans.map((day) => (
          <div key={day.day} className="day-section">
            <div className="day-header">
              <h3>Day {day.day}</h3>
              <p className="day-title">{day.title}</p>
            </div>
            
            <div className="activities-timeline">
              {day.activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-time">
                    <span className="time-dot"></span>
                    <span className="time-text">{activity.time}</span>
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                      <h4>{activity.activity}</h4>
                    </div>
                    <p>{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="recommendations">
        <h2>Travel Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">💡</span>
            <h4>Best Time to Visit</h4>
            <p>Consider local weather and peak tourist seasons when planning activities</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🍴</span>
            <h4>Local Cuisine</h4>
            <p>Don't miss trying authentic local dishes and visiting popular food markets</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎫</span>
            <h4>Book in Advance</h4>
            <p>Popular attractions may require advance booking - check online</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🚌</span>
            <h4>Transportation</h4>
            <p>Research local public transport options or consider ride-sharing apps</p>
          </div>
        </div>
      </div>

      <div className="itinerary-footer">
        <button className="secondary-button" onClick={() => navigate('/search')}>
          Plan Another Trip
        </button>
      </div>
    </div>
  );
};

export default Itinerary;