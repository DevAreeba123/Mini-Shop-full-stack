// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock <= 0) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Product Image Container */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-slate-100 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
            Out of Stock
          </span>
        ) : product.stock < 5 ? (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow">
            Only {product.stock} left
          </span>
        ) : null}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product._id}`} className="block mb-1.5">
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-slate-500 text-xs line-clamp-2 mb-3 flex-1 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/product/${product._id}`}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Details
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1 ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
