
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
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const scale = useTransform(scrollY, [0, 500], [1.1, 1.3]);
  const rotate = useTransform(scrollY, [0, 500], [0, 5]);

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Container with Parallax and Ambient Movement */}
      <motion.div 
        style={{ y, scale, rotateZ: rotate }}
        animate={{ 
          scale: [1.1, 1.2, 1.1],
          rotate: [0, 1.5, 0]
        }}
        transition={{ 
          scale: { duration: 25, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 35, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0 z-0 origin-center"
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
            className="text-7xl md:text-9xl font-black mb-8 leading-[0.9] text-white tracking-tighter"
          >
            The Golden <br />
            <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">Orchard</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-xl md:text-2xl mb-8 text-gray-100 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-lg"
          >
            Savor the royalty of orchards. Directly from nature's lap to your door. <br/> <span className="text-amber-400 font-bold">Serving Karachi Only.</span>
          </motion.p>

          {/* Premium Harvest Sunset Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            className="mb-10 max-w-md mx-auto p-4 md:p-6 bg-black/60 backdrop-blur-md rounded-3xl border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.08)]"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
              <p className="text-amber-400 text-[9px] font-black uppercase tracking-[0.3em]">
                HARVEST CYCLE CLOSING IN
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center p-2 bg-white/5 rounded-2xl border border-white/15">
                <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">Days</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white/5 rounded-2xl border border-white/15">
                <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">Hours</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white/5 rounded-2xl border border-white/15">
                <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">Mins</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white/5 rounded-2xl border border-amber-400/30">
                <span className="text-2xl md:text-3xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-extrabold text-amber-400 uppercase tracking-widest mt-0.5 animate-pulse">Secs</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            <button 
              onClick={onExplore}
              className="relative px-16 py-6 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-2xl transition-all transform hover:scale-105 shadow-[0_0_60px_rgba(245,158,11,0.5)] active:scale-95 group flex items-center gap-4 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Order Your Harvest
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 bg-amber-400/50"></div>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.4em]">Scroll to Discover</p>
              <div className="h-px w-8 bg-amber-400/50"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Fix: Add default export for Hero component
export default Hero;
