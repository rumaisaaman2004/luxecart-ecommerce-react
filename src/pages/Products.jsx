import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';

const Products = () => {
  const { 
    products: allProducts, 
    deleteProduct, 
    updateProduct,
    searchProducts, 
    filterByCategory, 
    getCategories 
  } = useProductContext();
  
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    image: '',
    badge: '',
    badgeColor: '#dc3545'
  });
  const [editErrors, setEditErrors] = useState({});

  const categories = ['All', ...getCategories().filter(c => c !== 'All')];

  useEffect(() => {
    let filtered = allProducts;
    
    if (searchTerm) {
      filtered = searchProducts(searchTerm);
    }
    
    if (selectedCategory !== 'All') {
      filtered = filterByCategory(selectedCategory);
    }
    
    setProducts(filtered);
  }, [allProducts, searchTerm, selectedCategory, searchProducts, filterByCategory]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || '',
      stock: product.stock || '',
      image: product.image || '',
      badge: product.badge || '',
      badgeColor: product.badgeColor || '#dc3545'
    });
    setEditErrors({});
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editFormData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!editFormData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(editFormData.price) || editFormData.price <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!editFormData.stock) {
      errors.stock = 'Stock is required';
    } else if (isNaN(editFormData.stock) || editFormData.stock < 0) {
      errors.stock = 'Stock must be a positive number';
    }
    
    if (!editFormData.category) {
      errors.category = 'Category is required';
    }
    
    return errors;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
    
    const updatedData = {
      ...editFormData,
      price: parseFloat(editFormData.price),
      originalPrice: editFormData.originalPrice ? parseFloat(editFormData.originalPrice) : null,
      stock: parseInt(editFormData.stock)
    };
    
    updateProduct(editingProduct.id, updatedData);
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) return 'bg-danger';
    if (stock < 20) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="display-4 fw-bold">Our Products</h1>
          <p className="lead">Discover our curated collection of premium products</p>
        </div>
      </div>

      {/* Products Section */}
      <section className="py-5">
        <div className="container">
          {/* Search and Filter Bar */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select bg-light border-0"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2 text-end">
              <span className="text-muted">
                <i className="fas fa-box me-1"></i> {products.length} products
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="row g-4">
            {products.length > 0 ? (
              products.map(product => (
                <div className="col-sm-6 col-md-4 col-lg-3" key={product.id}>
                  <div className="card product-card h-100 border-0 shadow-sm position-relative">
                    {/* Admin Actions Overlay */}
                    <div className="position-absolute top-0 start-0 m-2 d-flex gap-2" style={{ zIndex: 2 }}>
                      <button
                        className="btn btn-sm btn-warning rounded-circle"
                        onClick={() => handleEditClick(product)}
                        title="Edit Product"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger rounded-circle"
                        onClick={() => handleDeleteClick(product)}
                        title="Delete Product"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                    {/* Product Badge */}
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
                        src={product.image || '/assets/placeholder.png'} 
                        className="card-img-top" 
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/assets/placeholder.png';
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0">{product.name}</h5>
                        <span className={`badge ${getStockBadge(product.stock)}`}>
                          {product.stock} left
                        </span>
                      </div>
                      <p className="text-muted small mb-2">{product.description}</p>
                      <p className="text-muted small mb-2">
                        <i className="fas fa-tag me-1"></i> {product.category}
                      </p>
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
                <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
                <h4>No products found</h4>
                <p className="text-muted">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
                <p className="text-muted small mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  <i className="fas fa-trash me-2"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="row">
                    {/* Product Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${editErrors.name ? 'is-invalid' : ''}`}
                        value={editFormData.name}
                        onChange={handleEditChange}
                      />
                      {editErrors.name && (
                        <div className="invalid-feedback">{editErrors.name}</div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Category</label>
                      <select
                        name="category"
                        className={`form-select ${editErrors.category ? 'is-invalid' : ''}`}
                        value={editFormData.category}
                        onChange={handleEditChange}
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Gaming">Gaming</option>
                      </select>
                      {editErrors.category && (
                        <div className="invalid-feedback">{editErrors.category}</div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Price (Rs.)</label>
                      <input
                        type="number"
                        name="price"
                        className={`form-control ${editErrors.price ? 'is-invalid' : ''}`}
                        value={editFormData.price}
                        onChange={handleEditChange}
                      />
                      {editErrors.price && (
                        <div className="invalid-feedback">{editErrors.price}</div>
                      )}
                    </div>

                    {/* Original Price */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Original Price</label>
                      <input
                        type="number"
                        name="originalPrice"
                        className="form-control"
                        value={editFormData.originalPrice}
                        onChange={handleEditChange}
                      />
                    </div>

                    {/* Stock */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        className={`form-control ${editErrors.stock ? 'is-invalid' : ''}`}
                        value={editFormData.stock}
                        onChange={handleEditChange}
                      />
                      {editErrors.stock && (
                        <div className="invalid-feedback">{editErrors.stock}</div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        name="description"
                        rows="3"
                        className="form-control"
                        value={editFormData.description}
                        onChange={handleEditChange}
                      ></textarea>
                    </div>

                    {/* Image URL */}
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">Image URL</label>
                      <input
                        type="url"
                        name="image"
                        className="form-control"
                        value={editFormData.image}
                        onChange={handleEditChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Badge */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Badge</label>
                      <select
                        name="badge"
                        className="form-select"
                        value={editFormData.badge}
                        onChange={handleEditChange}
                      >
                        <option value="">No Badge</option>
                        <option value="Sale">Sale</option>
                        <option value="New">New</option>
                        <option value="Best Seller">Best Seller</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;