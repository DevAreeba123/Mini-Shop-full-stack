// src/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, totalCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      // Redirect to login preserving destination
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-800">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't added any technology accessories to your cart yet. Explore our catalog to find items you love!
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected accessories ({totalCount} items)
          </p>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
            {cartItems.map((item) => {
              const subtotal = Number((item.price * item.quantity).toFixed(2));
              return (
                <div key={item._id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item._id}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                      {item.category}
                    </span>
                    <Link
                      to={`/product/${item._id}`}
                      className="block text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-slate-500 font-medium">
                      Unit Price: ${Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900 bg-white min-w-[2.2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 999)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30 font-bold text-xs transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[5rem]">
                      <span className="block text-xs text-slate-400">Subtotal</span>
                      <span className="text-sm sm:text-base font-bold text-slate-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 px-2">
            <span>Prices are inclusive of standard local taxes</span>
            <Link to="/" className="text-indigo-600 hover:underline font-semibold">
              + Add More Items
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({totalCount}):</span>
              <span className="font-semibold text-slate-900">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Method:</span>
              <span className="font-semibold text-slate-800">Cash on Delivery</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Grand Total:</span>
              <span className="text-2xl font-black text-indigo-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            type="button"
            onClick={handleCheckoutClick}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {!isAuthenticated && (
            <p className="text-xs text-center text-slate-400">
              You will be prompted to log in or register before completing your order.
            </p>
          )}

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <p className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Cash payment upon physical delivery
            </p>
            <p className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              No online card or bank credentials required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
