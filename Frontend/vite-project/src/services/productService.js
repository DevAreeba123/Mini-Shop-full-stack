// src/services/productService.js
import api from './api.js';

/**
 * Fetch paginated products from API
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 */
export const getProducts = async (page = 1, limit = 4) => {
  const response = await api.get(`/products?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Fetch single product details by MongoDB ID
 * @param {string} id - Product ID
 */
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

/**
 * Create a new product (Admin only)
 * @param {Object} productData - { name, description, price, category, image, stock }
 */
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

/**
 * Delete a product by MongoDB ID (Admin only)
 * @param {string} id - Product ID
 */
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

const productService = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
};

export default productService;
