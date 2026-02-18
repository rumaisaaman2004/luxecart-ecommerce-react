import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [activeTab, setActiveTab] = useState('signup'); // Default signup tab
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Validation states
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});

  const handleLoginChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setLoginData({
      ...loginData,
      [e.target.name]: value
    });
  };

  const handleSignupChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSignupData({
      ...signupData,
      [e.target.name]: value
    });
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = 'Email is invalid';
    
    if (!loginData.password) errors.password = 'Password is required';
    else if (loginData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    return errors;
  };

  const validateSignup = () => {
    const errors = {};
    if (!signupData.firstName) errors.firstName = 'First name is required';
    if (!signupData.lastName) errors.lastName = 'Last name is required';
    
    if (!signupData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) errors.email = 'Email is invalid';
    
    if (!signupData.password) errors.password = 'Password is required';
    else if (signupData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    
    if (!signupData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (signupData.password !== signupData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!signupData.agreeTerms) errors.agreeTerms = 'You must agree to terms';
    
    return errors;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = validateLogin();
    setLoginErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      console.log('Login data:', loginData);
      alert('Login successful! Redirecting to dashboard...');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = validateSignup();
    setSignupErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      console.log('Signup data:', signupData);
      alert('Account created successfully! You can now login.');
      setActiveTab('login');
    }
  };

  return (
    <div className="auth-page" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Navbar is already in App.js - this page doesn't have its own navbar */}
      
      {/* Auth Section */}
      <section className="auth-section" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row g-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: 'white' }}>
                
                {/* Left Side - Features */}
                <div className="col-lg-6" style={{
                  background: 'linear-gradient(135deg, #0a192f 0%, #1a3a5f 100%)',
                  color: 'white',
                  padding: '50px 40px'
                }}>
                  <div className="text-center mb-5">
                    <i className="fas fa-crown fa-4x mb-4" style={{ color: '#d4af37' }}></i>
                    <h1 className="display-6 fw-bold mb-3">Welcome to LuxeCart</h1>
                    <p className="mb-5" style={{ opacity: 0.9 }}>Experience premium shopping with exclusive products and seamless service.</p>
                  </div>
                  
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <i className="fas fa-shipping-fast fa-2x me-3" style={{ color: '#d4af37' }}></i>
                        <div>
                          <h5 className="mb-1">Free Delivery</h5>
                          <p className="mb-0 small" style={{ opacity: 0.8 }}>On orders above Rs.999</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <i className="fas fa-shield-alt fa-2x me-3" style={{ color: '#d4af37' }}></i>
                        <div>
                          <h5 className="mb-1">Secure Payments</h5>
                          <p className="mb-0 small" style={{ opacity: 0.8 }}>256-bit SSL encryption</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <i className="fas fa-headset fa-2x me-3" style={{ color: '#d4af37' }}></i>
                        <div>
                          <h5 className="mb-1">24/7 Support</h5>
                          <p className="mb-0 small" style={{ opacity: 0.8 }}>Dedicated customer care</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Forms */}
                <div className="col-lg-6 p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">LuxeCart Account</h2>
                    <p className="text-muted">Access your dashboard or create a new account</p>
                  </div>

                  {/* Tabs */}
                  <div className="d-flex gap-2 mb-4">
                    <button
                      className={`btn flex-grow-1 py-3 fw-bold rounded-3 ${activeTab === 'login' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => setActiveTab('login')}
                      style={activeTab === 'login' ? { backgroundColor: '#0a192f' } : {}}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i> Login
                    </button>
                    <button
                      className={`btn flex-grow-1 py-3 fw-bold rounded-3 ${activeTab === 'signup' ? 'btn-success' : 'btn-outline-secondary'}`}
                      onClick={() => setActiveTab('signup')}
                    >
                      <i className="fas fa-user-plus me-2"></i> Sign Up
                    </button>
                  </div>

                  {/* Login Form */}
                  {activeTab === 'login' && (
                    <form onSubmit={handleLoginSubmit} noValidate>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control form-control-lg ${loginErrors.email ? 'is-invalid' : ''}`}
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                        />
                        {loginErrors.email && (
                          <div className="invalid-feedback">{loginErrors.email}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <div className="input-group">
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            name="password"
                            className={`form-control form-control-lg ${loginErrors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                          >
                            <i className={`fas fa-${showLoginPassword ? 'eye-slash' : 'eye'}`}></i>
                          </button>
                        </div>
                        {loginErrors.password && (
                          <div className="invalid-feedback d-block">{loginErrors.password}</div>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            className="form-check-input"
                            id="rememberMe"
                            checked={loginData.rememberMe}
                            onChange={handleLoginChange}
                          />
                          <label className="form-check-label" htmlFor="rememberMe">
                            Remember me
                          </label>
                        </div>
                        <a href="#" className="text-decoration-none small" style={{ color: '#d4af37' }}>
                          Forgot Password?
                        </a>
                      </div>

                      <button type="submit" className="btn btn-dark btn-lg w-100 py-3 fw-bold mb-4" style={{ backgroundColor: '#0a192f' }}>
                        <i className="fas fa-sign-in-alt me-2"></i> Sign In
                      </button>
                    </form>
                  )}

                  {/* Signup Form */}
                  {activeTab === 'signup' && (
                    <form onSubmit={handleSignupSubmit} noValidate>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            className={`form-control form-control-lg ${signupErrors.firstName ? 'is-invalid' : ''}`}
                            placeholder="First Name"
                            value={signupData.firstName}
                            onChange={handleSignupChange}
                          />
                          {signupErrors.firstName && (
                            <div className="invalid-feedback">{signupErrors.firstName}</div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            className={`form-control form-control-lg ${signupErrors.lastName ? 'is-invalid' : ''}`}
                            placeholder="Last Name"
                            value={signupData.lastName}
                            onChange={handleSignupChange}
                          />
                          {signupErrors.lastName && (
                            <div className="invalid-feedback">{signupErrors.lastName}</div>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control form-control-lg ${signupErrors.email ? 'is-invalid' : ''}`}
                          placeholder="youremail@gmail.com"
                          value={signupData.email}
                          onChange={handleSignupChange}
                        />
                        {signupErrors.email && (
                          <div className="invalid-feedback">{signupErrors.email}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <div className="input-group">
                          <input
                            type={showSignupPassword ? 'text' : 'password'}
                            name="password"
                            className={`form-control form-control-lg ${signupErrors.password ? 'is-invalid' : ''}`}
                            placeholder="Create a password"
                            value={signupData.password}
                            onChange={handleSignupChange}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                          >
                            <i className={`fas fa-${showSignupPassword ? 'eye-slash' : 'eye'}`}></i>
                          </button>
                        </div>
                        {signupErrors.password && (
                          <div className="invalid-feedback d-block">{signupErrors.password}</div>
                        )}
                        <div className="form-text mt-1">
                          <i className="fas fa-info-circle me-1"></i> Minimum 8 characters with letters and numbers
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className={`form-control form-control-lg ${signupErrors.confirmPassword ? 'is-invalid' : ''}`}
                          placeholder="Confirm password"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                        />
                        {signupErrors.confirmPassword && (
                          <div className="invalid-feedback">{signupErrors.confirmPassword}</div>
                        )}
                      </div>

                      <div className="form-check mb-4">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          className="form-check-input"
                          id="agreeTerms"
                          checked={signupData.agreeTerms}
                          onChange={handleSignupChange}
                        />
                        <label className="form-check-label small" htmlFor="agreeTerms">
                          I agree to the <a href="#" style={{ color: '#d4af37', textDecoration: 'none' }}>Terms & Conditions</a> and <a href="#" style={{ color: '#d4af37', textDecoration: 'none' }}>Privacy Policy</a>
                        </label>
                        {signupErrors.agreeTerms && (
                          <div className="text-danger small mt-1">{signupErrors.agreeTerms}</div>
                        )}
                      </div>

                      <button type="submit" className="btn btn-success btn-lg w-100 py-3 fw-bold">
                        <i className="fas fa-user-plus me-2"></i> Create Account
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;