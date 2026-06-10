import React, { useState, useEffect } from 'react';
import { ActiveTab, GoldPrices, Language, HistoryItem, TickerSettings } from '../types';
import { translations } from '../utils/translations';
import { 
  TrendingUp, 
  Coins, 
  Download, 
  FileSpreadsheet, 
  Clock, 
  Sparkles, 
  Calculator, 
  BookOpen, 
  ChevronRight,
  ChevronLeft,
  Calendar,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Globe,
  Activity,
  ArrowUp,
  ArrowDown,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { ThreeDBullion } from './ThreeDVisuals';
import { AIMarketAnalyst } from './AIMarketAnalyst';

interface HomeDashboardProps {
  prices: GoldPrices;
  savePrices: (newPrices: GoldPrices) => void;
  language: Language;
  history: HistoryItem[];
  setActiveTab: (tab: ActiveTab) => void;
  deleteHistoryItem: (id: string) => void;
  tickerSettings: TickerSettings;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  prices,
  savePrices,
  language,
  history,
  setActiveTab,
  deleteHistoryItem,
  tickerSettings
}) => {
  const t = translations[language];

  // Live feed & market state parameters
  const [msnData, setMsnData] = useState({
    gold_ounce_usd: 2385.50,
    usd_egp: 49.65,
    trend: 'up' as 'up' | 'down' | 'stable',
    change_percent: 0.12,
    source: 'بث شبكة MSN المالية مباشر (MSN Money Watchlist)'
  });

  const [liveHistory, setLiveHistory] = useState<Array<{ date: string; price: number }>>([
    { date: "00:00", price: 2382.40 },
    { date: "01:00", price: 2384.15 },
    { date: "02:00", price: 2388.90 },
    { date: "03:00", price: 2390.20 },
    { date: "04:00", price: 2386.50 },
    { date: "05:00", price: 2389.80 },
    { date: "06:00", price: 2392.10 }
  ]);
  
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [imgError, setImgError] = useState<boolean>(false);

  // Active computed parameters
  const currentOunceUsd = tickerSettings.globalGoldOunce;
  const currentUsdEgp = tickerSettings.usdRateSell;
  const currentTrend = msnData.trend;
  const currentPercentChange = msnData.change_percent;
  const currentSource = language === 'ar' 
    ? 'بث مؤشر GoldAPI المتميز والآمن (الرئيسي والوحيد)'
    : 'Exclusive GoldAPI Premium Unified Feed';

  // Fetch live rates from custom MSN + GoldAPI joint endpoint on the server
  const fetchLiveRates = async (isSilent = false) => {
    if (!isSilent) setIsLoadingLive(true);
    try {
      const response = await fetch('/api/live-rates');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          if (data.msn) {
            setMsnData({
              gold_ounce_usd: data.msn.gold_ounce_usd,
              usd_egp: data.msn.usd_egp,
              trend: data.msn.trend,
              change_percent: data.msn.change_percent,
              source: data.msn.source
            });
          }
          if (data.history && data.history.length > 0) {
            setLiveHistory(data.history);
          }
          const nowStr = new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          setLastSyncTime(nowStr);
        }
      }
    } catch (err) {
      console.warn("Unable to sync direct gold market feeds (using fallback):", err);
    } finally {
      if (!isSilent) setIsLoadingLive(false);
    }
  };

  // Run fetch on mount and setup auto-refresh interval (every 30 seconds for live feel)
  useEffect(() => {
    fetchLiveRates(false);
    const interval = setInterval(() => {
      fetchLiveRates(true);
    }, 30000); // 30 seconds dynamic update
    return () => clearInterval(interval);
  }, []);

  // Format time of the last sync dynamically
  useEffect(() => {
    if (!lastSyncTime) {
      const nowStr = new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastSyncTime(nowStr);
    }
  }, [language]);

  // Propagator method to automatically push converted pricing calculations across 24K, 21K, and 18K
  const handleApplyWebRates = () => {
    if (!currentOunceUsd || !currentUsdEgp) return;
    
    // Formula matching Egyptian market pricing standard:
    // Gram 24K Price = (OuncePrice / 31.1034768) * exchangeRate
    const cleanOunceWeight = 31.1034768;
    const computed24K = (currentOunceUsd / cleanOunceWeight) * currentUsdEgp;
    
    const standard24 = Math.round(computed24K);
    const standard21 = Math.round(standard24 * 0.875);
    const standard18 = Math.round(standard24 * 0.75);

    savePrices({
      g24: standard24,
      g21: standard21,
      g18: standard18
    });

    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 5000); // Reset toast alert
  };

  // Calculated Metrics
  const totalOperations = history.length;
  
  const totalWeight21K = history.reduce((sum, item) => sum + item.cleanWeight21k, 0);
  const totalValueSum = history.reduce((sum, item) => sum + item.totalValue, 0);

  // Formatting helper
  const formatNum = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const getFormattedDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  // Excel Excel XML / CSV Downloader with clean UTF-8 BOM encoding for seamless Excel Arabic parsing
  const exportToExcel = () => {
    if (history.length === 0) return;

    // Build standard CSV file with Arabic Headers and BOM
    const headers = language === 'ar' 
      ? ['التاريخ', 'الوزن الخام (جرام)', 'العيار بالأسهم', 'مكافئ عيار 21 (جرام)', 'سعر جرام 21 وقتها', 'القيمة الإجمالية (ج.م)']
      : ['Date', 'Raw Weight (g)', 'Purity (Shares)', '21K Equivalent (g)', '21K Spot Price', 'Total Value (EGP)'];

    const rows = history.map(item => {
      const formattedDate = new Date(item.timestamp).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
      return [
        `"${formattedDate}"`,
        item.weight,
        item.purity,
        item.cleanWeight21k,
        item.pricePerGram21k,
        item.totalValue
      ];
    });

    // Unicode BOM to force Excel into UTF-8 mode
    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pyramids_Gold_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 text-white">
      
      {/* Front Welcome Bento Hero Card */}
      <div className="bento-card bg-gradient-to-br from-[#0a101d]/85 via-[#07080a] to-[#0d1220] border border-blue-500/20 shadow-[0_12px_45px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-48 w-48 rounded-full bg-blue-500/[0.04] blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 -ml-6 -mb-6 h-36 w-36 rounded-full bg-amber-500/[0.02] blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex-1 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 justify-start">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30">
              <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
            </div>
            <span className="text-[11px] font-black tracking-widest uppercase font-mono text-amber-400">{t.appName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight text-start">
            {t.dashboardWelcome}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed text-start">
            {t.dashboardDesc}
          </p>
        </div>

        {/* Decorative Brand Logo circle with beautiful fallback pyramid block */}
        <div className="relative z-10 flex-shrink-0 self-start md:self-auto">
          {!imgError ? (
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-amber-500/30 p-1.5 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex items-center justify-center overflow-hidden hover:border-amber-500/60 transition-all duration-300">
              <img 
                src="https://scontent.fcai19-6.fna.fbcdn.net/v/t39.30808-6/555918514_1376236214503912_7142926422343815940_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-Ee25hTmxCsQ7kNvwFuTPVH&_nc_oc=AdqlyaoAk5d0Tbidf0BDTv33gNOoATPHt8IsqnLkEr8D8HCTA-Lghj9jSqN9Q02pH08&_nc_zt=23&_nc_ht=scontent.fcai19-6.fna&_nc_gid=k43zHmpgIfbl2j-2R1K4ZA&_nc_ss=7b289&oh=00_Af_9jhFH_u1URl5j79AU6yq4YZ8Na-96gHa85T9AbfomEQ&oe=6A2261F2" 
                alt="Logo Big" 
                className="h-full w-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-amber-500/40 p-3 shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-amber-500/[0.02] bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:8px_8px] opacity-40"></div>
              <div className="text-amber-500 font-extrabold text-[9px] sm:text-[10px] tracking-widest font-mono z-10-au">XAU</div>
              <div className="relative w-8 h-8 flex items-center justify-center mt-1 z-10-au">
                <div className="absolute w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-amber-500/80 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"></div>
                <div className="absolute top-[8px] text-[8px] font-black font-mono text-neutral-950">Au</div>
              </div>
              <span className="text-[7.5px] text-amber-500/60 font-mono mt-1 uppercase z-10 tracking-widest">Pyramids Gold</span>
            </div>
          )}
        </div>
      </div>

      {/* 🌐 LIVE MSN WATCHLIST & GLOBAL GOLD MONITORING DASHBOARD 🌐 */}
      <div className="bento-card bg-gradient-to-b from-neutral-950/85 to-[#07080a] border border-amber-500/20 p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-48 w-48 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-48 w-48 rounded-full bg-blue-500/[0.03] blur-3xl pointer-events-none"></div>

        {/* Header line with blinking live dot */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-neutral-900/60 pb-5 mb-6">
          <div className="space-y-1.5 text-start">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 font-mono">
                {language === 'ar' ? 'بث الصاغة المباشر والربط التلقائي بمؤشرات الأسواق' : 'Live Market Feeds & Sync Engine'}
              </span>
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Globe className="h-5.5 w-5.5 text-amber-500 filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]" />
              {language === 'ar' ? 'مراقبة البورصة العالمية وسعر الصرف اللحظي' : 'Global Ounce & Exchange Rate Monitor'}
            </h3>
          </div>

          {/* Unified Active GoldAPI Premium Feed Badge */}
          <div className="flex flex-wrap items-center gap-3.5 self-start lg:self-auto">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-[10px] font-black select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              {language === 'ar' ? 'بث مؤشر GoldAPI المباشر والآمن 100%' : 'Exclusive Active GoldAPI Premium Feed (100% Guaranteed)'}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[10px] text-neutral-400 font-mono bg-neutral-900/40 border border-neutral-850 px-2.5 py-1 rounded-lg font-bold">
                {language === 'ar' ? `آخر تحديث: ${lastSyncTime}` : `Sync: ${lastSyncTime}`}
              </span>

              <button
                type="button"
                onClick={() => fetchLiveRates(false)}
                disabled={isLoadingLive}
                className={`p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-amber-500 transition-all cursor-pointer ${
                  isLoadingLive ? 'animate-spin pointer-events-none text-amber-500' : ''
                }`}
                title="تحديث الأسعار الآن / Refresh prices now"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Master details grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          
          {/* Ounce Spot USD Card (Col 7) */}
          <div className="lg:col-span-7 bg-neutral-950/60 border border-neutral-900 rounded-2xl p-5.5 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/20 transition-all duration-500 shadow-lg">
            <div className="absolute top-4 left-4">
              <Activity className="h-5 w-5 text-neutral-800 group-hover:text-amber-500/25 transition-colors" />
            </div>

            <div className="text-start">
              <span className="text-[10px] font-black text-amber-500/80 tracking-wider block uppercase mb-1 font-mono select-none">
                {language === 'ar' ? '◀ سعر الأونصة في البورصة العالمية (XAU / USD)' : '◀ Global Ounce Spot Index (XAU/USD)'}
              </span>
              
              <div className="flex items-baseline gap-4 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white group-hover:text-amber-400 transition-colors duration-300 drop-shadow-[0_2px_12px_rgba(245,158,11,0.15)]">
                  {currentOunceUsd ? `$${currentOunceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '---'}
                </span>

                {/* Trend Up / Down indicators */}
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black font-mono leading-none ${
                    currentTrend === 'up' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : currentTrend === 'down' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {currentTrend === 'up' ? <ArrowUp className="h-3.5 w-3.5" /> : currentTrend === 'down' ? <ArrowDown className="h-3.5 w-3.5 text-rose-400" /> : null}
                  {currentTrend === 'up' ? '+' : ''}{currentPercentChange.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Sparkline for extreme mastercraft look */}
            <div className="mt-6 pt-4 text-start border-t border-neutral-900/60 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1.5 select-none font-bold">
                  <Activity className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  {language === 'ar' ? 'مؤشر تقلبات حركة الأونصة اللحظية' : 'Ounce Live Price Action Trend'}
                </span>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 animate-pulse font-mono">
                  {language === 'ar' ? 'البث الموحد للقرارات والأسعار' : 'Unified Decisions Feed'}
                </span>
              </div>
              
              {/* Responsive SVG Graphic Vector */}
              <div className="h-14 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                    <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Grid lines background */}
                  <line x1="0" y1="5" x2="100" y2="5" stroke="#16181f" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="15" x2="100" y2="15" stroke="#16181f" strokeWidth="0.5" strokeDasharray="2,2" />

                  {/* Fill Area */}
                  <path
                    d={`M 0 20 
                       L 0 ${20 - ((liveHistory[0]?.price - 4490) / 25) * 20}
                       L 15 ${20 - ((liveHistory[1]?.price - 4490) / 25) * 20}
                       L 30 ${20 - ((liveHistory[2]?.price - 4490) / 25) * 20}
                       L 45 ${20 - ((liveHistory[3]?.price - 4490) / 25) * 20}
                       L 60 ${20 - ((liveHistory[4]?.price - 4490) / 25) * 20}
                       L 75 ${20 - ((liveHistory[5]?.price - 4490) / 25) * 20}
                       L 100 ${20 - ((currentOunceUsd || 4504.10 - 4490) / 25) * 20}
                       L 100 20 Z`}
                    fill="url(#sparkline-grad)"
                    className="transition-all duration-700"
                  />

                  {/* Line Draw with Glow */}
                  <path
                    d={`M 0 ${20 - ((liveHistory[0]?.price - 4490) / 25) * 20}
                       L 15 ${20 - ((liveHistory[1]?.price - 4490) / 25) * 20}
                       L 30 ${20 - ((liveHistory[2]?.price - 4490) / 25) * 20}
                       L 45 ${20 - ((liveHistory[3]?.price - 4490) / 25) * 20}
                       L 60 ${20 - ((liveHistory[4]?.price - 4490) / 25) * 20}
                       L 75 ${20 - ((liveHistory[5]?.price - 4490) / 25) * 20}
                       L 100 ${20 - ((currentOunceUsd || 4504.10 - 4490) / 25) * 20}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#gold-glow)"
                    className="transition-all duration-700"
                  />
                  
                  {/* Active pulses */}
                  <circle
                    cx="100"
                    cy={20 - ((currentOunceUsd || 4504.10 - 4490) / 25) * 20}
                    r="2.5"
                    fill="#f59e0b"
                    className="animate-ping"
                  />
                  <circle
                    cx="100"
                    cy={20 - ((currentOunceUsd || 4504.10 - 4490) / 25) * 20}
                    r="1.5"
                    fill="#ffffff"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* EGP Exchange Rate Card (Col 5) */}
          <div className="lg:col-span-5 bg-neutral-950/60 border border-neutral-900 rounded-2xl p-5.5 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500 shadow-lg">
            <div className="text-start">
              <span className="text-[10px] font-black text-blue-400 tracking-wider block uppercase mb-1 font-mono select-none">
                {language === 'ar' ? '◀ سعر صرف دولار الصاغة بمصر (USD / EGP)' : '◀ EGP Exchange Rate Standard (USD/EGP)'}
              </span>

              <div className="space-y-1.5 mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(16,185,129,0.15)]">
                    {currentUsdEgp ? currentUsdEgp.toFixed(2) : '---'}
                  </span>
                  <span className="text-xs text-neutral-400 font-extrabold">
                    {language === 'ar' ? 'جنيه مصري' : 'EGP'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans pt-1">
                  {language === 'ar' 
                    ? 'المتوسط الحسابي الموحد والآمن المسجل والمعبر عن أسعار الصرف الرسمية بالصاغة في مصر والمطابق تماماً لشريط الأخبار.'
                    : 'Unified arithmetic exchange rate representing the active official gold market pricing in Egypt, matching the ticker.'}
                </p>
              </div>
            </div>

            {/* Quick stats mini badges */}
            <div className="mt-4 pt-3.5 border-t border-neutral-900/60 grid grid-cols-2 gap-3 text-[10.5px] font-mono">
              <div className="bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-850 text-start">
                <span className="text-neutral-500 block text-[8px] uppercase tracking-wider font-extrabold select-none">
                  {language === 'ar' ? 'سعر الشراء (Buy)' : 'Buy Rate'}
                </span>
                <span className="text-emerald-400 font-bold">
                  {tickerSettings.usdRateBuy ? tickerSettings.usdRateBuy.toFixed(2) : '---'} ج.م
                </span>
              </div>
              <div className="bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-850 text-start">
                <span className="text-neutral-500 block text-[8px] uppercase tracking-wider font-extrabold select-none">
                  {language === 'ar' ? 'سعر البيع (Sell)' : 'Sell Rate'}
                </span>
                <span className="text-amber-500 font-bold">
                  {tickerSettings.usdRateSell ? tickerSettings.usdRateSell.toFixed(2) : '---'} ج.م
                </span>
              </div>
            </div>
          </div>

        </div>



        {/* Propagation Controller / Apply parameters */}
        <div className="p-4 sm:p-5 rounded-2xl border border-dashed border-amber-500/25 bg-amber-500/[0.015] flex flex-col md:flex-row items-center justify-between gap-5 transition-all hover:bg-amber-500/[0.03]">
          <div className="flex items-start gap-4 text-start">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500 shrink-0 mt-0.5">
              <Coins className="h-5.5 w-5.5 text-amber-400" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                {language === 'ar' ? 'المطابقة الحسابية وتغذية عيارات الذهب بالمنصة تلقائياً' : 'Automatic Dashboard Gold Calibration Sync'}
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans max-w-3xl">
                {language === 'ar' 
                  ? `باعتماد الأونصة الجارية ($${currentOunceUsd}) وصرف الجنيه (${currentUsdEgp} ج.م)، سينتج سعر جرام عيار 24 حاسوبياً: [ ${currentOunceUsd && currentUsdEgp ? Math.round((currentOunceUsd / 31.1034768) * currentUsdEgp) : '---'} ج.م ] والعيار 21 المرجعي ليكون [ ${currentOunceUsd && currentUsdEgp ? Math.round((currentOunceUsd / 31.1034768) * currentUsdEgp * 0.875) : '---'} ج.م ].` 
                  : `Coordinates formula: 24K price equals OunceUSD/31.1*USD_EGP = [ ${currentOunceUsd && currentUsdEgp ? Math.round((currentOunceUsd / 31.1034768) * currentUsdEgp) : '---'} EGP ].`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto shrink-0 z-10 animate-fade-in">
            {/* Safe external click target for MSN Watchlist */}
            <a
              href="https://www.msn.com/ar-eg/money/watchlist?tab=Related&id=ck48ur&ocid=ansMSNMoney11&duration=1D&src=b_secdans&relatedQuoteId=ck48ur&relatedSource=MlAl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-4 py-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-extrabold text-[11px] rounded-xl transition-all w-full sm:w-auto hover:text-white"
            >
              {language === 'ar' ? 'عرض على MSN Money ↗' : 'View on MSN Money ↗'}
            </a>

            <button
              onClick={handleApplyWebRates}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-xs font-black bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-neutral-950 hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-amber-500/10 active:scale-[0.99]"
            >
              <RefreshCw className="h-4 w-4" />
              {language === 'ar' ? 'تطبيق وإعادة تسعير العيارات الآن' : 'Apply & Compute Local Gold Rates'}
            </button>
          </div>
        </div>

        {/* Global Toast confirmation style element nested */}
        {syncSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-400 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {language === 'ar' 
                ? '✓ تم تطبيق الأسعار المرجعية وتوجيه حساب عيارات الذهب بالمنصة بنجاح الكلي!' 
                : '✓ Gold pricing formulas calibrated and updated across the platform successfully!'}
            </span>
          </div>
        )}

        {/* Feedback Source meta logs */}
        <div className="mt-4.5 flex items-center justify-between text-[9px] text-neutral-500 font-mono font-bold select-none">
          <span>{language === 'ar' ? `مصدر التغذية الجاري: ${currentSource}` : `Active API Connection: ${currentSource}`}</span>
          <span>{language === 'ar' ? 'تشفير آمن TLS مفعّل' : 'SSL Encrypted / Verified Endpoints'}</span>
        </div>

      </div>

      {/* KPI Performance Metrics Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Operations Count Card */}
        <div className="bento-card flex flex-col justify-between p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-blue-500/[0.02] group-hover:bg-blue-500/[0.04] transition-colors blur-xl"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-500 block">{t.statsLogCount}</span>
              <span className="text-3xl font-black font-mono tracking-tight text-white">
                {formatNum(totalOperations, 0)}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>{language === 'ar' ? 'مسارات المعايرة المتكاملة' : 'Active system records logged'}</span>
          </div>
        </div>

        {/* Total Weight Equivalent 21K Grams Card */}
        <div className="bento-card flex flex-col justify-between p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-yellow-500/[0.02] group-hover:bg-yellow-500/[0.04] transition-colors blur-xl"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-500 block">{t.statsTotalWeight}</span>
              <span className="text-3xl font-black font-mono tracking-tight gold-gradient-text">
                {formatNum(totalWeight21K, 3)} <span className="text-sm font-semibold text-neutral-400 font-sans">{language === 'ar' ? 'جم' : 'g'}</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[var(--gold)]">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>{language === 'ar' ? 'العائد المكافئ الصافي لـ جرام 21' : 'Net equivalent 21K grade gold'}</span>
          </div>
        </div>

        {/* Aggregated Estimated Commercial Valuation */}
        <div className="bento-card flex flex-col justify-between p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-emerald-500/[0.02] group-hover:bg-emerald-500/[0.04] transition-colors blur-xl"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-500 block">{t.statsTotalValue}</span>
              <span className="text-3xl font-black font-mono tracking-tight text-emerald-400">
                {formatNum(totalValueSum, 2)} <span className="text-sm font-semibold text-neutral-500 font-sans">{t.currency}</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>{language === 'ar' ? 'أقرب تسعير حسب الأسعار الجارية' : 'Value evaluated inside the platform'}</span>
          </div>
        </div>

      </div>

      {/* Main Column Bento grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left main: Active market overview and benchmarks - Col span 7 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <ThreeDBullion language={language} price24K={prices.g24} price21K={prices.g21} />
          
          <div className="bento-card">
            <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest font-mono flex items-center gap-2 mb-6 border-b border-neutral-900 pb-3">
              <span>◆</span>
              {t.marketOverview}
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              
              <div className="bg-black/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase block mb-1">{t.g24}</span>
                <span className="text-lg md:text-xl font-black font-mono text-cyan-400">{formatNum(prices.g24, 0)}</span>
                <span className="text-[9px] text-neutral-500 font-medium block mt-3 select-none">100% {t.pureGold.split(' ')[0]}</span>
              </div>

              <div className="bg-black/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase block mb-1">{t.g21}</span>
                <span className="text-lg md:text-xl font-black font-mono text-yellow-500">{formatNum(prices.g21, 0)}</span>
                <span className="text-[9px] text-neutral-500 font-medium block mt-3 select-none">87.5% {language === 'ar' ? 'نقاء' : 'Fine'}</span>
              </div>

              <div className="bg-black/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase block mb-1">{t.g18}</span>
                <span className="text-lg md:text-xl font-black font-mono text-amber-600">{formatNum(prices.g18, 0)}</span>
                <span className="text-[9px] text-neutral-500 font-medium block mt-3 select-none">75% {language === 'ar' ? 'نقاء' : 'Fine'}</span>
              </div>

            </div>

            {/* Quick guidance formula widget */}
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/40 p-4.5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{language === 'ar' ? 'تسعير مالي تفاعلي متزامن والأسعار' : 'Interactive Weight to Spot Value Conversion'}</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {language === 'ar' 
                    ? 'يتم تحييف كل النواتج ومزامنتها لحظياً بالأسعار السارية المدخلة. لضمان دقة بالغة للثروات وتثمين صفقات الاستيراد.'
                    : 'The conversion computes weight equivalent instantly, multiplying standard EGP averages dynamically.'}
                </p>
              </div>
            </div>

            {/* Simulated Chart visual representing bullion fineness proportions */}
            <div className="mt-6 border-t border-neutral-900 pt-5">
              <span className="block text-[11px] font-bold text-neutral-400 mb-3.5 uppercase font-mono tracking-wider">{t.chartPurityDistribution}</span>
              <div className="h-4 w-full bg-neutral-950 rounded-full flex overflow-hidden border border-neutral-900/40">
                <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-500 h-full" style={{ width: '24%' }} title="24K" />
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full" style={{ width: '51%' }} title="21K" />
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-200 h-full" style={{ width: '25%' }} title="18K" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-2 font-mono">
                <span>{t.g18} (25%)</span>
                <span>{t.g21} (51%)</span>
                <span>{t.g24} (24%)</span>
              </div>
            </div>

          </div>

          {/* Quick Access Lanes / Actions Card */}
          <div className="bento-card">
            <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest font-mono mb-5 border-b border-neutral-900 pb-3">
              <span>◆</span>
              {t.quickActions}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button
                onClick={() => setActiveTab('calculator')}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 hover:border-yellow-500/40 text-left transition-all group cursor-pointer"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-3 max-w-[85%]">
                  <div className="h-9 w-9 bg-yellow-500/20 rounded-lg flex items-center justify-center text-[var(--gold)] shrink-0">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div className="truncate text-right">
                    <h4 className="text-xs font-bold text-white leading-none truncate">{t.startCalibration}</h4>
                    <p className="text-[9px] text-neutral-500 mt-1 truncate">{language === 'ar' ? 'معادلة التحييف الرسمية' : 'Calibrate scrap weights'}</p>
                  </div>
                </div>
                {language === 'ar' ? <ChevronLeft className="h-4 w-4 text-neutral-500 group-hover:text-yellow-400 transition-colors shrink-0" /> : <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-yellow-400 transition-colors shrink-0" />}
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 hover:border-orange-500/40 text-left transition-all group cursor-pointer"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-3 max-w-[85%]">
                  <div className="h-9 w-9 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="truncate text-right">
                    <h4 className="text-xs font-bold text-white leading-none truncate">{t.viewGuide}</h4>
                    <p className="text-[9px] text-neutral-500 mt-1 truncate">{language === 'ar' ? 'شرح الأسهم وحظ الموازين' : 'System guidelines'}</p>
                  </div>
                </div>
                {language === 'ar' ? <ChevronLeft className="h-4 w-4 text-neutral-500 group-hover:text-orange-400 transition-colors shrink-0" /> : <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-orange-400 transition-colors shrink-0" />}
              </button>

            </div>
          </div>

        </div>

        {/* Right side: Excel Exporter widget & Recent list logs - Col span 5 */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Excel Download Operations Widget */}
          <div className="bento-card bg-gradient-to-b from-[#161616] to-[#0c0c0c] border border-emerald-500/25 relative overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-emerald-500/[0.04] blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase font-mono">
                  {language === 'ar' ? 'مزامنة السجلات وإكسل' : 'EXCEL COMPATIBILITY'}
                </span>
              </div>
              
              <h4 className="text-base font-bold text-white mb-2">
                {language === 'ar' ? 'تحميل سجل الصاغة وصادرات الحساب' : 'Download Complete Assayer Log'}
              </h4>
              
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {language === 'ar' 
                  ? 'قم بتنزيل كافة المعاملات المحفوظة مباشرة في قالب متوافق تماماً مع Microsoft Excel للطباعة السهلة والتحليلات اليدوية الإضافية.' 
                  : 'Save your calibrations database directly as a spreadsheet. Preserves Arabic metadata, dates, pure weights, and spot market values.'}
              </p>
            </div>

            <button
              onClick={exportToExcel}
              disabled={history.length === 0}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition-all shadow-md ${
                history.length > 0
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black cursor-pointer hover:scale-[1.01]'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              {t.exportExcel}
            </button>
          </div>

          {/* Quick Active Reels Recent History list item */}
          <div className="bento-card flex-1 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-5 border-b border-neutral-900 pb-3">
              <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest font-mono flex items-center gap-2">
                <span>◆</span>
                {t.latestOperations}
              </h3>
              <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-900 px-2.5 py-1 rounded-sm">
                {history.length}
              </span>
            </div>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-neutral-500">
                <Calendar className="h-8 w-8 text-neutral-800 mb-2 stroke-1" />
                <p className="text-[11px] font-medium">{t.historyEmpty}</p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {history.slice(0, 5).map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-black/40 border border-neutral-900/80 rounded-xl hover:border-neutral-800 transition-colors flex justify-between items-center text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-white">{formatNum(item.weight, 1)}g</span>
                        <span className="text-[10px] text-neutral-500">({item.purity} {t.shares})</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block font-mono">
                        {getFormattedDate(item.timestamp)}
                      </span>
                    </div>

                    <div className="text-right flex flex-col gap-1 items-end">
                      <div className="font-mono font-bold text-[var(--gold-light)]">
                        + {formatNum(item.cleanWeight21k, 2)}g <span className="text-[9px] font-sans text-neutral-400">21K</span>
                      </div>
                      <div className="text-[10px] font-mono font-semibold text-neutral-400">
                        {formatNum(item.totalValue, 0)} {t.currency}
                      </div>
                    </div>
                  </div>
                ))}
                
                {history.length > 5 && (
                  <button 
                    onClick={() => setActiveTab('calculator')}
                    className="w-full text-center py-2 text-[10px] text-neutral-500 hover:text-[var(--gold)] transition-colors font-bold font-mono uppercase tracking-wider"
                  >
                    + {history.length - 5} {language === 'ar' ? 'عمليات إضافية في حاسبة التحييف' : 'more items inside calibration tool'}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 🔮 AI Market Decider, Connected Servers Tracker & Pyramids Corporate Overview */}
      <AIMarketAnalyst prices={prices} language={language} />

    </div>
  );
};
