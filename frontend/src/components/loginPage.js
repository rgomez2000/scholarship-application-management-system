import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // For redirecting after login

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  // To store error messages
  const navigate = useNavigate();  // For redirecting user after successful login

  const handleLogin = (e) => {
    e.preventDefault();

    // Make POST request to the API to get the token
    axios
      .post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      })
      .then((response) => {
        const token = response.data.token;  // Get token from the response
        localStorage.setItem("token", token);  // Store token in localStorage
        console.log("Token received:", token);

        // Redirect to home after successful login
        navigate("/");
      })
      .catch((error) => {
        // Handle login failure (wrong username/password)
        setErrorMessage("Invalid credentials, please try again.");
        console.error("Login failed:", error.response.data);
      });
  };

  return (
    <div>
      
      {errorMessage && <p class='alert-error' style={{ color: 'red' }}>{errorMessage}</p>}
      <form class="form-container" id="form-container" onSubmit={handleLogin}>
        <div class="form-group">
            <h2>Login</h2>
            <label>Username</label>
            <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
        </div>
        <div class="form-group">
            <label>Password</label>
            <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        <div>
          <button class="form-container-button" type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
