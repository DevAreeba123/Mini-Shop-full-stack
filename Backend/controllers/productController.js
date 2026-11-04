// Backend/controllers/productController.js
import Product from '../models/product.js';

/**
 * @desc    Fetch paginated products
 * @route   GET /api/products?page=1&limit=4
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 4);

    // Calculate total product count
    const totalProducts = await Product.countDocuments();

    // Query paginated products using skip and limit
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const pages = Math.ceil(totalProducts / limit) || 1;

    res.json({
      products,
      page,
      pages,
      totalProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message || 'Server error fetching products' });
  }
};

/**
 * @desc    Fetch single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(404).json({ message: 'Product not found or invalid product ID' });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        message: 'Please provide all product fields: name, description, price, category, image, stock',
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number' });
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: 'Stock must be a valid non-negative integer' });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      image: image.trim(),
      stock: Math.floor(numericStock),
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message || 'Server error creating product' });
  }
};

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message || 'Server error deleting product' });
  }
};
