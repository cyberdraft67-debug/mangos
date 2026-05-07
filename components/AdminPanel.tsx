
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, LayoutDashboard, FileText, Trash2, X, ChevronRight, User, Package, MapPin, Phone, Calendar, CheckSquare, Truck, PackageCheck } from 'lucide-react';
import { getAllOrders, updateOrderStatus, OrderData, clearAllOrders } from '../services/orderService';
import { generateOrderPDF, generateOrdersSummaryPDF } from '../services/pdfService';
import { cn } from '../lib/utils';

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
      <div className="absolute inset-0 bg-charcoal/95 backdrop-blur-2xl" onClick={onCancel} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-ivory w-full max-w-md rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-gold/10"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-6 text-charcoal shadow-xl">
            <Lock size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif text-charcoal tracking-tight mb-2">HQ Registry</h2>
          <p className="text-[10px] text-gold font-black uppercase tracking-[0.4em]">Secure Access Required</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-charcoal/30 uppercase tracking-[0.3em] ml-2">Registry ID</label>
            <input 
              type="text" 
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-white border border-charcoal/5 outline-none focus:border-gold font-serif transition-all"
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-charcoal/30 uppercase tracking-[0.3em] ml-2">Access Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-white border border-charcoal/5 outline-none focus:border-gold font-serif transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] font-bold text-center py-2">
              {error}
            </motion.p>
          )}
          <button className="w-full py-5 bg-charcoal text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gold hover:text-charcoal transition-all shadow-xl active:scale-95 duration-500">
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
    if (window.confirm("CRITICAL: Wipe all registry records?")) {
      clearAllOrders();
      setOrders([]);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <div className="fixed inset-0 z-[200] bg-ivory flex flex-col overflow-hidden">
      <header className="bg-white border-b border-charcoal/5 px-10 py-6 flex flex-wrap justify-between items-center shrink-0 gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-charcoal rounded-xl flex items-center justify-center text-gold">
            <LayoutDashboard size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-charcoal tracking-tight">The Registry</h1>
            <p className="text-[9px] text-gold font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
              Live Ledger Status: Optimized
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => generateOrdersSummaryPDF(filteredOrders, filter)} 
            className="flex items-center gap-3 bg-ivory border border-charcoal/5 px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:border-gold transition-all text-charcoal"
          >
            <FileText size={14} />
            Export Archives
          </button>
          <button 
            onClick={handleWipeDatabase} 
            className="text-red-400 hover:text-red-500 transition-colors p-3"
          >
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
          <button onClick={onClose} className="p-3 hover:bg-charcoal/5 rounded-full text-charcoal transition-colors">
            <X size={24} strokeWidth={1} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-[400px] border-r border-charcoal/5 bg-white overflow-y-auto custom-scrollbar shrink-0 flex flex-col">
          <div className="p-8 border-b border-charcoal/5 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <h3 className="text-[9px] font-black text-charcoal/30 uppercase tracking-[0.3em] mb-6">Archive Filter</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Shipped', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                    filter === status
                      ? "bg-charcoal text-white shadow-xl"
                      : "bg-ivory text-charcoal/40 hover:text-gold"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            {filteredOrders.length === 0 ? (
              <div className="p-20 text-center opacity-20">
                <Package size={48} strokeWidth={1} className="mx-auto mb-4" />
                <p className="text-[10px] uppercase tracking-widest font-black">No Records</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <button 
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "w-full p-8 border-b border-charcoal/5 text-left transition-all duration-500 group",
                    selectedOrder?.orderId === order.orderId ? "bg-ivory border-l-4 border-l-gold" : "hover:bg-ivory/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-serif text-charcoal text-lg">{order.orderId}</span>
                    <span className="text-[9px] font-bold text-charcoal/30 uppercase tracking-widest">{new Date(order.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-light text-charcoal/60 mb-4">{order.customer.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-serif text-gold">Rs. {order.total.toLocaleString()}</span>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      order.status === 'Pending' ? "bg-amber-100 text-amber-700" : 
                      order.status === 'Shipped' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-ivory/50 overflow-y-auto p-12 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div 
                key={selectedOrder.orderId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-5xl mx-auto space-y-12 pb-24"
              >
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-12 border-b border-charcoal/5">
                  <div>
                    <h2 className="text-5xl font-serif text-charcoal tracking-tighter mb-4">{selectedOrder.orderId}</h2>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                        <Calendar size={12} />
                        {new Date(selectedOrder.timestamp).toLocaleString()}
                      </div>
                      <div className="w-1 h-1 bg-gold rounded-full" />
                      <div className="flex items-center gap-2 text-[10px] text-gold font-bold uppercase tracking-widest">
                        <Shield size={12} />
                        Verified Archive
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 p-1 bg-white rounded-full border border-charcoal/5 shadow-sm">
                    {[
                      { status: 'Pending', icon: CheckSquare },
                      { status: 'Shipped', icon: Truck },
                      { status: 'Delivered', icon: PackageCheck }
                    ].map(s => (
                      <button 
                        key={s.status}
                        onClick={() => handleStatusChange(selectedOrder.orderId, s.status as any)}
                        className={cn(
                          "px-6 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                          selectedOrder.status === s.status 
                          ? "bg-charcoal text-white shadow-xl" 
                          : "text-charcoal/40 hover:text-gold"
                        )}
                      >
                        <s.icon size={12} />
                        {s.status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-charcoal/5">
                    <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                      <User size={14} />
                      Recipient Metadata
                    </h3>
                    <div className="space-y-8">
                      <div>
                        <p className="text-[9px] text-charcoal/30 font-bold uppercase tracking-[0.2em] mb-2">Primary Identity</p>
                        <p className="text-xl font-serif text-charcoal">{selectedOrder.customer.name}</p>
                      </div>
                      <div className="flex gap-12">
                        <div>
                          <p className="text-[9px] text-charcoal/30 font-bold uppercase tracking-[0.2em] mb-2">Comms</p>
                          <p className="text-sm font-bold text-charcoal flex items-center gap-2">
                            <Phone size={12} className="text-gold" />
                            {selectedOrder.customer.phone}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] text-charcoal/30 font-bold uppercase tracking-[0.2em] mb-2">Regional Destination</p>
                        <p className="text-sm font-light text-charcoal/60 leading-relaxed flex items-start gap-2">
                          <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                          {selectedOrder.customer.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-charcoal/5 flex flex-col">
                    <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                      <Package size={14} />
                      Inventory Ledger
                    </h3>
                    <div className="flex-1 space-y-6">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm group">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-gold bg-ivory w-8 h-8 flex items-center justify-center rounded-lg">{item.quantity}</span>
                            <span className="text-charcoal/80 font-serif">{item.name}</span>
                          </div>
                          <span className="text-charcoal font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-10 mt-10 border-t border-charcoal/5">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-charcoal/30 uppercase tracking-[0.4em]">Aggregated Total</span>
                        <span className="text-4xl font-serif text-charcoal tracking-tighter">Rs. {selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={() => generateOrderPDF(selectedOrder)}
                    className="flex items-center gap-3 text-[10px] font-black text-gold border-b border-gold/20 pb-2 hover:text-charcoal hover:border-charcoal transition-all uppercase tracking-[0.5em]"
                  >
                    Generate Provenance Certificate
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Shield size={64} strokeWidth={1} className="mb-8" />
                <h2 className="text-2xl font-serif text-charcoal tracking-widest mb-2">Awaiting Archive Selection</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Registry System v5.4.2</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
