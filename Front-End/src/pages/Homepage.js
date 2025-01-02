import React from 'react';
import '../styles/Homepage.css'; // Importing a CSS file for styling
import NavigationBar from '../components/NavigationBar';

function HomePage() {
  return (
    <div className="homepage-container">
      <NavigationBar />
      <main className="homepage-main">
        <section className="welcome-section">
          <h1>Welcome to GradeCalHub!</h1>
          <p>Your one-stop solution for grade calculations. We make tracking your academic performance effortless!</p>
        </section>
        <section className="features-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>📊 Easy-to-use grade calculators</li>
            <li>🔒 Secure and reliable</li>
            <li>📈 Insights to help you succeed</li>
          </ul>
        </section>
        <section className="cta-section">
          <h2>Get Started Today!</h2>
          <p>Sign up or log in to access powerful grade calculation tools and stay ahead in your studies.</p>
          <a href="/register" className="cta-button">Sign Up Now</a>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
