import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Calculator } from './components/Calculator';
import { Settings } from './components/Settings';
import { SystemInfo } from './components/SystemInfo';
import { HomeDashboard } from './components/HomeDashboard';
import { FloatingCaratCard } from './components/FloatingCaratCard';
import { BottomMarketTicker } from './components/BottomMarketTicker';
import { AdminGate } from './components/AdminGate';
import { ActiveTab, GoldPrices, Language, HistoryItem, TickerSettings } from './types';
import { translations } from './utils/translations';
import { motion, AnimatePresence } from 'motion/react';

// Default standard Egyptian pricing averages if none saved in localStorage
const DEFAULT_PRICES: GoldPrices = {
  g24: 4200,
  g21: 3675,
  g18: 3150,
};

// Default currencies exchange and live market data values
const DEFAULT_TICKER_SETTINGS: TickerSettings = {
  mode: 'auto',
  usdRateBuy: 49.65,
  usdRateSell: 49.75,
  eurRateBuy: 53.40,
  eurRateSell: 53.52,
  sarRateBuy: 13.24,
  sarRateSell: 13.27,
  aedRateBuy: 13.51,
  aedRateSell: 13.55,
  kwdRateBuy: 161.42,
  kwdRateSell: 162.10,
  globalGoldOunce: 2435,
};

export default function App() {
  // Passcode gate state (password is mas2026)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pyramids_lock_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const handleUnlock = () => {
    setIsUnlocked(true);
    try {
      localStorage.setItem('pyramids_lock_unlocked', 'true');
    } catch {}
  };

  const handleLock = () => {
    setIsUnlocked(false);
    try {
      localStorage.setItem('pyramids_lock_unlocked', 'false');
    } catch {}
    setActiveTab('home');
  };

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

  // Ticker settings state (auto internet sync vs manual inputs)
  const [tickerSettings, setTickerSettings] = useState<TickerSettings>(() => {
    try {
      const saved = localStorage.getItem('pyramids_ticker_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading ticker settings:', e);
    }
    return DEFAULT_TICKER_SETTINGS;
  });

  // Safe handler to update ticker configurations
  const saveTickerSettings = (newSettings: TickerSettings) => {
    setTickerSettings(newSettings);
    try {
      localStorage.setItem('pyramids_ticker_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save ticker settings:', e);
    }
  };

  // Direct internet API live price fetcher routine (from free and open APIs)
  const fetchLiveTickerData = async () => {
    let loadedCurrencies: Partial<TickerSettings> = {};
    let globalOunceVal = tickerSettings.globalGoldOunce;
    let calculatedEgpRate = tickerSettings.usdRateSell;

    // 1. Fetch live keyless exchange rates relative to USD (USD standard rates)
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (res.ok) {
        const data = await res.json();
        calculatedEgpRate = data.rates.EGP || 49.75;
        
        const getRateInEgp = (code: string, fallback: number) => {
          const rateToUsd = data.rates[code];
          if (rateToUsd) {
            return calculatedEgpRate / rateToUsd;
          }
          return fallback;
        };

        const usdVal = calculatedEgpRate;
        const eurVal = getRateInEgp('EUR', 53.45);
        const sarVal = getRateInEgp('SAR', 13.25);
        const aedVal = getRateInEgp('AED', 13.53);
        const kwdVal = getRateInEgp('KWD', 161.80);

        if (data.rates.XAU) {
          globalOunceVal = Math.round(1 / data.rates.XAU);
        }

        loadedCurrencies = {
          usdRateBuy: Math.round(usdVal * 0.998 * 100) / 100,
          usdRateSell: Math.round(usdVal * 1.002 * 100) / 100,
          eurRateBuy: Math.round(eurVal * 0.998 * 100) / 100,
          eurRateSell: Math.round(eurVal * 1.002 * 100) / 100,
          sarRateBuy: Math.round(sarVal * 0.998 * 100) / 100,
          sarRateSell: Math.round(sarVal * 1.002 * 100) / 100,
          aedRateBuy: Math.round(aedVal * 0.998 * 100) / 100,
          aedRateSell: Math.round(aedVal * 1.002 * 100) / 100,
          kwdRateBuy: Math.round(kwdVal * 0.998 * 100) / 100,
          kwdRateSell: Math.round(kwdVal * 1.002 * 100) / 100,
        };
      }
    } catch (currencyErr) {
      console.warn('Unable to sync standard currency conversion ratios:', currencyErr);
    }

    // 2. Fetch live gold rates using the preconfigured/saved Key via GoldAPI (prone to CORS/Rate-limit failures)
    try {
      const apiKey = localStorage.getItem('goldapi_key') || 'goldapi-d403eb25233852441e428c300695afdf-io';
      const proxyEgpUrl = `/api/goldapi-proxy?currency=EGP&key=${encodeURIComponent(apiKey.trim())}`;
      const goldRes = await fetch(proxyEgpUrl);

      if (goldRes.ok) {
        const goldData = await goldRes.json();
        let p24 = goldData.price_gram_24k;
        let p21 = goldData.price_gram_21k;
        let p18 = goldData.price_gram_18k;

        if (!p24 && goldData.price) {
          p24 = goldData.price / 31.1034768;
        }

        if (goldData.price && calculatedEgpRate) {
          globalOunceVal = Math.round(goldData.price / (p24 ? (goldData.price_gram_24k ? goldData.price / p24 : calculatedEgpRate) : calculatedEgpRate) * 31.1034768);
          try {
            // Standard estimation of golden ounce global value from Troy ounce directly
            const proxyUsdUrl = `/api/goldapi-proxy?currency=USD&key=${encodeURIComponent(apiKey.trim())}`;
            const ounceRes = await fetch(proxyUsdUrl);
            if (ounceRes.ok) {
              const ounceData = await ounceRes.json();
              if (ounceData.price) globalOunceVal = Math.round(ounceData.price);
            }
          } catch (ounceErr) {
            // Nested error bypass
          }
        }

        if (p24) {
          if (!p21) p21 = p24 * 0.875;
          if (!p18) p18 = p24 * 0.75;

          const r24 = Math.round(p24 * 100) / 100;
          const r21 = Math.round(p21 * 100) / 100;
          const r18 = Math.round(p18 * 100) / 100;

          savePrices({
            g24: r24,
            g21: r21,
            g18: r18
          });
        }
      }
    } catch (goldApiErr) {
      console.warn('Unable to retrieve direct GoldAPI pricing indices (using cache/server proxy fallback):', goldApiErr);
    }

    // Update ticker settings values with any newly fetched or cached parameters safely
    setTickerSettings(prev => {
      const revised = {
        ...prev,
        ...loadedCurrencies,
        globalGoldOunce: globalOunceVal ? globalOunceVal : prev.globalGoldOunce
      };
      try {
        localStorage.setItem('pyramids_ticker_settings', JSON.stringify(revised));
      } catch (e) {}
      return revised;
    });
  };

  // Safe side effect to periodically sync live metrics
  useEffect(() => {
    if (tickerSettings.mode === 'auto') {
      fetchLiveTickerData();
      const runInterval = setInterval(() => {
        fetchLiveTickerData();
      }, 300000); // refresh every 5 mins
      return () => clearInterval(runInterval);
    }
  }, [tickerSettings.mode]);

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

  // Scroll to top of the page when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

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
            tickerSettings={tickerSettings}
            saveTickerSettings={saveTickerSettings}
            fetchLiveTickerData={fetchLiveTickerData}
            onLock={handleLock}
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

  if (!isUnlocked) {
    return (
      <AdminGate 
        language={language} 
        onSetLanguage={handleSetLanguage} 
        onUnlock={handleUnlock} 
      />
    );
  }

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
          onLock={handleLock}
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

      {/* 🌟 LIVE 21K FLOATING CARAT CARD 🌟 */}
      <FloatingCaratCard prices={prices} language={language} setActiveTab={setActiveTab} />

      {/* 📊 LIVE GOLD & CURRENCY SCROLLING TICKER 📊 */}
      <BottomMarketTicker prices={prices} language={language} tickerSettings={tickerSettings} />


      {/* 🚀 PREMIUM RESPONSIVE FLOATING BOTTOM BAR / DOCK 🚀 */}
      <div className="relative z-30">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
      </div>
    </div>
  );
}
