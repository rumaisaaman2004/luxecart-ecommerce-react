import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Sample initial products data
const initialProducts = [
  {
    id: 'P001',
    name: 'Wireless Headphones',
    description: 'Premium sound, noise cancellation',
    price: 5999,
    originalPrice: 7999,
    category: 'Electronics',
    stock: 128,
    image: '/assets/headphone2.png',
    badge: 'Sale',
    badgeColor: '#dc3545'
  },
  {
    id: 'P002',
    name: 'Smart Watch Pro',
    description: 'Health tracking, stylish design',
    price: 8999,
    originalPrice: null,
    category: 'Electronics',
    stock: 94,
    image: '/assets/smartwatch.png',
    badge: 'New',
    badgeColor: '#28a745'
  },
  {
    id: 'P003',
    name: 'Pro Runner Shoes',
    description: 'Comfortable running shoes',
    price: 3499,
    originalPrice: 4999,
    category: 'Fashion',
    stock: 76,
    image: '/assets/joggers.png',
    badge: 'Sale',
    badgeColor: '#dc3545'
  },
  {
    id: 'P004',
    name: 'Smartphone X',
    description: '128GB, 48MP Camera, 5G',
    price: 24999,
    originalPrice: null,
    category: 'Electronics',
    stock: 52,
    image: '/assets/product3.png',
    badge: 'Best Seller',
    badgeColor: '#ffc107'
  }
];

// Create context
const ProductContext = createContext();

// Custom hook for product management
const useProducts = () => {
  const [products, setProducts] = useLocalStorage('products', initialProducts);

  // Create new product
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  // Update product
  const updateProduct = (id, updatedData) => {
    const updatedProducts = products.map(product => 
      product.id === id || product.id === parseInt(id) 
        ? { ...product, ...updatedData }
        : product
    );
    setProducts(updatedProducts);
    return updatedProducts;
  };

  // Delete product
  const deleteProduct = (id) => {
    const filteredProducts = products.filter(product => 
      product.id !== id && product.id !== parseInt(id)
    );
    setProducts(filteredProducts);
    return true;
  };

  // Get product by ID
  const getProductById = (id) => {
    return products.find(p => p.id === id || p.id === parseInt(id));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
  };
};

// Provider component
export const ProductProvider = ({ children }) => {
  const productMethods = useProducts();

  return (
    <ProductContext.Provider value={productMethods}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};