
import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const Hero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  return (
    <div id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-cream">
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/linen.png")' }} />
      
      {/* Hero Visual - High End Product Shot */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block"
      >
        <img 
          src="https://images.unsplash.com/photo-1553272725-086100aecf5e?q=80&w=2000&auto=format&fit=crop"
          alt="Royal Chaunsa"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cream/20 to-cream" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="mb-8"
          >
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.8em] inline-block py-1 border-b border-gold/20 mb-4 ml-[0.8em]">
              Reserve Selection
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[110px] font-serif leading-[0.9] text-charcoal tracking-tighter mb-10"
          >
            Punjab's
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="text-sm md:text-base mb-16 text-charcoal/40 font-light leading-relaxed max-w-sm tracking-wide"
          >
            A heritage curated through generations. Experience the most aromatic harvest of the season.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1.2 }}
            className="flex flex-col items-start"
          >
            <button 
              onClick={onExplore}
              className="group relative px-16 py-6 border border-charcoal text-charcoal rounded-none font-bold text-[9px] tracking-[0.5em] uppercase transition-all duration-700 overflow-hidden hover:text-white"
            >
              <div className="absolute inset-0 bg-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
              <span className="relative z-10 transition-colors">Explore Collection</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elite Markings */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-16 left-16 z-10 hidden md:block"
      >
        <div className="flex items-center gap-10">
          <div className="space-y-2">
            <span className="text-[8px] text-charcoal/30 font-black uppercase tracking-[0.5em] block">Legacy Collection</span>
            <span className="text-[14px] text-gold font-serif italic block">Est. 1954</span>
          </div>
          <div className="w-40 h-px bg-charcoal/5" />
          <div className="space-y-2">
            <span className="text-[8px] text-charcoal/30 font-black uppercase tracking-[0.5em] block">Origin Status</span>
            <span className="text-[14px] text-gold font-serif italic block">Punjab Region</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
