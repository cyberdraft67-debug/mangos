
import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Premium harvest season ends on August 15th, 2026 at 23:59:59 UTC
const TARGET_HARVEST_DATE = '2026-08-15T23:59:59Z';

const calculateTimeLeft = () => {
  const targetDate = new Date(TARGET_HARVEST_DATE);
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();
  
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  return timeLeft;
};

const Hero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div id="hero" className="relative min-h-screen pt-36 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background Container with Parallax and Ambient Movement */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0 origin-center will-change-transform"
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover scale-110"
          poster="https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000&auto=format&fit=crop"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-lush-green-forest-4393-large.mp4" 
            type="video/mp4" 
          />
        </video>
      </motion.div>

      {/* Static Overlays */}
      <div className="absolute inset-0 z-[1] bg-black/40 backdrop-blur-[0.5px]"></div>
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/20 to-black/30"></div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: [0, -10, 0],
          }}
          transition={{ 
            opacity: { duration: 1, ease: "easeOut" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 inline-flex items-center gap-3 px-6 py-2 bg-amber-500/20 backdrop-blur border border-amber-400/30 rounded-full"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.4em]">Karachi Regional Exclusive</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95] text-white tracking-tighter"
          >
            The Golden <br />
            <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">Orchard</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg md:text-xl mb-6 text-gray-100 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-lg"
          >
            Savor the royalty of orchards. Directly from nature's lap to your door. <br/> <span className="text-amber-400 font-bold">Serving Karachi Only.</span>
          </motion.p>

          {/* Premium Harvest Sunset Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            className="mb-8 max-w-sm mx-auto p-3 md:p-4 bg-black/65 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.06)]"
          >
            <div className="flex items-center justify-center gap-1.5 mb-2.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
              <p className="text-amber-400 text-[8px] font-black uppercase tracking-[0.3em]">
                HARVEST CYCLE CLOSING IN
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center p-1.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[7px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">Days</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[7px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">Hours</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[7px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">Mins</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-white/5 rounded-xl border border-amber-400/20">
                <span className="text-xl md:text-2xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[7px] font-extrabold text-amber-400 uppercase tracking-widest mt-0.5 animate-pulse">Secs</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <button 
              onClick={onExplore}
              className="relative px-12 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-lg md:text-xl transition-all transform hover:scale-105 shadow-[0_0_50px_rgba(245,158,11,0.4)] active:scale-95 group flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Order Your Harvest
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            {/* Elegant premium mouse-wheel indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-5 h-8 border border-amber-400/50 rounded-full flex justify-center pt-1.5 opacity-80 backdrop-blur-sm">
                <motion.div 
                  animate={{ 
                    y: [0, 8, 0],
                    opacity: [1, 0.3, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.8, 
                    ease: "easeInOut" 
                  }}
                  className="w-1 h-2 bg-amber-400 rounded-full"
                />
              </div>
              <span className="text-amber-400 text-[8px] font-black uppercase tracking-[0.4em] mt-1 drop-shadow-md">
                Scroll to Discover
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Fix: Add default export for Hero component
export default Hero;
