import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await api.get('/users/me');
        setUser(res.data.user);

        // Mock stats data
        setStats({
          totalBookings: Math.floor(Math.random() * 20) + 5,
          upcomingEvents: Math.floor(Math.random() * 10) + 2,
          unreadMessages: Math.floor(Math.random() * 15)
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!user) {
    return <div className="dashboard-error">Please log in to view your dashboard</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.name}!</h1>
          <p>Ready to connect with amazing companions today?</p>
        </div>
        <div className="user-avatar">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
            alt={user.name} 
          />
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>{stats.upcomingEvents}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>{stats.unreadMessages}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="action-card">
          <h3>Find Companions</h3>
          <p>Discover and connect with companions for your next adventure</p>
          <Link to="/companions" className="btn btn-primary">Browse Companions</Link>
        </div>
        <div className="action-card">
          <h3>Create Booking</h3>
          <p>Schedule your next outing with a perfect companion</p>
          <Link to="/create-booking" className="btn btn-secondary">Book Now</Link>
        </div>
        <div className="action-card">
          <h3>My Bookings</h3>
          <p>View and manage your upcoming and past bookings</p>
          <Link to="/bookings" className="btn btn-secondary">View Bookings</Link>
        </div>
        <div className="action-card">
          <h3>Messages</h3>
          <p>Chat with your companions and stay connected</p>
          <Link to="/chat" className="btn btn-secondary">Open Chat</Link>
        </div>
      </div>

      <div className="dashboard-tips">
        <h2>Pro Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">⭐</div>
            <h4>Complete Your Profile</h4>
            <p>A complete profile increases your chances of finding the perfect match by 70%.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📸</div>
            <h4>Add Photos</h4>
            <p>Profiles with photos receive 3x more views and responses.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">💬</div>
            <h4>Be Responsive</h4>
            <p>Respond to messages within 24 hours to build trust with companions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;