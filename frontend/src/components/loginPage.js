import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

            localStorage.setItem('token', response.data.token || 'undefined');
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
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
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
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginPage;