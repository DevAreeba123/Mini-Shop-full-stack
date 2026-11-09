// Backend/models/product.js
import mongoose from 'mongoose';

// Product schema: defines what a product document looks like in MongoDB
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
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;