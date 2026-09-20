"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/axios.js";
import { Search } from "lucide-react";


// Helper for Status Styling
const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
        case "fulfilled":
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
        case "pending":
            return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
        case "shipped":
            return "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]";
        case "cancelled":
            return "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
        default:
            return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
};

export default function DisplayOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);

    // Search State
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Orders
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/api/orders?pageNumber=${page}&pageSize=${pageSize}`);
            setOrders(data.orders);
            setTotalPages(data.pages);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to fetch orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    // Client-side Search Filter
    const filteredOrders = orders.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.buyer.name.toLowerCase().includes(searchLower) ||
            order.buyer.email.toLowerCase().includes(searchLower) ||
            order.product.name.toLowerCase().includes(searchLower) ||
            order.status.toLowerCase().includes(searchLower)
        );
    });

    return (
        // Main Background with Rich Gradient
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-300 p-4 md:p-8 font-sans selection:bg-blue-500/30">

            {/* Decorative Glow Elements */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                            Order Management
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">View, track and manage all your customer orders.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                        {/* Advanced Search Input */}
                        <div className="relative w-full md:w-80 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search
                                    className="h-5 w-5 text-white group-focus-within:text-blue-400 transition-colors drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                                    strokeWidth={2}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by orderid, name, email, mobile"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/60 border border-slate-700/50 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm placeholder:text-slate-500"
                            />
                        </div>

                        <Link
                            href="/create"
                            className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 border border-blue-500/50 rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            New Order
                        </Link>
                    </div>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 animate-pulse backdrop-blur-sm">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-3 space-y-3">
                                        <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                                        <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                                        <div className="h-6 bg-slate-700/50 rounded w-1/2 mt-4"></div>
                                    </div>
                                    <div className="md:col-span-3 space-y-3">
                                        <div className="h-3 bg-slate-700/50 rounded w-1/3"></div>
                                        <div className="h-3 bg-slate-700/50 rounded w-full"></div>
                                        <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
                                    </div>
                                    <div className="md:col-span-6 flex gap-4">
                                        <div className="w-20 h-24 bg-slate-700/50 rounded-lg"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
                                            <div className="h-3 bg-slate-700/50 rounded w-1/3"></div>
                                            <div className="h-3 bg-slate-700/50 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center backdrop-blur-sm">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {/* Orders List */}
                {!loading && !error && (
                    <div className="space-y-5">
                        {filteredOrders.length === 0 ? (
                            <div className="bg-slate-900/40 border border-slate-800/50 p-12 text-center rounded-2xl backdrop-blur-sm">
                                <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                <p className="text-slate-400 text-lg">No orders found</p>
                                <p className="text-slate-500 text-sm mt-1">Try adjusting your search terms.</p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="group bg-slate-900/40 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-slate-700/80 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">

                                        {/* Order Header Info */}
                                        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-800/50 pb-4 md:pb-0 md:pr-6 flex flex-col justify-between">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Order Date</p>
                                                <p className="text-sm text-slate-300 font-medium">{new Date(order.orderDate).toLocaleString()}</p>

                                                <div className="mt-3 flex items-center gap-3">
                                                    <span className="text-blue-400 font-bold text-xl tracking-tight">#{order.orderNumber}</span>
                                                    <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                        {order.paymentMethod}
                                                    </span>
                                                </div>

                                                <div className="mt-3 text-sm">
                                                    <span className="text-slate-500">Total Amount:</span>
                                                    <span className="font-bold text-white ml-2 text-lg">₹{order.totalAmount}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-3">
                                                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-lg transition-colors border border-slate-700/50">
                                                    TRACK
                                                </button>
                                                <button className="flex-1 text-blue-400 hover:text-blue-300 text-xs font-semibold py-2 rounded-lg transition-colors border border-blue-500/30 hover:border-blue-400/50 bg-blue-500/5 hover:bg-blue-500/10">
                                                    INVOICE
                                                </button>
                                            </div>
                                        </div>

                                        {/* Buyer Details */}
                                        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-800/50 pb-4 md:pb-0 md:pr-6">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Buyer Details</p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                                        {order.buyer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-200">{order.buyer.name}</p>
                                                </div>
                                                <p className="text-xs text-slate-400 flex items-center gap-2">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {order.buyer.state}
                                                </p>
                                                <p className="text-xs text-slate-400 flex items-center gap-2 truncate">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    {order.buyer.email}
                                                </p>
                                                <p className="text-xs text-slate-400 flex items-center gap-2">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                    {order.buyer.phone}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="md:col-span-6 flex gap-5">
                                            <div className="w-24 h-28 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/50 relative group-hover:border-slate-600 transition-colors">
                                                <img
                                                    src={order.product.image || "https://via.placeholder.com/150"}
                                                    alt={order.product.name}
                                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-blue-400 font-bold text-lg leading-tight mb-1">{order.product.name}</p>
                                                    <p className="text-xs text-slate-400 mb-3">Model: <span className="text-slate-300 font-medium">{order.product.model}</span></p>

                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                                        <p className="text-slate-500">Qty: <span className="text-slate-300 font-medium ml-1">{order.product.quantity}</span></p>
                                                        <p className="text-slate-500">Price: <span className="text-slate-300 font-medium ml-1">₹{order.product.price}</span></p>
                                                        <p className="text-slate-500">Delivery: <span className="text-slate-300 font-medium ml-1">₹{order.deliveryCharges}</span></p>
                                                        <p className="text-slate-500">Discount: <span className="text-emerald-400 font-medium ml-1">-₹{order.discount}</span></p>
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="mt-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-10 gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900/60 disabled:hover:text-slate-400 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${page === p
                                            ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-500"
                                            : "bg-slate-900/40 text-slate-400 border border-slate-800/50 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900/60 disabled:hover:text-slate-400 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}