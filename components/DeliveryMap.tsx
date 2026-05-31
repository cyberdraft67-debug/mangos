import * as React from 'react';
import { motion } from 'framer-motion';

const DeliveryMap: React.FC = () => {
  return (
    <div id="delivery-map" className="w-full bg-gradient-to-br from-amber-50/40 via-white to-amber-50/10 border border-amber-500/10 rounded-3xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Decorative Blueprint Grid Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b04_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b04_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      
      {/* Header Accent details */}
      <div className="flex justify-between items-center mb-4 relative z-10 border-b border-amber-500/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <h5 className="text-[10px] font-black tracking-[0.25em] text-gray-900 uppercase">
            Harvest Delivery Corridor
          </h5>
        </div>
        <span className="text-[8px] font-mono text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10">
          Karachi Special Route
        </span>
      </div>

      {/* Visual Map Content */}
      <div className="relative h-28 w-full flex items-center justify-center">
        {/* The Map Vector Path */}
        <svg className="w-full h-full" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle background terrain guide lines */}
          <path 
            d="M 20 80 Q 70 90 120 70 T 220 50 T 300 20" 
            stroke="#f59e0b" 
            strokeWidth="0.5" 
            strokeDasharray="2 6" 
            opacity="0.15" 
          />
          <path 
            d="M 10 30 Q 90 50 160 30 T 270 40" 
            stroke="#111827" 
            strokeWidth="0.5" 
            strokeDasharray="3 9" 
            opacity="0.08" 
          />

          {/* Underlay glow path */}
          <path
            d="M 240,25 Q 160,50 80,95"
            fill="transparent"
            stroke="#fbbf24"
            strokeWidth="3"
            opacity="0.15"
            strokeLinecap="round"
          />

          {/* Core connection curve line */}
          <path
            d="M 240,25 Q 160,50 80,95"
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth="1.5"
            opacity="0.5"
            strokeLinecap="round"
          />

          {/* Animated golden flow dots */}
          <motion.path
            d="M 240,25 Q 160,50 80,95"
            fill="transparent"
            stroke="#d97706"
            strokeWidth="2"
            strokeDasharray="6 12"
            strokeLinecap="round"
            animate={{ strokeDashoffset: [0, -36] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 2 }}
          />

          {/* Multan Origin Node Accent */}
          <g transform="translate(240, 25)">
            {/* outer radar ring */}
            <circle r="10" fill="none" stroke="#f59e0b" strokeWidth="0.75" opacity="0.3">
              <animate attributeName="r" values="4;12;4" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* inner solid ring */}
            <circle r="4" fill="#f59e0b" />
            <circle r="1.5" fill="#ffffff" />
          </g>

          {/* Karachi Destination Node Accent */}
          <g transform="translate(80, 95)">
            {/* outer radar ring */}
            <circle r="12" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.4">
              <animate attributeName="r" values="5;15;5" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
            {/* inner solid ring */}
            <circle r="5" fill="#d97706" />
            <circle r="2" fill="#ffffff" />
          </g>

          {/* Route Labels embedded directly inside SVG for pinpoint placement */}
          <text x="245" y="15" fill="#111827" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-sans uppercase tracking-wider">
            Multan Orchards
          </text>
          <text x="245" y="44" fill="#9ca3af" fontSize="6.5" textAnchor="middle" className="font-mono">
            30.15° N, 71.52° E
          </text>

          <text x="80" y="115" fill="#111827" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-sans uppercase tracking-wider">
            Karachi Hub
          </text>
          <text x="80" y="80" fill="#9ca3af" fontSize="6.5" textAnchor="middle" className="font-mono">
            24.86° N, 67.00° E
          </text>
        </svg>

        {/* Legend overlays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-500/10 shadow-sm pointer-events-none">
          <p className="text-[8px] font-black tracking-widest text-amber-600 uppercase flex items-center gap-1">
            <span>Direct Air/Cold Chain Corridor</span>
          </p>
        </div>
      </div>

      {/* Footer statistics overlay */}
      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-amber-500/5 text-center text-[9px] uppercase tracking-wider">
        <div className="bg-amber-500/5 p-1.5 rounded-lg border border-amber-500/5">
          <p className="text-[6.5px] text-gray-400 font-bold">Corridor Length</p>
          <p className="font-mono font-black text-amber-700 mt-0.5">~930 Kilometers</p>
        </div>
        <div className="bg-amber-500/5 p-1.5 rounded-lg border border-amber-500/5">
          <p className="text-[6.5px] text-gray-400 font-bold">Transit Standard</p>
          <p className="font-mono font-black text-amber-700 mt-0.5">24h Elite Temp Control</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
