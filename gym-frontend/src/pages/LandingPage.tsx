import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Gym Management</h1>
          <p>Your fitness journey starts here</p>
          <a href="#services" className="cta-button">Get Started</a>
        </div>
      </section>
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>We provide the best fitness solutions for all your needs.</p>
      </section>
      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="services-container">
          <div className="service">
            <h3>Personal Training</h3>
            <p>Get personalized training plans.</p>
          </div>
          <div className="service">
            <h3>Group Classes</h3>
            <p>Join our group fitness classes.</p>
          </div>
          <div className="service">
            <h3>Nutrition Plans</h3>
            <p>Receive custom nutrition plans.</p>
          </div>
        </div>
      </section>
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>Get in touch with us for more information.</p>
      </section>
    </div>
  );
};

export default LandingPage;
