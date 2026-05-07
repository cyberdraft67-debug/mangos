import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AIChef from './components/AIChef';
import { AdminLogin, AdminDashboard } from './components/AdminPanel';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // ✅ Admin access via ?admin=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1") {
      setShowAdminLogin(true);
    }
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={totalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={scrollTo}
      />

      <Hero onExplore={() => scrollTo('products')} />

      {/* PRODUCTS */}
      <section id="products" className="py-40 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-32">
            <span className="text-[10px] text-gold font-black uppercase tracking-[0.8em] mb-6 inline-block">The Selection</span>
            <h2 className="text-6xl md:text-8xl font-serif text-charcoal mb-10 tracking-tighter">Premium <span className="italic text-gold">Harvest</span></h2>
            <div className="w-20 h-px bg-gold/30 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {PRODUCTS.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <div id="chef" className="scroll-mt-24">
        <AIChef />
      </div>

      {/* TRUST MARKERS */}
      <section className="py-40 bg-ivory border-y border-charcoal/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
            {[
              { label: 'Origin', value: 'Punjab' },
              { label: 'Heritage', value: 'Since 1954' },
              { label: 'Integrity', value: 'Certified' },
              { label: 'Delivery', value: 'Air Cargo' }
            ].map((marker, i) => (
              <div key={i} className="group">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.5em] mb-4">{marker.label}</p>
                <p className="text-2xl font-serif text-charcoal group-hover:text-gold transition-all duration-700">{marker.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-16 border-t border-charcoal/5 pt-20">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-serif text-charcoal tracking-tighter mb-3 italic font-light">Reserve Selection</h3>
            <p className="text-[9px] text-gold font-bold uppercase tracking-[0.5em]">The Heritage Fruit Protocol</p>
          </div>
          
          <div className="flex gap-16 text-[9px] font-black text-charcoal/30 uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-gold transition-colors duration-500">History</a>
            <a href="#" className="hover:text-gold transition-colors duration-500">Orchard</a>
            <a href="#" className="hover:text-gold transition-colors duration-500">Protocol</a>
          </div>

          <p className="text-[9px] text-charcoal/10 font-bold uppercase tracking-[0.3em] text-center md:text-right">
            © 2024 Heritage Reserve. <br />
            Cultivated with Tradition.
          </p>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        clearCart={clearCart}
      />

      {/* ADMIN LOGIN */}
      {showAdminLogin && (
        <AdminLogin
          onLogin={() => {
            setIsAdminAuthenticated(true);
            setShowAdminLogin(false);
          }}
          onCancel={() => {
            setShowAdminLogin(false);
            window.history.replaceState({}, "", "/");
          }}
        />
      )}

      {/* ADMIN DASHBOARD */}
      {isAdminAuthenticated && (
        <AdminDashboard
          onClose={() => {
            setIsAdminAuthenticated(false);
            window.history.replaceState({}, "", "/");
          }}
        />
      )}
    </div>
  );
};

export default App;
