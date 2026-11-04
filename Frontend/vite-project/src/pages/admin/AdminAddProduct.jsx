// src/pages/admin/AdminAddProduct.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import productService from '../../services/productService.js';

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Accessories');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('15');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !description.trim() || !price || !category || !image.trim() || stock === '') {
      setErrorMessage('Please fill in all required product fields');
      return;
    }

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock);

    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage('Please enter a valid positive price');
      return;
    }

    if (isNaN(numStock) || numStock < 0) {
      setErrorMessage('Please enter a valid non-negative stock count');
      return;
    }

    try {
      setIsSubmitting(true);
      await productService.createProduct({
        name: name.trim(),
        description: description.trim(),
        price: numPrice,
        category: category.trim(),
        image: image.trim(),
        stock: numStock,
      });

      // Redirect to admin products list upon success
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to create product:', err);
      setErrorMessage(err.message || 'Error creating product. Please verify inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample image filler for testing convenience
  const fillSampleImage = () => {
    setImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Add New Product
            </h1>
            <span className="text-xs uppercase bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create and publish a new technology accessory item into MongoDB
          </p>
        </div>

        <Link
          to="/admin/products"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Cancel & Return
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smart Fitness Tracker Band"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                disabled={isSubmitting}
              >
                <option value="Audio">Audio</option>
                <option value="Accessories">Accessories</option>
                <option value="Computer">Computer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Price (USD $) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Public Image URL *
              </label>
              <button
                type="button"
                onClick={fillSampleImage}
                className="text-[11px] text-indigo-600 hover:underline font-semibold"
              >
                Use sample Unsplash image
              </button>
            </div>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Live Image Preview */}
          {image && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={image}
                alt="Preview"
                className="w-16 h-16 rounded-xl object-cover border"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xs text-slate-500">Image URL preview</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Product Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed 2–3 sentence overview of this technology accessory..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Product to MongoDB...</span>
                </>
              ) : (
                <span>Publish Product</span>
              )}
            </button>

            <Link
              to="/admin/products"
              className="px-5 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold text-sm rounded-xl transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
