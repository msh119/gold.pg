import React, { useState } from 'react';
import { GoldPrices, ActiveTab, Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, X, Calculator, CircleHelp, Sparkles } from 'lucide-react';

interface FloatingCaratCardProps {
  prices: GoldPrices;
  language: Language;
  setActiveTab: (tab: ActiveTab) => void;
}

export const FloatingCaratCard: React.FC<FloatingCaratCardProps> = ({ prices, language, setActiveTab }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const isAr = language === 'ar';

  const formattedPrice = prices.g21.toLocaleString(isAr ? 'ar-EG' : 'en-US');

  return (
    <div className="fixed bottom-36 right-4 sm:right-6 md:right-10 z-40 select-none">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          // Mini Gold Coin State Trigger
          <motion.button
            key="minimized-coin"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.15, y: -3 }}
            onClick={() => setIsMinimized(false)}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-yellow-600 to-amber-700 p-0.5 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer focus:outline-none"
            title={isAr ? 'عرض سعر عيار 21 مباشر' : 'Show 21K live rate'}
          >
            {/* Pulsing ring */}
            <span className="absolute -inset-1 rounded-full bg-amber-500/30 animate-pulse" />
            
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#0d0d0d] text-center">
              <span className="text-[9px] font-black tracking-widest text-amber-500 line-clamp-1">21K</span>
              <span className="text-[10px] font-extrabold text-white leading-none mt-0.5">{prices.g21}</span>
            </div>
          </motion.button>
        ) : (
          // Full Premium Floating Card State
          <motion.div
            key="expanded-card"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: [0, -6, 0], // Floating vertical bounce wave motion
              scale: 1,
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            whileHover={{ scale: 1.03 }}
            className="w-52 bg-gradient-to-br from-[#16140f]/95 via-[#0e0c08]/95 to-[#060606]/95 border-2 border-amber-500/50 p-4 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.15)] backdrop-blur-xl group relative overflow-hidden"
          >
            {/* Golden flare gradient overlays */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="absolute top-2.5 left-2.5 text-neutral-500 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 p-1 rounded-full border border-neutral-800 transition-colors cursor-pointer z-20"
              title={isAr ? 'إخفاء' : 'Minimize'}
            >
              <X className="h-3 w-3" />
            </button>

            {/* Sparkles Live Status indicator */}
            <div className="flex justify-end items-center gap-1.5 mb-2 relative z-10">
              <span className="flex h-1.5 w-1.5 items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[8px] font-black font-mono text-emerald-400 uppercase tracking-widest leading-none bg-emerald-950/45 px-1.5 py-0.5 rounded border border-emerald-500/15">
                {isAr ? 'مباشر الآن' : 'LIVE NOW'}
              </span>
            </div>

            {/* Tap to open Calculator container click action */}
            <div 
              onClick={() => setActiveTab('calculator')}
              className="cursor-pointer space-y-1 text-center select-none"
            >
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-amber-500/90 uppercase tracking-widest font-mono">
                <Sparkles className="h-3 w-3 text-yellow-500 animate-spin" style={{ animationDuration: '8s' }} />
                {isAr ? 'عيار 21 دقيق' : 'CALIBRATED 21K'}
              </span>

              <div className="py-1">
                <span className="text-3xl sm:text-4.5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)] block">
                  {formattedPrice}
                </span>
                <span className="text-[10px] sm:text-xs font-black tracking-wide text-neutral-400 block mt-0.5 uppercase">
                  {isAr ? 'جنيه مصري / جرام' : 'EGP / GRAM'}
                </span>
              </div>

              {/* Action Hint */}
              <div className="pt-2 mt-2 border-t border-amber-500/10 flex items-center justify-center gap-1.5 text-[9px] font-bold text-neutral-400 group-hover:text-amber-400 transition-colors uppercase font-mono">
                <Calculator className="h-3 w-3 text-amber-500 animate-pulse" />
                <span>{isAr ? 'اضغط لفتح الحاسبة' : 'TAP FOR CALCULATOR'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
