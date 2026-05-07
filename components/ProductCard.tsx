
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Plus, Check, MessageSquare, X } from 'lucide-react';
import { Product, Review } from '../types';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(product.reviews);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';

  const handleAddToCartClick = () => {
    if (product.stock <= 0 || isAdded) return;
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;
    
    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ userName: '', rating: 5, comment: '' });
    setShowAddReview(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-gold">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            fill={i < Math.floor(rating) ? 'currentColor' : 'none'} 
            className="stroke-[1.5]"
          />
        ))}
      </div>
    );
  };

  const stockStatus = product.stock <= 0 
    ? { label: 'Sold Out', color: 'text-red-500' }
    : product.stock <= 10 
    ? { label: 'Select Harvest', color: 'text-gold' }
    : { label: 'Peak Season', color: 'text-charcoal/40' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full perspective-1000"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory rounded-none mb-8 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-all duration-1000 border border-charcoal/5">
        <motion.img 
          src={product.image} 
          alt={product.name} 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 brightness-90 group-hover:brightness-100",
            product.stock <= 0 ? 'grayscale opacity-40' : 'group-hover:contrast-[1.05]'
          )}
          referrerPolicy="no-referrer"
        />
        
        {/* Elite Labeling */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
          <span className={cn(
            "text-[8px] font-black uppercase tracking-[0.4em] px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-none inline-block border border-charcoal/5",
            stockStatus.color
          )}>
            {stockStatus.label}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.4em] px-3 py-1.5 bg-charcoal text-white rounded-none inline-block">
            {product.category}
          </span>
        </div>

        {/* Floating Quick Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-7 focus-within:opacity-100">
          <button 
            onClick={handleAddToCartClick}
            disabled={product.stock <= 0}
            className="w-16 h-16 bg-charcoal text-white rounded-full flex items-center justify-center shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-700 hover:bg-gold hover:scale-110 active:scale-95"
          >
            {isAdded ? <Check className="w-6 h-6 stroke-[3]" /> : <Plus className="w-6 h-6 stroke-[3]" />}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 px-2">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-serif text-charcoal tracking-tight group-hover:text-gold transition-colors duration-500">{product.name}</h3>
            <div className="flex items-center gap-4 mt-3">
              {renderStars(typeof averageRating === 'string' && averageRating === 'New' ? 0 : Number(averageRating))}
              <span className="text-[8px] font-black text-charcoal/30 uppercase tracking-[0.3em]">
                {averageRating} / {reviews.length} Records
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-serif text-charcoal block tracking-tighter">Rs. {product.price.toLocaleString()}</span>
            <span className="text-[8px] text-charcoal/30 uppercase tracking-[0.4em] font-black">{product.unit}</span>
          </div>
        </div>

        <p className="text-charcoal/60 text-[11px] mb-10 leading-relaxed font-light italic line-clamp-2 tracking-wide">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center gap-8 pt-6 border-t border-charcoal/5">
          <button 
            onClick={() => setShowReviews(!showReviews)}
            className="flex items-center gap-2 text-charcoal/40 hover:text-gold transition-colors duration-500"
          >
            <MessageSquare size={12} />
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Review Dossier</span>
          </button>
          <button 
            onClick={() => setShowAddReview(!showAddReview)}
            className="text-[8px] font-black text-charcoal/20 hover:text-charcoal/50 transition-colors uppercase tracking-[0.4em]"
          >
            Authenticate
          </button>
        </div>

        <AnimatePresence>
          {(showReviews || showAddReview) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white/50 rounded-none mt-6 border border-charcoal/5"
            >
              <div className="p-6">
                {showAddReview ? (
                  <form onSubmit={handleAddReview} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Signature"
                        required
                        value={newReview.userName}
                        onChange={e => setNewReview({...newReview, userName: e.target.value})}
                        className="w-full text-[9px] px-0 py-3 bg-transparent border-b border-charcoal/10 focus:border-gold outline-none uppercase tracking-widest text-charcoal"
                      />
                      <select 
                        value={newReview.rating}
                        onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                        className="w-full text-[9px] bg-transparent border-b border-charcoal/10 outline-none text-gold font-bold uppercase tracking-widest"
                      >
                        {[5,4,3,2,1].map(r => <option key={r} value={r} className="bg-white">{r} Stars</option>)}
                      </select>
                    </div>
                    <textarea 
                      placeholder="Orchard Evaluation"
                      required
                      value={newReview.comment}
                      onChange={e => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full text-[10px] bg-transparent border-b border-charcoal/10 outline-none min-h-[80px] resize-none text-charcoal/60 italic leading-relaxed"
                    />
                    <div className="flex justify-between items-center">
                      <button type="submit" className="text-[9px] font-black uppercase tracking-[0.5em] text-gold hover:text-gold-light transition-colors">Submit Report</button>
                      <button type="button" onClick={() => setShowAddReview(false)} className="text-[9px] font-black uppercase tracking-[0.5em] text-charcoal/20 hover:text-charcoal/40 transition-colors">Abort</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6 max-h-60 overflow-y-auto custom-scrollbar pr-4">
                    {reviews.length === 0 ? (
                      <p className="text-[9px] text-charcoal/20 italic text-center py-8 tracking-[0.5em] uppercase font-black">Archive Empty</p>
                    ) : (
                      reviews.map(review => (
                        <div key={review.id} className="border-b border-charcoal/5 pb-6 last:border-0">
                          <div className="flex justify-between mb-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-charcoal/80">{review.userName}</span>
                            <span className="text-[8px] text-charcoal/20 uppercase tracking-[0.2em] font-black">{review.date}</span>
                          </div>
                          {renderStars(review.rating)}
                          <p className="text-[10px] text-charcoal/60 mt-3 italic font-light leading-relaxed">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProductCard;
