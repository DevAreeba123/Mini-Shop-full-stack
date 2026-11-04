// Backend/models/product.js
import mongoose from 'mongoose';
import initialProducts from '../data/products.js';

// Define the Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      enum: ['Audio', 'Accessories', 'Computer'],
    },
    image: {
      type: String,
      required: [true, 'Please add a product image URL'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseProduct = mongoose.models.Product || mongoose.model('Product', productSchema);

// In-memory fallback product storage pre-loaded with the 8 official products
let inMemoryProducts = initialProducts.map((p, index) => ({
  ...p,
  _id: `65f2b3c4d5e6f7a8b9c00${index + 1}0`,
  createdAt: new Date(Date.now() - (8 - index) * 3600000),
  updatedAt: new Date(),
}));

// Adapter supporting both live MongoDB Mongoose queries and in-memory fallback
const Product = {
  schema: productSchema,

  find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseProduct.find(filter);
    }
    // Return a chainable query object for in-memory
    let results = [...inMemoryProducts];
    if (filter.category) {
      results = results.filter((p) => p.category === filter.category);
    }

    const query = {
      _skip: 0,
      _limit: results.length,
      skip(s) {
        this._skip = s;
        return this;
      },
      limit(l) {
        this._limit = l;
        return this;
      },
      sort() {
        return this;
      },
      async then(resolve) {
        const paginated = results.slice(this._skip, this._skip + this._limit);
        return resolve(paginated);
      },
    };
    return query;
  },

  async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProduct.countDocuments(filter);
    }
    if (filter.category) {
      return inMemoryProducts.filter((p) => p.category === filter.category).length;
    }
    return inMemoryProducts.length;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProduct.findById(id);
    }
    return inMemoryProducts.find((p) => String(p._id) === String(id)) || null;
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProduct.create(data);
    }
    const newProduct = {
      ...data,
      _id: 'prd_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      price: Number(data.price),
      stock: Number(data.stock),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryProducts.unshift(newProduct);
    return newProduct;
  },

  async findByIdAndDelete(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProduct.findByIdAndDelete(id);
    }
    const index = inMemoryProducts.findIndex((p) => String(p._id) === String(id));
    if (index !== -1) {
      const deleted = inMemoryProducts[index];
      inMemoryProducts.splice(index, 1);
      return deleted;
    }
    return null;
  },

  async deleteMany(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProduct.deleteMany(filter);
    }
    const count = inMemoryProducts.length;
    inMemoryProducts = [];
    return { deletedCount: count };
  },

  async insertMany(items) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProduct.insertMany(items);
    }
    const created = items.map((p, idx) => ({
      ...p,
      _id: `65f2b3c4d5e6f7a8b9c00${idx + 1}0`,
      price: Number(p.price),
      stock: Number(p.stock),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    inMemoryProducts = [...created];
    return created;
  },

  // Helper method to reset to default 8 seed items
  resetInMemory() {
    inMemoryProducts = initialProducts.map((p, index) => ({
      ...p,
      _id: `65f2b3c4d5e6f7a8b9c00${index + 1}0`,
      createdAt: new Date(Date.now() - (8 - index) * 3600000),
      updatedAt: new Date(),
    }));
  },
};

export default Product;
