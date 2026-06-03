/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Award, 
  ShieldCheck, 
  Instagram, 
  Mail, 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ShoppingCart, 
  Info,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';

import Header from './components/Header';
import FaqAccordion from './components/FaqAccordion';

import { FLAVORS, REVIEWS, HERO_IMAGE } from './data';
import { CartItem, JamFlavor } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSpotlightId, setActiveSpotlightId] = useState<string>('strawberry-jam');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [selectedSubTier, setSelectedSubTier] = useState<string>('brunch');

  // Trigger floating alert when item is added to cart
  const [cartAlert, setCartAlert] = useState<{ show: boolean; text: string } | null>(null);

  const triggerAlert = (text: string) => {
    setCartAlert({ show: true, text });
    setTimeout(() => {
      setCartAlert(null);
    }, 3000);
  };

  // Add Single Jar directly to Cart
  const handleAddSingleToCart = (flavorId: string) => {
    const flavor = FLAVORS.find(f => f.id === flavorId);
    if (!flavor) return;

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.flavorId === flavorId && !item.isCustomBox);
      if (existingIdx !== -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: `single-${flavorId}-${Date.now()}`,
            name: `${flavor.name} Jar`,
            flavorId: flavor.id,
            image: flavor.image,
            price: flavor.price,
            quantity: 1,
            isCustomBox: false
          }
        ];
      }
    });

    triggerAlert(`Added delicious ${flavor.name} to your pantry!`);
    
    // Auto trigger drawer open to let users see their items
    setTimeout(() => {
      setCartOpen(true);
    }, 400);
  };

  // Add Subscription directly to Cart
  const handleAddSubscriptionToCart = (tierType: string) => {
    let name = "Single Spooner Club";
    let price = 8;
    let desc = "1 signature jar monthly";
    
    if (tierType === 'brunch') {
      name = "Brunch Host Club";
      price = 20;
      desc = "3 bespoke jars monthly";
    } else if (tierType === 'slatherer') {
      name = "Daily Slatherer Club";
      price = 39;
      desc = "6 bespoke jars monthly";
    }

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.flavorId === `sub-${tierType}`);
      if (existingIdx !== -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: `sub-${tierType}-${Date.now()}`,
            name: `${name} Subscription`,
            flavorId: `sub-${tierType}`,
            image: HERO_IMAGE,
            price: price,
            quantity: 1,
            isCustomBox: true,
            boxContents: [FLAVORS[0].id] // Default reference
          }
        ];
      }
    });

    triggerAlert(`Joined the Gloop ${name}! Welcome to the Gloop Club.`);
    
    setTimeout(() => {
      setCartOpen(true);
    }, 400);
  };

  // Adjust line item quantities inside Cart drawer
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const nextQuant = item.quantity + delta;
          return nextQuant > 0 ? { ...item, quantity: nextQuant } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  // Remove line item altogether
  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Remove all products
  const handleClearCart = () => {
    setCart([]);
  };

  // Click smooth scroll helper
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cycle reviews carousel
  const nextReview = () => {
    setActiveReviewIdx((activeReviewIdx + 1) % REVIEWS.length);
  };
  const prevReview = () => {
    setActiveReviewIdx((activeReviewIdx - 1 + REVIEWS.length) % REVIEWS.length);
  };

  // Handle Join VIP club
  const handleJoinNewsletter = (e: any) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterSuccess(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const selectedSpotlightFlavor = FLAVORS.find(f => f.id === activeSpotlightId) || FLAVORS[0];

  return (
    <div className="min-h-screen bg-[#f4f5f0] flex flex-col selection:bg-[#fcaf9b] selection:text-[#4b2920] overflow-x-hidden">
      
      {/* Dynamic Pop-up Alerts */}
      <AnimatePresence>
        {cartAlert?.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#b51136] border-2 border-[#4b2920] px-6 py-3 rounded-full retro-shadow flex items-center space-x-3 text-white max-w-sm"
          >
            <Sparkles className="w-5 h-5 text-[#fbbc2f] animate-spin" />
            <span className="font-sans text-xs md:text-sm font-bold tracking-tight">
              {cartAlert.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header navigation */}
      <Header 
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
        clearCart={handleClearCart}
        onScrollToSection={handleScrollToSection}
      />

      {/* RUNNING BANNER TOP TICKER */}
      <div className="w-full bg-[#b51136] border-b-3 border-[#4b2920] py-1.5 overflow-hidden flex items-center z-20">
        <div className="animate-marquee whitespace-nowrap flex text-[#f4f5f0] text-xs font-display font-medium tracking-widest uppercase">
          {Array(8).fill("• COUTURE CONFECTIONERY • THE COOLEST JAMS IN TOWN • SHIMMERING REFLECTION • 100% ORGANIC SWEET FRUIT FOLDS • NO HIGH FRUCTOSE SLOP • ").map((str, idx) => (
            <span key={idx} className="mr-4 inline-block">{str}</span>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="hero" className="relative px-4 py-12 md:py-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Floating fruit particles decoration for a very cheeky playful layout */}
        <div className="absolute top-24 left-10 w-6 h-6 rounded-full bg-[#b51136]/10 animate-bounce pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-8 h-8 rounded-full bg-[#fbbc2f]/20 animate-pulse pointer-events-none" />

        {/* Hero Left Content Column (Inspired by Image 1 "Virtual Yoga" styling & high-contrast panels) */}
        <div className="lg:col-span-6 space-y-6 md:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div className="inline-flex items-center space-x-3 bg-[#fcaf9b]/35 border-2 border-[#4b2920] rounded-full px-4 py-1.5 shadow-sm">
            <span className="text-xl">🍓</span>
            <span className="font-display text-xs font-black text-[#4b2920] tracking-wider uppercase">
              100% Natural Shimmering Spreads
            </span>
          </div>

          <div className="space-y-3">
            {/* Imposing typographic pairing */}
            <h1 className="font-serif text-5xl md:text-7xl font-extrabold text-[#4b2920] tracking-tighter leading-[0.9]">
              Spread the <br className="hidden md:inline" />
              <span className="text-[#b51136] relative inline-block hover-gloop">
                Gloop.
              </span>
            </h1>
            
            <p className="font-serif text-3xl font-light text-[#4b2920]/90 italic leading-snug pt-2">
              For mindfully delicious plates.
            </p>
          </div>

          {/* Bold callout panel inspired by "The Queen" text statement in Image 1 */}
          <div className="bg-[#fbbc2f] border-3 border-[#4b2920] rounded-2xl p-5 retro-shadow max-w-lg relative">
            <span className="absolute -top-3.5 right-6 bg-[#b51136] text-white text-[9px] font-display font-black uppercase tracking-widest px-2.5 py-1 rounded-md border-2 border-[#4b2920]">
              The Lustre Standard
            </span>
            <p className="font-sans text-base md:text-lg font-bold text-[#4b2920] leading-relaxed text-left">
              Why settle for dull, chemical gelatin starch? Gloop is cooked gently at vacuum low-temperatures to preserve active fruit cells, producing a thick, shimmering, high-definition mirror veneer that shines on sourdough.
            </p>
          </div>

          {/* Quick-action buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
            <button
              onClick={() => handleScrollToSection('flavors')}
              className="px-8 py-4 bg-[#b51136] hover:bg-[#a00e2e] text-[#f4f5f0] text-sm font-display font-black uppercase tracking-widest rounded-xl border-3 border-[#4b2920] retro-shadow transition-transform hover:translate-y-[1px] active:translate-y-0 cursor-pointer"
            >
              Shop Spreads
            </button>
          </div>

        </div>

        {/* Hero Right Visual Column - Master Crate & Grid layout (Inspired by Image 2 "Meadowell" layout & Prickly Pear photography) */}
        <div className="lg:col-span-6 relative flex justify-center">
          
          {/* Framed container */}
          <div className="relative p-3 bg-[#fcaf9b] border-4 border-[#4b2920] rounded-3xl retro-shadow-lg w-full max-w-lg">
            
            <div className="absolute top-2 left-4 text-[10px] font-bold text-[#4b2920] uppercase tracking-wide">
              Official Portrait • Batch #99
            </div>

            {/* Main Picture */}
            <div className="overflow-hidden rounded-2xl border-3 border-[#4b2920] aspect-[4/3] relative">
              <img
                src={HERO_IMAGE}
                alt="Gloop Jars Lineup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 right-3 bg-[#fbbc2f] border-2 border-[#4b2920] px-3 py-1.5 rounded-lg">
                <span className="font-serif text-xs font-black text-[#4b2920] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#4b2920]" />
                  <span>Couture Finish</span>
                </span>
              </div>
            </div>

            {/* Captions below */}
            <div className="mt-4 pt-4 border-t-2 border-dashed border-[#4b2920]/30 grid grid-cols-3 text-center gap-2">
              <div className="border-r border-[#4b2920]/20 py-1">
                <span className="font-display text-3xl font-black text-[#4b2920]">0%</span>
                <p className="text-[9px] font-display uppercase font-bold text-gray-700 mt-1 tracking-wider">HFCS Thickeners</p>
              </div>
              <div className="border-r border-[#4b2920]/20 py-1">
                <span className="font-display text-3xl font-black text-[#4b2920]">45x</span>
                <p className="text-[9px] font-display uppercase font-bold text-gray-700 mt-1 tracking-wider">More Lustre</p>
              </div>
              <div className="py-1">
                <span className="font-display text-3xl font-black text-[#4b2920]">100%</span>
                <p className="text-[9px] font-display uppercase font-bold text-gray-700 mt-1 tracking-wider">Orchard Born</p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* HISTORIC TRUST BANNER - BOLD STATS (Inspired by Pretzel specs Image 4) */}
      <section className="bg-[#4b2920] text-[#f4f5f0] border-y-3 border-[#4b2920] py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          
          <div className="space-y-1">
            <div className="font-display text-4xl md:text-5xl font-black text-[#fcaf9b] tracking-tight">14,000+</div>
            <p className="font-display text-xs md:text-sm font-bold text-[#f4f5f0]/85 uppercase tracking-widest">Slices Slathered</p>
          </div>

          <div className="space-y-1">
            <div className="font-display text-4xl md:text-5xl font-black text-[#fbbc2f] tracking-tight">99.4%</div>
            <p className="font-display text-xs md:text-sm font-bold text-[#f4f5f0]/85 uppercase tracking-widest">Mirror Sheen Rating</p>
          </div>

          <div className="space-y-1">
            <div className="font-display text-4xl md:text-5xl font-black text-[#fcaf9b] tracking-tight">100%</div>
            <p className="font-display text-xs md:text-sm font-bold text-[#f4f5f0]/85 uppercase tracking-widest">Organic Handpicked</p>
          </div>

          <div className="space-y-1">
            <div className="font-display text-4xl md:text-5xl font-black text-[#fbbc2f] tracking-tight">0.0%</div>
            <p className="font-display text-xs md:text-sm font-bold text-[#f4f5f0]/85 uppercase tracking-widest">Starch Additives</p>
          </div>

        </div>
      </section>

      {/* FLAVOR SPOTLIGHT BENTO PANEL SECTION */}
      <section id="flavors" className="py-16 md:py-24 px-4 max-w-7xl mx-auto w-full space-y-12">
        
        {/* Section Heading Panel */}
        <div className="text-center max-w-xl mx-auto">
          <span className="font-display text-xs font-black uppercase tracking-widest text-[#b51136] bg-[#fcaf9b]/35 border border-[#4b2920] rounded-full px-3 py-1 inline-block mb-3">
            Spotlight Curator
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#4b2920]">
            The Couture Formulations
          </h2>
          <p className="font-sans text-sm text-[#4b2920]/80 mt-2">
            Click a flavor label to examine its design profile, sugar specs, ingredients log, and culinary partner pairings list.
          </p>
        </div>

        {/* Bento Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT SELECTOR RAIL - 4 Formula Options with gorgeous color highlights */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3">
            {FLAVORS.map(flavor => {
              const isSelected = flavor.id === activeSpotlightId;
              return (
                <button
                  key={flavor.id}
                  onClick={() => setActiveSpotlightId(flavor.id)}
                  className={`p-5 rounded-2xl border-3 text-left transition-all cursor-pointer relative group flex items-center justify-between overflow-hidden ${
                    isSelected 
                      ? 'bg-white border-[#b51136] retro-shadow-sm scale-[1.01]' 
                      : 'bg-white/60 border-[#4b2920] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div 
                      className="w-10 h-10 rounded-lg border-2 border-[#4b2920] flex items-center justify-center text-xs font-bold text-white relative shadow-sm"
                      style={{ backgroundColor: flavor.color }}
                    >
                      <span className={flavor.textColor === '#f4f5f0' ? 'text-white' : 'text-[#4b2920]'}>
                        g.
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#4b2920]">
                        {flavor.name}
                      </h4>
                      <p className="text-[10px] font-display font-bold uppercase tracking-widest text-gray-500 mt-0.5">
                        {flavor.title}
                      </p>
                    </div>
                  </div>

                  <span 
                    className={`w-6 h-6 rounded-full border-2 border-[#4b2920] flex items-center justify-center text-xs text-[#4b2920] font-black ${
                      isSelected ? 'bg-[#fbbc2f]' : 'bg-transparent'
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT VIEWING PANEL - Detailed Formula Card with live animations */}
          <div className="lg:col-span-8 bg-white border-4 border-[#4b2920] rounded-3xl p-6 md:p-8 flex flex-col justify-between retro-shadow relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#4b2920]/5 rounded-bl-full pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Product Close up Visual Details (Left) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative group p-2 bg-[#f4f5f0] rounded-2xl border-3 border-[#4b2920] max-w-[240px] transform rotate-1">
                  <img
                    src={selectedSpotlightFlavor.image}
                    alt={selectedSpotlightFlavor.name}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-square object-cover rounded-xl border border-[#4b2920]/20"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm p-1 rounded-lg border border-[#4b2920] text-center">
                    <span className="font-serif text-[11px] font-black uppercase text-[#4b2920] tracking-wider">
                      {selectedSpotlightFlavor.name}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-1.5 h-6">
                  <Award className="w-4 h-4 text-[#b51136]" />
                  <span className="text-[10px] font-serif font-black uppercase text-[#4b2920] tracking-widest mt-0.5">
                    Premium Artisan Batch
                  </span>
                </div>
              </div>

              {/* Detailed Spec sheets (Right) */}
              <div className="md:col-span-7 space-y-4">
                
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-[#4b2920]">
                    {selectedSpotlightFlavor.name}
                  </h3>
                  <span className="text-xs font-display font-medium uppercase tracking-wider text-[#b51136]">
                    {selectedSpotlightFlavor.tagline}
                  </span>
                  <p className="font-sans text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
                    {selectedSpotlightFlavor.description}
                  </p>
                </div>

                {/* Meter Stats */}
                <div className="space-y-1.5 p-3 rounded-xl bg-[#f4f5f0]/70 border border-[#4b2920]/15">
                  
                  {/* Sweetness */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-display font-extrabold text-[#4b2920] uppercase tracking-wider">
                      <span>Sweetness level</span>
                      <span>{selectedSpotlightFlavor.sweetness} / 5</span>
                    </div>
                    <div className="flex gap-1">
                      {Array(5).fill(0).map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1.5 flex-1 rounded-sm ${
                            idx < selectedSpotlightFlavor.sweetness 
                              ? 'bg-[#b51136] border border-[#4b2920]' 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tartness */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-display font-extrabold text-[#4b2920] uppercase tracking-wider">
                      <span>Acidic Tartness</span>
                      <span>{selectedSpotlightFlavor.tartness} / 5</span>
                    </div>
                    <div className="flex gap-1 font-bold">
                      {Array(5).fill(0).map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1.5 flex-1 rounded-sm ${
                            idx < selectedSpotlightFlavor.tartness 
                              ? 'bg-[#fbbc2f] border border-[#4b2920]' 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Lustre */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-display font-extrabold text-[#4b2920] uppercase tracking-wider">
                      <span>Reflective Sheen & Lustre</span>
                      <span>{selectedSpotlightFlavor.lustre} / 5</span>
                    </div>
                    <div className="flex gap-1">
                      {Array(5).fill(0).map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1.5 flex-1 rounded-sm ${
                            idx < selectedSpotlightFlavor.lustre 
                              ? 'bg-[#fcaf9b] border border-[#4b2920]' 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                </div>

                {/* Vibe and Pairings Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-display font-black uppercase text-[#b51136] tracking-widest block mb-1">
                      Taste Profile:
                    </span>
                    <span className="font-sans text-[#4b2920] font-medium leading-relaxed block text-[11px]">
                      {selectedSpotlightFlavor.vibe}
                    </span>
                  </div>
                  <div>
                    <span className="font-display font-black uppercase text-[#4b2920] tracking-widest block mb-1">
                      Suggested Pairings:
                    </span>
                    <ul className="list-disc list-inside text-gray-500 space-y-0.5 text-[11px] font-mono select-all">
                      {selectedSpotlightFlavor.pairings.map((p, idx) => (
                        <li key={idx} className="truncate">{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

            </div>

            {/* Direct Add bottom area */}
            <div className="mt-6 pt-4 border-t border-[#4b2920]/15 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-gray-500 max-w-sm">
                Ingredients: <span className="text-gray-700 italic select-all font-mono text-[10px] block mt-0.5 leading-normal">{selectedSpotlightFlavor.ingredients}</span>
              </span>

              <button
                onClick={() => handleAddSingleToCart(selectedSpotlightFlavor.id)}
                className="bg-[#b51136] hover:bg-[#a00e2e] text-[#f4f5f0] font-display text-xs font-black uppercase tracking-widest px-6 py-3 retro-border retro-shadow-sm rounded-xl cursor-pointer hover:translate-y-[1px] transition-all flex items-center space-x-1.5 flex-shrink-0"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Adopt a Jar • ${selectedSpotlightFlavor.price}</span>
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* HOW GLOOP IS MADE / CRAFT MANIFESTO (Inspired by Bake Today Steps & Meadowell Diagram) */}
      <section id="manifesto" className="bg-[#fcaf9b] border-y-3 border-[#4b2920] py-16 md:py-24 px-4 relative overflow-hidden z-20">
        
        {/* Subtle dot pattern inside background panels */}
        <div className="absolute inset-0 dashed-rail opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10 space-y-16">
          
          {/* Section layout head */}
          <div className="text-center max-w-xl mx-auto">
            <span className="bg-[#4b2920] text-white text-[9px] font-display font-black tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-3">
              The Cook Registry
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#4b2920]">
              The Low-Pressure Slow Simmer Method
            </h2>
            <p className="font-sans text-base text-[#4b2920]/80 mt-2">
              Most generic jams are boiled aggressively. Our dedicated cook preserves active flavor oils and gorgeous glistening sheets.
            </p>
          </div>

          {/* Three Steps Grid (Bake Today retro guide replica) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Step 1 */}
            <div className="p-6 bg-[#f4f5f0] border-3 border-[#4b2920] rounded-2xl relative flex flex-col justify-between retro-shadow group hover:-translate-y-1 transition-transform">
              <span className="absolute -top-3.5 left-6 bg-[#b51136] text-white text-[10px] font-display font-black tracking-widest uppercase px-3 py-1 rounded-md border-2 border-[#4b2920]">
                Step 01
              </span>
              
              <div className="pt-3">
                <h4 className="font-serif text-xl font-bold text-[#4b2920] mb-2">
                  Heirloom Sourcing
                </h4>
                <p className="font-sans text-sm text-gray-600 leading-relaxed mb-2">
                  We don't buy bulk surplus bruised fruits. We contract directly with certified organic family-owned orchards in northern valleys, getting ruby strawberries, velvety peaches, and yellow zest lemons in pristine state.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[#f4f5f0] border-3 border-[#4b2920] rounded-2xl relative flex flex-col justify-between retro-shadow group hover:-translate-y-1 transition-transform">
              <span className="absolute -top-3.5 left-6 bg-[#fbbc2f] text-[#4b2920] text-[10px] font-display font-black tracking-widest uppercase px-3 py-1 rounded-md border-2 border-[#4b2920]">
                Step 02
              </span>
              
              <div className="pt-3">
                <h4 className="font-serif text-xl font-bold text-[#4b2920] mb-2">
                  Vacuum Vacuuming
                </h4>
                <p className="font-sans text-sm text-gray-600 leading-relaxed mb-2">
                  We seal fruit and raw unrefined cane sugar in high-end vacuum copper vessels. Simmering occurs at just 55°C, ensuring that essential flavors do not compile and get boiled off. Mirror shine sheen secured.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[#f4f5f0] border-3 border-[#4b2920] rounded-2xl relative flex flex-col justify-between retro-shadow group hover:-translate-y-1 transition-transform">
              <span className="absolute -top-3.5 left-6 bg-[#b51136] text-white text-[10px] font-display font-black tracking-widest uppercase px-3 py-1 rounded-md border-2 border-[#4b2920]">
                Step 03
              </span>
              
              <div className="pt-3">
                <h4 className="font-serif text-xl font-bold text-[#4b2920] mb-2">
                  Typographic Packaging
                </h4>
                <p className="font-sans text-sm text-gray-600 leading-relaxed mb-2">
                  Fresh glistening glazes are packed while warm into aesthetic designer glass jars customized in Italy. We wrap each one with high contrast typographic labels and safety seals before dispatching to your brunch table.
                </p>
              </div>
            </div>

          </div>

          {/* Scrolling text statement below steps */}
          <div className="border-3 border-[#4b2920] bg-white p-6 rounded-2xl text-center w-full retro-shadow-sm/65">
            <p className="font-serif text-base md:text-lg font-bold italic text-[#4b2920] leading-relaxed">
              "Some brands take their fruit and boil it away into deep red paste. We believe sweet fruit deserves respect. Design, method, and sugar balance take time, but culinary joy doesn't get shortcuts."
            </p>
            <span className="text-[10px] uppercase font-bold text-gray-400 mt-2 block">— Head Chef Master, Gloop Kitchens</span>
          </div>

        </div>

      </section>

      {/* TASTEMAKERS CUSTOMER TESTIMONIAL CAROUSEL (Ozzie Pretzel style) */}
      <section id="reviews" className="py-16 md:py-24 px-4 bg-white border-y-3 border-[#4b2920] relative overflow-hidden">
        
        {/* Abstract design vector frames */}
        <div className="absolute top-2 right-4 text-9xl font-serif font-black text-[#fcaf9b]/15 pointer-events-none">
          GLOP
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          <div className="text-center">
            <span className="bg-[#fbbc2f] border-2 border-[#4b2920] rounded-full text-[10px] font-black text-[#4b2920] px-3 py-1 inline-block mb-3 uppercase tracking-wider">
              Reviews
            </span>
            <h3 className="font-serif text-4xl font-extrabold text-[#4b2920]">
              What the Tastemakers say
            </h3>
          </div>

          <div className="bg-[#f4f5f0] border-3 border-[#4b2920] rounded-3xl p-6 md:p-10 relative retro-shadow">
            
            <span className="text-6xl text-[#fcaf9b] font-serif absolute -top-3 left-4 select-none leading-none">“</span>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Review Text */}
                <p className="font-serif text-lg md:text-xl font-bold italic text-[#4b2920] leading-relaxed relative z-10 pl-6 select-all">
                  {REVIEWS[activeReviewIdx].quote}
                </p>

                {/* Stars and Author metadata */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#4b2920]/15 pl-6">
                  
                  <div className="flex items-center space-x-3">
                    <img
                      src={REVIEWS[activeReviewIdx].avatar}
                      alt={REVIEWS[activeReviewIdx].name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-[#4b2920] object-cover"
                    />
                    <div>
                      <h5 className="font-sans text-sm font-black text-[#4b2920]">
                        {REVIEWS[activeReviewIdx].name}
                      </h5>
                      <span className="text-[10px] text-gray-500 font-bold block">
                        {REVIEWS[activeReviewIdx].location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end">
                    {/* Stars render */}
                    <div className="flex text-[#fbbc2f] mb-1">
                      {Array(REVIEWS[activeReviewIdx].rating).fill(0).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current stroke-[2px]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#b51136] uppercase bg-white px-2 py-0.5 rounded border border-[#4b2920]">
                      Favorite glaze: {REVIEWS[activeReviewIdx].flavor}
                    </span>
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>

            {/* Slider Switch buttons */}
            <div className="absolute -bottom-6 right-8 flex space-x-2">
              <button
                onClick={prevReview}
                className="p-3 bg-white hover:bg-gray-100 border-2 border-[#4b2920] rounded-full text-[#4b2920] retro-shadow-sm transition-all focus:outline-none"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-4 h-4 stroke-[3px]" />
              </button>
              <button
                onClick={nextReview}
                className="p-3 bg-[#b51136] hover:bg-[#a00e2e] text-white border-2 border-[#4b2920] rounded-full retro-shadow-sm transition-all focus:outline-none"
                aria-label="Next Review"
              >
                <ChevronRight className="w-4 h-4 stroke-[3px]" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* CLUP SUBSCRIPTION REGISTRY TIERS (Pilates pricing form replica Image 6) */}
      <section className="bg-[#fcaf9b] border-b-3 border-[#4b2920] py-16 md:py-24 px-4 relative">
        <div className="max-w-5xl mx-auto w-full space-y-12">
          
          <div className="text-center max-w-xl mx-auto">
            <span className="bg-[#b51136] text-[#f4f5f0] text-[9px] font-display font-black tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-3 border-2 border-[#4b2920]">
              The Gloop Club
            </span>
            <h3 className="font-serif text-4xl font-extrabold text-[#4b2920]">
              Join the Gloop Club Subscription
            </h3>
            <p className="font-sans text-base text-[#4b2920]/80 mt-1">
              Never let your bread dry out. Choose your delivery density and get limited-edition jar glazes delivered right to your door monthly.
            </p>
          </div>

          {/* Three Tier Subscription Box Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Tier 1 */}
            <div className={`p-6 rounded-2xl border-3 bg-white relative flex flex-col justify-between transition-all ${
              selectedSubTier === 'single' ? 'border-[#b51136] retro-shadow-lg scale-[1.01]' : 'border-[#4b2920] retro-shadow shadow-sm'
            }`}>
              {/* Highlight badge */}
              {selectedSubTier === 'single' && (
                <div className="absolute -top-3 right-6 py-0.5 px-2 bg-[#b51136] text-[8px] font-display font-extrabold text-white uppercase rounded border border-black">
                  Active Choice
                </div>
              )}
              
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-500 font-display tracking-widest">Tier One • Starter</span>
                <h4 className="font-serif text-xl font-bold text-[#4b2920] mt-1">Single Spooner</h4>
                <div className="my-4 flex items-baseline">
                  <span className="font-display text-4xl font-black text-[#4b2920]">$8</span>
                  <span className="text-xs text-gray-500 font-medium ml-1">/ Month</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pb-4 border-b border-[#4b2920]/10 font-sans">
                  Perfect for single toast lovers. Get one custom seasonal glaze formula delivered fresh.
                </p>
                <ul className="py-4 space-y-2 text-sm text-[#4b2920]/85 font-semibold font-sans">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" /> 
                    <span>1 jar Gloop formula monthly</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" /> 
                    <span>Collectable designer lid</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" /> 
                    <span>Cancel or switch easily</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedSubTier('single');
                    handleAddSubscriptionToCart('single');
                  }}
                  className="w-full py-2.5 bg-[#4b2920] hover:bg-black text-white text-xs font-display font-black uppercase tracking-widest rounded-xl border-2 border-[#4b2920] cursor-pointer"
                >
                  Adopt Single Spoon
                </button>
              </div>
            </div>

            {/* Tier 2 */}
            <div className={`p-6 rounded-2xl border-3 bg-[#fbbc2f] relative flex flex-col justify-between transition-all ${
              selectedSubTier === 'brunch' ? 'border-[#b51136] retro-shadow-lg scale-[1.01]' : 'border-[#4b2920] retro-shadow shadow-sm'
            }`}>
              <div className="absolute -top-3.5 right-6 py-0.5 px-3 bg-[#b51136] text-[8px] font-display font-extrabold text-white uppercase rounded-full border-2 border-[#4b2920]">
                Best Value Choice
              </div>
              
              <div>
                <span className="text-[9px] uppercase font-bold text-[#4b2920] font-display tracking-widest">Tier Two • Popular</span>
                <h4 className="font-serif text-xl font-bold text-[#4b2920] mt-1">Brunch Host Club</h4>
                <div className="my-4 flex items-baseline">
                  <span className="font-display text-4xl font-black text-[#4b2920]">$20</span>
                  <span className="text-xs text-[#4b2920] font-medium ml-1">/ Month</span>
                </div>
                <p className="text-sm text-[#4b2920]/90 leading-relaxed pb-4 border-b border-[#4b2920]/20 font-sans">
                  Cater your sunday morning spreads perfectly. Get 3 bespoke seasonal formula jars of your choice.
                </p>
                <ul className="py-4 space-y-2 text-sm text-[#4b2920] font-bold font-sans">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#b51136] stroke-[3px]" /> 
                    <span>3 signature jars monthly</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#b51136] stroke-[3px]" /> 
                    <span>Complimentary Shipping</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#b51136] stroke-[3px]" /> 
                    <span>10% Crate Pack Savings</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedSubTier('brunch');
                    handleAddSubscriptionToCart('brunch');
                  }}
                  className="w-full py-2.5 bg-[#4b2920] hover:bg-black text-white text-xs font-display font-black uppercase tracking-widest rounded-xl border-2 border-[#4b2920] cursor-pointer"
                >
                  Adopt Brunch Host
                </button>
              </div>
            </div>

            {/* Tier 3 */}
            <div className={`p-6 rounded-2xl border-3 bg-white relative flex flex-col justify-between transition-all ${
              selectedSubTier === 'slatherer' ? 'border-[#b51136] retro-shadow-lg scale-[1.01]' : 'border-[#4b2920] retro-shadow shadow-sm'
            }`}>
              
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-500 font-display tracking-widest">Tier Three • Complete</span>
                <h4 className="font-serif text-xl font-bold text-[#4b2920] mt-1">Daily Slatherer</h4>
                <div className="my-4 flex items-baseline">
                  <span className="font-display text-4xl font-black text-[#4b2920]">$39</span>
                  <span className="text-xs text-gray-500 font-medium ml-1">/ Month</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pb-4 border-b border-[#4b2920]/10 font-sans">
                  For professional bakers and large greedy households. Get 6 massive custom formulation jars.
                </p>
                <ul className="py-4 space-y-2 text-sm text-[#4b2920]/85 font-semibold font-sans">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" /> 
                    <span>6 complete jars monthly</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" /> 
                    <span>Exclusive VIP flavor previews</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" /> 
                    <span>15% ultimate stack savings</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedSubTier('slatherer');
                    handleAddSubscriptionToCart('slatherer');
                  }}
                  className="w-full py-2.5 bg-[#4b2920] hover:bg-black text-white text-xs font-display font-black uppercase tracking-widest rounded-xl border-2 border-[#4b2920] cursor-pointer"
                >
                  Adopt Daily Slather
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* DETAILED FAQ SECTION */}
      <section className="py-16 md:py-24 px-4 bg-[#f4f5f0] border-b-3 border-[#4b2920]">
        <div className="max-w-3xl mx-auto w-full">
          <FaqAccordion />
        </div>
      </section>

      {/* FOOTER & LARGE WORDMARK BANNER (Bake Today typography style replica Image 5) */}
      <footer className="bg-[#b51136] text-[#f4f5f0] border-t-3 border-[#4b2920] pt-16 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b-2 border-white/20">
          
          {/* Footer Logo Column */}
          <div className="md:col-span-4 space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-[#fbbc2f] border-2 border-[#4b2920] text-[#4b2920] flex items-center justify-center text-xl font-bold font-serif shadow-sm">
                g
              </div>
              <span className="font-serif text-3xl font-extrabold tracking-tight">gloop.</span>
            </div>
            <p className="font-serif text-lg italic text-[#fcaf9b] leading-snug max-w-sm">
              Couture jam curating designed around the dynamic pleasure of breakfast spreads.
            </p>
            <div className="flex space-x-3 text-[#f4f5f0] pt-2 justify-center md:justify-start">
              <a href="#instagram" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="mailto:hello@gloopjam.com" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Email support">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3 font-sans text-xs flex flex-col items-center md:items-start text-center md:text-left">
            <h5 className="font-serif text-sm font-black uppercase tracking-wider text-[#fcaf9b]">Navigate</h5>
            <ul className="space-y-2 text-white/80 font-semibold uppercase tracking-wider">
              <li>
                <button onClick={() => handleScrollToSection('flavors')} className="hover:text-[#fbbc2f] transition-colors cursor-pointer">
                  Flavor Spotlight
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection('manifesto')} className="hover:text-[#fbbc2f] transition-colors cursor-pointer">
                  Cooking manifesto
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter syndicate sign-up */}
          <div id="newsletter" className="md:col-span-5 space-y-4 flex flex-col items-center md:items-start text-center md:text-left w-full">
            <h5 className="font-serif text-sm font-black uppercase tracking-wider text-[#fbbc2f]">
              Join Gloop's VIP newsletter
            </h5>
            <p className="font-sans text-sm text-white/85 leading-relaxed max-w-sm">
              We send out single emails containing unique coupon codes, exclusive limited batch flavors, and recipes. No spam.
            </p>
            
            <form onSubmit={handleJoinNewsletter} className="flex gap-2 w-full max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="hello@gloopjam.com"
                className="flex-1 bg-white border-2 border-[#4b2920] text-[#4b2920] font-sans text-xs px-3 py-3 rounded-xl outline-none placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-[#fbbc2f] hover:bg-[#e4a822] text-[#4b2920] font-sans text-xs font-black uppercase px-5 py-3 rounded-xl border-2 border-[#4b2920] cursor-pointer"
              >
                Join
              </button>
            </form>

            <AnimatePresence>
              {newsletterSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-[#fbbc2f] font-bold"
                >
                  ✓ Registered in Gloop's Elite VIP list! Check your inbox for GLOOP99 code.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* GIANT FOOTER BANNER WORDMARK (Image 5 replica) */}
        <div className="w-full text-center py-6 select-none opacity-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />
          <h1 className="font-serif text-[12vw] font-black uppercase text-white tracking-tighter leading-none w-full block text-center whitespace-nowrap">
            GLOOP JAM
          </h1>
          <p className="text-[10px] md:text-xs font-sans tracking-widest text-[#fcaf9b] font-extrabold uppercase mt-1">
            © 2026 Gloop Food Labs Inc.
          </p>
        </div>

      </footer>

    </div>
  );
}
