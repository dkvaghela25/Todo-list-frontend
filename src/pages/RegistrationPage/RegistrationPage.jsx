import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfilePicture from '../profile-picture.png';
import ToastHelper from '../../helper/toastHelper'; // Use the helper
import isLoggedin from '../../helper/isLoggedin';
import './RegistrationPage.css';

function RegistrationPage() {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    let bool = isLoggedin();

    if (bool) {
      navigate('/user-details')
    }

  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  const resetPicture = async () => {
    // Fetch the default image as a blob
    const response = await fetch(defaultProfilePicture);
    const blob = await response.blob();
    // Create a File object from the blob (name and type are important)
    const file = new File([blob], "default-profile-picture.png", { type: blob.type });
    setFile(file);
    setBackgroundImage(defaultProfilePicture);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password || !formData.email) {
      return ToastHelper.error('Please fill in all required fields');
    }
    
    if (formData.password !== formData.confirmPassword) {
      return ToastHelper.error('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return ToastHelper.error('Password must be at least 6 characters long');
    }
    
    const formDataWithFile = new FormData();
    formDataWithFile.append('username', formData.username);
    formDataWithFile.append('password', formData.password);
    formDataWithFile.append('email', formData.email);
    formDataWithFile.append('phone_no', formData.phone_no || '');
    
    if (file) {
      formDataWithFile.append('image', file);
    }

    console.log('Form data being sent:', formDataWithFile);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formDataWithFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/login');
      ToastHelper.success(res.data.message || 'Registration successful'); // Use the helper
    } catch (error) {
      console.error("Registration error:", error);
      ToastHelper.error(error.response?.data?.message || 'Registration failed'); // Use the helper
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1 className="registration-title">Register</h1>
          <p className="registration-subtitle">Create your account and upload a profile picture</p>
        </div>

        <form className="registration-form" onSubmit={registerUser}>
          <div className="registration-content">
            <div className="registration-left">
              <div
                className="profile-picture-container"
                style={{
                  backgroundImage: backgroundImage ? `url(${backgroundImage})` : `url(${defaultProfilePicture})`,
                }}
              >
                <input
                  type="file"
                  className="image-input"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              <button
                type="button"
                className="registration-btn registration-btn-secondary"
                onClick={resetPicture}
              >
                <span className="btn-icon">🗑️</span>
                Remove Picture
              </button>
            </div>

            <div className="registration-right">

              <div className="registration-field">
                <label className="registration-label">Username *</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="registration-input"
                  autoComplete="off"
                  value={formData.username || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="registration-field">
                <label className="registration-label">Password *</label>
                <div className="password-input-container">
                  <input
                    className="registration-input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    autoComplete="off"
                    value={formData.password || ''}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="registration-field">
                <label className="registration-label">Confirm Password *</label>
                <div className="password-input-container">
                  <input
                    className="registration-input"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    autoComplete="off"
                    value={formData.confirmPassword || ''}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="registration-field">
                <label className="registration-label">Email ID *</label>
                <input
                  className="registration-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="off"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="registration-field">
                <label className="registration-label">Phone Number *</label>
                <input
                  className="registration-input"
                  type="text"
                  name="phone_no"
                  placeholder="Phone No."
                  autoComplete="off"
                  value={formData.phone_no || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="registration-actions">
            <button 
              type="submit" 
              className="registration-btn registration-btn-primary"
            >
              Register
            </button>
          </div>
        </form>
        <div className="link-container">
        Already have an account <Link to="/login">Log In</Link>
      </div>
      </div>
    </div>
  );
}

export default RegistrationPage;