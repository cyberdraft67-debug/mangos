
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Trash2, Minus, Plus, FileText, Send, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { processOrderSubmission, generateGmailLink, OrderData } from '../services/orderService';
import { generateOrderPDF } from '../services/pdfService';
import { cn } from '../lib/utils';

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
      
      const gmailLink = generateGmailLink(orderData);
      window.open(gmailLink, '_blank');

      setIsSuccess(true);
      
      setTimeout(() => {
        generateOrderPDF(orderData);
      }, 500);
      
      if (clearCart) clearCart();

    } catch (error) {
      console.error("Order processing failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    onClose();
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
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={!isProcessing ? onClose : undefined} 
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="absolute top-0 right-0 h-full w-full max-w-md md:max-w-xl bg-white shadow-2xl flex flex-col border-l border-charcoal/5"
          >
            {isSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-center bg-cream">
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                  className="mb-12"
                >
                  <CheckCircle2 className="w-28 h-28 text-gold stroke-[0.5px]" />
                </motion.div>
                
                <h2 className="text-5xl font-serif text-charcoal mb-6 tracking-tighter italic">Selection Acquired</h2>
                <p className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-16">Registry Entry: {lastOrder?.orderId}</p>
                
                <div className="bg-ivory border border-charcoal/5 p-10 rounded-none w-full text-left space-y-8 mb-16 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <div className="space-y-6 relative z-10">
                    <p className="text-[9px] text-gold font-black uppercase tracking-[0.4em]">Protocol Authorization</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                        <div className="w-1 h-1 bg-gold rounded-full" />
                        Ledger Synchronized
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                        <div className="w-1 h-1 bg-gold rounded-full" />
                        Provenance Verified
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-6 px-10">
                  <button 
                    onClick={() => generateOrderPDF(lastOrder!)}
                    className="w-full py-6 bg-gold text-midnight rounded-none font-black uppercase tracking-[0.4em] text-[9px] flex items-center justify-center gap-4 hover:bg-gold-light transition-all duration-700"
                  >
                    <FileText size={16} strokeWidth={1} />
                    Download Provenance
                  </button>
                  <button 
                    onClick={handleCloseSuccess}
                    className="w-full py-6 text-ivory/20 font-black uppercase tracking-[0.5em] text-[9px] hover:text-ivory/40 transition-colors"
                  >
                    Return to Selection
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-10 border-b border-charcoal/5 flex justify-between items-center bg-cream/50 backdrop-blur-3xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <h2 className="text-3xl font-serif text-charcoal tracking-tighter italic font-light">Your Selection</h2>
                    <p className="text-[9px] text-gold font-black uppercase tracking-[0.5em] mt-2">{items.length} Artifacts in Registry</p>
                  </div>
                  {!isProcessing && (
                    <button onClick={onClose} className="p-3 hover:bg-ivory rounded-none text-charcoal/20 hover:text-gold transition-all group relative z-10">
                      <X size={28} strokeWidth={1} className="group-hover:rotate-90 transition-transform duration-700" />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar bg-white">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                      <ShoppingBag size={64} strokeWidth={0.5} className="mb-8" />
                      <p className="text-[10px] font-black uppercase tracking-[0.8em]">Archive Vacant</p>
                    </div>
                  ) : (
                    <div className="space-y-16 pb-12">
                      <div className="space-y-10">
                        {items.map(item => (
                          <div key={item.id} className="flex gap-8 group">
                            <div className="w-24 h-32 bg-ivory rounded-none overflow-hidden border border-charcoal/5 relative">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <h4 className="font-serif text-charcoal text-xl tracking-tight leading-none italic">{item.name}</h4>
                              <p className="text-[9px] text-charcoal/20 uppercase tracking-[0.3em] font-black mt-2">{item.unit}</p>
                            </div>
                            <div className="flex flex-col items-end justify-center gap-4">
                              <p className="font-serif text-charcoal text-lg tracking-tighter">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                              {!isProcessing && (
                                <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-4 py-1.5 px-3 border border-charcoal/5 rounded-none">
                                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-charcoal/30 hover:text-gold transition-colors"><Minus size={12} /></button>
                                    <span className="text-[10px] font-black text-charcoal/60 w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-charcoal/30 hover:text-gold transition-colors"><Plus size={12} /></button>
                                  </div>
                                  <button onClick={() => onRemove(item.id)} className="text-red-900/10 hover:text-red-500/40 transition-colors">
                                    <Trash2 size={12} strokeWidth={1} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-10 pt-10 border-t border-white/5">
                        <h3 className="text-[9px] font-black text-gold uppercase tracking-[0.5em]">Authentication Details</h3>
                        <div className="space-y-8">
                          <div className="relative group">
                            <input 
                              type="text" 
                              disabled={isProcessing}
                              value={customerInfo.name}
                              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                              placeholder="Recipient Signature"
                              className={cn(
                                "w-full bg-transparent border-b border-charcoal/10 pb-4 outline-none text-[10px] font-serif text-charcoal placeholder:text-charcoal/20 uppercase tracking-[0.2em] focus:border-gold transition-all",
                                showValidation && !customerInfo.name && "border-red-500/20"
                              )}
                            />
                          </div>
                          <div className="relative group">
                            <input 
                              type="tel" 
                              disabled={isProcessing}
                              value={customerInfo.phone}
                              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                              placeholder="Primary Channel"
                              className={cn(
                                "w-full bg-transparent border-b border-charcoal/10 pb-4 outline-none text-[10px] font-serif text-charcoal placeholder:text-charcoal/20 uppercase tracking-[0.2em] focus:border-gold transition-all",
                                showValidation && !customerInfo.phone && "border-red-500/20"
                              )}
                            />
                          </div>
                          <div className="relative group">
                            <textarea 
                              disabled={isProcessing}
                              value={customerInfo.address}
                              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                              placeholder="Regional Destination"
                              className={cn(
                                "w-full bg-transparent border-b border-charcoal/10 pb-4 outline-none text-[10px] font-serif text-charcoal placeholder:text-charcoal/20 uppercase tracking-[0.2em] min-h-[100px] resize-none focus:border-gold transition-all",
                                showValidation && !customerInfo.address && "border-red-500/20"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-12 bg-ivory/50 backdrop-blur-3xl border-t border-charcoal/5">
                    <div className="flex justify-between items-center mb-12">
                      <span className="text-charcoal/20 font-black text-[9px] uppercase tracking-[0.6em]">Protocol Total</span>
                      <span className="text-4xl font-serif text-charcoal tracking-tighter italic">Rs. {total.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full py-8 bg-charcoal text-white rounded-none font-black text-[10px] uppercase tracking-[0.5em] shadow-xl transition-all duration-700 hover:bg-gold hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-6 disabled:opacity-30 cursor-pointer"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-4">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border border-white border-t-transparent rounded-full" />
                          <span>Processing Auth...</span>
                        </div>
                      ) : (
                        <>
                          <span>Execute Command</span>
                          <Send size={16} strokeWidth={1} />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[7px] text-charcoal/20 font-black uppercase tracking-[1em] mt-10 italic">Heritage Reserve Priority Logistics</p>
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
