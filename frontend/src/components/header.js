import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';

const Header = () => {
    const navigate = useNavigate();
    
    // Check if the user is authenticated by looking for the token in localStorage
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    // Retrieve the username from localStorage
    const firstName = localStorage.getItem('first_name') || localStorage.getItem('username'); // Fallback to username if first name is not available

    // Logout function to clear the token and redirect to the homepage
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('first_name');
        navigate('/',{ replace: true }); // Redirect to homepage after logout
    };

    // Handle click on Home, redirect to /apply if authenticated
    const handleHomeClick = () => {
        if (isAuthenticated) {
            navigate('/apply'); // Redirect to /apply if authenticated
        } else {
            navigate('/'); // Stay on the home page if not authenticated
        }
    };

    return (
        <header>
            <div className="header-section brand">
                <h1>ScholarAid</h1>
                <span className="divider">|</span>
            </div>

            <div className="header-section navigation">
                <nav className="nav-link">
                <button onClick={handleHomeClick} className="logout-link">Home</button>
                </nav>
            </div>

            <div className="header-section auth-links">
                {isAuthenticated ? (
                    <>
                        <span>Hi, {firstName}</span>
                        <span className="divider">|</span>
                        <nav className="nav-link">
                            <Link to="/profile">Profile</Link>
                            <span className="divider">|</span>
                            <button onClick={handleLogout} className="logout-link">Logout</button>
                        </nav>
                    </>
                ) : (
                    <>
                        <span>Hi, Guest</span>
                        <span className="divider">|</span>
                        <nav className="nav-link">
                            <Link to="/login">Login</Link>
                            <span className="divider">|</span>
                            <Link to="/register">Register</Link>
                        </nav>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;