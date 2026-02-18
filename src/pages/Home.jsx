import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium sound, noise cancellation',
      price: 2499,
      originalPrice: 3999,
      image: '/assets/headphone2.png',
      badge: 'Sale',
      badgeColor: '#dc3545'
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      description: 'Health tracking, stylish design',
      price: 8999,
      originalPrice: null,
      image: '/assets/watch.png',
      badge: 'New',
      badgeColor: '#28a745'
    },
    {
      id: 3,
      name: 'Smartphone X',
      description: '128GB, 48MP Camera, 5G',
      price: 24999,
      originalPrice: null,
      image: '/assets/product2.png',
      badge: 'Best Seller',
      badgeColor: '#ffc107'
    },
    {
      id: 4,
      name: 'Gaming Headset',
      description: '7.1 Surround Sound, RGB',
      price: 7999,
      originalPrice: 9999,
      image: '/assets/gaming.png',
      badge: 'Sale',
      badgeColor: '#dc3545'
    },
    {
      id: 5,
      name: 'Pro Runner Shoes',
      description: 'Comfortable running shoes',
      price: 3499,
      originalPrice: 4999,
      image: '/assets/joggers.png',
      badge: 'Sale',
      badgeColor: '#dc3545'
    },
    {
      id: 6,
      name: 'Digital Camera',
      description: '24MP, 4K Video',
      price: 45999,
      originalPrice: null,
      image: '/assets/camera.png',
      badge: 'New',
      badgeColor: '#28a745'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 text-white">
              <h1 className="display-3 fw-bold mb-4">Experience Premium Shopping</h1>
              <p className="lead mb-4">
                Discover curated collections, exclusive deals, and seamless shopping with LuxeCart.
              </p>
              <Link to="/products" className="btn btn-gold btn-lg">
                <i className="fas fa-shopping-bag me-2"></i>Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center section-title mb-5">Trending Products</h2>
          
          <div className="row g-4">
            {products.map(product => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={product.id}>
                <div className="card product-card h-100 border-0 shadow-sm">
                  {/* Badge */}
                  {product.badge && (
                    <div 
                      className="product-badge"
                      style={{
                        backgroundColor: product.badgeColor,
                        color: product.badge === 'Best Seller' ? '#000' : '#fff'
                      }}
                    >
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Image */}
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={product.image} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="card-body text-center">
                    <h5 className="fw-bold mb-2">{product.name}</h5>
                    <p className="text-muted small mb-3">{product.description}</p>
                    <div className="mb-3">
                      <span className="price">Rs.{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-muted text-decoration-line-through ms-2 small">
                          Rs.{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Link 
                      to={`/product/${product.id}`} 
                      className="btn btn-outline-primary btn-sm w-100"
                      style={{
                        borderColor: '#0a192f',
                        color: '#0a192f'
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="fas fa-truck feature-icon mb-3"></i>
                <h5 className="fw-bold">Free Shipping</h5>
                <p className="text-muted">On orders over Rs.5,000</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="fas fa-undo feature-icon mb-3"></i>
                <h5 className="fw-bold">Easy Returns</h5>
                <p className="text-muted">30-day return policy</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="fas fa-headset feature-icon mb-3"></i>
                <h5 className="fw-bold">24/7 Support</h5>
                <p className="text-muted">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;