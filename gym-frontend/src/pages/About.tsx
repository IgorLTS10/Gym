import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="intro">
        <h1>About Us</h1>
        <p>Welcome to Gym Management, your ultimate destination for fitness and wellness. Our mission is to help you achieve your fitness goals through personalized training, group classes, and comprehensive nutrition plans.</p>
      </section>
      <section className="mission">
        <h2>Our Mission</h2>
        <p>We aim to provide top-notch fitness solutions tailored to your individual needs. Whether you're a beginner or a seasoned athlete, we have the resources and expertise to support your journey.</p>
      </section>
      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-container">
          <div className="team-member">
            <img src="/images/trainer1.jpg" alt="Trainer 1" />
            <h3>John Doe</h3>
            <p>Head Trainer</p>
          </div>
          <div className="team-member">
            <img src="/images/trainer2.jpg" alt="Trainer 2" />
            <h3>Jane Smith</h3>
            <p>Nutrition Expert</p>
          </div>
          <div className="team-member">
            <img src="/images/trainer3.jpg" alt="Trainer 3" />
            <h3>Emily Johnson</h3>
            <p>Group Class Instructor</p>
          </div>
        </div>
      </section>
      <section className="values">
        <h2>Our Values</h2>
        <p>At Gym Management, we believe in commitment, community, and continuous improvement. We strive to create an inclusive environment where everyone feels welcome and motivated to reach their full potential.</p>
      </section>
    </div>
  );
};

export default About;
