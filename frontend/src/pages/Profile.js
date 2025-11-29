import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    interests: '',
    location: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || '',
          email: res.data.user.email || '',
          bio: res.data.user.bio || '',
          interests: (res.data.user.interests || []).join(', '),
          location: res.data.user.location || ''
        });
        setAvatar(res.data.user.avatar || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        ...formData,
        interests: formData.interests.split(',').map(item => item.trim()).filter(item => item)
      };

      const res = await api.put('/users/me', updateData);
      setUser(res.data.user);
      setMessage('Profile updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile: ' + (err.response?.data?.msg || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your personal information and preferences</p>
      </div>

      {message && (
        <div className={`profile-message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="avatar-section">
            <div className="avatar-preview">
              <img 
                src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`} 
                alt="Profile" 
              />
            </div>
            <label className="avatar-upload-btn">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              Change Photo
            </label>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">⭐ 4.8</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">24</span>
              <span className="stat-label">Bookings</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">98%</span>
              <span className="stat-label">Response Rate</span>
            </div>
          </div>
        </div>

        <div className="profile-form-section">
          <form onSubmit={onSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={onChange}
                placeholder="City, Country"
              />
            </div>

            <div className="form-group">
              <label htmlFor="interests">Interests (comma separated)</label>
              <input
                type="text"
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={onChange}
                placeholder="Travel, Music, Food, Sports"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={onChange}
                rows="4"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;