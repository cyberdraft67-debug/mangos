
import * as React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] inline-block">
          &copy; {currentYear} The Golden Orchard. Reserves.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
