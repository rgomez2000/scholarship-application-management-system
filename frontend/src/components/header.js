import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import logo from './assets/logo.png';


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
            navigate('/'); // Redirect to /apply if authenticated
        } else {
            navigate('/'); // Stay on the home page if not authenticated
        }
    };

    // Handle click on Home, redirect to /apply if authenticated
    const handleApplicationsClick = () => {
        navigate('/applications');
    };


    return (
        <body class="header-body">
            <header class="header">
                <div class="header-section brand">
                    <img src={logo} alt="logo" class="logo"/>
                </div>
                <span className="divider"></span>
                <div class="header-section navigation">
                    <a onClick={handleHomeClick} className="nav-link">Home</a>
                    {isAuthenticated && <a onClick={handleApplicationsClick} className="nav-link">Applications</a>}
                    <Notifications/>
                </div>

                <div class="header-section auth-links">
                    {isAuthenticated ? (
                        <>
                            <span class="greeting">Hi, {firstName}</span>
                            <span class="divider"></span>
                            <a href="/profile" class="auth-link" >Profile</a>
                            <span className="divider"></span>
                            <a href="/" onClick={handleLogout} class="auth-link">Logout</a>
                        </>
                    ) : (
                        <>
                            <span class="greeting">Hi, Guest</span>
                            <span class="divider"></span>
                            <Link to="/login" class="auth-link">Login</Link>
                            <span class="divider" ></span>
                            <Link to="/register" class="auth-link">Register</Link>
                        </>
                    )}
                </div>
            </header>
        </body>
    );
};

export default Header;