// Backend/models/order.js
import mongoose from 'mongoose';

// Define the Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Cash on Delivery',
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseOrder = mongoose.models.Order || mongoose.model('Order', orderSchema);

// In-memory fallback order storage
const inMemoryOrders = [];

// Adapter supporting both Mongoose and in-memory preview
const Order = {
  schema: orderSchema,

  find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseOrder.find(filter);
    }
    let results = inMemoryOrders.filter((o) => {
      if (filter.user) return String(o.user) === String(filter.user);
      return true;
    });

    const query = {
      sort(criteria) {
        // Sort newest first by default
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return this;
      },
      async then(resolve) {
        return resolve(results);
      },
    };
    return query;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseOrder.findById(id).populate('user', 'name email');
    }
    return inMemoryOrders.find((o) => String(o._id) === String(id)) || null;
  },

  async create(orderData) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseOrder.create(orderData);
    }
    const newOrder = {
      ...orderData,
      _id: 'ord_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      orderStatus: orderData.orderStatus || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryOrders.unshift(newOrder);
    return newOrder;
  },
};

export default Order;
