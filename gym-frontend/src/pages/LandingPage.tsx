import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Gym Management</h1>
          <p>Your fitness journey starts here</p>
          <a href="/subscriptions" className="cta-button">Get Started</a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
