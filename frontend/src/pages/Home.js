import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="logo-container">
            <div className="logo">
              <span className="logo-icon">👥</span>
              <span className="logo-text">Companion<span className="logo-highlight">Hub</span></span>
            </div>
          </div>
          <h1 className="hero-title">Find Your Perfect Companion</h1>
          <p className="hero-subtitle">Connect with amazing companions for travel, events, and special occasions. Experience unforgettable moments with people who share your interests.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Join Now - It's Free</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Happy companions" 
              className="hero-image"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose CompanionHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Verified Companions</h3>
              <p className="feature-description">
                All our companions are verified for your safety and peace of mind.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Platform</h3>
              <p className="feature-description">
                Bank-level security to protect your personal information.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Real-time Chat</h3>
              <p className="feature-description">
                Connect instantly with companions through our messaging system.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3 className="feature-title">Rating System</h3>
              <p className="feature-description">
                Make informed decisions with our transparent rating system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="subscription-plans">
        <div className="container">
          <h2 className="section-title">Affordable Subscription Plans</h2>
          <p className="section-subtitle">Get unlimited access to all premium features for just ₹150/month</p>
          
          <div className="plans-container">
            <div className="plan-card featured">
              <div className="plan-badge">MOST POPULAR</div>
              <h3 className="plan-title">Premium Plan</h3>
              <div className="plan-price">
                <span className="price-amount">₹150</span>
                <span className="price-duration">/month</span>
              </div>
              <ul className="plan-features">
                <li>✓ Unlimited companion requests</li>
                <li>✓ Priority messaging</li>
                <li>✓ Verified companions only</li>
                <li>✓ Advanced search filters</li>
                <li>✓ Exclusive events access</li>
                <li>✓ 24/7 customer support</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-block">Subscribe Now</Link>
              <div className="plan-guarantee">7-Day Money Back Guarantee</div>
            </div>
          </div>
          
          <div className="ads-container">
            <div className="ad-card">
              <div className="ad-icon">🔥</div>
              <h4>Limited Time Offer!</h4>
              <p>Subscribe now and get 30% off your first month. Only ₹105 instead of ₹150!</p>
            </div>
            
            <div className="ad-card">
              <div className="ad-icon">🎉</div>
              <h4>Join 10,000+ Happy Users!</h4>
              <p>Experience unforgettable moments with companions who share your interests.</p>
            </div>
            
            <div className="ad-card">
              <div className="ad-icon">💎</div>
              <h4>Premium Features Included</h4>
              <p>Priority messaging, advanced search, and exclusive events access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up and complete your profile in minutes</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Find Companions</h3>
              <p>Browse and connect with companions that match your interests</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Enjoy</h3>
              <p>Schedule your outing and enjoy unforgettable experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p>"CompanionHub helped me find the perfect travel companion for my Europe trip. We had an amazing time together!"</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah K." />
                <div>
                  <h4>Sarah K.</h4>
                  <p>Travel Enthusiast</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p>"I was nervous about attending a networking event alone, but my CompanionHub match made it incredible!"</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Michael T." />
                <div>
                  <h4>Michael T.</h4>
                  <p>Business Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <div className="logo-container-center">
              <div className="logo">
                <span className="logo-icon">👥</span>
                <span className="logo-text">Companion<span className="logo-highlight">Hub</span></span>
              </div>
            </div>
            <h2 className="cta-title">Ready to Find Your Perfect Companion?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied users who have found meaningful connections through CompanionHub.
            </p>
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;