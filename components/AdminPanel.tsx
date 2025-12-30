
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders, updateOrderStatus, OrderData, clearAllOrders } from '../services/orderService';
import { generateOrderPDF, generateOrdersSummaryPDF } from '../services/pdfService';

export const AdminLogin: React.FC<{ onLogin: () => void; onCancel: () => void }> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'mango123') {
      onLogin();
    } else {
      setError('Invalid Access Credentials');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onCancel} />
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-md rounded-[3rem] p-10 md:p-14 shadow-2xl border border-amber-100"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black shadow-xl">G</div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1">HQ Authorization</h2>
          <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.4em]">Secure Database Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Manager ID</label>
            <input 
              type="text" 
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-amber-500 focus:bg-white font-bold text-gray-900 transition-all placeholder:text-gray-300"
              placeholder="admin"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Access Token</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-amber-500 focus:bg-white font-bold text-gray-900 transition-all placeholder:text-gray-300"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-black uppercase text-center bg-red-50 py-3 rounded-xl border border-red-100">
              {error}
            </motion.p>
          )}
          <button className="w-full py-6 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:scale-95">
            Initialize Session
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [filter, setFilter] = useState<'All' | OrderData['status']>('All');

  useEffect(() => {
    setOrders(getAllOrders());
  }, []);

  const handleStatusChange = (orderId: string, status: OrderData['status']) => {
    updateOrderStatus(orderId, status);
    const updatedOrders = getAllOrders();
    setOrders(updatedOrders);
    if (selectedOrder?.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleWipeDatabase = () => {
    if (window.confirm("CRITICAL ACTION: This will permanently delete all order records from the local database. Proceed?")) {
      clearAllOrders();
      setOrders([]);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleDownloadLedgerPDF = () => {
    if (filteredOrders.length === 0) {
      alert("No records to download.");
      return;
    }
    generateOrdersSummaryPDF(filteredOrders, filter);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-8 py-4 md:py-6 flex flex-wrap justify-between items-center shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-amber-500 font-black">HQ</div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter uppercase">Order Database</h1>
            <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Ledger Connected
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadLedgerPDF} 
            className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-amber-50 hover:border-amber-200 transition-all text-gray-600 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Download PDF
          </button>
          <button 
            onClick={handleWipeDatabase} 
            className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
          >
            Wipe Ledger
          </button>
          <button onClick={onClose} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-lg">
            Exit
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar / List */}
        <div className="w-full md:w-96 border-r border-gray-200 bg-white overflow-y-auto custom-scrollbar shrink-0 flex flex-col">
          <div className="p-6 border-b border-gray-50 sticky top-0 bg-white/95 backdrop-blur z-10">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Active Entries ({filteredOrders.length})</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Shipped', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${
                    filter === status
                      ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-amber-200 hover:text-amber-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            {filteredOrders.length === 0 ? (
              <div className="p-16 text-center opacity-40">
                <div className="mb-4 flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest">No {filter !== 'All' ? filter : ''} Records</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <button 
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full p-6 border-b border-gray-50 text-left transition-all ${selectedOrder?.orderId === order.orderId ? 'bg-amber-50/50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-gray-900 text-sm tracking-tight">{order.orderId}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase">{new Date(order.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-700 mb-2 truncate">{order.customer.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-amber-600">Rs. {order.total.toLocaleString()}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-50/50 overflow-y-auto p-6 md:p-12 custom-scrollbar">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div 
                key={selectedOrder.orderId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-8 pb-20"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{selectedOrder.orderId}</h2>
                      <div className="px-3 py-1 bg-gray-900 text-amber-400 rounded-lg text-[9px] font-black uppercase tracking-widest">Official Record</div>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Logged on {new Date(selectedOrder.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['Pending', 'Shipped', 'Delivered'] as const).map(s => (
                      <button 
                        key={s}
                        onClick={() => handleStatusChange(selectedOrder.orderId, s)}
                        className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          selectedOrder.status === s 
                          ? 'bg-gray-900 text-white shadow-xl' 
                          : 'bg-white border border-gray-200 text-gray-400 hover:border-amber-500 hover:text-amber-600 shadow-sm'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Recipient Metadata
                      </h3>
                      <button 
                        onClick={() => generateOrderPDF(selectedOrder)}
                        className="text-[9px] font-black uppercase text-amber-600 hover:text-amber-700 underline tracking-widest"
                      >
                        Download Invoice
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Legal Name</p>
                        <p className="font-black text-gray-900 text-lg">{selectedOrder.customer.name}</p>
                      </div>
                      <div className="pb-4 border-b border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone / WhatsApp</p>
                        <p className="font-black text-gray-900 text-lg">{selectedOrder.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Destination Address</p>
                        <p className="font-bold text-gray-700 leading-relaxed text-sm">{selectedOrder.customer.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      Inventory Manifest
                    </h3>
                    <div className="flex-1 space-y-4">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm pb-3 border-b border-gray-50/50 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-gray-50 flex items-center justify-center rounded-lg text-[10px] font-black text-gray-400">{item.quantity}x</span>
                            <span className="text-gray-600 font-bold">{item.name}</span>
                          </div>
                          <span className="font-black text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 mt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Invoice</span>
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">Rs. {selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.customer.notes && (
                  <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2 relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      Management Notes
                    </p>
                    <p className="text-sm font-bold text-amber-900 leading-relaxed italic relative">"{selectedOrder.customer.notes}"</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl flex items-center justify-center mb-8 border border-gray-100 text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-2">Order Vault</h2>
                <p className="text-gray-400 font-medium text-sm">Select a harvest record from the list to begin management.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
