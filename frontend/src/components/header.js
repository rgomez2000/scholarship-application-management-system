import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkIsAdmin } from './services/api';
import './header.css';
import logo from './assets/logo.png';
import Notifications from "./services/notifications";


const Header = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
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

    const addApplicationsClick = () => {
        navigate('/addScholarship');
    };

    useEffect(() => {
        async function fetchIsAdmin() {
            const isAdminFlag = await checkIsAdmin();
            setIsAdmin(isAdminFlag);
        }

        fetchIsAdmin();
    })


    return (
        <body class="header-body">
            <header class="header">
                <div class="header-section brand">
                    <img src={logo} alt="logo" class="logo"/>
                </div>
                <span className="divider"></span>
                <div class="header-section navigation">
                    <a href="" onClick={handleHomeClick} className="nav-link">Home</a>
                    {isAuthenticated && isAdmin && <a href="" onClick={handleApplicationsClick} className="nav-link">Applications</a>}
                    {isAuthenticated && isAdmin && <a href="" onClick={addApplicationsClick} className="nav-link">Add Scholarship</a>}
                </div>

                <div class="header-section auth-links">
                    {isAuthenticated ? (
                        <>
                            
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