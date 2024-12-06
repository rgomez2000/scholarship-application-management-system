import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './loginPage.css'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // To redirect after login

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the login request
            const response = await axios.post('http://localhost:8000/api/login/', {
                username,
                password
            });

            // Save the token (assuming JWT)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('first_name', response.data.first_name);

            // Redirect to homepage
            navigate('/'); // Redirect to homepage
        } catch (error) {
            setMessage('Invalid credentials');
        }
    };

    return (
        <div>
            {message && <p class='alert-error' style={{ color: 'red' }}>{message}</p>}
            <form class="form-container" onSubmit={handleSubmit}>
                <div class="form-group">
                    <h2>Login Page</h2>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div class="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;