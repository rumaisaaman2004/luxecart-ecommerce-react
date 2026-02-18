import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // All products data (same as Products page)
  const allProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium sound, noise cancellation',
      fullDescription: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
      price: 2499,
      originalPrice: 3999,
      image: '/assets/headphone2.png',
      images: ['/assets/headphone2.png', '/assets/head3.png', '/assets/gaming.png'],
      category: 'Electronics',
      badge: 'Sale',
      badgeColor: '#dc3545',
      inStock: true,
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      description: 'Health tracking, stylish design',
      fullDescription: 'Track your fitness goals with Smart Watch Pro. Features heart rate monitoring, sleep tracking, GPS, and 7-day battery life. Compatible with iOS and Android.',
      price: 8999,
      originalPrice: null,
      image: '/assets/smartwatch.png',
      images: ['/assets/smartwatch.png', '/assets/watch.png'],
      category: 'Electronics',
      badge: 'New',
      badgeColor: '#28a745',
      inStock: true,
      rating: 4.8,
      reviews: 95
    },
    {
      id: 3,
      name: 'Smartphone X',
      description: '128GB, 48MP Camera, 5G',
      fullDescription: 'Latest smartphone with 6.7" AMOLED display, 48MP triple camera, 128GB storage, and 5G connectivity. Powerful processor for seamless performance.',
      price: 24999,
      originalPrice: null,
      image: '/assets/product2.png',
      images: ['/assets/product2.png', '/assets/product3.png'],
      category: 'Electronics',
      badge: 'Best Seller',
      badgeColor: '#ffc107',
      inStock: true,
      rating: 4.7,
      reviews: 256
    },
    {
      id: 4,
      name: 'Gaming Headset',
      description: '7.1 Surround Sound, RGB',
      fullDescription: 'Immerse yourself in gaming with 7.1 surround sound, RGB lighting, and noise-cancelling microphone. Compatible with PC, PS5, Xbox, and Switch.',
      price: 7999,
      originalPrice: 9999,
      image: '/assets/gaming.png',
      images: ['/assets/gaming.png', '/assets/headphone2.png'],
      category: 'Gaming',
      badge: 'Sale',
      badgeColor: '#dc3545',
      inStock: true,
      rating: 4.6,
      reviews: 67
    },
    {
      id: 5,
      name: 'Pro Runner Shoes',
      description: 'Comfortable running shoes',
      fullDescription: 'Lightweight running shoes with responsive cushioning. Breathable mesh upper and durable outsole for maximum comfort during long runs.',
      price: 3499,
      originalPrice: 4999,
      image: '/assets/joggers.png',
      images: ['/assets/joggers.png'],
      category: 'Fashion',
      badge: 'Sale',
      badgeColor: '#dc3545',
      inStock: true,
      rating: 4.3,
      reviews: 42
    },
    {
      id: 6,
      name: 'Digital Camera',
      description: '24MP, 4K Video',
      fullDescription: 'Capture stunning photos and videos with 24MP sensor and 4K recording. Includes multiple shooting modes and Wi-Fi connectivity for easy sharing.',
      price: 45999,
      originalPrice: null,
      image: '/assets/camera.png',
      images: ['/assets/camera.png'],
      category: 'Electronics',
      badge: 'New',
      badgeColor: '#28a745',
      inStock: false,
      rating: 4.9,
      reviews: 23
    },
    {
      id: 7,
      name: 'Classic Watch',
      description: 'Elegant design, leather strap',
      fullDescription: 'Timeless elegance with premium leather strap and Japanese quartz movement. Water-resistant and perfect for formal occasions.',
      price: 5999,
      originalPrice: 7999,
      image: '/assets/watch.png',
      images: ['/assets/watch.png'],
      category: 'Fashion',
      badge: 'Sale',
      badgeColor: '#dc3545',
      inStock: true,
      rating: 4.4,
      reviews: 38
    },
    {
      id: 8,
      name: 'Headphones Pro',
      description: 'Professional audio quality',
      fullDescription: 'Studio-grade headphones for professionals. High-resolution audio, comfortable fit for long sessions, and detachable cable.',
      price: 12999,
      originalPrice: null,
      image: '/assets/head3.png',
      images: ['/assets/head3.png', '/assets/headphone2.png'],
      category: 'Electronics',
      badge: 'New',
      badgeColor: '#28a745',
      inStock: true,
      rating: 4.7,
      reviews: 19
    }
  ];

  // Get related products (same category)
  const getRelatedProducts = () => {
    if (!product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  };

  useEffect(() => {
    // Find product by id
    const foundProduct = allProducts.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    setSelectedImage(0);
  }, [id]);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = () => {
    alert(`${quantity} x ${product?.name} added to cart!`);
    // Cart functionality will be added later
  };

  if (!product) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-gold mt-3">Back to Products</Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts();

  return (
    <>
      {/* Breadcrumb */}
      <section className="product-details pt-5">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="row mt-4">
            {/* Product Images */}
            <div className="col-md-6 mb-4">
              <div className="main-image mb-3">
                <img 
                  src={product.images[selectedImage] || product.image} 
                  className="img-fluid rounded shadow" 
                  alt={product.name}
                  style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="row g-2">
                  {product.images.map((img, index) => (
                    <div className="col-3" key={index}>
                      <img 
                        src={img} 
                        className={`img-thumbnail ${selectedImage === index ? 'active-thumbnail' : ''}`}
                        alt={`${product.name} - ${index + 1}`}
                        style={{ cursor: 'pointer', height: '80px', objectFit: 'cover' }}
                        onClick={() => setSelectedImage(index)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="col-md-6">
              {product.badge && (
                <span 
                  className="badge mb-3"
                  style={{
                    backgroundColor: product.badgeColor,
                    color: product.badge === 'Best Seller' ? '#000' : '#fff',
                    padding: '8px 15px',
                    fontSize: '0.9rem'
                  }}
                >
                  {product.badge}
                </span>
              )}
              
              <h1 className="fw-bold mb-3">{product.name}</h1>
              
              {/* Rating */}
              <div className="rating mb-3">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i}
                    className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                  ></i>
                ))}
                <span className="ms-2 text-muted">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="display-6 fw-bold" style={{ color: '#0a192f' }}>Rs.{product.price}</span>
                {product.originalPrice && (
                  <span className="text-muted text-decoration-line-through ms-3 fs-5">
                    Rs.{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="lead mb-4">{product.fullDescription}</p>

              {/* Stock Status */}
              <div className="mb-4">
                {product.inStock ? (
                  <p className="text-success">
                    <i className="fas fa-check-circle me-2"></i> In Stock
                  </p>
                ) : (
                  <p className="text-danger">
                    <i className="fas fa-times-circle me-2"></i> Out of Stock
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="form-label fw-bold">Quantity:</label>
                <div className="input-group" style={{ width: '150px' }}>
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={!product.inStock}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    value={quantity}
                    readOnly
                    min="1"
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={increaseQuantity}
                    disabled={!product.inStock}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                className="btn btn-gold btn-lg w-100 mb-3"
                onClick={addToCart}
                disabled={!product.inStock}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                Add to Cart
              </button>

              {/* Additional Info */}
              <div className="additional-info mt-4 p-3 bg-light rounded">
                <p className="mb-2">
                  <i className="fas fa-truck me-2" style={{ color: '#d4af37' }}></i>
                  Free shipping on orders over Rs.5,000
                </p>
                <p className="mb-2">
                  <i className="fas fa-undo me-2" style={{ color: '#d4af37' }}></i>
                  30-day easy returns
                </p>
                <p className="mb-0">
                  <i className="fas fa-shield-alt me-2" style={{ color: '#d4af37' }}></i>
                  1-year warranty
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="section-title mb-4">Related Products</h3>
              </div>
              {relatedProducts.map(related => (
                <div className="col-md-3 mb-4" key={related.id}>
                  <div className="card product-card h-100 border-0 shadow-sm">
                    <div style={{ height: '150px', overflow: 'hidden' }}>
                      <img 
                        src={related.image} 
                        className="card-img-top" 
                        alt={related.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="card-body text-center">
                      <h6 className="fw-bold">{related.name}</h6>
                      <p className="price small">Rs.{related.price}</p>
                      <Link 
                        to={`/product/${related.id}`} 
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;