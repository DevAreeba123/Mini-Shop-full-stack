// Backend/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import products from './data/products.js';
import Product from './models/product.js';
import connectDB from './config/db.js';

dotenv.config();

// Run with: node seeder.js
// Only the products collection is touched, users and orders stay safe
const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log(`Success! ${products.length} products seeded.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeder error: ${error.message}`);
    process.exit(1);
  }
};

importData();