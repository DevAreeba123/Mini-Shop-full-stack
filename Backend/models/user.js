// Backend/models/user.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    collection: 'shop_users',
    timestamps: true,
  }
);

// Mongoose pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify entered password against hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create standard Mongoose model
const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

// In-memory fallback storage for preview when MongoDB Atlas is not yet connected
const inMemoryUsers = [];

// Seed default admin in memory for direct testing
(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123456', salt);
  inMemoryUsers.push({
    _id: '65f1a2b3c4d5e6f7a8b9c001',
    name: 'Admin User',
    email: 'admin@minishop.com',
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    matchPassword: async function (pw) {
      return await bcrypt.compare(pw, this.password);
    },
  });
})();

// Proxy adapter to seamlessly support both live MongoDB and in-memory preview
const User = {
  // Pass through Mongoose model properties
  schema: userSchema,
  
  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.findOne(query);
    }
    const user = inMemoryUsers.find((u) => {
      if (query.email) return u.email.toLowerCase() === query.email.toLowerCase();
      if (query._id) return String(u._id) === String(query._id);
      return false;
    });
    return user || null;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.findById(id).select('-password');
    }
    const user = inMemoryUsers.find((u) => String(u._id) === String(id));
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  },

  async create(userData) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.create(userData);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      matchPassword: async function (pw) {
        return await bcrypt.compare(pw, this.password);
      },
    };
    inMemoryUsers.push(newUser);
    return newUser;
  },
};

export default User;
