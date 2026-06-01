import React from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../utils/translations';
import { Home, Calculator, Cpu, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, language }) => {
  const t = translations[language];

  const menuItems = [
    {
      id: 'home' as ActiveTab,
      label: language === 'ar' ? 'الرئيسية' : 'Dashboard',
      icon: Home,
      glowColor: 'rgba(245, 158, 11, 0.4)', // Amber gold
    },
    {
      id: 'calculator' as ActiveTab,
      label: language === 'ar' ? 'الحاسبة' : 'Calculator',
      icon: Calculator,
      glowColor: 'rgba(217, 119, 6, 0.4)', // Deep Gold
    },
    {
      id: 'info' as ActiveTab,
      label: language === 'ar' ? 'ذكاء السيرفرات' : 'AI & Systems',
      icon: Cpu,
      glowColor: 'rgba(34, 211, 238, 0.4)', // Cyan smart
    },
    {
      id: 'settings' as ActiveTab,
      label: language === 'ar' ? 'الأسعار' : 'Rates Config',
      icon: Settings,
      glowColor: 'rgba(239, 68, 68, 0.4)', // Hot Red
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-5 px-4 sm:px-6 md:pb-6">
      <nav 
        id="pyramids-global-dock"
        className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-3 py-2 bg-black/85 backdrop-blur-2xl rounded-2xl border border-amber-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.05)] w-full max-w-lg transition-all duration-300 hover:border-amber-500/40"
      >
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-1 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 py-2 sm:py-2 px-1 sm:px-3 text-center transition-all duration-300 group outline-none rounded-xl cursor-pointer"
            >
              {/* Premium Glow / Capsule Behind Active Item */}
              {isActive && (
                <motion.div
                  layoutId="activeDockPill"
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/15 border border-amber-500/20 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  style={{
                    boxShadow: `0 0 16px ${item.glowColor}`,
                  }}
                />
              )}

              {/* Icon Container with Micro-Jump */}
              <div className="relative">
                <Icon
                  className={`h-4.5 w-4.5 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110 ${
                    isActive 
                      ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                      : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}
                />
                {!isActive && (
                  <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-amber-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9.5px] sm:text-xs font-sans font-black tracking-wide transition-colors duration-300 ${
                  isActive 
                    ? 'text-amber-400' 
                    : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              >
                {item.label}
              </span>

              {/* Bottom active accent dot */}
              {isActive && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
