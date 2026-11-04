// Backend/controllers/orderController.js
import Order from '../models/order.js';
import Product from '../models/product.js';

/**
 * @desc    Create new order with Cash on Delivery
 * @route   POST /api/orders
 * @access  Private/Customer
 */
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        message: 'Please provide full shipping details (Full Name, Address, City, and Postal Code)',
      });
    }

    // Validate order items
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified in checkout' });
    }

    // Server-side validation of products, stock check, and total calculation
    let calculatedTotalPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const productId = item.product || item._id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: `Product '${item.name || productId}' not found in catalog`,
        });
      }

      const quantity = Math.max(1, parseInt(item.quantity) || 1);

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for '${product.name}'. Only ${product.stock} available.`,
        });
      }

      // Decrement stock
      product.stock -= quantity;
      if (typeof product.save === 'function') {
        await product.save();
      }

      const itemSubtotal = product.price * quantity;
      calculatedTotalPrice += itemSubtotal;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantity,
      });
    }

    // Round total to 2 decimal places to prevent floating point inaccuracies
    calculatedTotalPrice = Math.round(calculatedTotalPrice * 100) / 100;

    // Create the order in database with COD payment method
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
      totalPrice: calculatedTotalPrice,
      orderStatus: 'pending',
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message || 'Server error creating order' });
  }
};

/**
 * @desc    Get logged in user orders sorted newest first
 * @route   GET /api/orders/myOrders
 * @access  Private/Customer
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: error.message || 'Server error fetching user orders' });
  }
};
