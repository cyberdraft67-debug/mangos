import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
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
    if (!el) return;

    // Premium custom-easing smooth scroll with a refined top offset (ideal for fixed navigations)
    const headerOffset = 130;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    const startPosition = window.scrollY;
    const distance = offsetPosition - startPosition;
    const duration = 1000; // Refined 1-second long-range easing
    let startTimestamp: number | null = null;

    const cubicOut = (t: number) => {
      return 1 - Math.pow(1 - t, 3); // Slowing down beautifully at the end
    };

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = cubicOut(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
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
      <section id="products" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
              Our 2026 Selections
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
              Straight from the sun-drenched orchards of Punjab. Our handpicked premium boxes are tailored for regular family enjoyment, gifting, or premium celebrations:
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-50 border border-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider mx-auto">
              <span className="text-base">📅</span>
              <span>Pre-order Shipments Begin: <strong className="font-extrabold text-amber-950">After 15 June 2026</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        clearCart={clearCart}
      />

      <Footer />

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
