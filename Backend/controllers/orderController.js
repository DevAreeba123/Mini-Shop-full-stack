// Backend/controllers/orderController.js
import mongoose from 'mongoose';
import Order from '../models/order.js';
import Product from '../models/product.js';

// @desc    Place a new order (Cash on Delivery)
// @route   POST /api/orders
// @access  Logged-in user
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    // 1. Validate shipping details
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        message: 'Please provide full shipping details (name, address, city, postal code)',
      });
    }

    // 2. Validate order items
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    // 3. Check every product and stock using fresh data from MongoDB.
    // We never trust price or total sent by the frontend.
    let totalPrice = 0;
    const verifiedOrderItems = [];
    const purchasedProducts = [];

    for (const item of orderItems) {
      const productId = item.product || item._id;

      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ message: 'Invalid product ID in order' });
      }

      const quantity = parseInt(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'A product in your cart no longer exists' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for '${product.name}'. Only ${product.stock} available.`,
        });
      }

      totalPrice += product.price * quantity;

      // Product details are copied into the order (snapshot)
      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
      purchasedProducts.push({ product, quantity });
    }

    // 4. Save the order with the logged-in user's ID
    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
      },
      paymentMethod: 'Cash on Delivery',
      totalPrice: Math.round(totalPrice * 100) / 100, // avoids floating point errors
    });

    // 5. Reduce stock only after the order is saved
    for (const { product, quantity } of purchasedProducts) {
      product.stock -= quantity;
      await product.save();
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// @desc    Get logged-in user's orders, newest first
// @route   GET /api/orders/myOrders
// @access  Logged-in user
export const getMyOrders = async (req, res) => {
  try {
    // Filter by req.user._id, so a user can never see another user's orders
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};