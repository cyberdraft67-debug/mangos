
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';
import { processOrderSubmission, generateGmailLink, OrderData } from '../services/orderService';
import { generateOrderPDF } from '../services/pdfService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  clearCart?: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, clearCart }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '' 
  });
  const [showValidation, setShowValidation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderData | null>(null);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0 || isProcessing) return;
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      setShowValidation(true);
      return;
    }

    setIsProcessing(true);

    const orderId = `CH-${Date.now().toString().slice(-6)}`;
    const orderData: OrderData = {
      orderId,
      customer: customerInfo,
      items,
      total,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      await processOrderSubmission(orderData);
      setLastOrder(orderData);
      setIsSuccess(true);
      
      // Automatically generate PDF on success
      setTimeout(() => {
        generateOrderPDF(orderData);
      }, 800);
      
    } catch (error) {
      alert("System busy. Please try placing your order again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
    if (clearCart) clearCart();
    setIsSuccess(false);
    onClose();

    setTimeout(() => {
      const productsEl = document.getElementById('products');
      if (productsEl) {
        productsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleGmailDispatch = () => {
    if (lastOrder) {
      window.open(generateGmailLink(lastOrder), '_blank');
    }
  };

  const handleDownloadInvoice = () => {
    if (lastOrder) {
      generateOrderPDF(lastOrder);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
            onClick={!isProcessing ? onClose : undefined} 
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
          >
            {isSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#fffcf5] overflow-y-auto">
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </motion.div>
                
                <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Order Logged</h2>
                <p className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Ref: {lastOrder?.orderId}</p>
                
                <div className="bg-white border border-amber-100 p-8 rounded-[2.5rem] shadow-sm mb-8 w-full text-left space-y-5">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Invoice Status</p>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      PDF Invoice Generated
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Email Routing</p>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                      Confirmed to <span className="text-amber-600 font-bold">cyberdraft67@gmail.com</span>.
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <button 
                    onClick={handleDownloadInvoice}
                    className="w-full py-5 bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download PDF Invoice
                  </button>
                  <button 
                    onClick={handleGmailDispatch}
                    className="w-full py-5 bg-[#EA4335] hover:bg-[#d93025] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.5 0 4 2 4 4.5V17z"/><path d="M2 9.5l10 6 10-6"/></svg>
                    Notify via Gmail
                  </button>
                  <button 
                    onClick={handleCloseSuccess}
                    className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                  >
                    Go Shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Checkout</h2>
                    <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em]">{items.length} Harvest Units</p>
                  </div>
                  {!isProcessing && (
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/20 custom-scrollbar">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-8">
                      <div className="bg-amber-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                      </div>
                      <button onClick={onClose} className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg">Back to Orchards</button>
                    </div>
                  ) : (
                    <div className="space-y-8 pb-12">
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.id} className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-xs">{item.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold">{item.quantity} × {item.unit}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900 text-xs">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                              {!isProcessing && (
                                <button onClick={() => onRemove(item.id)} className="text-red-300 hover:text-red-500 mt-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm space-y-6">
                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Delivery Details</h3>
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            disabled={isProcessing}
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                            placeholder="Recipient Name"
                            className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.name ? 'border-red-500' : 'border-gray-100'} outline-none font-bold text-gray-900 text-sm disabled:opacity-50`}
                          />
                          <input 
                            type="tel" 
                            disabled={isProcessing}
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            placeholder="WhatsApp Number"
                            className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.phone ? 'border-red-500' : 'border-gray-100'} outline-none font-bold text-gray-900 text-sm disabled:opacity-50`}
                          />
                          <textarea 
                            disabled={isProcessing}
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            placeholder="Exact Shipping Address"
                            className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.address ? 'border-red-500' : 'border-gray-100'} outline-none font-bold text-gray-900 text-sm min-h-[100px] disabled:opacity-50`}
                          />
                          {showValidation && (!customerInfo.name || !customerInfo.phone || !customerInfo.address) && (
                            <p className="text-red-500 text-[10px] font-black uppercase text-center">Missing Delivery Information</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-10 border-t border-gray-100 bg-white rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Total</span>
                      <span className="text-4xl font-black text-gray-900 tracking-tighter">Rs. {total.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full py-6 bg-gray-900 hover:bg-black text-white rounded-3xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 disabled:bg-gray-400"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-3">
                          <svg className="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Processing...
                        </span>
                      ) : "Confirm Order"}
                    </button>
                    <p className="text-center text-[9px] text-gray-400 font-black uppercase tracking-[0.4em] mt-8">Logged to Database • PDF Generating</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
