// src/services/orderService.js
import api from './api.js';

/**
 * Place a new order with Cash on Delivery
 * @param {Object} orderData - { orderItems, shippingAddress }
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * Fetch authenticated customer's order history
 */
export const getMyOrders = async () => {
  const response = await api.get('/orders/myOrders');
  return response.data;
};

const orderService = {
  createOrder,
  getMyOrders,
};

export default orderService;
