import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDocuments, addDocument, queryDocuments } from '../../firebase/firestore';
import './Guides.css';

const Guides = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterDestination, setFilterDestination] = useState(location.state?.destination || '');

  const [newGuide, setNewGuide] = useState({
    title: '',
    destination: '',
    description: '',
    duration: '',
    budget: '',
    attractions: [''],
    tips: ['']
  });

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      // Try to load from Firestore, fallback to mock data
      try {
        const fetchedGuides = await getDocuments('guides');
        if (fetchedGuides && fetchedGuides.length > 0) {
          setGuides(fetchedGuides);
        } else {
          setGuides(getMockGuides());
        }
      } catch (error) {
        setGuides(getMockGuides());
      }
    } catch (error) {
      console.error('Error loading guides:', error);
      setGuides(getMockGuides());
    } finally {
      setLoading(false);
    }
  };

  const getMockGuides = () => [
    {
      id: '1',
      title: 'Paris in 3 Days - A Complete Guide',
      destination: 'Paris, France',
      author: 'Sarah Johnson',
      authorEmail: 'sarah@example.com',
      description: 'A comprehensive guide to exploring the City of Light in just three days. Perfect for first-time visitors.',
      duration: '3 days',
      budget: '$$$',
      rating: 4.9,
      views: 1250,
      likes: 89,
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River Cruise', 'Montmartre'],
      tips: [
        'Buy a Paris Pass for skip-the-line access',
        'Walk along the Seine at sunset',
        'Try local patisseries for authentic pastries'
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      category: 'European'
    },
    {
      id: '2',
      title: 'Tokyo Adventure: Culture & Technology',
      destination: 'Tokyo, Japan',
      author: 'Mike Chen',
      authorEmail: 'mike@example.com',
      description: 'Experience the perfect blend of traditional culture and modern innovation in Japan\'s capital.',
      duration: '5 days',
      budget: '$$$',
      rating: 4.8,
      views: 980,
      likes: 72,
      attractions: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Outer Market', 'TeamLab Borderless'],
      tips: [
        'Get a JR Pass for unlimited train travel',
        'Try sushi at a local conveyor belt restaurant',
        'Visit temples early to avoid crowds'
      ],
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      category: 'Asian'
    },
    {
      id: '3',
      title: 'Bali on a Budget',
      destination: 'Bali, Indonesia',
      author: 'Emma Wilson',
      authorEmail: 'emma@example.com',
      description: 'Discover the beauty of Bali without breaking the bank. Affordable luxury and authentic experiences.',
      duration: '7 days',
      budget: '$',
      rating: 4.7,
      views: 1560,
      likes: 124,
      attractions: ['Tanah Lot', 'Ubud Monkey Forest', 'Tegallalang Rice Terrace', 'Seminyak Beach'],
      tips: [
        'Rent a scooter for easy transportation',
        'Eat at local warungs for authentic food',
        'Visit rice terraces early morning for best photos'
      ],
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      category: 'Southeast Asian'
    },
    {
      id: '4',
      title: 'New York City Highlights',
      destination: 'New York, USA',
      author: 'David Kim',
      authorEmail: 'david@example.com',
      description: 'The essential guide to NYC - See all the iconic landmarks and hidden gems in one weekend.',
      duration: '2 days',
      budget: '$$$$',
      rating: 4.6,
      views: 890,
      likes: 56,
      attractions: ['Times Square', 'Central Park', 'Statue of Liberty', 'Brooklyn Bridge', 'Metropolitan Museum'],
      tips: [
        'Walk everywhere - it\'s the best way to explore',
        'Get a MetroCard for public transport',
        'Visit museums on free admission days'
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: 'North American'
    }
  ];

  const handleCreateGuide = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please sign in to create a guide');
      navigate('/auth');
      return;
    }

    try {
      const guideData = {
        ...newGuide,
        author: currentUser.displayName || 'Anonymous',
        authorEmail: currentUser.email,
        userId: currentUser.uid,
        rating: 0,
        views: 0,
        likes: 0,
        attractions: newGuide.attractions.filter(a => a.trim() !== ''),
        tips: newGuide.tips.filter(t => t.trim() !== '')
      };

      await addDocument('guides', guideData);
      alert('Guide created successfully!');
      setShowCreateForm(false);
      setNewGuide({
        title: '',
        destination: '',
        description: '',
        duration: '',
        budget: '',
        attractions: [''],
        tips: ['']
      });
      loadGuides();
    } catch (error) {
      console.error('Error creating guide:', error);
      alert('Failed to create guide. Please try again.');
    }
  };

  const handleAddField = (field) => {
    setNewGuide(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleFieldChange = (field, index, value) => {
    setNewGuide(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const filteredGuides = guides.filter(guide => {
    if (filterDestination) {
      return guide.destination.toLowerCase().includes(filterDestination.toLowerCase());
    }
    return true;
  });

  return (
    <div className="guides-container">
      <div className="guides-header">
        <div>
          <h1>Community Travel Guides</h1>
          <p>Explore guides created by fellow travelers and share your own experiences</p>
        </div>
        <button
          className="create-guide-btn"
          onClick={() => currentUser ? setShowCreateForm(true) : navigate('/auth')}
        >
          + Create Guide
        </button>
      </div>

      <div className="guides-filters">
        <input
          type="text"
          placeholder="Search by destination..."
          value={filterDestination}
          onChange={(e) => setFilterDestination(e.target.value)}
          className="filter-input"
        />
        <span className="results-count">{filteredGuides.length} guide(s) found</span>
      </div>

      {showCreateForm && (
        <div className="create-guide-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Your Travel Guide</h2>
              <button className="close-btn" onClick={() => setShowCreateForm(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateGuide} className="create-form">
              <div className="form-group">
                <label>Guide Title *</label>
                <input
                  type="text"
                  value={newGuide.title}
                  onChange={(e) => setNewGuide({...newGuide, title: e.target.value})}
                  placeholder="e.g., Paris in 3 Days"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Destination *</label>
                  <input
                    type="text"
                    value={newGuide.destination}
                    onChange={(e) => setNewGuide({...newGuide, destination: e.target.value})}
                    placeholder="e.g., Paris, France"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={newGuide.duration}
                    onChange={(e) => setNewGuide({...newGuide, duration: e.target.value})}
                    placeholder="e.g., 3 days"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Budget Level</label>
                <select
                  value={newGuide.budget}
                  onChange={(e) => setNewGuide({...newGuide, budget: e.target.value})}
                >
                  <option value="">Select budget</option>
                  <option value="$">$ - Budget</option>
                  <option value="$$">$$ - Moderate</option>
                  <option value="$$$">$$$ - Expensive</option>
                  <option value="$$$$">$$$$ - Luxury</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newGuide.description}
                  onChange={(e) => setNewGuide({...newGuide, description: e.target.value})}
                  placeholder="Describe your travel experience and what makes this guide special..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Must-See Attractions</label>
                {newGuide.attractions.map((attraction, index) => (
                  <input
                    key={index}
                    type="text"
                    value={attraction}
                    onChange={(e) => handleFieldChange('attractions', index, e.target.value)}
                    placeholder={`Attraction ${index + 1}`}
                    className="multi-input"
                  />
                ))}
                <button
                  type="button"
                  className="add-field-btn"
                  onClick={() => handleAddField('attractions')}
                >
                  + Add Attraction
                </button>
              </div>

              <div className="form-group">
                <label>Travel Tips</label>
                {newGuide.tips.map((tip, index) => (
                  <input
                    key={index}
                    type="text"
                    value={tip}
                    onChange={(e) => handleFieldChange('tips', index, e.target.value)}
                    placeholder={`Tip ${index + 1}`}
                    className="multi-input"
                  />
                ))}
                <button
                  type="button"
                  className="add-field-btn"
                  onClick={() => handleAddField('tips')}
                >
                  + Add Tip
                </button>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-message">Loading guides...</div>
      ) : filteredGuides.length > 0 ? (
        <div className="guides-grid">
          {filteredGuides.map(guide => (
            <div
              key={guide.id}
              className="guide-card"
              onClick={() => navigate(`/guides/${guide.id}`, { state: { guide } })}
            >
              <div className="guide-card-header">
                <h3>{guide.title}</h3>
                <div className="guide-rating">
                  <span className="stars">{'⭐'.repeat(Math.floor(guide.rating))}</span>
                  <span className="rating-text">{guide.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="guide-destination">
                <span className="location-icon">📍</span>
                {guide.destination}
              </div>

              <p className="guide-description">{guide.description}</p>

              <div className="guide-meta">
                <span className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  {guide.duration}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">💰</span>
                  {guide.budget}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">👁️</span>
                  {guide.views} views
                </span>
              </div>

              <div className="guide-attractions">
                <strong>Highlights:</strong>
                <div className="attractions-tags">
                  {guide.attractions.slice(0, 3).map((attraction, idx) => (
                    <span key={idx} className="attraction-tag">{attraction}</span>
                  ))}
                  {guide.attractions.length > 3 && (
                    <span className="attraction-tag">+{guide.attractions.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="guide-footer">
                <span className="guide-author">By {guide.author}</span>
                <span className="guide-likes">❤️ {guide.likes}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-guides">
          <p>No guides found. Be the first to create one!</p>
          <button onClick={() => setShowCreateForm(true)}>Create Guide</button>
        </div>
      )}
    </div>
  );
};

export default Guides;
