import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text-nav">CH</span>
          </Link>
          
          <nav className="nav">
            <ul className="nav-list">
              <li>
                <Link to="/" className="nav-link">Home</Link>
              </li>
              
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/bookings" className="nav-link">Bookings</Link>
                  </li>
                  <li>
                    <Link to="/bookings/create" className="nav-link">Create Booking</Link>
                  </li>
                  <li>
                    <Link to="/chat" className="nav-link">Chat</Link>
                  </li>
                  <li>
                    <Link to="/profile" className="nav-link">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="nav-link btn-logout">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;