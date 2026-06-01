import React from 'react';
import { ActiveTab, GoldPrices, Language } from '../types';
import { translations } from '../utils/translations';
import { Coins, Globe, TrendingUp, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  prices: GoldPrices;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  prices, 
  language, 
  setLanguage,
  activeTab,
  setActiveTab
}) => {
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const getFormattedPrice = (price: number) => {
    return price.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US') + ' ' + t.currency;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(212,175,55,0.15)] bg-[#0d0d0d]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 border-2 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all duration-300 group overflow-hidden">
            {/* Glowing gradient background base */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500/20 to-orange-500/10 opacity-70 blur-xs rounded-xl"></div>
            
            <img 
              src="https://scontent.fcai19-6.fna.fbcdn.net/v/t39.30808-6/555918514_1376236214503912_7142926422343815940_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-Ee25hTmxCsQ7kNvwFuTPVH&_nc_oc=AdqlyaoAk5d0Tbidf0BDTv33gNOoATPHt8IsqnLkEr8D8HCTA-Lghj9jSqN9Q02pH08&_nc_zt=23&_nc_ht=scontent.fcai19-6.fna&_nc_gid=k43zHmpgIfbl2j-2R1K4ZA&_nc_ss=7b289&oh=00_Af_9jhFH_u1URl5j79AU6yq4YZ8Na-96gHa85T9AbfomEQ&oe=6A2261F2"
              alt="Logo"
              className="relative z-10 h-full w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            
            {/* Subtle animated neon light flare */}
            <span className="absolute top-1 left-1 z-20 flex h-1 w-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-1 w-1 bg-amber-400"></span>
            </span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-widest bg-gradient-to-r from-amber-200 via-[var(--gold)] to-orange-400 bg-clip-text text-transparent uppercase">
              {t.appName}
            </h1>
            <p className="hidden text-[10px] text-neutral-500 sm:block font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Price Ticker (Live synchronization) */}
        <div className="hidden flex-1 items-center justify-center gap-6 px-4 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.15)] bg-[#161616]/70 px-4 py-1.5 text-xs">
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-neutral-400 font-bold">{t.tickerTitle}:</span>
            
            <div className="flex items-center gap-4 ml-2">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 font-semibold">{t.g24}:</span>
                <span className="font-mono font-bold text-amber-400">{getFormattedPrice(prices.g24)}</span>
              </div>
              <div className="h-3 w-px bg-neutral-800"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 font-semibold">{t.g21}:</span>
                <span className="font-mono font-bold text-yellow-500">{getFormattedPrice(prices.g21)}</span>
              </div>
              <div className="h-3 w-px bg-neutral-800"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 font-semibold">{t.g18}:</span>
                <span className="font-mono font-bold text-amber-600">{getFormattedPrice(prices.g18)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language and Action Button */}
        <div className="flex items-center gap-2">
          {/* Mobil Price Ticker shortcut */}
          <div className="flex items-center gap-1.5 rounded-lg bg-[#161616] px-3 py-1.5 text-xs md:hidden border border-neutral-800">
            <Coins className="h-3.5 w-3.5 text-yellow-500" />
            <span className="font-mono font-bold text-yellow-500">
              {getFormattedPrice(prices.g21)}
            </span>
          </div>

          {/* Price Settings Icon Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-blue-500 bg-blue-500/15 text-blue-400 shadow-md shadow-blue-500/10'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-blue-500/40 hover:text-blue-300 hover:bg-neutral-850'
            }`}
            title={t.settingsTab}
            aria-label={t.settingsTab}
            id="header-price-settings-btn"
          >
            <Sliders className="h-4 w-4" />
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 px-3.5 py-2 text-xs font-semibold text-neutral-300 transition-all hover:border-[var(--gold)]/40 hover:text-[var(--gold-light)] cursor-pointer"
            style={{ direction: 'ltr' }}
            id="header-lang-btn"
          >
            <Globe className="h-3.5 w-3.5 text-neutral-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Mobile Ticker */}
      <div className="flex border-t border-neutral-900 bg-black px-4 py-1.5 justify-around text-[10px] md:hidden">
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">{t.g24}:</span>
          <span className="font-mono font-extrabold text-amber-400">{getFormattedPrice(prices.g24)}</span>
        </div>
        <div className="h-3 w-px bg-neutral-900"></div>
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">{t.g21}:</span>
          <span className="font-mono font-extrabold text-yellow-500">{getFormattedPrice(prices.g21)}</span>
        </div>
        <div className="h-3 w-px bg-neutral-900"></div>
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">{t.g18}:</span>
          <span className="font-mono font-extrabold text-amber-600">{getFormattedPrice(prices.g18)}</span>
        </div>
      </div>
    </header>
  );
};
