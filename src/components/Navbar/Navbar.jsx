import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signOutUser } from '../../firebase/auth';
import './Navbar.css';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✈️</span>
          Touri
        </Link>
        
        <button 
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/search" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Search
            </Link>
          </li>
          
          {currentUser ? (
            <>
              <li className="navbar-item">
                <Link to="/itinerary" className="navbar-link" onClick={() => setMenuOpen(false)}>
                  My Itinerary
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleSignOut} className="navbar-button">
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li className="navbar-item">
              <Link to="/auth" className="navbar-button-link" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;