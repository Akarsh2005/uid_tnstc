import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Initialize user data from localStorage or default
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const defaultUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      joined: '2025-01-01',
    };
    const initialUser = storedUser || defaultUser;
    setUser(initialUser);
    setFormData({
      name: initialUser.name,
      email: initialUser.email,
      phone: initialUser.phone,
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setMessage('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleSave = () => {
    if (validateForm()) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3s
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setErrors({});
    setIsEditing(false);
    setMessage('');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h2 className="profile-title">My Profile</h2>
          <button
            className="profile-home-button"
            onClick={() => navigate('/home')}
            aria-label="Back to Home"
          >
            Back to Home
          </button>
        </div>
        <div className="profile-details">
          <h3 className="profile-section-title">Personal Information</h3>
          {message && (
            <div className="profile-message success">{message}</div>
          )}
          <div className="profile-info">
            {isEditing ? (
              <>
                <div className="profile-field">
                  <label className="profile-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`profile-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <span className="profile-error">{errors.name}</span>}
                </div>
                <div className="profile-field">
                  <label className="profile-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`profile-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="profile-error">{errors.email}</span>}
                </div>
                <div className="profile-field">
                  <label className="profile-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`profile-input ${errors.phone ? 'error' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <span className="profile-error">{errors.phone}</span>}
                </div>
                <div className="profile-field">
                  <label className="profile-label">Joined</label>
                  <p className="profile-text">{new Date(user.joined).toLocaleDateString('en-GB')}</p>
                </div>
                <div className="profile-actions">
                  <button
                    className="profile-save-button"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                  <button
                    className="profile-cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Joined:</strong> {new Date(user.joined).toLocaleDateString('en-GB')}</p>
                <div className="profile-actions">
                  <button
                    className="profile-edit-button"
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;