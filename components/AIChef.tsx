
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Search, UtensilsCrossed, Wine, Coffee, Salad, ChevronRight } from 'lucide-react';
import { getMangoAssistantResponse } from '../services/geminiService';
import { Message } from '../types';
import { cn } from '../lib/utils';

const RECIPE_SUGGESTIONS = [
  { label: 'Elixirs', icon: Wine, query: 'Give me a sophisticated Chaunsa mango drink/mocktail recipe for a gala' },
  { label: 'Accompaniments', icon: Salad, query: 'Show me an haute cuisine summer salad featuring Chaunsa mangoes' },
  { label: 'Confections', icon: Coffee, query: 'What is a museum-grade dessert I can craft with Heritage Chaunsa?' },
  { label: 'Savory Entrées', icon: UtensilsCrossed, query: 'Are there any Michelin-style savory main dishes that use Chaunsa mangoes?' },
];

const AIChef: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Salutations. I am your Heritage Sommelier. I possess the accumulated wisdom of the Punjab's most historic orchards. How may I guide your culinary exploration today?" }
  ]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = { role: 'user' as const, content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSearchQuery('');
    setIsTyping(true);

    try {
      const aiResponse = await getMangoAssistantResponse(textToSend);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Forgive me, the archives are currently restricted. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSend(`Identify a refined application for Gold Chaunsa involving: ${searchQuery}`);
    }
  };

  return (
    <section id="chef" className="py-40 bg-white relative overflow-hidden scroll-mt-24">
      {/* Decorative Branding */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.08),transparent_60%)]" />
      
      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <span className="text-[10px] text-gold font-black uppercase tracking-[0.8em] mb-6 inline-block">The Culinary Archives</span>
          <h2 className="text-6xl md:text-8xl font-serif text-charcoal mb-10 tracking-tighter">
            Heritage <span className="italic text-gold">Sommelier</span>
          </h2>
          <p className="text-charcoal/40 text-lg font-light max-w-2xl mx-auto leading-relaxed tracking-wide italic">
             Proprietary intelligence for bespoke recipes, pairing advice, and the rich heritage of the Punjab.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-20 items-start">
          {/* Sidebar Suggestions */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-ivory backdrop-blur-3xl border border-charcoal/5 p-10 rounded-none shadow-sm">
              <h3 className="text-[9px] font-black text-gold uppercase tracking-[0.5em] mb-10">Curated Inquiries</h3>
              <div className="space-y-4">
                {RECIPE_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion.query)}
                    className="w-full flex items-center gap-6 p-5 rounded-none border border-charcoal/5 hover:border-gold/30 hover:bg-white transition-all duration-700 group text-left"
                  >
                    <div className="p-4 bg-white rounded-none text-gold group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-sm">
                      <suggestion.icon size={16} strokeWidth={1} />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] font-black text-charcoal/60 uppercase tracking-[0.3em] group-hover:text-charcoal transition-colors">{suggestion.label}</span>
                    </div>
                    <ChevronRight size={12} className="text-charcoal/20 group-hover:text-gold transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex. Saffron, Cardamom..."
                className="w-full pl-14 pr-8 py-5 rounded-none border border-charcoal/5 bg-white backdrop-blur-3xl focus:border-gold/30 outline-none text-[10px] transition-all text-charcoal placeholder:text-charcoal/20 font-sans tracking-[0.3em] uppercase shadow-sm"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/40 w-4 h-4" />
            </form>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden border border-charcoal/5 flex flex-col h-[750px] relative"
            >
              {/* Chat Header */}
              <div className="p-10 border-b border-charcoal/5 flex items-center justify-between bg-cream/50 backdrop-blur-3xl sticky top-0 z-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-ivory rounded-none flex items-center justify-center border border-gold relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 shadow-xl" />
                    <Sparkles className="text-gold w-6 h-6 group-hover:text-white transition-colors relative z-10" strokeWidth={1} />
                  </div>
                  <div>
                    <h4 className="font-serif text-charcoal text-2xl tracking-tighter">Heritage Core</h4>
                    <p className="text-[8px] text-gold font-black uppercase tracking-[0.4em] flex items-center gap-3 mt-1">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                      Protocol Active
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-charcoal/5" />
                  ))}
                </div>
              </div>

              {/* Messages Container */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-cream/30">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={cn(
                        "max-w-[75%] p-8 rounded-none text-[11px] font-sans leading-relaxed tracking-wide shadow-sm",
                        msg.role === 'user' 
                          ? "bg-charcoal text-white font-black uppercase tracking-[0.2em]" 
                          : "bg-white text-charcoal/70 border border-charcoal/5 font-light font-serif italic text-[15px]"
                      )}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white p-8 rounded-none border border-charcoal/5 flex items-center gap-3 shadow-sm">
                      <motion.div animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 bg-gold rounded-full" />
                      <motion.div animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 bg-gold rounded-full" />
                      <motion.div animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 bg-gold rounded-full" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-10 border-t border-charcoal/5 bg-cream/50">
                <div className="flex gap-6 p-1 bg-white rounded-none border border-charcoal/5 focus-within:border-gold/20 transition-all duration-700 shadow-sm">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Consult the Sommelier..."
                    className="flex-1 px-8 py-4 bg-transparent focus:outline-none text-charcoal text-[10px] placeholder:text-charcoal/20 font-black uppercase tracking-[0.4em]"
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={isTyping || !input.trim()}
                    className="w-14 h-14 bg-charcoal text-white rounded-none flex items-center justify-center border border-charcoal hover:bg-gold hover:border-gold transition-all duration-700 disabled:opacity-30 cursor-pointer"
                  >
                    <Send size={18} strokeWidth={1} />
                  </button>
                </div>
                <p className="text-center text-[7px] text-charcoal/20 font-black uppercase tracking-[0.8em] mt-8 italic">Heritage Intelligence Protocol • Elite Data Reserve</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChef;
