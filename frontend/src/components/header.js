import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'

const Header = () => {
    return (
        <header>
             <div class="header-section brand">
                <h1>ScholarAid</h1>
                <span class="divider">|</span>
            </div>

            <div class="header-section navigation">
                <nav class="nav-link">
                    <Link to="/">Home</Link>
                </nav>
            </div>

            <div class="header-section auth-links">
                <span> Hi  Guest </span>
                <span class="divider">|</span>
                <nav class="nav-link">
                    <Link to="/login">Login</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;