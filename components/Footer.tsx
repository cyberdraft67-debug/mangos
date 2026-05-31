
import * as React from 'react';
import { motion } from 'framer-motion';
import DeliveryMap from './DeliveryMap';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-white border-t border-gray-100 pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-start">
          {/* Brand section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform">
                <span className="text-white font-black text-xl">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">The Golden</span>
                <span className="text-xl font-light text-amber-500 tracking-tighter uppercase leading-none">Orchard</span>
              </div>
            </div>
            <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-sm uppercase tracking-wider">
              From the heart of Multan orchards, delivering royalty to your doorstep. The purest harvest, every season. Centuries of tradition, packed in every box.
            </p>
          </div>

          {/* Delivery Map Corridor Section */}
          <div className="lg:col-span-5 w-full">
            <DeliveryMap />
          </div>

          {/* Navigation links - Simplified and pushed to right on desktop */}
          <div className="lg:col-span-3 space-y-6 lg:text-right flex flex-col lg:items-end">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Navigation</h4>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-3">
              <li>
                <motion.a 
                  href="#hero" 
                  whileHover={{ x: -4, color: "#f59e0b" }}
                  className="text-gray-900 font-bold uppercase tracking-widest text-xs inline-block transition-colors"
                >
                  Home
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#catalog" 
                  whileHover={{ x: -4, color: "#f59e0b" }}
                  className="text-gray-900 font-bold uppercase tracking-widest text-xs inline-block transition-colors"
                >
                  The Harvest
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#" 
                  whileHover={{ x: -4, color: "#f59e0b" }}
                  className="text-gray-900 font-bold uppercase tracking-widest text-xs inline-block transition-colors"
                >
                  Our Orchards
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#" 
                  whileHover={{ x: -4, color: "#f59e0b" }}
                  className="text-gray-900 font-bold uppercase tracking-widest text-xs inline-block transition-colors"
                >
                  Shipping
                </motion.a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
            &copy; {currentYear} The Golden Orchard. Multan Harvest Reserve.
          </p>
          <div className="flex gap-8">
            <motion.a 
              href="#" 
              whileHover={{ y: -2, color: "#111827" }}
              className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] transition-colors"
            >
              Privacy
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -2, color: "#111827" }}
              className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] transition-colors"
            >
              Terms
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
