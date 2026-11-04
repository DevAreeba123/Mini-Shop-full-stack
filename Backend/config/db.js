// Backend/config/db.js
import mongoose from 'mongoose';

let isConnected = false;

/**
 * Checks whether the provided MONGO_URI is a dummy or placeholder string
 * @param {string} uri - Connection string from environment
 * @returns {boolean} - True if URI is dummy, empty, or placeholder
 */
export const isDummyMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string' || uri.trim() === '') {
    return true;
  }
  const dummyPlaceholders = [
    'YOUR_USERNAME',
    'YOUR_PASSWORD',
    'YOUR_CLUSTER',
    '<username>',
    '<password>',
    '<cluster>',
    'YOUR_DATABASE',
    'YOUR_HOST',
    'placeholder',
    'example.com',
  ];
  return dummyPlaceholders.some((placeholder) => uri.includes(placeholder));
};

/**
 * Connect to MongoDB Atlas using Mongoose ODM with automatic resilient fallback
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  // 1. Check for missing or dummy placeholder connection string
  if (isDummyMongoUri(mongoUri)) {
    console.log(
      '----------------------------------------------------------------------\n' +
      'ℹ️  [MongoDB Mode: In-Memory Resilient Fallback Active]\n' +
      '   - Reason: MONGO_URI is using dummy template credentials or is unset.\n' +
      '   - Status: Application is 100% operational with 8 pre-seeded products,\n' +
      '             auth session management, cart, orders, and admin controls.\n' +
      '   - To connect to live MongoDB Atlas: Set your actual connection string\n' +
      '     in Backend/.env or root .env, then restart the server.\n' +
      '----------------------------------------------------------------------'
    );
    isConnected = false;
    return false;
  }

  // 2. Real connection string detected: Attempt connection with timeout
  try {
    console.log('🔄 [MongoDB] Connecting to live MongoDB Atlas cluster...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });
    isConnected = true;
    console.log(`✅ [MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(
      '----------------------------------------------------------------------\n' +
      `⚠️  [MongoDB Warning] Could not reach live MongoDB Atlas: ${error.message}\n` +
      '   - Automatically activated In-Memory Fallback Store.\n' +
      '   - Your application will continue running without crashing.\n' +
      '   - Please verify your MongoDB Atlas IP whitelist (0.0.0.0/0) and credentials.\n' +
      '----------------------------------------------------------------------'
    );
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => isConnected;

export default connectDB;
