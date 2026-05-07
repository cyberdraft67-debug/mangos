
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollTo: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onScrollTo }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 md:px-16",
        isScrolled ? "py-4" : "py-10"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto transition-all duration-1000 flex justify-between items-center group/nav",
        isScrolled ? "bg-white/90 backdrop-blur-3xl px-10 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-charcoal/5" : "bg-transparent"
      )}>
        {/* Elite Branding */}
        <div 
          className="cursor-pointer flex items-center gap-4"
          onClick={() => onScrollTo('hero')}
        >
          <div className="w-8 h-8 flex items-center justify-center border border-gold rotate-45 group-hover/nav:rotate-0 transition-transform duration-700">
            <span className="-rotate-45 group-hover/nav:rotate-0 transition-transform duration-700 text-[10px] font-black text-gold">R</span>
          </div>
          <span className={cn(
            "text-2xl font-serif tracking-tighter transition-all duration-700 italic font-light",
            isScrolled ? "text-charcoal" : "text-charcoal"
          )}>
            Reserve<span className={cn("font-bold not-italic ml-2 text-gold")}>Selection</span>
          </span>
        </div>

        {/* Minimalist Menu */}
        <nav className="hidden md:flex items-center gap-16">
          {['Selection', 'Legacy', 'Chef'].map((item) => (
            <button 
              key={item}
              onClick={() => onScrollTo(item.toLowerCase() === 'selection' ? 'products' : item.toLowerCase())} 
              className={cn(
                "text-[9px] font-black uppercase tracking-[0.6em] transition-all duration-700 relative group py-2",
                isScrolled ? "text-charcoal/40 hover:text-gold" : "text-charcoal/30 hover:text-gold"
              )}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-700 ease-[0.16, 1, 0.3, 1] group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Action Elements */}
        <div className="flex items-center gap-10">
          <button 
            onClick={onOpenCart}
            className="group relative p-2"
          >
            <ShoppingBag className={cn(
              "w-5 h-5 transition-all duration-700",
              isScrolled ? "text-gold" : "text-charcoal"
            )} strokeWidth={1} />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gold text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          
          <button className={cn("md:hidden transition-all duration-700", isScrolled ? "text-charcoal" : "text-gold")}>
            <Menu className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Subtle Elite Marker */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="absolute top-full left-0 right-0 flex justify-center pt-6 pointer-events-none"
          >
            <span className="text-[7px] text-charcoal/10 font-black uppercase tracking-[0.8em]">
              Established 1954 • Heritage Reserve Distribution
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
