import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-section py-5">
      <div className="container">
        <div className="row">
          {/* About */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="footer-heading mb-3">LuxeCart</h5>
            <p className="text-white-50">Your premier destination for luxury shopping. Discover curated collections and exclusive deals.</p>
            <div className="social-icons">
              <a href="#" className="text-white-50 me-2"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white-50 me-2"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white-50 me-2"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white-50 me-2"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-heading mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="footer-link">Home</Link></li>
              <li className="mb-2"><Link to="/products" className="footer-link">Products</Link></li>
              <li className="mb-2"><Link to="/cart" className="footer-link">Cart</Link></li>
              <li className="mb-2"><Link to="/login" className="footer-link">Login</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-heading mb-3">Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="footer-link">Electronics</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Fashion</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Accessories</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Footwear</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-heading mb-3">Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-2 text-white-50">
                <i className="fas fa-map-marker-alt me-2" style={{color: '#d4af37'}}></i>
                123 Mall Road, Lahore
              </li>
              <li className="mb-2 text-white-50">
                <i className="fas fa-phone me-2" style={{color: '#d4af37'}}></i>
                +92 300 1234567
              </li>
              <li className="mb-2 text-white-50">
                <i className="fas fa-envelope me-2" style={{color: '#d4af37'}}></i>
                support@luxecart.com
              </li>
            </ul>
          </div>
        </div>

        <hr className="bg-secondary" />

        <div className="row">
          <div className="col text-center">
            <p className="text-white-50 mb-0">
              © 2026 LuxeCart. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;