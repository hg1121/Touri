import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { addDocument } from '../../firebase/firestore';
import jsPDF from 'jspdf';
import './Itinerary.css';

const Itinerary = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('selections');
    if (data) {
      const parsedData = JSON.parse(data);
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
    if (!itinerary) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with line wrapping
    const addText = (text, x, y, maxWidth, fontSize = 10, style = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', style);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.5) + 5;
    };

    // Helper function to check if we need a new page
    const checkNewPage = (currentY, requiredSpace = 30) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        doc.addPage();
        return margin;
      }
      return currentY;
    };

    // Title
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Travel Itinerary', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(itinerary.destination, pageWidth / 2, 32, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 50;

    // Dates
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const dateText = `${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}`;
    yPosition = addText(dateText, pageWidth / 2, yPosition, pageWidth - 2 * margin, 11, 'normal');
    doc.text(dateText, pageWidth / 2, yPosition - 5, { align: 'center' });
    yPosition += 5;

    // Flight Details Section
    yPosition = checkNewPage(yPosition, 40);
    doc.setFillColor(52, 152, 219);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Flight Details', margin + 5, yPosition + 6);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(`Airline: ${itinerary.flight.airline}`, margin + 5, yPosition, pageWidth - 2 * margin, 10, 'bold');
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Flight Number: ${itinerary.flight.flightNumber}`, margin + 5, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Departure: ${itinerary.flight.departure}`, margin + 5, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Arrival: ${itinerary.flight.arrival}`, margin + 5, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Duration: ${itinerary.flight.duration}`, margin + 5, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Price: $${itinerary.flight.price}`, margin + 5, yPosition, pageWidth - 2 * margin);
    yPosition += 10;

    // Hotel Details Section
    yPosition = checkNewPage(yPosition, 40);
    doc.setFillColor(52, 152, 219);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Accommodation', margin + 5, yPosition + 6);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(`Hotel: ${itinerary.hotel.name}`, margin + 5, yPosition, pageWidth - 2 * margin, 10, 'bold');
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Rating: ${'★'.repeat(itinerary.hotel.stars)} (${itinerary.hotel.rating}/5)`, margin + 5, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Location: ${itinerary.hotel.distance}`, margin + 5, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Price per night: $${itinerary.hotel.pricePerNight}`, margin + 5, yPosition, pageWidth - 2 * margin);
    yPosition += 10;

    // Total Cost
    yPosition = checkNewPage(yPosition, 20);
    doc.setFillColor(46, 204, 113);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Estimated Cost: $${itinerary.totalCost}`, margin + 5, yPosition + 6);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    // Daily Itinerary
    itinerary.dailyPlans.forEach((day) => {
      yPosition = checkNewPage(yPosition, 50);

      // Day Header
      doc.setFillColor(231, 76, 60);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${day.day}: ${day.title}`, margin + 5, yPosition + 6);
      doc.setTextColor(0, 0, 0);
      yPosition += 15;

      // Activities
      day.activities.forEach((activity) => {
        yPosition = checkNewPage(yPosition, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${activity.time}`, margin + 5, yPosition);
        doc.setFont('helvetica', 'bold');
        yPosition = addText(activity.activity, margin + 30, yPosition, pageWidth - 2 * margin - 30, 10, 'bold');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        yPosition = addText(activity.description, margin + 30, yPosition, pageWidth - 2 * margin - 30, 9);
        yPosition += 3;
      });

      yPosition += 5;
    });

    // Travel Tips Section
    yPosition = checkNewPage(yPosition, 40);
    doc.setFillColor(155, 89, 182);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Travel Tips', margin + 5, yPosition + 6);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    const tips = [
      'Consider local weather and peak tourist seasons when planning activities',
      'Don\'t miss trying authentic local dishes and visiting popular food markets',
      'Popular attractions may require advance booking - check online',
      'Research local public transport options or consider ride-sharing apps'
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    tips.forEach((tip) => {
      yPosition = checkNewPage(yPosition, 15);
      const bulletPoint = `• ${tip}`;
      yPosition = addText(bulletPoint, margin + 5, yPosition, pageWidth - 2 * margin, 10);
    });

    // Footer
    yPosition = checkNewPage(yPosition, 20);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by Touri - Your Travel Planning Companion', pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 5, { align: 'center' });

    // Save the PDF
    const fileName = `${itinerary.destination.replace(/[^a-z0-9]/gi, '_')}_Itinerary.pdf`;
    doc.save(fileName);
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