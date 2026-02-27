import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useProductContext(); // Get products from context/Local Storage
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // FIXED: Handle multiple ID formats
  useEffect(() => {
    console.log('Looking for product with ID:', id);
    setLoading(true);
    
    if (!products || products.length === 0) {
      console.log('No products available');
      setLoading(false);
      return;
    }
    
    // Try different matching strategies
    let foundProduct = null;
    
    // Strategy 1: Direct string match
    foundProduct = products.find(p => p.id === id);
    
    // Strategy 2: If ID is numeric timestamp, try to find by numeric ID
    if (!foundProduct && !isNaN(parseInt(id))) {
      const numericId = parseInt(id);
      foundProduct = products.find(p => p.id === numericId || p.id === String(numericId));
    }
    
    // Strategy 3: If ID starts with 'P', try removing P and match numeric
    if (!foundProduct && typeof id === 'string' && id.startsWith('P')) {
      const numericPart = parseInt(id.substring(1));
      if (!isNaN(numericPart)) {
        foundProduct = products.find(p => {
          // Check if product ID is numeric
          if (!isNaN(parseInt(p.id))) {
            return parseInt(p.id) === numericPart;
          }
          // Check if product ID is PXXX format
          if (typeof p.id === 'string' && p.id.startsWith('P')) {
            return parseInt(p.id.substring(1)) === numericPart;
          }
          return false;
        });
      }
    }
    
    // Strategy 4: Try to match by any means
    if (!foundProduct) {
      foundProduct = products.find(p => 
        String(p.id) === String(id) || 
        String(p.id).replace('P', '') === String(id).replace('P', '')
      );
    }
    
    console.log('Found product:', foundProduct);
    setProduct(foundProduct);
    setSelectedImage(0);
    setLoading(false);
  }, [id, products]);

  // Get related products (same category)
  const getRelatedProducts = () => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(prev => prev - 1);

  const addToCart = () => {
    alert(`${quantity} x ${product?.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2>Product not found</h2>
        <p className="text-muted">Product ID: {id}</p>
        <p className="text-muted small">Available IDs: {products.map(p => p.id).join(', ')}</p>
        <Link to="/products" className="btn btn-gold mt-3">Back to Products</Link>
      </div>
    );
  }

  // Ensure images array exists
  const productImages = product.images || (product.image ? [product.image] : []);
  
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
              <li className="breadcrumb-item active">{product.name}</li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="row mt-4">
            {/* Product Images */}
            <div className="col-md-6 mb-4">
              <div className="main-image mb-3">
                <img 
                  src={productImages[selectedImage] || product.image || '/assets/placeholder.png'} 
                  className="img-fluid rounded shadow" 
                  alt={product.name}
                  style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                  }}
                />
              </div>
              
              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="row g-2">
                  {productImages.map((img, index) => (
                    <div className="col-3" key={index}>
                      <img 
                        src={img} 
                        className={`img-thumbnail ${selectedImage === index ? 'active-thumbnail' : ''}`}
                        alt={`${product.name} - ${index + 1}`}
                        style={{ cursor: 'pointer', height: '80px', objectFit: 'cover' }}
                        onClick={() => setSelectedImage(index)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80?text=Error';
                        }}
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
                    backgroundColor: product.badgeColor || '#6c757d',
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
                    className={`fas fa-star ${i < Math.floor(product.rating || 0) ? 'text-warning' : 'text-muted'}`}
                  ></i>
                ))}
                <span className="ms-2 text-muted">({product.reviews || 0} reviews)</span>
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
              <p className="lead mb-4">{product.fullDescription || product.description}</p>

              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <p className="text-success">
                    <i className="fas fa-check-circle me-2"></i> In Stock ({product.stock} units)
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
                    disabled={product.stock <= 0}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    value={quantity}
                    readOnly
                    min="1"
                    max={product.stock}
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={increaseQuantity}
                    disabled={product.stock <= 0}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                className="btn btn-gold btn-lg w-100 mb-3"
                onClick={addToCart}
                disabled={product.stock <= 0}
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
                        src={related.image || '/assets/placeholder.png'} 
                        className="card-img-top" 
                        alt={related.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
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