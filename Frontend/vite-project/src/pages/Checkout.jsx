// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import orderService from '../services/orderService.js';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    // If cart is empty and no successful order has just been placed, redirect to cart
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, orderSuccess, navigate]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      setErrorMessage('Please fill in all shipping details before placing your order');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your shopping cart is empty');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
        },
      };

      const createdOrder = await orderService.createOrder(orderPayload);

      // Order created successfully: clear cart and show confirmation
      clearCart();
      setOrderSuccess(createdOrder);
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(
        err.message || 'Failed to place order. Please check product stock or network connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Placed Successfully
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Order ID: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800 text-xs">{orderSuccess._id}</code>
          </p>
        </div>

        {/* Order Details Confirmation Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">Deliver To:</span>
              <p className="font-bold text-slate-800">{orderSuccess.shippingAddress?.fullName}</p>
              <p className="text-slate-600">{orderSuccess.shippingAddress?.address}</p>
              <p className="text-slate-600">
                {orderSuccess.shippingAddress?.city}, {orderSuccess.shippingAddress?.postalCode}
              </p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Method:</span>
              <p className="font-bold text-slate-800">Cash on Delivery (COD)</p>
              <span className="text-slate-400 block font-medium mt-2">Total Amount:</span>
              <p className="text-base font-extrabold text-indigo-600">
                ${Number(orderSuccess.totalPrice).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Items Ordered:</span>
            <div className="space-y-2">
              {orderSuccess.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover border" />
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">{item.name}</span>
                    <span className="text-slate-500 font-bold">× {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/orders"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete shipping details to place your Cash on Delivery order
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Shipping Information Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Johnathan Smith"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  disabled={isSubmitting}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Complete Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, suite, street name and number"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Seattle"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Postal Code / ZIP
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 98101"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h2 className="text-lg font-bold text-slate-900">Payment Option</h2>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border-2 border-indigo-500 flex items-start gap-4">
              <input
                type="radio"
                name="paymentMethod"
                id="cod"
                checked
                readOnly
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div className="space-y-1">
                <label htmlFor="cod" className="block text-sm font-bold text-indigo-950 cursor-pointer">
                  Cash on Delivery (COD)
                </label>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  Pay with cash directly to the courier agent when your parcel arrives at your address.
                  No advance online payment required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Review */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Review Items ({cartItems.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item._id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-slate-500">
                      {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total Price:</span>
              <span className="text-2xl font-black text-indigo-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Placing COD Order...</span>
              </>
            ) : (
              <span>Confirm & Place Order</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
