import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateBooking.css';

const CreateBooking = () => {
  const [companions, setCompanions] = useState([]);
  const [formData, setFormData] = useState({
    companionId: '',
    dateTime: '',
    duration: '2',
    eventType: 'general',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const res = await api.get('/users/companions');
        setCompanions(res.data.users);
      } catch (err) {
        console.error('Error fetching companions:', err);
        setError('Failed to load companions');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanions();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/bookings', formData);
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="booking-loading">Loading companions...</div>;
  }

  return (
    <div className="create-booking">
      <div className="booking-header">
        <h1>Create New Booking</h1>
        <p>Find the perfect companion for your event</p>
      </div>

      {error && <div className="booking-error">{error}</div>}

      <div className="booking-form-container">
        <form onSubmit={onSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="companionId">Select Companion</label>
            <select
              id="companionId"
              name="companionId"
              value={formData.companionId}
              onChange={onChange}
              required
            >
              <option value="">Choose a companion</option>
              {companions.map((companion) => (
                <option key={companion._id} value={companion._id}>
                  {companion.name} - {companion.bio?.substring(0, 50) || 'No bio'}...
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateTime">Date & Time</label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (hours)</label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={onChange}
                required
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="5">5 hours</option>
                <option value="6">6 hours</option>
                <option value="8">8 hours</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={onChange}
              required
            >
              <option value="general">General Outing</option>
              <option value="travel">Travel Companion</option>
              <option value="dining">Dining Experience</option>
              <option value="event">Event Attendance</option>
              <option value="shopping">Shopping</option>
              <option value="business">Business Meeting</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onChange}
              rows="4"
              placeholder="Any special requests or details about your booking..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? 'Creating Booking...' : 'Create Booking'}
          </button>
        </form>

        <div className="booking-preview">
          <h3>Booking Preview</h3>
          <div className="preview-card">
            <div className="preview-header">
              <h4>{formData.eventType ? formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1) : 'Event Type'}</h4>
              <div className="preview-duration">{formData.duration} hours</div>
            </div>
            
            {formData.dateTime && (
              <div className="preview-date">
                {new Date(formData.dateTime).toLocaleDateString()} at 
                {new Date(formData.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            )}
            
            {formData.companionId && (
              <div className="preview-companion">
                <img 
                  src={companions.find(c => c._id === formData.companionId)?.avatar || 
                       `https://ui-avatars.com/api/?name=${encodeURIComponent(companions.find(c => c._id === formData.companionId)?.name || 'Companion')}&background=random`} 
                  alt="Companion" 
                />
                <div>
                  <h5>{companions.find(c => c._id === formData.companionId)?.name || 'Selected Companion'}</h5>
                  <p>{companions.find(c => c._id === formData.companionId)?.bio?.substring(0, 60) || 'Companion bio'}...</p>
                </div>
              </div>
            )}
            
            <div className="preview-price">
              <span>Estimated Price:</span>
              <span className="price">${formData.duration ? formData.duration * 25 : 0}</span>
            </div>
          </div>
          
          <div className="booking-tips">
            <h4>Booking Tips</h4>
            <ul>
              <li>Book at least 24 hours in advance for better availability</li>
              <li>Include specific details in notes for personalized service</li>
              <li>Check companion's availability before finalizing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;