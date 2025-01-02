import React, { useState } from "react";
import axios from "axios";
import "../styles/AuthPage.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/check-username/${username}`
      );
      setUsernameAvailable(response.data.available);
    } catch (err) {
      console.error("Error checking username:", err);
      setUsernameAvailable(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!usernameAvailable) {
      setError("Username is already taken.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Error registering user:", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Create Account</h1>
        {error && <p className="error-message">{error}</p>}
        {success && (
          <p className="success-message">Account created successfully!</p>
        )}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={checkUsernameAvailability} // Check availability on blur
          />
          {!usernameAvailable && (
            <p className="error-message">Username is already taken.</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
