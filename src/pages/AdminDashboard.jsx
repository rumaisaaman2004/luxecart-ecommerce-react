import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { useProductContext } from '../context/ProductContext';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const { products: contextProducts, addProduct, updateProduct, deleteProduct } = useProductContext();
  
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  // Product Management States
  const [productsList, setProductsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    stock: '',
    image: '',
    badge: '',
    badgeColor: '#dc3545'
  });

  // Update productsList when contextProducts changes
  useEffect(() => {
    setProductsList(contextProducts);
  }, [contextProducts]);

  // Filter products based on search
  const filteredProducts = productsList.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || 'Electronics',
      stock: product.stock || '',
      image: product.image || '',
      badge: product.badge || '',
      badgeColor: product.badgeColor || '#dc3545'
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
  e.preventDefault();
  
  // Validate image URL
  let imageUrl = editFormData.image;
  if (!imageUrl || imageUrl.trim() === '') {
    imageUrl = '/assets/placeholder.png';
  } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = '/assets/' + imageUrl;
  }
  
  const productData = {
    ...editFormData,
    image: imageUrl,
    price: parseFloat(editFormData.price) || 0,
    originalPrice: editFormData.originalPrice ? parseFloat(editFormData.originalPrice) : null,
    stock: parseInt(editFormData.stock) || 0,
    status: parseInt(editFormData.stock) > 0 ? 
            (parseInt(editFormData.stock) < 20 ? 'Low Stock' : 'In Stock') : 
            'Out of Stock'
  };

  if (!editingProduct) {
    // Add new product - Use timestamp for unique ID
    const newId = Date.now().toString();
    const newProduct = {
      id: newId,
      ...productData
    };
    addProduct(newProduct); // Context will handle the update
  } else {
    // Update existing product using context
    updateProduct(editingProduct.id, productData); // Context will handle the update
  }
  
  // Close modal and reset form
  setShowEditModal(false);
  setEditingProduct(null);
  setEditFormData({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    stock: '',
    image: '',
    badge: '',
    badgeColor: '#dc3545'
  });
};

  const handleViewProduct = (productId) => {
    window.open(`/product/${productId}`, '_blank');
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (window.innerWidth <= 992) {
      document.body.style.overflow = !sidebarOpen ? 'hidden' : '';
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.style.overflow = '';
  };

  // Sales Chart Data
  const salesData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Sales (in Rs.)',
        data: [120000, 190000, 150000, 250000, 220000, 300000, 284750],
        borderColor: '#0a192f',
        backgroundColor: 'rgba(10, 25, 47, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rs' + (value/1000).toFixed(0) + 'K';
          }
        }
      }
    }
  };

  // Traffic Sources Chart Data
  const trafficData = {
    labels: ['Direct', 'Social Media', 'Email', 'Referrals', 'Organic Search'],
    datasets: [
      {
        data: [35, 25, 15, 10, 15],
        backgroundColor: ['#0a192f', '#d4af37', '#28a745', '#dc3545', '#17a2b8'],
        borderWidth: 1
      }
    ]
  };

  // Category Revenue Chart Data
  const categoryData = {
    labels: ['Electronics', 'Fashion', 'Accessories', 'Footwear'],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: ['#0a192f', '#d4af37', '#28a745', '#dc3545'],
        borderWidth: 1
      }
    ]
  };

  // Orders Data
  const orders = [
    { id: '#ORD-7842', customer: 'dular fatima', date: '08 Feb 2026', amount: 12499, status: 'Delivered' },
    { id: '#ORD-7841', customer: 'zubala', date: '07 Feb 2026', amount: 5999, status: 'Pending' },
    { id: '#ORD-7840', customer: 'rumaisa aman', date: '07 Feb 2026', amount: 8999, status: 'Shipped' },
    { id: '#ORD-7839', customer: 'sameeha', date: '06 Feb 2026', amount: 24999, status: 'Cancelled' },
    { id: '#ORD-7838', customer: 'daneen', date: '06 Feb 2026', amount: 3499, status: 'Delivered' },
  ];

  // Customers Data
  const customers = [
    { name: 'Raheel shokat', email: 'Raheel@gmail.com', orders: 12, spent: 124990, status: 'Active', avatar: 'Raheel+shokat' },
    { name: 'Pari', email: 'pari@gmail.com', orders: 8, spent: 89990, status: 'Active', avatar: 'Pari' },
    { name: 'Amina Pari', email: 'amina@gmail.com', orders: 15, spent: 315000, status: 'Active', avatar: 'Amina+Pari' },
    { name: 'Naila Salman', email: 'naila@gmail.com', orders: 5, spent: 64995, status: 'Inactive', avatar: 'Naila+Salman' },
  ];

  // Top Products Data
  const topProducts = [
    { name: 'Wireless Headphones', sold: 128, price: 5999, image: '/assets/product1.avif' },
    { name: 'Smart Watch Pro', sold: 94, price: 8999, image: '/assets/smartwatch.png' },
    { name: 'Pro Runner Shoes', sold: 76, price: 3499, image: '/assets/joggers.png' },
    { name: 'Smartphone X', sold: 52, price: 24999, image: '/assets/product3.png' },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      'Delivered': 'bg-success',
      'Pending': 'bg-warning',
      'Shipped': 'bg-info',
      'Cancelled': 'bg-danger',
      'Processing': 'bg-primary',
      'In Stock': 'bg-success',
      'Low Stock': 'bg-warning',
      'Active': 'bg-success',
      'Inactive': 'bg-warning'
    };
    return colors[status] || 'bg-secondary';
  };

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard':
        return (
          <div>
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">Dashboard Overview</h1>
              <button className="btn btn-primary">
                <i className="fas fa-download me-2"></i> Export Report
              </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-xl-3 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Total Revenue</h6>
                        <h3 className="fw-bold mb-0">Rs.2.84L</h3>
                        <span className="text-success small">
                          <i className="fas fa-arrow-up me-1"></i> 12.5%
                        </span>
                      </div>
                      <div className="stats-icon bg-primary">
                        <i className="fas fa-rupee-sign"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Total Orders</h6>
                        <h3 className="fw-bold mb-0">1,248</h3>
                        <span className="text-success small">
                          <i className="fas fa-arrow-up me-1"></i> 8.2%
                        </span>
                      </div>
                      <div className="stats-icon bg-success">
                        <i className="fas fa-shopping-bag"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Customers</h6>
                        <h3 className="fw-bold mb-0">5,642</h3>
                        <span className="text-success small">
                          <i className="fas fa-arrow-up me-1"></i> 5.7%
                        </span>
                      </div>
                      <div className="stats-icon bg-warning">
                        <i className="fas fa-users"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Avg. Order Value</h6>
                        <h3 className="fw-bold mb-0">Rs.2,280</h3>
                        <span className="text-danger small">
                          <i className="fas fa-arrow-down me-1"></i> 2.3%
                        </span>
                      </div>
                      <div className="stats-icon bg-info">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4 mb-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0">
                    <h5 className="fw-bold mb-0">Sales Overview (Last 7 Months)</h5>
                  </div>
                  <div className="card-body" style={{ height: '300px' }}>
                    <Line data={salesData} options={salesOptions} />
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0">
                    <h5 className="fw-bold mb-0">Top Selling Products</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {topProducts.map((product, index) => (
                        <div key={index} className="list-group-item border-0 d-flex align-items-center py-3">
                          <div className="product-img me-3">
                            <img src={product.image} className="rounded" width="45" height="45" alt={product.name} />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0">{product.name}</h6>
                            <small className="text-muted">{product.sold} sold</small>
                          </div>
                          <span className="badge bg-primary">Rs.{product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                    <h5 className="fw-bold mb-0">Recent Orders</h5>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setActivePage('orders')}>
                      View All Orders
                    </button>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, index) => (
                            <tr key={index}>
                              <td className="fw-semibold">{order.id}</td>
                              <td>{order.customer}</td>
                              <td>{order.date}</td>
                              <td>Rs.{order.amount}</td>
                              <td><span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  <i className="fas fa-eye"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="row">
              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center py-4">
                    <i className="fas fa-mobile-alt fa-3x text-primary mb-3"></i>
                    <h5 className="fw-bold">Mobile Traffic</h5>
                    <h3 className="fw-bold">68%</h3>
                    <p className="text-muted mb-0">of total visits</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center py-4">
                    <i className="fas fa-shopping-cart fa-3x text-success mb-3"></i>
                    <h5 className="fw-bold">Conversion Rate</h5>
                    <h3 className="fw-bold">4.8%</h3>
                    <p className="text-muted mb-0">visits to purchase</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center py-4">
                    <i className="fas fa-star fa-3x text-warning mb-3"></i>
                    <h5 className="fw-bold">Customer Satisfaction</h5>
                    <h3 className="fw-bold">4.7/5</h3>
                    <p className="text-muted mb-0">based on 1,024 reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">Products Management</h1>
              <button className="btn btn-primary" onClick={() => {
                setEditingProduct(null);
                setEditFormData({
                  name: '',
                  description: '',
                  price: '',
                  originalPrice: '',
                  category: 'Electronics',
                  stock: '',
                  image: '',
                  badge: '',
                  badgeColor: '#dc3545'
                });
                setShowEditModal(true);
              }}>
                <i className="fas fa-plus me-2"></i> Add New Product
              </button>
            </div>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="row">
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
                  <div className="col-md-6 text-end">
                    <span className="text-muted">
                      <i className="fas fa-box me-1"></i> {filteredProducts.length} products
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="fw-semibold">{product.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={product.image || '/assets/placeholder.png'} 
                                className="rounded me-2" 
                                width="40" 
                                height="40" 
                                alt={product.name}
                                style={{ objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/assets/placeholder.png';
                                }}
                              />
                              <div>
                                <span className="fw-semibold">{product.name}</span>
                                <br />
                                <small className="text-muted">{product.description?.substring(0, 30)}...</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                              {product.category}
                            </span>
                          </td>
                          <td>
                            <span className="fw-bold">Rs.{product.price}</span>
                            {product.originalPrice && (
                              <small className="text-muted text-decoration-line-through ms-2">
                                Rs.{product.originalPrice}
                              </small>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${product.stock < 20 ? 'bg-warning' : 'bg-success'} px-3 py-2`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${product.stock > 0 ? (product.stock < 20 ? 'bg-warning' : 'bg-success') : 'bg-danger'}`}>
                              {product.stock > 0 ? (product.stock < 20 ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditClick(product)}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteClick(product)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleViewProduct(product.id)}
                                title="View"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                          <h5>No products found</h5>
                          <p className="text-muted">Try adjusting your search</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-0">
                      <h5 className="modal-title fw-bold">Confirm Delete</h5>
                      <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
                      <p className="text-muted small mb-0">This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer border-0">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
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

            {/* Add/Edit Product Modal */}
            {showEditModal && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-0">
                      <h5 className="modal-title fw-bold">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h5>
                      <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                    </div>
                    <form onSubmit={handleEditSubmit}>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Product Name</label>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              value={editFormData.name}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Category</label>
                            <select
                              name="category"
                              className="form-select"
                              value={editFormData.category}
                              onChange={handleEditChange}
                            >
                              <option value="Electronics">Electronics</option>
                              <option value="Fashion">Fashion</option>
                              <option value="Accessories">Accessories</option>
                              <option value="Footwear">Footwear</option>
                              <option value="Gaming">Gaming</option>
                            </select>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">Price (Rs.)</label>
                            <input
                              type="number"
                              name="price"
                              className="form-control"
                              value={editFormData.price}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
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
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">Stock</label>
                            <input
                              type="number"
                              name="stock"
                              className="form-control"
                              value={editFormData.stock}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
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
                          <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">Image URL</label>
                            <input
                              type="text"
                              name="image"
                              className="form-control"
                              value={editFormData.image}
                              onChange={handleEditChange}
                              placeholder="/assets/headphone2.png or filename.png"
                            />
                            <small className="text-muted">
                              Use: /assets/filename.png or just filename.png
                            </small>
                          </div>
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
                          <i className="fas fa-save me-2"></i>
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // ... rest of the cases remain the same (orders, customers, analytics, settings, profile, account-settings, help-center)
      case 'orders':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">Orders Management</h1>
              <div className="d-flex">
                <input type="text" className="form-control form-control-sm me-2" placeholder="Search orders..." style={{ width: '200px' }} />
                <button className="btn btn-sm btn-outline-primary me-2">Filter</button>
                <button className="btn btn-sm btn-primary">
                  <i className="fas fa-plus me-1"></i> New Order
                </button>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0">Recent Orders</h5>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-primary active">All</button>
                  <button className="btn btn-sm btn-outline-primary">Pending</button>
                  <button className="btn btn-sm btn-outline-primary">Completed</button>
                  <button className="btn btn-sm btn-outline-primary">Cancelled</button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={index}>
                          <td className="fw-semibold">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.date}</td>
                          <td>Rs.{order.amount}</td>
                          <td><span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-success">
                              <i className="fas fa-check"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">Customers Management</h1>
              <button className="btn btn-primary">
                <i className="fas fa-user-plus me-2"></i> Add Customer
              </button>
            </div>
            
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="fw-bold mb-0">All Customers</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {customers.map((customer, index) => (
                    <div className="col-md-3 mb-3" key={index}>
                      <div className="card border-0 shadow-sm text-center h-100">
                        <div className="card-body py-4">
                          <div className="customer-avatar mx-auto mb-3">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${customer.avatar}&background=0a192f&color=fff`} 
                              className="rounded-circle" width="60" height="60" alt={customer.name}
                            />
                          </div>
                          <h6 className="fw-bold mb-1">{customer.name}</h6>
                          <p className="text-muted small mb-2">{customer.email}</p>
                          <span className={`badge ${getStatusBadge(customer.status)}`}>{customer.status}</span>
                          <p className="text-muted small mt-2">{customer.orders} Orders • Rs.{customer.spent.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">Analytics & Reports</h1>
              <div className="d-flex">
                <select className="form-select form-select-sm me-2" style={{ width: '150px' }}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                </select>
                <button className="btn btn-sm btn-primary">
                  <i className="fas fa-download me-1"></i> Export
                </button>
              </div>
            </div>
            
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0">
                    <h5 className="fw-bold mb-0">Traffic Sources</h5>
                  </div>
                  <div className="card-body" style={{ height: '300px' }}>
                    <Pie data={trafficData} />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0">
                    <h5 className="fw-bold mb-0">Revenue by Category</h5>
                  </div>
                  <div className="card-body" style={{ height: '300px' }}>
                    <Pie data={categoryData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">Settings</h1>
              <button className="btn btn-primary" id="saveSettingsBtn">
                <i className="fas fa-save me-2"></i> Save Changes
              </button>
            </div>
            
            <div className="row">
              <div className="col-lg-3">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush" id="settings-tabs">
                      <button 
                        className={`list-group-item list-group-item-action ${activeSettingsTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveSettingsTab('general')}
                      >
                        <i className="fas fa-cog me-2"></i> General
                      </button>
                      <button 
                        className={`list-group-item list-group-item-action ${activeSettingsTab === 'payment' ? 'active' : ''}`}
                        onClick={() => setActiveSettingsTab('payment')}
                      >
                        <i className="fas fa-credit-card me-2"></i> Payment
                      </button>
                      <button 
                        className={`list-group-item list-group-item-action ${activeSettingsTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveSettingsTab('notifications')}
                      >
                        <i className="fas fa-bell me-2"></i> Notifications
                      </button>
                      <button 
                        className={`list-group-item list-group-item-action ${activeSettingsTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveSettingsTab('security')}
                      >
                        <i className="fas fa-shield-alt me-2"></i> Security
                      </button>
                      <button 
                        className={`list-group-item list-group-item-action ${activeSettingsTab === 'store' ? 'active' : ''}`}
                        onClick={() => setActiveSettingsTab('store')}
                      >
                        <i className="fas fa-store me-2"></i> Store Settings
                      </button>
                      <button 
                        className={`list-group-item list-group-item-action ${activeSettingsTab === 'shipping' ? 'active' : ''}`}
                        onClick={() => setActiveSettingsTab('shipping')}
                      >
                        <i className="fas fa-truck me-2"></i> Shipping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="tab-content">
                      {activeSettingsTab === 'general' && (
                        <div>
                          <h5 className="fw-bold mb-4">General Settings</h5>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Store Name</label>
                              <input type="text" className="form-control" defaultValue="LuxeCart" />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Store Email</label>
                              <input type="email" className="form-control" defaultValue="support@luxecart.com" />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Store Currency</label>
                              <select className="form-select" defaultValue="Pak Rupee (Rs.)">
                                <option>Pak Rupee (Rs.)</option>
                                <option>US Dollar ($)</option>
                                <option>Euro (€)</option>
                              </select>
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Timezone</label>
                              <select className="form-select" defaultValue="Asia/Karachi">
                                <option>Asia/Karachi (PKT)</option>
                                <option>UTC</option>
                                <option>America/New_York</option>
                              </select>
                            </div>
                            <div className="col-12 mb-3">
                              <label className="form-label">Store Description</label>
                              <textarea className="form-control" rows="3" defaultValue="Premium online store for luxury products"></textarea>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeSettingsTab === 'payment' && (
                        <div>
                          <h5 className="fw-bold mb-4">Payment Settings</h5>
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3">Payment Methods</h6>
                            <div className="form-check mb-2">
                              <input className="form-check-input" type="checkbox" id="stripe" defaultChecked />
                              <label className="form-check-label" htmlFor="stripe">Stripe Payment</label>
                            </div>
                            <div className="form-check mb-2">
                              <input className="form-check-input" type="checkbox" id="razorpay" defaultChecked />
                              <label className="form-check-label" htmlFor="razorpay">Razorpay</label>
                            </div>
                            <div className="form-check mb-2">
                              <input className="form-check-input" type="checkbox" id="cod" />
                              <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeSettingsTab === 'notifications' && (
                        <div>
                          <h5 className="fw-bold mb-4">Notification Settings</h5>
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3">Email Notifications</h6>
                            <div className="form-check mb-2">
                              <input className="form-check-input" type="checkbox" id="newOrderEmail" defaultChecked />
                              <label className="form-check-label" htmlFor="newOrderEmail">New Order Notifications</label>
                            </div>
                            <div className="form-check mb-2">
                              <input className="form-check-input" type="checkbox" id="lowStockEmail" defaultChecked />
                              <label className="form-check-label" htmlFor="lowStockEmail">Low Stock Alerts</label>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeSettingsTab === 'security' && (
                        <div>
                          <h5 className="fw-bold mb-4">Security Settings</h5>
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3">Two-Factor Authentication</h6>
                            <div className="form-check mb-2">
                              <input className="form-check-input" type="checkbox" id="enable2FA" />
                              <label className="form-check-label" htmlFor="enable2FA">Enable 2FA for Admin Login</label>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeSettingsTab === 'store' && (
                        <div>
                          <h5 className="fw-bold mb-4">Store Settings</h5>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Store Status</label>
                              <select className="form-select" defaultValue="Open">
                                <option>Open</option>
                                <option>Closed (Maintenance)</option>
                              </select>
                            </div>
                            <div className="col-12 mb-3">
                              <label className="form-label">Store Address</label>
                              <textarea className="form-control" rows="2" defaultValue="123 Luxury Street, Lahore"></textarea>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeSettingsTab === 'shipping' && (
                        <div>
                          <h5 className="fw-bold mb-4">Shipping Settings</h5>
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3">Shipping Methods</h6>
                            <div className="form-check mb-2">
                              <input className="form-check-input" type="checkbox" id="standardShipping" defaultChecked />
                              <label className="form-check-label" htmlFor="standardShipping">Standard Shipping (3-5 days)</label>
                            </div>
                            <div className="form-check mb-2">
                              <input className="form-check-input" type="checkbox" id="expressShipping" defaultChecked />
                              <label className="form-check-label" htmlFor="expressShipping">Express Shipping (1-2 days)</label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">My Profile</h1>
              <button className="btn btn-primary" id="updateProfileBtn">
                <i className="fas fa-save me-2"></i> Update Profile
              </button>
            </div>
            
            <div className="row">
              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center py-4">
                    <div className="profile-avatar mb-3">
                      <img 
                        src="https://ui-avatars.com/api/?name=Admin+User&background=0a192f&color=fff&bold=true&size=150" 
                        className="rounded-circle" width="120" height="120" alt="Admin"
                      />
                      <div className="avatar-upload mt-3">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-camera me-1"></i> Change Photo
                        </button>
                      </div>
                    </div>
                    <h4 className="fw-bold mb-1">Admin User</h4>
                    <p className="text-muted mb-2">Super Administrator</p>
                    <span className="badge bg-success mb-3">Active</span>
                    <div className="profile-stats mt-3">
                      <div className="row">
                        <div className="col-6">
                          <h5 className="fw-bold mb-1">1,248</h5>
                          <small className="text-muted">Orders</small>
                        </div>
                        <div className="col-6">
                          <h5 className="fw-bold mb-1">5,642</h5>
                          <small className="text-muted">Customers</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="fw-bold mb-4">Personal Information</h5>
                    <form>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">First Name</label>
                          <input type="text" className="form-control" defaultValue="Admin" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Last Name</label>
                          <input type="text" className="form-control" defaultValue="User" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email Address</label>
                          <input type="email" className="form-control" defaultValue="admin@luxecart.com" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Phone Number</label>
                          <input type="tel" className="form-control" defaultValue="+92 300 1234567" />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label">Bio</label>
                          <textarea className="form-control" rows="3">Experienced administrator with 5+ years in e-commerce management.</textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'account-settings':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">Account Settings</h1>
              <button className="btn btn-primary">
                <i className="fas fa-save me-2"></i> Save Changes
              </button>
            </div>
            
            <div className="row">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="fw-bold mb-4">Account Preferences</h5>
                    
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">Email Preferences</h6>
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="orderUpdates" defaultChecked />
                        <label className="form-check-label" htmlFor="orderUpdates">Order updates and notifications</label>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">Interface Preferences</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Theme</label>
                          <select className="form-select" defaultValue="Light">
                            <option>Light</option>
                            <option>Dark</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Language</label>
                          <select className="form-select" defaultValue="English">
                            <option>English</option>
                            <option>Urdu</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm border-danger">
                  <div className="card-header bg-white border-danger">
                    <h5 className="fw-bold mb-0 text-danger">Danger Zone</h5>
                  </div>
                  <div className="card-body">
                    <button className="btn btn-outline-danger w-100 mb-2">
                      <i className="fas fa-download me-2"></i> Export Account Data
                    </button>
                    <button className="btn btn-outline-danger w-100 mb-2">
                      <i className="fas fa-ban me-2"></i> Deactivate Account
                    </button>
                    <button className="btn btn-danger w-100">
                      <i className="fas fa-trash me-2"></i> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help-center':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold text-dark">Help Center</h1>
              <button className="btn btn-primary">
                <i className="fas fa-headset me-2"></i> Contact Support
              </button>
            </div>
            
            <div className="row">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="fw-bold mb-4">Frequently Asked Questions</h5>
                    
                    <div className="accordion" id="helpAccordion">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#help1">
                            How do I add a new product?
                          </button>
                        </h2>
                        <div id="help1" className="accordion-collapse collapse show" data-bs-parent="#helpAccordion">
                          <div className="accordion-body">
                            To add a new product, navigate to the Products page and click "Add New Product".
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">Contact Support</h5>
                    <div className="support-contact mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-envelope text-primary me-2"></i>
                        <span>support@luxecart.com</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-phone text-success me-2"></i>
                        <span>+92 300 1234567</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">Submit a Ticket</h6>
                      <input type="text" className="form-control mb-3" placeholder="Subject" />
                      <textarea className="form-control mb-3" rows="3" placeholder="Message"></textarea>
                      <button className="btn btn-primary w-100">
                        <i className="fas fa-paper-plane me-2"></i> Submit Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-body">
      <div className="d-flex" id="wrapper">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && window.innerWidth <= 992 && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* Sidebar */}
        <div className={`sidebar-wrapper border-end ${sidebarOpen ? '' : 'collapsed'}`} id="sidebar-wrapper">
          {/* Sidebar Header */}
          <div className="sidebar-header text-center py-4 position-relative">
            <button className="btn btn-sm btn-danger sidebar-close-btn" onClick={closeSidebar}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div className="sidebar-logo">
                <i className="fas fa-crown fa-2x text-gold"></i>
              </div>
              <div className="ms-3">
                <h4 className="fw-bold mb-0">LuxeCart</h4>
              </div>
            </div>
            <div className="sidebar-divider"></div>
          </div>
          
          {/* Sidebar Menu */}
          <div className="sidebar-menu">
            <div className="list-group list-group-flush">
              <button 
                className={`list-group-item list-group-item-action ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('dashboard');
                  if (window.innerWidth <= 992) closeSidebar();
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="sidebar-icon">
                    <i className="fas fa-tachometer-alt"></i>
                  </div>
                  <span className="ms-3">Dashboard</span>
                </div>
              </button>
              
              <button 
                className={`list-group-item list-group-item-action ${activePage === 'products' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('products');
                  if (window.innerWidth <= 992) closeSidebar();
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="sidebar-icon">
                    <i className="fas fa-box"></i>
                  </div>
                  <span className="ms-3">Products</span>
                </div>
              </button>
              
              <button 
                className={`list-group-item list-group-item-action ${activePage === 'orders' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('orders');
                  if (window.innerWidth <= 992) closeSidebar();
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="sidebar-icon">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <span className="ms-3">Orders</span>
                  <span className="badge bg-danger ms-auto">12</span>
                </div>
              </button>
              
              <button 
                className={`list-group-item list-group-item-action ${activePage === 'customers' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('customers');
                  if (window.innerWidth <= 992) closeSidebar();
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="sidebar-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <span className="ms-3">Customers</span>
                </div>
              </button>
              
              <button 
                className={`list-group-item list-group-item-action ${activePage === 'analytics' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('analytics');
                  if (window.innerWidth <= 992) closeSidebar();
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="sidebar-icon">
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <span className="ms-3">Analytics</span>
                </div>
              </button>
              
              <button 
                className={`list-group-item list-group-item-action ${activePage === 'settings' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('settings');
                  if (window.innerWidth <= 992) closeSidebar();
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="sidebar-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <span className="ms-3">Settings</span>
                </div>
              </button>
              
              {/* View Store Button */}
              <a 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="list-group-item list-group-item-action view-store-item"
              >
                <div className="d-flex align-items-center">
                  <div className="sidebar-icon">
                    <i className="fas fa-store"></i>
                  </div>
                  <span className="ms-3">View Store</span>
                </div>
              </a>
            </div>
          </div>
          
          {/* Sidebar Footer */}
          <div className="sidebar-footer p-4 border-top">
            <div className="d-flex align-items-center mb-3">
              <div className="user-avatar me-3">
                <img 
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0a192f&color=fff&bold=true" 
                  className="rounded-circle" width="45" height="45" alt="Admin"
                />
              </div>
              <div className="user-info">
                <h6 className="mb-0 fw-semibold">Admin User</h6>
                <small className="text-muted">Super Administrator</small>
              </div>
            </div>
            <a href="/" className="btn btn-outline-dark btn-sm w-100 d-flex align-items-center justify-content-center">
              <i className="fas fa-sign-out-alt me-2"></i> Logout
            </a>
          </div>
        </div>

        {/* Page Content */}
        <div id="page-content-wrapper">
          {/* Top Navbar */}
          <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 shadow-sm">
            <div className="container-fluid px-3">
              <button className="btn btn-dark btn-sm me-3" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
              </button>
              
              <div className="navbar-brand d-none d-md-block">
                <div className="d-flex align-items-center">
                  <span className="fw-bold" id="page-title">
                    {activePage === 'dashboard' && 'Dashboard'}
                    {activePage === 'products' && 'Products'}
                    {activePage === 'orders' && 'Orders'}
                    {activePage === 'customers' && 'Customers'}
                    {activePage === 'analytics' && 'Analytics'}
                    {activePage === 'settings' && 'Settings'}
                    {activePage === 'profile' && 'My Profile'}
                    {activePage === 'account-settings' && 'Account Settings'}
                    {activePage === 'help-center' && 'Help Center'}
                  </span>
                </div>
              </div>
              
              <div className="navbar-nav ms-auto align-items-center">
                {/* Notifications Dropdown */}
                <div className="nav-item dropdown me-1">
                  <a className="nav-link position-relative" href="#" id="notificationsDropdown" data-bs-toggle="dropdown">
                    <div className="notification-icon">
                      <i className="fas fa-bell"></i>
                      <span className="notification-badge">5</span>
                    </div>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end shadow-lg border-0" style={{ minWidth: '320px' }}>
                    <div className="dropdown-header d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">Notifications</h6>
                      <span className="badge bg-primary">5 new</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    
                    <a className="dropdown-item d-flex align-items-center py-3" href="#">
                      <div className="notification-icon-wrapper bg-primary text-white me-3">
                        <i className="fas fa-shopping-cart"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">New Order Received</div>
                        <small className="text-muted">Order #ORD-7845</small>
                      </div>
                      <small className="text-muted ms-2">2 min ago</small>
                    </a>
                    
                    <a className="dropdown-item d-flex align-items-center py-3" href="#">
                      <div className="notification-icon-wrapper bg-success text-white me-3">
                        <i className="fas fa-user-plus"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">New Customer</div>
                        <small className="text-muted">Rumaisa Aman registered</small>
                      </div>
                      <small className="text-muted ms-2">1 hour ago</small>
                    </a>
                    
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item text-center text-primary fw-semibold" href="#">
                      View all notifications
                    </a>
                  </div>
                </div>
                
                {/* User Dropdown */}
                <div className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" data-bs-toggle="dropdown">
                    <span className="d-none d-md-inline fw-semibold">Admin</span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                    <div className="dropdown-header">
                      <h6 className="mb-0">Admin Panel</h6>
                      <small className="text-muted">Super Administrator</small>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={() => setActivePage('profile')}>
                      <i className="fas fa-user me-2"></i> My Profile
                    </button>
                    <button className="dropdown-item" onClick={() => setActivePage('account-settings')}>
                      <i className="fas fa-cog me-2"></i> Account Settings
                    </button>
                    <button className="dropdown-item" onClick={() => setActivePage('help-center')}>
                      <i className="fas fa-question-circle me-2"></i> Help Center
                    </button>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item text-danger" href="/">
                      <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="container-fluid px-4 py-4">
            <div id="dynamic-content">
              {renderContent()}
            </div>
          </div>

          {/* Footer */}
          <footer className="footer border-top py-3">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <span className="text-muted">
                    © 2026 LuxeCart Admin Panel
                  </span>
                </div>
                <div className="col-md-6 text-md-end">
                  <span className="text-muted">
                    <i className="fas fa-circle text-success me-1"></i>
                    System Status: <strong className="text-success">Operational</strong>
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <style>{`
        /* Import Poppins font */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .admin-body {
          background-color: #f8f9fa;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          height: 100%;
        }

        #wrapper {
          display: flex;
          min-height: 100vh;
          position: relative;
          width: 100%;
        }

        /* Sidebar Styles */
        .sidebar-wrapper {
          min-height: 100vh;
          width: 280px;
          background: #fff;
          border-right: 1px solid rgba(0,0,0,0.1);
          box-shadow: 2px 0 15px rgba(0,0,0,0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1050;
          flex-shrink: 0;
          overflow: hidden;
          overflow-y: auto;
        }

        .sidebar-wrapper.collapsed {
          width: 0;
          min-width: 0;
          overflow: hidden;
        }

        .sidebar-header {
          background: linear-gradient(135deg, #0a192f 0%, #1a3a5f 100%);
          padding: 1.5rem 1rem !important;
          position: relative;
          flex-shrink: 0;
        }

        .sidebar-logo {
          background: rgba(255,255,255,0.1);
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .sidebar-header h4 {
          color: white;
          font-size: 1.4rem;
          margin-bottom: 0.25rem;
        }

        .sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.2);
          margin: 1rem auto;
          width: 80%;
        }

        .sidebar-menu {
          flex: 1;
          padding: 1rem 0;
          overflow-x: hidden;
          min-height: 0;
        }

        .list-group-item {
          border: none;
          padding: 0.9rem 1.5rem;
          color: #5a6a85;
          font-weight: 500;
          transition: all 0.3s;
          background: transparent;
          border-left: 4px solid transparent;
          cursor: pointer;
        }

        .list-group-item:hover {
          background-color: rgba(10, 25, 47, 0.05);
          color: #0a192f;
          border-left-color: rgba(212, 175, 55, 0.5);
          padding-left: 2rem;
        }

        .list-group-item.active {
          background-color: rgba(10, 25, 47, 0.1);
          color: #0a192f;
          border-left-color: #d4af37;
          font-weight: 600;
        }

        .sidebar-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(10, 25, 47, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5a6a85;
          transition: all 0.3s;
        }

        .list-group-item:hover .sidebar-icon {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }

        .list-group-item.active .sidebar-icon {
          background: #d4af37;
          color: white;
        }

        .view-store-item {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%);
          border-left: 4px solid #d4af37 !important;
          margin-top: 10px;
          border-top: 1px solid rgba(212, 175, 55, 0.2) !important;
        }

        .view-store-item:hover {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.15) 100%) !important;
          border-left-color: #d4af37 !important;
        }

        .view-store-item .sidebar-icon {
          background: #d4af37 !important;
          color: white !important;
        }

        .view-store-item span {
          color: #0a192f !important;
          font-weight: 600 !important;
        }

        .sidebar-footer {
          background: #f8f9fa;
          border-top: 1px solid rgba(0,0,0,0.1);
          flex-shrink: 0;
          padding: 1rem;
        }

        .user-avatar {
          position: relative;
        }

        .user-avatar::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background-color: #28a745;
          border-radius: 50%;
          border: 2px solid white;
        }

        #page-content-wrapper {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          width: 100%;
          transition: all 0.3s ease;
        }

        /* Navbar */
        .navbar {
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          padding: 0.75rem 0;
          position: sticky;
          top: 0;
          z-index: 1030;
        }

        .notification-icon {
          position: relative;
          width: 40px;
          height: 40px;
          background: rgba(10, 25, 47, 0.05);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5a6a85;
          transition: all 0.3s;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #dc3545;
          color: white;
          font-size: 0.65rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .notification-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dropdown-menu {
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .dropdown-item {
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          margin: 0.1rem 0.5rem;
          width: auto;
          transition: all 0.2s;
        }

        .dropdown-item:hover {
          background-color: rgba(10, 25, 47, 0.05);
        }

        #page-content-wrapper > .container-fluid {
          flex: 1;
          padding: 1.5rem;
        }

        .card {
          border-radius: 12px;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid rgba(0,0,0,0.05);
          height: 100%;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }

        .stats-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .table th {
          font-weight: 600;
          color: #495057;
          background-color: #f8f9fa;
          border-top: none;
          padding: 1rem;
        }

        .table td {
          padding: 1rem;
          vertical-align: middle;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(10, 25, 47, 0.03);
        }

        .footer {
          background-color: #fff;
          border-top: 1px solid rgba(0,0,0,0.1);
          margin-top: auto;
        }

        .text-gold {
          color: #d4af37 !important;
        }

        .sidebar-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: none;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          z-index: 1051;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          transition: all 0.3s;
        }

        .card-body canvas {
          width: 100% !important;
          max-width: 100%;
          height: 250px !important;
        }

        /* Desktop View */
        @media (min-width: 993px) {
          .sidebar-wrapper {
            position: sticky;
            top: 0;
            height: 100vh;
            overflow: auto;
          }
          
          #page-content-wrapper {
            width: calc(100% - 280px);
            margin-left: 0;
            flex: 1;
          }
          
          #wrapper.toggled .sidebar-wrapper {
            margin-left: -280px;
            transform: translateX(-100%);
          }
          
          .sidebar-close-btn {
            display: none !important;
          }
          
          #page-content-wrapper > .container-fluid {
            padding: 2rem 2.5rem !important;
            max-width: 100%;
          }
        }

        /* Mobile View */
        @media (max-width: 992px) {
          .sidebar-wrapper {
            position: fixed;
            left: -280px;
            top: 0;
            bottom: 0;
            z-index: 1050;
            width: 280px;
            height: 100vh;
            transition: left 0.3s ease-in-out;
            box-shadow: 5px 0 25px rgba(0,0,0,0.15);
          }
          
          .sidebar-wrapper:not(.collapsed) {
            left: 0;
          }
          
          .sidebar-overlay {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1049;
            display: block;
          }
          
          #page-content-wrapper {
            width: 100% !important;
            margin-left: 0 !important;
          }
          
          .sidebar-close-btn {
            display: flex !important;
          }
          
          #page-content-wrapper > .container-fluid {
            padding: 1rem !important;
          }
          
          .d-flex.justify-content-between {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
          
          .stats-icon {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }
          
          .btn-primary {
            width: 100%;
          }
        }

        /* Small Mobile */
        @media (max-width: 576px) {
          .sidebar-wrapper {
            width: 85%;
            max-width: 280px;
          }
          
          #page-content-wrapper > .container-fluid {
            padding: 0.75rem !important;
          }
          
          .card-body {
            padding: 0.75rem;
          }
        }

        /* Utility Classes */
        .d-flex {
          display: flex !important;
        }

        .flex-grow-1 {
          flex-grow: 1 !important;
        }

        .overflow-hidden {
          overflow: hidden !important;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        .sidebar-wrapper {
          z-index: 1050;
        }

        .navbar {
          z-index: 1030;
        }

        .dropdown-menu {
          z-index: 1060;
        }

        /* Print Styles */
        @media print {
          .sidebar-wrapper,
          .navbar,
          .btn,
          .footer {
            display: none !important;
          }
          
          #page-content-wrapper {
            width: 100% !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;