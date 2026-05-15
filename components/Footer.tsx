
import * as React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-white border-t border-gray-100 pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          {/* Brand section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform">
                <span className="text-white font-black text-xl">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Chaunsa</span>
                <span className="text-xl font-light text-amber-500 tracking-tighter uppercase leading-none">Gold</span>
              </div>
            </div>
            <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-sm uppercase tracking-wider">
              From the heart of Multan orchards, delivering royalty to your doorstep. The purest harvest, every season. Centuries of tradition, packed in every box.
            </p>
          </div>

          {/* Navigation links - Simplified and pushed to right on desktop */}
          <div className="space-y-6 md:text-right flex flex-col md:items-end">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Navigation</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <li><a href="#hero" className="text-gray-900 font-bold uppercase tracking-widest text-xs hover:text-amber-500 transition-colors">Home</a></li>
              <li><a href="#catalog" className="text-gray-900 font-bold uppercase tracking-widest text-xs hover:text-amber-500 transition-colors">The Harvest</a></li>
              <li><a href="#" className="text-gray-900 font-bold uppercase tracking-widest text-xs hover:text-amber-500 transition-colors">Our Orchards</a></li>
              <li><a href="#" className="text-gray-900 font-bold uppercase tracking-widest text-xs hover:text-amber-500 transition-colors">Shipping</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
            &copy; {currentYear} Chaunsa Gold. Multan Harvest Reserve.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
