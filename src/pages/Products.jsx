import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  // All products data
  const allProducts = [
    // Electronics
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium sound, noise cancellation',
      price: 2499,
      originalPrice: 3999,
      image: '/assets/headphone2.png',
      category: 'Electronics',
      badge: 'Sale',
      badgeColor: '#dc3545'
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      description: 'Health tracking, stylish design',
      price: 8999,
      originalPrice: null,
      image: '/assets/smartwatch.png',
      category: 'Electronics',
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
      category: 'Electronics',
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
      category: 'Gaming',
      badge: 'Sale',
      badgeColor: '#dc3545'
    },
    // Fashion
    {
      id: 5,
      name: 'Pro Runner Shoes',
      description: 'Comfortable running shoes',
      price: 3499,
      originalPrice: 4999,
      image: '/assets/joggers.png',
      category: 'Fashion',
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
      category: 'Electronics',
      badge: 'New',
      badgeColor: '#28a745'
    },
    {
      id: 7,
      name: 'Classic Watch',
      description: 'Elegant design, leather strap',
      price: 5999,
      originalPrice: 7999,
      image: '/assets/watch.png',
      category: 'Fashion',
      badge: 'Sale',
      badgeColor: '#dc3545'
    },
    {
      id: 8,
      name: 'Headphones Pro',
      description: 'Professional audio quality',
      price: 12999,
      originalPrice: null,
      image: '/assets/head3.png',
      category: 'Electronics',
      badge: 'New',
      badgeColor: '#28a745'
    }
  ];

  // States for filtering
  const [products, setProducts] = useState(allProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Get unique categories
  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  // Filter products
  const filterProducts = () => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setProducts(filtered);
  };

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setTimeout(filterProducts, 0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setTimeout(filterProducts, 0);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setTimeout(filterProducts, 0);
  };

  return (
    <>
      {/* Page Header */}
      <section className="page-header" style={{
        backgroundColor: '#0a192f',
        color: 'white',
        padding: '100px 0',
        marginTop: '76px'
      }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Our Products</h1>
          <p className="lead">Discover our curated collection of premium products</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Filters Sidebar */}
            <div className="col-lg-3 mb-4">
              <div className="card filter-card border-0 shadow-sm p-3">
                <h5 className="fw-bold mb-3">Categories</h5>
                <div className="list-group mb-4">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`list-group-item list-group-item-action ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category)}
                      style={{
                        backgroundColor: selectedCategory === category ? '#0a192f' : 'transparent',
                        color: selectedCategory === category ? 'white' : '#333',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <h5 className="fw-bold mb-3">Search</h5>
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />

                <h5 className="fw-bold mb-3">Sort By</h5>
                <select className="form-select" value={sortBy} onChange={handleSortChange}>
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              <div className="row g-4">
                {products.length > 0 ? (
                  products.map(product => (
                    <div className="col-md-6 col-lg-4" key={product.id}>
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
                        <div className="card-body">
                          <h5 className="fw-bold mb-2">{product.name}</h5>
                          <p className="text-muted small mb-3">{product.description}</p>
                          <p className="text-muted small mb-2">Category: {product.category}</p>
                          <div className="mb-3">
                            <span className="price">Rs.{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-muted text-decoration-line-through ms-2 small">
                                Rs.{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="d-flex gap-2">
                            <Link 
                              to={`/product/${product.id}`} 
                              className="btn btn-outline-primary btn-sm flex-grow-1"
                            >
                              View Details
                            </Link>
                            <button className="btn btn-gold btn-sm">
                              <i className="fas fa-cart-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <h4>No products found</h4>
                    <p>Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;