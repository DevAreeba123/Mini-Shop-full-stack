// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService.js';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch up to 100 products for administration table
      const data = await productService.getProducts(1, 100);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load admin products:', err);
      setError(err.message || 'Unable to retrieve product list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      setDeletingId(id);
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFeedbackMessage(`Product "${name}" deleted successfully.`);
      setConfirmDeleteId(null);
      setTimeout(() => setFeedbackMessage(''), 3000);
    } catch (err) {
      console.error('Delete product error:', err);
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Products
            </h1>
            <span className="text-xs uppercase bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total of {products.length} catalog items in inventory
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all self-start sm:self-auto active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Product
        </Link>
      </div>

      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage('')} className="text-emerald-900 font-bold text-sm">
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading catalog items...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3 max-w-md mx-auto">
          <h3 className="text-base font-bold text-rose-900">Error</h3>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            onClick={fetchAdminProducts}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <h3 className="text-lg font-bold text-slate-800">No Products in Inventory</h3>
          <p className="text-xs text-slate-500">
            Click "Add New Product" to populate your store catalog.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/product/${p._id}`}
                        className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors block line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <span className="font-mono text-[10px] text-slate-400">ID: {p._id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-xs ${
                          p.stock <= 0
                            ? 'bg-rose-100 text-rose-700'
                            : p.stock < 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {confirmDeleteId === p._id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[11px] text-rose-600 font-bold mr-1">Confirm?</span>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            disabled={deletingId === p._id}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                          >
                            {deletingId === p._id ? 'Deleting...' : 'Yes, Delete'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(p._id)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
