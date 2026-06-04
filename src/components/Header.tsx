/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Minus, Plus, Trash2, Sparkles, CheckCircle, Gift } from 'lucide-react';
import { CartItem } from '../types';
import { FLAVORS } from '../data';

interface HeaderProps {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  onScrollToSection: (id: string) => void;
}

export default function Header({
  cart,
  cartOpen,
  setCartOpen,
  updateQuantity,
  removeFromCart,
  clearCart,
  onScrollToSection
}: HeaderProps) {
  const [promoCode, setPromoCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<{ code: string; percent: number; dollar: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const itemsSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Apply discounts
  let discountAmount = 0;
  if (activeDiscount) {
    if (activeDiscount.percent > 0) {
      discountAmount = itemsSubtotal * (activeDiscount.percent / 100);
    } else if (activeDiscount.dollar > 0) {
      discountAmount = Math.min(itemsSubtotal, activeDiscount.dollar);
    }
  }

  const shippingCost = itemsSubtotal > 40 || activeDiscount?.code === 'LOVERGLOOP' ? 0 : 5.99;
  const finalTotal = Math.max(0, itemsSubtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'GLOOP99') {
      setActiveDiscount({ code: 'GLOOP99', percent: 15, dollar: 0 });
      setPromoCode('');
    } else if (code === 'FREEJAR') {
      if (cart.length === 0) {
        setPromoError('Add items first to claim your promo!');
      } else {
        setActiveDiscount({ code: 'FREEJAR', percent: 0, dollar: 14 });
        setPromoCode('');
      }
    } else if (code === 'LOVERGLOOP') {
      setActiveDiscount({ code: 'LOVERGLOOP', percent: 0, dollar: 0 });
      setPromoCode('');
    } else {
      setPromoError('Vibe-check failed: Invalid coupon code.');
    }
  };

  const handleCheckout = () => {
    setIsCheckedOut(true);
    setTimeout(() => {
      clearCart();
    }, 4500);
  };

  const handleResetCheckout = () => {
    setIsCheckedOut(false);
    setCartOpen(false);
  };

  return (
    <>
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 w-full bg-[#f4f5f0]/95 backdrop-blur-md border-b-3 border-[#4b2920] px-4 md:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div 
            onClick={() => onScrollToSection('hero')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#b51136] retro-border flex items-center justify-center text-[#f4f5f0] text-xl font-bold hover-gloop">
              g
            </div>
            <span className="font-serif text-3xl font-bold text-[#4b2920] tracking-tight hover-gloop">
              gloop.
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-display font-black text-xs uppercase tracking-widest text-[#4b2920]">
            <button 
              onClick={() => onScrollToSection('flavors')} 
              className="hover:text-[#b51136] transition-colors relative group py-1"
            >
              The Flavors
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b51136] transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => onScrollToSection('manifesto')} 
              className="hover:text-[#b51136] transition-colors relative group py-1"
            >
              How It's Made
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b51136] transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => onScrollToSection('reviews')} 
              className="hover:text-[#b51136] transition-colors relative group py-1"
            >
              Tastemakers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b51136] transition-all group-hover:w-full"></span>
            </button>
          </nav>

          {/* Secondary / Action Items */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => {
                setIsCheckedOut(false);
                setCartOpen(true);
              }}
              className="relative p-2.5 rounded-full bg-[#fcaf9b] hover:bg-[#e89d89] retro-border cursor-pointer transition-colors"
              aria-label="Toggle shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#4b2920]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#b51136] text-[#f4f5f0] text-[10px] md:text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#4b2920]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* SHOPPING CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/60"
            />

            {/* Cart Content Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#f4f5f0] border-l-4 border-[#4b2920] flex flex-col shadow-2xl overflow-hidden"
            >
              
              {/* Cart Drawer Header */}
              <div className="p-4 border-b-3 border-[#4b2920] bg-[#fcaf9b] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#4b2920]" />
                  <h2 className="font-serif text-2xl font-bold text-[#4b2920]">Your Pantry</h2>
                </div>
                <button
                  id="close-cart-btn"
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-full bg-[#f4f5f0] hover:bg-[#4b2920] hover:text-[#f4f5f0] transition-colors border-2 border-[#4b2920]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inside Cart Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isCheckedOut ? (
                  // Success State after checkout demo
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 bg-white/40 rounded-2xl border-2 border-[#4b2920]/40 m-2"
                  >
                    <div className="w-20 h-20 bg-[#fbbc2f] rounded-full retro-border flex items-center justify-center text-white relative">
                      <CheckCircle className="w-12 h-12 text-[#4b2920]" />
                      <motion.div
                        className="absolute -top-1 -right-1 text-2xl"
                        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ✨
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#4b2920] uppercase tracking-wide">
                        Order Dispatched!
                      </h3>
                      <p className="font-sans text-sm text-[#4b2920] mt-2 leading-relaxed">
                        Your kitchen is in for a glorious upgrade. Our master cook is sealing your premium jars with shimmering, hand-crafted love.
                      </p>
                    </div>
                    <div className="bg-[#fcaf9b] p-3 rounded-lg border border-[#4b2920] text-xs font-semibold text-[#4b2920] w-full mt-4">
                      Estimated Delivery Transit: 2-3 Days 🚚
                    </div>
                    <button
                      onClick={handleResetCheckout}
                      className="w-full py-2.5 bg-[#b51136] hover:bg-[#900e28] text-white font-display font-black uppercase tracking-widest rounded-xl border-2 border-[#4b2920] retro-shadow-sm transition-all"
                    >
                      Sweet, Back to Shop
                    </button>
                  </motion.div>
                ) : cart.length === 0 ? (
                  // Empty State
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4 text-[#4b2920]/70">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#4b2920]/50 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-[#4b2920]/40" />
                    </div>
                    <div>
                      <p className="font-serif text-lg font-semibold">Your shelf is bare!</p>
                      <p className="text-xs max-w-xs mt-1">Let's solve that immediately. Fill it up with classic crimson colors or spicy zest.</p>
                    </div>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        onScrollToSection('flavors');
                      }}
                      className="px-6 py-2 bg-[#b51136] text-[#f4f5f0] text-xs font-bold uppercase tracking-widest rounded-full border-2 border-[#4b2920] hover:bg-[#a00e2e] transition-colors shadow-sm"
                    >
                      Browse Our Glazes
                    </button>
                  </div>
                ) : (
                  // Items List
                  <div className="space-y-3">
                    {cart.map((item, index) => {
                      const flavorRef = FLAVORS.find(f => f.id === item.flavorId);
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          key={item.id}
                          className="p-3 bg-white rounded-xl retro-border flex items-center space-x-3 relative group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 object-cover rounded-lg border-2 border-[#4b2920]"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-sm font-bold text-[#4b2920] truncate">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-[#b51136] uppercase font-bold tracking-wider">
                              {item.isCustomBox ? 'Custom Assortment' : 'Single Designer Flavor'}
                            </span>
                            {item.boxContents && (
                              <p className="text-[10px] text-[#4b2920]/70 mt-0.5 truncate leading-none">
                                Inside: {item.boxContents.map(id => FLAVORS.find(f => f.id === id)?.name.replace(' Jam','') || id).join(', ')}
                              </p>
                            )}
                            <p className="text-xs font-bold text-[#4b2920] mt-1">
                              ${item.price} <span className="text-[10px] text-gray-400 font-normal">ea</span>
                            </p>
                          </div>

                          {/* Control Quantities */}
                          <div className="flex flex-col items-center space-y-1">
                            <div className="flex items-center space-x-1.5 bg-[#f4f5f0] p-1 rounded-md border border-[#4b2920]/40">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-0.5 hover:bg-[#4b2920]/10 rounded transition-colors text-[#4b2920]"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-[#4b2920] px-1">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-0.5 hover:bg-[#4b2920]/10 rounded transition-colors text-[#4b2920]"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete Item"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Cart Drawer Footer & Checkout Logic */}
              {!isCheckedOut && cart.length > 0 && (
                <div className="border-t-3 border-[#4b2920] bg-white p-4 space-y-3.5 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                  {/* Shipping Notice Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-[#4b2920]">
                      <span>
                        {itemsSubtotal >= 40 
                          ? "🏆 FREE SHIPPING SECURED!" 
                          : `Spend $${(40 - itemsSubtotal).toFixed(2)} more for Complimentary Shipping`}
                      </span>
                      <span>{itemsSubtotal >= 40 ? "100%" : `${Math.min(100, Math.round((itemsSubtotal / 40) * 100))}%`}</span>
                    </div>
                    <div className="w-full bg-[#f4f5f0] h-2 rounded-full overflow-hidden border border-[#4b2920]">
                      <div 
                        className="bg-[#b51136] h-full transition-all duration-300" 
                        style={{ width: `${Math.min(100, (itemsSubtotal / 40) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Voucher Form */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try GLOOP99 or FREEJAR"
                      className="flex-1 text-xs px-3 py-2 bg-[#f4f5f0] border-2 border-[#4b2920] rounded-xl outline-none uppercase font-display font-bold tracking-wider"
                    />
                    <button
                      type="submit"
                      className="bg-[#fbbc2f] hover:bg-[#e4a822] text-[#4b2920] px-4 py-2 border-2 border-[#4b2920] rounded-xl text-xs font-display font-black uppercase tracking-widest"
                    >
                      Apply
                    </button>
                  </form>
                  {promoError && <p className="text-[10px] text-red-600 font-bold ml-1">{promoError}</p>}
                  {activeDiscount && (
                    <div className="bg-[#fdbc2f]/10 px-3 py-1.5 rounded-lg border border-[#fbbc2f] flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#4b2920] flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-[#b51136]" /> Promo: <span className="text-[#b51136] font-bold">{activeDiscount.code}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveDiscount(null)}
                        className="text-gray-500 hover:text-black font-semibold text-xs font-display"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Summary Charges */}
                  <div className="space-y-1.5 text-sm border-t border-[#4b2920]/10 pt-2 font-sans font-medium text-[#4b2920]">
                    <div className="flex justify-between">
                      <span>Pantry Subtotal</span>
                      <span className="font-bold">${itemsSubtotal.toFixed(2)}</span>
                    </div>
                    {activeDiscount && (
                      <div className="flex justify-between text-emerald-600">
                        <span>
                          Discount {activeDiscount.percent > 0 ? `(${activeDiscount.percent}%)` : `(Coupon Code)`}
                        </span>
                        <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Pantry-Bound Shipping</span>
                      <span className="font-bold">
                        {shippingCost === 0 ? <span className="text-emerald-600">FREE</span> : `$${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base border-t-2 border-dashed border-[#4b2920]/20 pt-2 font-serif font-bold">
                      <span>Calculated Cost</span>
                      <span className="text-[#b51136]">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center p-3.5 bg-[#b51136] hover:bg-[#a00e2e] text-[#f4f5f0] text-sm font-display font-black uppercase tracking-widest rounded-xl border-2 border-[#4b2920] retro-shadow-sm hover:translate-y-[1px] hover:shadow-sm transition-all"
                  >
                    <span>Dispense My Gloop Order</span>
                    <Sparkles className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
