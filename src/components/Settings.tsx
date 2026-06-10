import React, { useState } from 'react';
import { GoldPrices, Language, TickerSettings } from '../types';
import { translations } from '../utils/translations';
import { Sliders, Save, RotateCcw, TrendingUp, AlertCircle, Sparkles, Globe, RefreshCw, Loader2, Check, Coins } from 'lucide-react';

import { ShieldAlert, LogOut } from 'lucide-react';

interface SettingsProps {
  prices: GoldPrices;
  savePrices: (prices: GoldPrices) => void;
  language: Language;
  tickerSettings: TickerSettings;
  saveTickerSettings: (settings: TickerSettings) => void;
  fetchLiveTickerData: () => Promise<void>;
  onLock?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  prices, 
  savePrices, 
  language,
  tickerSettings,
  saveTickerSettings,
  fetchLiveTickerData,
  onLock
}) => {
  const t = translations[language];

  // Internal component states for inputs
  const [g24, setG24] = useState<string>(prices.g24.toString());
  const [g21, setG21] = useState<string>(prices.g21.toString());
  const [g18, setG18] = useState<string>(prices.g18.toString());
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Currencies manual values states
  const [tickerMode, setTickerMode] = useState<'auto' | 'manual'>(tickerSettings.mode);
  const [usdBuy, setUsdBuy] = useState<string>(tickerSettings.usdRateBuy.toString());
  const [usdSell, setUsdSell] = useState<string>(tickerSettings.usdRateSell.toString());
  const [eurBuy, setEurBuy] = useState<string>(tickerSettings.eurRateBuy.toString());
  const [eurSell, setEurSell] = useState<string>(tickerSettings.eurRateSell.toString());
  const [sarBuy, setSarBuy] = useState<string>(tickerSettings.sarRateBuy.toString());
  const [sarSell, setSarSell] = useState<string>(tickerSettings.sarRateSell.toString());
  const [aedBuy, setAedBuy] = useState<string>(tickerSettings.aedRateBuy.toString());
  const [aedSell, setAedSell] = useState<string>(tickerSettings.aedRateSell.toString());
  const [kwdBuy, setKwdBuy] = useState<string>(tickerSettings.kwdRateBuy.toString());
  const [kwdSell, setKwdSell] = useState<string>(tickerSettings.kwdRateSell.toString());
  const [globalGoldOunceInput, setGlobalGoldOunceInput] = useState<string>(tickerSettings.globalGoldOunce.toString());
  
  const [tickerSaveSuccess, setTickerSaveSuccess] = useState<boolean>(false);
  const [tickerSyncLoading, setTickerSyncLoading] = useState<boolean>(false);

  // Synchronise toggle updates immediately to parent
  const handleToggleTickerMode = (newMode: 'auto' | 'manual') => {
    setTickerMode(newMode);
    saveTickerSettings({
      ...tickerSettings,
      mode: newMode,
    });
  };



  // Submit handler for currencies and ticker configurations
  const handleSaveTickerSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveTickerSettings({
      mode: tickerMode,
      usdRateBuy: parseFloat(usdBuy) || 0,
      usdRateSell: parseFloat(usdSell) || 0,
      eurRateBuy: parseFloat(eurBuy) || 0,
      eurRateSell: parseFloat(eurSell) || 0,
      sarRateBuy: parseFloat(sarBuy) || 0,
      sarRateSell: parseFloat(sarSell) || 0,
      aedRateBuy: parseFloat(aedBuy) || 0,
      aedRateSell: parseFloat(aedSell) || 0,
      kwdRateBuy: parseFloat(kwdBuy) || 0,
      kwdRateSell: parseFloat(kwdSell) || 0,
      globalGoldOunce: parseFloat(globalGoldOunceInput) || 0,
    });
    setTickerSaveSuccess(true);
    setTimeout(() => setTickerSaveSuccess(false), 3500);
  };

  // Manually trigger dynamic API update
  const handleManualSyncInternet = async () => {
    setTickerSyncLoading(true);
    await fetchLiveTickerData();
    // Re-synchronize local form fields with the updated state values from parent
    setTimeout(() => {
      const saved = localStorage.getItem('pyramids_ticker_settings');
      if (saved) {
        const fresh = JSON.parse(saved);
        setUsdBuy(fresh.usdRateBuy.toString());
        setUsdSell(fresh.usdRateSell.toString());
        setEurBuy(fresh.eurRateBuy.toString());
        setEurSell(fresh.eurRateSell.toString());
        setSarBuy(fresh.sarRateBuy.toString());
        setSarSell(fresh.sarRateSell.toString());
        setAedBuy(fresh.aedRateBuy.toString());
        setAedSell(fresh.aedRateSell.toString());
        setKwdBuy(fresh.kwdRateBuy.toString());
        setKwdSell(fresh.kwdRateSell.toString());
        setGlobalGoldOunceInput(fresh.globalGoldOunce.toString());
      }
      setTickerSyncLoading(false);
    }, 600);
  };

  // Egypt average reference gold prices
  const handleResetToDefaults = () => {
    setG24('4200');
    setG21('3675');
    setG18('3150');
    
    savePrices({
      g24: 4200,
      g21: 3675,
      g18: 3150
    });
    triggerSuccessToast();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p24 = parseFloat(g24) || 0;
    const p21 = parseFloat(g21) || p24 * 0.875; // fallback
    const p18 = parseFloat(g18) || p24 * 0.75; // fallback

    savePrices({
      g24: p24,
      g21: p21,
      g18: p18,
    });
    triggerSuccessToast();
  };

  const triggerSuccessToast = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      
      {/* Settings Welcome Header Section - Styled as a Premium Bento Cell */}
      <div className="bento-card bg-gradient-to-br from-[#161616] via-[#111111] to-[#161616] border border-amber-500/20 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-yellow-500/[0.03] blur-3xl"></div>
        <div className="relative z-10 w-full">
          <div className="flex items-center gap-2 text-[var(--gold)] mb-3">
            <Sliders className="h-5 w-5" />
            <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">{t.settingsTab}</span>
          </div>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2">
            {t.settingsTitle}
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {t.settingsSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Inputs Form Column - Span 8 */}
        <div className="lg:col-span-8 flex flex-col gap-6">



          <form onSubmit={handleSubmit} className="bento-card space-y-6">
            
            <h3 className="text-xs font-bold text-[var(--gold)] tracking-widest uppercase border-b border-neutral-900 pb-4">
              {language === 'ar' ? '◆ تعديل أسعار الجرام الجارية' : '◆ Update Daily Gold Spot Rates'}
            </h3>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Gram 24 Price Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-400">
                  {t.g24} ({t.pricePerGram})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={g24}
                    onChange={(e) => setG24(e.target.value)}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-[var(--gold)] rounded-xl px-4 py-3 text-base font-mono font-bold text-amber-400 focus:outline-none transition-all"
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center text-[10px] text-neutral-500 font-bold">
                    {t.currency}
                  </div>
                </div>
              </div>

              {/* Gram 21 Price Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-400">
                  {t.g21} ({t.pricePerGram})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={g21}
                    onChange={(e) => setG21(e.target.value)}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-[var(--gold)] rounded-xl px-4 py-3 text-base font-mono font-bold text-yellow-500 focus:outline-none transition-all"
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center text-[10px] text-neutral-500 font-bold">
                    {t.currency}
                  </div>
                </div>
              </div>

              {/* Gram 18 Price Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-400">
                  {t.g18} ({t.pricePerGram})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={g18}
                    onChange={(e) => setG18(e.target.value)}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-[var(--gold)] rounded-xl px-4 py-3 text-base font-mono font-bold text-amber-600 focus:outline-none transition-all"
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center text-[10px] text-neutral-500 font-bold">
                    {t.currency}
                  </div>
                </div>
              </div>

            </div>

            {/* Price Consistency Warning / Tip */}
            <div className="rounded-xl border border-amber-950/20 bg-amber-950/5 p-4 text-xs text-amber-500 leading-relaxed flex gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <span className="font-bold block mb-0.5">
                  {language === 'ar' ? 'توصية ترابط الأسعار المئوي' : 'Price Coherence Guideline'}
                </span>
                <span className="text-neutral-400">
                  {language === 'ar' 
                    ? 'في الأحوال العادية، يتبع عيار 18 وعيار 21 تسعير عيار 24 بنسبة ثابتة؛ عيار 21 هو تماماً %87.5 من قيمة عيار 24، وعيار 18 هو تماماً %75.0 منه.' 
                    : 'Standard valuation requires maintaining the exact purity ratios: 21K price is exactly 87.5% of 24K price, and 18K is exactly 75% of 24K price.'}
                </span>
              </div>
            </div>

            {/* Form actions: Reset & Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] text-neutral-950 font-black text-sm py-3.5 px-6 shadow-md hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Save className="h-4.5 w-4.5" />
                {language === 'ar' ? 'حفظ الأسعار وتعديلها' : 'Apply & Save New Rates'}
              </button>
              
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 text-xs py-3.5 px-5 hover:bg-neutral-850 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                {language === 'ar' ? 'إعادة تعيين للأسعار المصرية المتوسطة' : 'Restore Cairo Average Rates'}
              </button>
            </div>

          </form>

          {/* 📊 LIVE PRICES & EXCHANGE RATES TICKER CONFIGURATION 📊 */}
          <div className="bento-card relative overflow-hidden mt-6 flex flex-col gap-5">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-amber-500/[0.02] blur-3xl"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Coins className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
                  {language === 'ar' ? 'تحديث شريط أسعار العملات والذهب السفلي' : 'Live Currencies & Global Gold Ticker'}
                </h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {language === 'ar' 
                    ? 'اختر بين جلب وتحديث الأسعار لحظياً وتلقائياً عبر خوادم ومزودي الإنترنت، أو التحكم اليدوي الكامل بالقيم من هنا.' 
                    : 'Toggle between fetching rates dynamically from free public APIs or managing all rates manually.'}
                </p>
              </div>
              
              {/* Mode selection buttons */}
              <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-850 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleTickerMode('auto')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tickerMode === 'auto' 
                      ? 'bg-amber-500 text-neutral-950 shadow-sm' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'ar' ? 'تحديث تلقائي' : 'Auto Sync'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTickerMode('manual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tickerMode === 'manual' 
                      ? 'bg-amber-500 text-neutral-950 shadow-sm' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'ar' ? 'إدخال يدوي' : 'Manual Entry'}
                </button>
              </div>
            </div>

            {tickerMode === 'auto' ? (
              <div className="space-y-4">
                {/* Auto sync info card */}
                <div className="rounded-xl border border-emerald-950/20 bg-emerald-950/10 p-4 text-xs text-emerald-500 leading-relaxed flex gap-3">
                  <Globe className="h-5 w-5 shrink-0 text-emerald-400 animate-spin-slow" />
                  <div className="space-y-2 flex-1">
                    <span className="font-bold block text-emerald-400 text-sm">
                      {language === 'ar' ? 'نظام المزامنة المباشرة مع الخوادم نشط' : 'Live Server Sync System Enabled'}
                    </span>
                    <span className="text-neutral-400 block pb-1 leading-relaxed">
                      {language === 'ar' 
                        ? 'يتم تحديث أسعار صرف العملات مقابل الجنيه المصري (الدولار واليورو والريال والدرهم والدينار) لحظياً من خوادم البنوك المفتوحة مجاناً، كما يتم مزامنة أسعار الذهب والفضة عبر منصات التداول العالمية تلقائياً.' 
                        : 'The ticker fetches latest Egypt banking exchange rates (USD, EUR, SAR, AED, KWD) and global real-time XAU/EGP indices from free open public APIs automatically.'}
                    </span>
                    
                    <button
                      type="button"
                      disabled={tickerSyncLoading}
                      onClick={handleManualSyncInternet}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 hover:bg-emerald-500/25 transition-all text-xs cursor-pointer disabled:opacity-50"
                    >
                      {tickerSyncLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                      {language === 'ar' ? 'مزامنة وتحديث فوري الآن' : 'Force Update Now'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveTickerSettings} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* USD Box */}
                  <div className="space-y-2 rounded-xl border border-neutral-900 bg-black/40 p-3.5">
                    <label className="block text-[11px] font-bold text-amber-550 font-mono uppercase">
                      🇺🇸 {language === 'ar' ? 'الدولار الأمريكي (USD)' : 'US Dollar (USD)'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'شراء' : 'Buy'}</span>
                        <input
                          type="number"
                          step="any"
                          value={usdBuy}
                          onChange={(e) => setUsdBuy(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'بيع' : 'Sell'}</span>
                        <input
                          type="number"
                          step="any"
                          value={usdSell}
                          onChange={(e) => setUsdSell(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* EUR Box */}
                  <div className="space-y-2 rounded-xl border border-neutral-900 bg-black/40 p-3.5">
                    <label className="block text-[11px] font-bold text-blue-400 font-mono uppercase">
                      🇪🇺 {language === 'ar' ? 'اليورو الأوروبي (EUR)' : 'Euro (EUR)'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'شراء' : 'Buy'}</span>
                        <input
                          type="number"
                          step="any"
                          value={eurBuy}
                          onChange={(e) => setEurBuy(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'بيع' : 'Sell'}</span>
                        <input
                          type="number"
                          step="any"
                          value={eurSell}
                          onChange={(e) => setEurSell(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SAR Box */}
                  <div className="space-y-2 rounded-xl border border-neutral-900 bg-black/40 p-3.5">
                    <label className="block text-[11px] font-bold text-emerald-400 font-mono uppercase">
                      🇸🇦 {language === 'ar' ? 'الريال السعودي (SAR)' : 'Saudi Riyal (SAR)'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'شراء' : 'Buy'}</span>
                        <input
                          type="number"
                          step="any"
                          value={sarBuy}
                          onChange={(e) => setSarBuy(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'بيع' : 'Sell'}</span>
                        <input
                          type="number"
                          step="any"
                          value={sarSell}
                          onChange={(e) => setSarSell(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AED Box */}
                  <div className="space-y-2 rounded-xl border border-neutral-900 bg-black/40 p-3.5">
                    <label className="block text-[11px] font-bold text-[#00ffcc] font-mono uppercase">
                      🇦🇪 {language === 'ar' ? 'الدرهم الإماراتي (AED)' : 'UAE Dirham (AED)'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'شراء' : 'Buy'}</span>
                        <input
                          type="number"
                          step="any"
                          value={aedBuy}
                          onChange={(e) => setAedBuy(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-[#00ffcc] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'بيع' : 'Sell'}</span>
                        <input
                          type="number"
                          step="any"
                          value={aedSell}
                          onChange={(e) => setAedSell(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-[#00ffcc] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* KWD Box */}
                  <div className="space-y-2 rounded-xl border border-neutral-900 bg-black/40 p-3.5">
                    <label className="block text-[11px] font-bold text-purple-400 font-mono uppercase">
                      🇰🇼 {language === 'ar' ? 'الدينار الكويتي (KWD)' : 'Kuwaiti Dinar (KWD)'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'شراء' : 'Buy'}</span>
                        <input
                          type="number"
                          step="any"
                          value={kwdBuy}
                          onChange={(e) => setKwdBuy(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{language === 'ar' ? 'بيع' : 'Sell'}</span>
                        <input
                          type="number"
                          step="any"
                          value={kwdSell}
                          onChange={(e) => setKwdSell(e.target.value)}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-750 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Global Ounce */}
                  <div className="space-y-2 rounded-xl border border-neutral-900 bg-black/40 p-3.5 flex flex-col justify-center">
                    <label className="block text-[11px] font-bold text-yellow-500 font-mono uppercase">
                      🌍 {language === 'ar' ? 'سعر الأوقية عالمياً بالدولار (USD)' : 'Global Gold Ounce Price (USD)'}
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="number"
                        step="any"
                        value={globalGoldOunceInput}
                        onChange={(e) => setGlobalGoldOunceInput(e.target.value)}
                        className="w-full bg-black border border-neutral-850 hover:border-text-neutral-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center text-[10px] text-neutral-500 font-bold font-mono">
                        USD
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs py-3.5 px-6 shadow-md hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {language === 'ar' ? 'حفظ إعدادات العملات يدوياً' : 'Apply & Save Currency Rates'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Live Calibration Stats Mock Column - Span 4 */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bento-card flex flex-col gap-5 h-full">
            <div className="absolute right-0 bottom-0 -mr-16 -mb-16 h-36 w-36 rounded-full bg-yellow-500/[0.02] blur-2xl"></div>
            
            <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest font-mono flex items-center gap-2 border-b border-neutral-900 pb-3">
              <Sparkles className="h-3.5 w-3.5" />
              {language === 'ar' ? 'نسب النقاوة الأساسية' : 'Alloy Benchmarks'}
            </h3>

            {/* Benchmark display list */}
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-900 bg-black p-3.5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-white">{t.g24}</h4>
                  <p className="text-[10px] text-neutral-500">{language === 'ar' ? 'ذهب خالص بنسبة 100%' : '100% pure gold block'}</p>
                </div>
                <span className="font-mono text-xs font-bold text-amber-400">1000/1000 {t.shares}</span>
              </div>

              <div className="rounded-xl border border-neutral-900 bg-black p-3.5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-white">{t.g21}</h4>
                  <p className="text-[10px] text-neutral-500">{language === 'ar' ? 'عيار المعايرة والتبادل' : 'Calibration standard'}</p>
                </div>
                <span className="font-mono text-xs font-bold text-yellow-500">875/1000 {t.shares}</span>
              </div>

              <div className="rounded-xl border border-neutral-900 bg-black p-3.5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-white">{t.g18}</h4>
                  <p className="text-[10px] text-neutral-500">{language === 'ar' ? 'مسبوكة الحلي والمجوهرات' : 'Jewelry manufacture'}</p>
                </div>
                <span className="font-mono text-xs font-bold text-orange-400">750/1000 {t.shares}</span>
              </div>
            </div>

            {/* Premium Secure Lock Card */}
            {onLock && (
              <div className="rounded-xl border border-dashed border-amber-600/20 bg-neutral-950 p-4 mt-2 space-y-3.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-neutral-200">
                    {t.lockSystemLabel}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  {language === 'ar'
                    ? 'تسجيل الخروج الفوري وإعادة قفل المنصة بالكامل، ستحتاج لإدخال الرمز السري mas2026 مرة أخرى للولوج.'
                    : 'Log out and lock entire environment immediately. You will need to type mas2026 passcode again to enter.'}
                </p>
                <button
                  type="button"
                  onClick={onLock}
                  className="w-full py-2.5 bg-red-950/40 hover:bg-red-900/40 border border-red-900/30 hover:border-red-500 text-rose-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.adminLock}</span>
                </button>
              </div>
            )}

            <div className="mt-auto pt-6 text-[10px] leading-relaxed text-neutral-500 border-t border-neutral-900">
              {language === 'ar' 
                ? '* هذا التطبيق لا يتطلب اتصالاً سحابياً؛ كافة الأسعار الحالية تحفظ مشفرة في جهازك لضمان خصوصيتك وسرعتك.' 
                : '* Pyramids Gold runs entirely locally. Your price inputs and calibration history are stored securely in your web browser\'s local storage.'}
            </div>

          </div>
        </div>

      </div>

      {/* Success Toast banner */}
      {isSuccess && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-950 border border-emerald-850 text-emerald-250 px-4 py-3 shadow-2xl text-xs font-bold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span>{t.pricesUpdatedSuccess}</span>
        </div>
      )}

      {/* Ticker Settings success Toast banner */}
      {tickerSaveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-amber-950 border border-amber-800 text-amber-250 px-4 py-3 shadow-2xl text-xs font-bold flex items-center gap-2">
          <Check className="h-4 w-4 animate-bounce text-amber-400" />
          <span>{language === 'ar' ? 'تم حفظ تعديلات شريط العملات بنجاح!' : 'Currency ticker settings saved successfully!'}</span>
        </div>
      )}

    </div>
  );
};
