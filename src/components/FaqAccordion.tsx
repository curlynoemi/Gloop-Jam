/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Plus, Minus } from 'lucide-react';
import { FAQS } from '../data';

export default function FaqAccordion() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="w-full bg-[#f4f5f0] border-3 border-[#4b2920] rounded-3xl p-6 md:p-8 relative">
      <div className="flex items-center space-x-2 text-[#b51136] mb-6">
        <HelpCircle className="w-5 h-5 flex-shrink-0" />
        <span className="font-display text-xs font-black uppercase tracking-widest">
          The Gloop Glossary
        </span>
      </div>

      <div className="divide-y-2 divide-[#4b2920]/15">
        {FAQS.map((faq, index) => {
          const isOpen = activeId === faq.id;
          return (
            <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
              {/* Question Trigger */}
              <button
                onClick={() => handleToggle(faq.id)}
                className="w-full flex justify-between items-center text-left py-2 font-serif text-[#4b2920] hover:text-[#b51136] transition-colors focus:outline-none cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-base md:text-lg pr-4 font-serif">
                  {faq.question}
                </span>

                <span className="w-8 h-8 rounded-full border-2 border-[#4b2920] bg-white text-[#4b2920] flex items-center justify-center flex-shrink-0 transition-all group-hover:bg-[#fcaf9b]/20">
                  {isOpen ? (
                    <Minus className="w-4 h-4 stroke-[3px]" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[3px]" />
                  )}
                </span>
              </button>

              {/* Answer Content Dropdown */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-3 pr-8 text-xs md:text-sm text-[#4b2920]/85 font-sans leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
