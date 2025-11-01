import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';


import Navbar from './components/Navbar/Navbar';
import Search from './components/Search/Search';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Auth from './components/Auth';


import Home from './pages/Home/Home';
import Results from './pages/Results/Results';
import Itinerary from './pages/Itinerary/Itinerary';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/search" element={<Search />} />
            <Route path="/results" element={<Results />} />
            <Route 
              path="/itinerary" 
              element={
                <ProtectedRoute>
                  <Itinerary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


