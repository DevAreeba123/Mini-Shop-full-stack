// src/pages/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService.js';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load user orders:', err);
      setError(err.message || 'Unable to retrieve your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your previous purchases and delivery status
          </p>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Browse More Accessories
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[350px] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Retrieving your order history...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-rose-900">Failed to Load Orders</h3>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2" />
              <line x1="8" x2="16" y1="6" y2="6" />
              <line x1="8" x2="16" y1="10" y2="10" />
              <line x1="8" x2="12" y1="14" y2="14" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">No Orders Placed Yet</h2>
          <p className="text-xs text-slate-500">
            You haven't placed any orders with Mini Shop yet. Your order history will appear here after checkout.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div>
                      <span className="text-slate-400 block font-medium">Order Placed</span>
                      <span className="font-bold text-slate-700">{formattedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Total Amount</span>
                      <span className="font-extrabold text-indigo-600">
                        ${Number(order.totalPrice).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Payment</span>
                      <span className="font-bold text-slate-700">{order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                      {order.orderStatus}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 bg-white px-2.5 py-1 rounded-md border">
                      #{order._id.slice(-8)}
                    </span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Left 2 Cols: Order Items */}
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Items in Order ({order.orderItems?.length || 0})
                    </h4>
                    <div className="space-y-3 divide-y divide-slate-100">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-sm">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 leading-snug">{item.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Quantity: <span className="font-semibold text-slate-700">{item.quantity}</span> × ${Number(item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-800 text-sm shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Col: Shipping Address */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 text-xs space-y-2">
                    <h4 className="font-bold uppercase tracking-wider text-slate-500">
                      Shipping Details
                    </h4>
                    <p className="font-extrabold text-slate-800 text-sm">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {order.shippingAddress?.address}
                    </p>
                    <p className="text-slate-600">
                      {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                    </p>
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Standard COD parcel dispatch
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
