import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBookings = async (page = 1) => {
      try {
        const res = await api.get(`/bookings?page=${page}&limit=5`);
        setBookings(res.data.bookings);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings(currentPage);
  }, [currentPage]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div className="bookings-loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Manage your upcoming and past bookings</p>
        <Link to="/create-booking" className="btn btn-primary">Create New Booking</Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bookings-empty">
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet.</p>
          <Link to="/create-booking" className="btn btn-primary">Book Your First Companion</Link>
        </div>
      ) : (
        <>
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <h3>{booking.eventType}</h3>
                    <p className="booking-date">
                      {new Date(booking.dateTime).toLocaleDateString()} at 
                      {new Date(booking.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div className={`booking-status ${getStatusClass(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
                
                <div className="booking-details">
                  <div className="companion-info">
                    <img 
                      src={booking.companionId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.companionId?.name || 'Companion')}&background=random`} 
                      alt={booking.companionId?.name || 'Companion'} 
                    />
                    <div>
                      <h4>{booking.companionId?.name || 'Unknown Companion'}</h4>
                      <p>{booking.companionId?.bio?.substring(0, 60) || 'No bio available'}...</p>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <Link to={`/chat/${booking.companionId?._id}`} className="btn btn-secondary">
                      Message
                    </Link>
                    <button className="btn btn-outline">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bookings;