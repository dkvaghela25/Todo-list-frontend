import React from 'react'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaUserPlus, FaSignInAlt, GoArrowRight  } from 'react-icons/fa'
import { BsListTask } from 'react-icons/bs'
import { AiOutlineSchedule } from 'react-icons/ai'
import './HomePage.css'
import isLoggedin from '../../helper/isLoggedin'

function HomePage() {
    return (
        <div className="home-container">
            <div className="home-content">
                <div className="logo-section">
                    <BsListTask className="logo-icon" />
                    <h1 className="home-title">Welcome to TodoMaster</h1>
                    <p className="home-subtitle">Manage your tasks efficiently and stay organized</p>
                </div>
                
                <div className="features-section">
                    <div className="feature">
                        <FaCheckCircle className="feature-icon" />
                        <h3>Stay Organized</h3>
                        <p>Keep track of all your tasks in one place</p>
                    </div>
                    <div className="feature">
                        <AiOutlineSchedule className="feature-icon" />
                        <h3>Manage Time</h3>
                        <p>Efficiently organize your daily schedule</p>
                    </div>
                </div>

                <div className="home-buttons">
                    {isLoggedin() ? (
                        <Link to="/user-details" className="home-button get-started-btn">
                            <span>Get Started</span>
                            <FaSignInAlt className="button-icon white-icon" />
                        </Link>
                    ) : (
                        <>
                            <Link to="/register" className="home-button register-btn">
                                <FaUserPlus className="button-icon" />
                                <span>Register</span>
                            </Link>
                            <Link to="/login" className="home-button login-btn">
                                <FaSignInAlt className="button-icon" />
                                <span>Login</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomePage