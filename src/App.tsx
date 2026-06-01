import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Calculator } from './components/Calculator';
import { Settings } from './components/Settings';
import { SystemInfo } from './components/SystemInfo';
import { HomeDashboard } from './components/HomeDashboard';
import { ActiveTab, GoldPrices, Language, HistoryItem } from './types';
import { translations } from './utils/translations';
import { motion, AnimatePresence } from 'motion/react';

// Default standard Egyptian pricing averages if none saved in localStorage
const DEFAULT_PRICES: GoldPrices = {
  g24: 4200,
  g21: 3675,
  g18: 3150,
};

export default function App() {
  // Safe load of prices
  const [prices, setPrices] = useState<GoldPrices>(() => {
    try {
      const saved = localStorage.getItem('pyramids_gold_prices');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading prices:', e);
    }
    return DEFAULT_PRICES;
  });

  // State for bilingual language support (starts in Arabic 'ar')
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('pyramids_gold_lang');
      if (saved === 'ar' || saved === 'en') {
        return saved as Language;
      }
    } catch (e) {}
    return 'ar';
  });

  // Active navigation tab
  const [activeTab, setActiveTab ] = useState<ActiveTab>('home');

  // Calculation calibration history log records
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('pyramids_gold_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading calibration history:', e);
    }
    return [];
  });

  // Synchronize gold prices changes
  const savePrices = (newPrices: GoldPrices) => {
    setPrices(newPrices);
    try {
      localStorage.setItem('pyramids_gold_prices', JSON.stringify(newPrices));
    } catch (e) {
      console.error('Failed to save prices:', e);
    }
  };

  // Synchronize language toggles
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('pyramids_gold_lang', lang);
    } catch (e) {}
  };

  // Add a successful calculation to history log
  const saveHistoryItem = (newItem: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const freshItem: HistoryItem = {
      ...newItem,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [freshItem, ...history].slice(0, 100); // Caps history at 100 entries
    setHistory(updatedHistory);
    try {
      localStorage.setItem('pyramids_gold_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save calibration logs:', e);
    }
  };

  // Clear all history reports
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('pyramids_gold_history');
    } catch (e) {}
  };

  // Delete single history log
  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('pyramids_gold_history', JSON.stringify(updated));
    } catch (e) {}
  };

  // Synchronize document direction attribute relative to selected language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboard
            prices={prices}
            savePrices={savePrices}
            language={language}
            history={history}
            setActiveTab={setActiveTab}
            deleteHistoryItem={handleDeleteHistoryItem}
          />
        );
      case 'calculator':
        return (
          <Calculator
            prices={prices}
            language={language}
            history={history}
            saveHistoryItem={saveHistoryItem}
            clearHistory={handleClearHistory}
            deleteHistoryItem={handleDeleteHistoryItem}
          />
        );
      case 'settings':
        return (
          <Settings
            prices={prices}
            savePrices={savePrices}
            language={language}
          />
        );
      case 'info':
        return <SystemInfo language={language} prices={prices} history={history} />;
      default:
        return (
          <Calculator
            prices={prices}
            language={language}
            history={history}
            saveHistoryItem={saveHistoryItem}
            clearHistory={handleClearHistory}
            deleteHistoryItem={handleDeleteHistoryItem}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 selection:bg-yellow-500/20 selection:text-yellow-400 relative overflow-hidden">
      
      {/* 🌟 PREMIUM SITE BACKGROUND WATERMARK LOGO 🌟 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-[0.03] select-none scale-105">
        <img 
          src="https://scontent.fcai19-6.fna.fbcdn.net/v/t39.30808-6/555918514_1376236214503912_7142926422343815940_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-Ee25hTmxCsQ7kNvwFuTPVH&_nc_oc=AdqlyaoAk5d0Tbidf0BDTv33gNOoATPHt8IsqnLkEr8D8HCTA-Lghj9jSqN9Q02pH08&_nc_zt=23&_nc_ht=scontent.fcai19-6.fna&_nc_gid=k43zHmpgIfbl2j-2R1K4ZA&_nc_ss=7b289&oh=00_Af_9jhFH_u1URl5j79AU6yq4YZ8Na-96gHa85T9AbfomEQ&oe=6A2261F2" 
          alt="Pyramids Gold Backdrop Watermark" 
          className="w-[85vw] h-[85vw] max-w-[1100px] max-h-[1100px] object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Golden accent bar at the very top */}
      <div className="relative z-10 h-1 w-full bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-300" />

      {/* Dynamic Header */}
      <div className="relative z-10">
        <Header 
          prices={prices} 
          language={language} 
          setLanguage={handleSetLanguage} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Body Frame Wrapper */}
      <div className="flex w-full relative z-10 justify-center">
        
        {/* Core Main Viewport content */}
        <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 pb-32 md:pb-36 relative z-20 w-full max-w-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* 🚀 PREMIUM RESPONSIVE FLOATING BOTTOM BAR / DOCK 🚀 */}
      <div className="relative z-30">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
      </div>
    </div>
  );
}
