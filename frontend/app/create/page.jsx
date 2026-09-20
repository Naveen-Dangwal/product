"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios.js";

export default function CreateOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: "",
    paymentMethod: "cod",
    totalAmount: "",
    orderDate: new Date().toISOString().split("T")[0],
    buyer: {
      name: "",
      state: "",
      email: "",
      phone: "",
    },
    product: {
      name: "",
      model: "",
      price: "",
      quantity: 1,
      image: "",
    },
    deliveryCharges: 0,
    discount: 0,
    status: "pending",
  });

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Auto-calculate total
  const autoCalculateTotal = () => {
    const price = Number(formData.product.price) || 0;
    const qty = Number(formData.product.quantity) || 0;
    const delivery = Number(formData.deliveryCharges) || 0;
    const discount = Number(formData.discount) || 0;
    const total = price * qty + delivery - discount;
    setFormData((prev) => ({ ...prev, totalAmount: total }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        product: {
          ...formData.product,
          price: Number(formData.product.price),
          quantity: Number(formData.product.quantity),
          image: formData.product.image || "https://via.placeholder.com/150",
        },
        deliveryCharges: Number(formData.deliveryCharges),
        discount: Number(formData.discount),
      };

      await api.post("/api/orders", payload);
      alert("Order Created Successfully!");
      router.push("/display");
    } catch (error) {
      console.error(error);
      alert(
        "Error creating order: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Reusable Input Class - Matches Dark Theme
  const inputClass =
    "w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm hover:border-slate-600";

  const labelClass =
    "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-300 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Decorative Glow Elements - Same as Display */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 border border-blue-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                Create New Order
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Fill in the details below to place a new order.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN - FORM */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Info Section */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-700/80 transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-white">Order Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Order Number</label>
                    <input
                      required
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="78369274"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="cod" className="bg-slate-900">COD</option>
                      <option value="online" className="bg-slate-900">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Order Date</label>
                    <input
                      required
                      type="date"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleChange}
                      className={`${inputClass} [color-scheme:dark]`}
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Details Section */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-700/80 transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-white">Buyer Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.buyer.name}
                      onChange={(e) => handleChange(e, "buyer")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      required
                      type="text"
                      name="state"
                      placeholder="Delhi"
                      value={formData.buyer.state}
                      onChange={(e) => handleChange(e, "buyer")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.buyer.email}
                      onChange={(e) => handleChange(e, "buyer")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      required
                      type="text"
                      name="phone"
                      placeholder="9876543210"
                      value={formData.buyer.phone}
                      onChange={(e) => handleChange(e, "buyer")}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-700/80 transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-white">Product Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Product Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="Blue Vivo Mobile Phone"
                      value={formData.product.name}
                      onChange={(e) => handleChange(e, "product")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Model</label>
                    <input
                      required
                      type="text"
                      name="model"
                      placeholder="Y11"
                      value={formData.product.model}
                      onChange={(e) => handleChange(e, "product")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Quantity</label>
                    <input
                      required
                      type="number"
                      name="quantity"
                      placeholder="1"
                      min="1"
                      value={formData.product.quantity}
                      onChange={(e) => handleChange(e, "product")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Price (₹)</label>
                    <input
                      required
                      type="number"
                      name="price"
                      placeholder="799"
                      value={formData.product.price}
                      onChange={(e) => handleChange(e, "product")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Image URL</label>
                    <input
                      type="text"
                      name="image"
                      placeholder="https://example.com/image.jpg"
                      value={formData.product.image}
                      onChange={(e) => handleChange(e, "product")}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Status Section */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-700/80 transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-white">Delivery & Status</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Delivery Charges (₹)</label>
                    <input
                      type="number"
                      name="deliveryCharges"
                      value={formData.deliveryCharges}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Discount (₹)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="pending" className="bg-slate-900">Pending</option>
                      <option value="fulfilled" className="bg-slate-900">Fulfilled</option>
                      <option value="shipped" className="bg-slate-900">Shipped</option>
                      <option value="cancelled" className="bg-slate-900">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - LIVE SUMMARY */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                
                {/* Order Summary Card */}
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                  
                  {/* Summary Header */}
                  <div className="bg-blue-600/10 border-b border-blue-500/20 p-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                      Live Preview
                    </h3>
                    <p className="text-3xl font-extrabold text-white mt-1">
                      ₹{Number(formData.totalAmount) || 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Final Order Amount
                    </p>
                  </div>

                  {/* Summary Body */}
                  <div className="p-5 space-y-4">
                    
                    {/* Product Preview */}
                    {(formData.product.name || formData.product.image) && (
                      <div className="flex gap-3 pb-4 border-b border-slate-800/50">
                        <div className="w-16 h-20 bg-slate-800 rounded-lg overflow-hidden border border-slate-700/50 flex-shrink-0">
                          <img
                            src={formData.product.image || "https://via.placeholder.com/150"}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-blue-400 truncate">
                            {formData.product.name || "Product Name"}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {formData.product.model || "Model"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Qty: <span className="text-slate-300 font-medium">{formData.product.quantity || 0}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between text-slate-500">
                        <span>Price × Qty</span>
                        <span className="font-medium text-slate-300">
                          ₹
                          {(Number(formData.product.price) || 0) *
                            (Number(formData.product.quantity) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Delivery Charges</span>
                        <span className="font-medium text-slate-300">
                          +₹{Number(formData.deliveryCharges) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Discount</span>
                        <span className="font-medium text-emerald-400">
                          -₹{Number(formData.discount) || 0}
                        </span>
                      </div>
                      <div className="border-t border-dashed border-slate-700/50 pt-3 flex justify-between items-center">
                        <span className="font-bold text-white">Total</span>
                        <span className="font-extrabold text-blue-400 text-lg">
                          ₹{Number(formData.totalAmount) || 0}
                        </span>
                      </div>
                    </div>

                    {/* Auto Calculate Button */}
                    <button
                      type="button"
                      onClick={autoCalculateTotal}
                      className="w-full text-xs font-semibold py-2.5 rounded-lg border border-dashed border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/60 transition-colors"
                    >
                      ⚡ Auto-Calculate Total
                    </button>

                    {/* Payment & Status Badges */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Payment</span>
                      <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        {formData.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Status</span>
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        {formData.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-200 bg-blue-600 border border-blue-500/50 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Create Order
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500">
                  You can review all details before submitting.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}