import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Homepage.css'; // Importing a CSS file for styling

function NavigationBar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:5000/auth/user", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(() => {
        setUsername(null);
      });
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm(`Are you sure you want to log out?`))
    {
      localStorage.removeItem("token");
      setUsername(null);
      window.location.reload();
    }
  };

  return (
    <div>
      <header className="header">
        <Link to="/" className="title">Welcome to GradeCalHub</Link>
        <div className="login-container">
          {username ? (
            <>
              <span>Welcome, {username}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <Link to="/login" className="login-button">Login</Link>
          )}
        </div>
      </header>
      <p>Your one-stop solution for grade calculations!</p>
      <nav className="navigation-bar">
        <ul>
          <li><Link to="/final-grade-calculator">Final Grade Calculator</Link></li>
          <li><Link to="/category-grade-calculator">Category Grade Calculator</Link></li>
          <li><Link to="/create-new-calculator">Create New Calculator</Link></li>
          <li><Link to="/calculator-list">Use Calculator</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default NavigationBar;