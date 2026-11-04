// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import productService from '../services/productService.js';
import ProductCard from '../components/ProductCard.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(currentPage, 4);
      setProducts(data.products || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero / Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Premium Tech Essentials
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Minimalist Accessories for Everyday Productivity
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Curated high-performance computer peripherals, audio gear, and lifestyle tech accessories.
            Cash on Delivery available nationwide.
          </p>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Catalog Header & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {products.length} of {totalProducts} technology accessories
          </p>
        </div>

        {/* Page status indicator */}
        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          Page <span className="font-bold text-slate-800">{page}</span> of{' '}
          <span className="font-bold text-slate-800">{pages}</span>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading catalog products...</p>
        </div>
      ) : error ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-rose-900">Unable to load products</h3>
          <p className="text-xs text-rose-700 max-w-md">{error}</p>
          <button
            onClick={() => fetchProducts(page)}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-800">No products available</h3>
          <p className="text-xs text-slate-500">Please check back soon or run the database seeder.</p>
        </div>
      ) : (
        <>
          {/* Responsive Product Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Navigation */}
          {pages > 1 && (
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handlePrevPage}
                disabled={page <= 1}
                className={`px-4 py-2 text-sm font-semibold rounded-xl border flex items-center gap-2 transition-all ${
                  page <= 1
                    ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 shadow-sm'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: pages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-9 h-9 text-xs font-bold rounded-lg transition-all ${
                      page === pNum
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={page >= pages}
                className={`px-4 py-2 text-sm font-semibold rounded-xl border flex items-center gap-2 transition-all ${
                  page >= pages
                    ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 shadow-sm'
                }`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
