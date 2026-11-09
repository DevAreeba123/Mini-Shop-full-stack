// Backend/config/db.js
import mongoose from 'mongoose';

// Connects the app to MongoDB Atlas using the URI stored in .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // stop the server, the app cannot work without its database
  }
};

export default connectDB;