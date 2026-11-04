// Backend/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import products from './data/products.js';
import Product from './models/product.js';
import connectDB, { isDummyMongoUri } from './config/db.js';

// Load environment variables from .env
dotenv.config();

const importData = async () => {
  try {
    console.log('🌱 Starting product seeding process...');
    const connected = await connectDB();

    if (connected && mongoose.connection.readyState === 1) {
      // Live MongoDB Atlas connected
      await Product.deleteMany();
      console.log('🧹 Cleared existing products in MongoDB Atlas.');
      await Product.insertMany(products);
      console.log('✅ Success! 8 products seeded into live MongoDB Atlas database:');
    } else {
      // In-Memory fallback mode
      await Product.deleteMany();
      await Product.insertMany(products);
      console.log('✅ Success! 8 products seeded into fallback in-memory storage:');
    }

    products.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} ($${p.price.toFixed(2)}) [${p.category}] - Stock: ${p.stock}`);
    });

    if (connected && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔒 Closed MongoDB Atlas connection.');
    } else {
      console.log('ℹ️  Note: When you configure your real MONGO_URI in .env, run this script again to seed live MongoDB Atlas.');
    }
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const connected = await connectDB();
    await Product.deleteMany();
    console.log('🗑️  All products removed.');
    if (connected && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
