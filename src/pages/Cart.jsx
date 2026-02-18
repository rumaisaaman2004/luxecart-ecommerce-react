import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 2499,
      quantity: 2,
      image: '/assets/headphone2.png'
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      price: 8999,
      quantity: 1,
      image: '/assets/smartwatch.png'
    },
    {
      id: 3,
      name: 'Gaming Headset',
      price: 7999,
      quantity: 1,
      image: '/assets/gaming.png'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 199;
  const total = subtotal + shipping;

  return (
    <>
      {/* Page Header */}
      <section style={{
        backgroundColor: '#0a192f',
        color: 'white',
        padding: '60px 0',
        marginTop: '76px'
      }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Shopping Cart</h1>
          <p className="lead">{cartItems.length} items in your cart</p>
        </div>
      </section>

      {/* Cart Section */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
              <h3>Your cart is empty</h3>
              <Link to="/products" className="btn btn-gold mt-3">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="row">
              {/* Cart Items */}
              <div className="col-lg-8">
                {cartItems.map(item => (
                  <div className="card mb-3 shadow-sm" key={item.id}>
                    <div className="row g-0 p-3">
                      <div className="col-md-2">
                        <img 
                          src={item.image} 
                          className="img-fluid" 
                          alt={item.name}
                          style={{ maxHeight: '80px' }}
                        />
                      </div>
                      <div className="col-md-4">
                        <h5 className="fw-bold">{item.name}</h5>
                        <p className="text-primary">Rs.{item.price}</p>
                      </div>
                      <div className="col-md-3">
                        <div className="input-group" style={{ width: '120px' }}>
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <input 
                            type="text" 
                            className="form-control text-center form-control-sm"
                            value={item.quantity}
                            readOnly
                          />
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <p className="fw-bold">Rs.{item.price * item.quantity}</p>
                      </div>
                      <div className="col-md-1">
                        <button 
                          className="btn btn-link text-danger"
                          onClick={() => removeItem(item.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="fw-bold mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal:</span>
                      <span className="fw-bold">Rs.{subtotal}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping:</span>
                      <span className="fw-bold">
                        {shipping === 0 ? 'Free' : `Rs.${shipping}`}
                      </span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="h5 fw-bold">Total:</span>
                      <span className="h5 fw-bold text-primary">Rs.{total}</span>
                    </div>
                    <button className="btn btn-gold w-100 mb-3">
                      Proceed to Checkout
                    </button>
                    <Link to="/products" className="btn btn-outline-secondary w-100">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;