import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import './LogoutPage.css'
import ToastHelper from '../../helper/toastHelper'; // Use the helper
import isLoggedin from '../../helper/isLoggedin';


function LogoutPage() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let bool = isLoggedin();
        console.log(bool)
        if (!bool) {
            navigate('/login');
            return;
        }
    }, []);
    
    const logout = async (e) => {
        e.preventDefault();
        setIsLoggingOut(true);

        let token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        let user_id = decodedToken.user_id;
        try {

            console.log(token)

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {} , {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });

            localStorage.removeItem("token");

            ToastHelper.success(res.data.message);
            navigate('/login')
            
        } catch (error) {
            ToastHelper.error(error.response.data.message || 'Logout failed');
        }
    };

    return (
        <div className="logout-container">
            <div className="logout-card">
                <div className="logout-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
                <h1 className="logout-title">Are you sure you want to log out?</h1>
                <p className="logout-subtitle">You'll need to sign in again to access your account.</p>
                <div className="logout-buttons">
                    <button 
                        className="logout-btn logout-btn-yes" 
                        onClick={logout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? 'Logging out...' : 'Yes'}
                    </button>
                    <button 
                        className="logout-btn logout-btn-no" 
                        onClick={() => navigate('/user-details')}
                        disabled={isLoggingOut}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LogoutPage