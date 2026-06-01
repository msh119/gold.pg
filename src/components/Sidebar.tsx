import React from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../utils/translations';
import { Home, Calculator, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language }) => {
  const t = translations[language];

  const menuItems = [
    {
      id: 'home' as ActiveTab,
      label: t.homeTab,
      icon: Home,
      color: 'from-yellow-400 to-amber-500',
    },
    {
      id: 'calculator' as ActiveTab,
      label: t.calculatorTab,
      icon: Calculator,
      color: 'from-amber-400 to-yellow-500',
    },
    {
      id: 'info' as ActiveTab,
      label: t.infoTab,
      icon: Info,
      color: 'from-orange-500 to-yellow-600',
    },
  ];

  return (
    <aside className="sticky top-[89px] hidden h-[calc(100vh-89px)] w-64 border-r border-neutral-800 bg-neutral-950 p-6 md:block">
      <div className="flex flex-col gap-6">
        
        {/* Navigation Section */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-blue-400 bg-gradient-to-r from-blue-500/10 to-transparent'
                    : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
                }`}
                style={{
                  borderLeft: isActive && language === 'en' ? '2px solid #3b82f6' : '',
                  borderRight: isActive && language === 'ar' ? '2px solid #3b82f6' : '',
                }}
              >
                {/* Visual Glow or dot in background of active */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 rounded-xl bg-blue-500/[0.04]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon 
                  className={`h-5 w-5 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-blue-400' : 'text-neutral-500 group-hover:text-neutral-400'
                  }`} 
                />
                
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Brand visual bottom card */}
        <div className="mt-auto rounded-2xl border border-neutral-800/80 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 shadow-xl flex items-start gap-3">
          <img 
            src="https://scontent.fcai19-6.fna.fbcdn.net/v/t39.30808-6/555918514_1376236214503912_7142926422343815940_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-Ee25hTmxCsQ7kNvwFuTPVH&_nc_oc=AdqlyaoAk5d0Tbidf0BDTv33gNOoATPHt8IsqnLkEr8D8HCTA-Lghj9jSqN9Q02pH08&_nc_zt=23&_nc_ht=scontent.fcai19-6.fna&_nc_gid=k43zHmpgIfbl2j-2R1K4ZA&_nc_ss=7b289&oh=00_Af_9jhFH_u1URl5j79AU6yq4YZ8Na-96gHa85T9AbfomEQ&oe=6A2261F2" 
            alt="Logo"
            className="h-10 w-10 rounded-xl object-cover border border-amber-500/30 flex-shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono">
                {t.systemStatus}
              </span>
            </div>
            <p className="text-xs font-bold text-neutral-300">
              {t.appName}
            </p>
            <p className="text-[10px] text-neutral-500 leading-normal">
              {language === 'ar' 
                ? 'الخيارات والحاسبات تتم محلياً وبشكل آمن تماماً للتبادل التجاري العادل.'
                : 'All operations and calibrations run locally and securely.'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
