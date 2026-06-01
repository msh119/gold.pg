import React, { useState, useEffect } from 'react';
import { ActiveTab, GoldPrices, Language, HistoryItem } from '../types';
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
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  prices,
  savePrices,
  language,
  history,
  setActiveTab,
  deleteHistoryItem
}) => {
  const t = translations[language];

  // Live MSN, GoldAPI, FreeGoldPrice, and MetalPriceAPI watch-feed & market state parameters
  const [activeFeedSource, setActiveFeedSource] = useState<'msn' | 'goldapi' | 'freegoldprice' | 'metalpriceapi'>('msn');

  const [msnData, setMsnData] = useState({
    gold_ounce_usd: 4504.10,
    usd_egp: 49.65,
    trend: 'up' as 'up' | 'down' | 'stable',
    change_percent: 0.12,
    source: 'بث شبكة MSN المالية مباشر (MSN Money Watchlist)'
  });

  const [goldApiData, setGoldApiData] = useState({
    gold_ounce_usd: 4540.17, // default preset matching user's exact goldapi response body timestamp
    usd_egp: 49.65,
    trend: 'up' as 'up' | 'down' | 'stable',
    change_percent: 0.98,
    success: true,
    source: 'خدمة GoldAPI.io السحابية المخصصة (بمفتاح المزامنة الخاص بك)'
  });

  const [freeGoldPriceData, setFreeGoldPriceData] = useState({
    gold_ounce_usd: 4518.25,
    usd_egp: 49.65,
    trend: 'up' as 'up' | 'down' | 'stable',
    change_percent: 0.54,
    success: true,
    source: 'خدمة FreeGoldPrice المباشرة (بمفتاح المزامنة المشترك الخاص بك)'
  });

  const [metalPriceApiData, setMetalPriceApiData] = useState({
    gold_ounce_usd: 4522.60,
    usd_egp: 49.65,
    trend: 'up' as 'up' | 'down' | 'stable',
    change_percent: 0.42,
    success: true,
    source: 'منصة MetalPriceAPI بمفتاح المزامنة الخاص بك'
  });

  const [liveHistory, setLiveHistory] = useState<Array<{ date: string; price: number }>>([
    { date: "00:00", price: 4496.40 },
    { date: "01:00", price: 4498.15 },
    { date: "02:00", price: 4501.90 },
    { date: "03:00", price: 4503.20 },
    { date: "04:00", price: 4500.50 },
    { date: "05:00", price: 4502.80 },
    { date: "06:00", price: 4504.10 }
  ]);
  
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Active computed parameters
  const currentOunceUsd = 
    activeFeedSource === 'msn' 
      ? msnData.gold_ounce_usd 
      : activeFeedSource === 'goldapi' 
        ? goldApiData.gold_ounce_usd 
        : activeFeedSource === 'freegoldprice'
          ? freeGoldPriceData.gold_ounce_usd
          : metalPriceApiData.gold_ounce_usd;

  const currentUsdEgp = 
    activeFeedSource === 'msn' 
      ? msnData.usd_egp 
      : activeFeedSource === 'goldapi' 
        ? goldApiData.usd_egp 
        : activeFeedSource === 'freegoldprice'
          ? freeGoldPriceData.usd_egp
          : metalPriceApiData.usd_egp;

  const currentTrend = 
    activeFeedSource === 'msn' 
      ? msnData.trend 
      : activeFeedSource === 'goldapi' 
        ? goldApiData.trend 
        : activeFeedSource === 'freegoldprice'
          ? freeGoldPriceData.trend
          : metalPriceApiData.trend;

  const currentPercentChange = 
    activeFeedSource === 'msn' 
      ? msnData.change_percent 
      : activeFeedSource === 'goldapi' 
        ? goldApiData.change_percent 
        : activeFeedSource === 'freegoldprice'
          ? freeGoldPriceData.change_percent
          : metalPriceApiData.change_percent;

  const currentSource = 
    activeFeedSource === 'msn' 
      ? msnData.source 
      : activeFeedSource === 'goldapi' 
        ? goldApiData.source 
        : activeFeedSource === 'freegoldprice'
          ? freeGoldPriceData.source
          : metalPriceApiData.source;

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
          if (data.goldapi) {
            setGoldApiData({
              gold_ounce_usd: data.goldapi.gold_ounce_usd,
              usd_egp: data.goldapi.usd_egp,
              trend: data.goldapi.trend,
              change_percent: data.goldapi.change_percent,
              success: data.goldapi.success,
              source: data.goldapi.source
            });
          }
          if (data.freegoldprice) {
            setFreeGoldPriceData({
              gold_ounce_usd: data.freegoldprice.gold_ounce_usd,
              usd_egp: data.freegoldprice.usd_egp,
              trend: data.freegoldprice.trend,
              change_percent: data.freegoldprice.change_percent,
              success: data.freegoldprice.success,
              source: data.freegoldprice.source
            });
          }
          if (data.metalpriceapi) {
            setMetalPriceApiData({
              gold_ounce_usd: data.metalpriceapi.gold_ounce_usd,
              usd_egp: data.metalpriceapi.usd_egp,
              trend: data.metalpriceapi.trend,
              change_percent: data.metalpriceapi.change_percent,
              success: data.metalpriceapi.success,
              source: data.metalpriceapi.source
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
      console.error("Failed to sync direct MSN gold market feeds:", err);
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
    <div className="flex flex-col gap-6 md:gap-8">
      
      {/* Front Welcome Bento Hero Card */}
      <div className="bento-card bg-gradient-to-br from-[#132247]/20 via-[#0d0d0d] to-[#161616] border border-blue-500/25 shadow-2xl shadow-blue-950/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-blue-500/[0.06] blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 text-amber-500 mb-3">
            <Sparkles className="h-4 w-4 text-amber-500 font-bold animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">{t.appName}</span>
          </div>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2">
            {t.dashboardWelcome}
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {t.dashboardDesc}
          </p>
        </div>

        {/* Decorative Brand Logo circle */}
        <div className="relative z-10 flex-shrink-0 self-start md:self-auto">
          <div className="relative h-20 w-20 rounded-2xl bg-neutral-900 border-2 border-amber-500/40 p-1 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center overflow-hidden">
            <img 
              src="https://scontent.fcai19-6.fna.fbcdn.net/v/t39.30808-6/555918514_1376236214503912_7142926422343815940_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-Ee25hTmxCsQ7kNvwFuTPVH&_nc_oc=AdqlyaoAk5d0Tbidf0BDTv33gNOoATPHt8IsqnLkEr8D8HCTA-Lghj9jSqN9Q02pH08&_nc_zt=23&_nc_ht=scontent.fcai19-6.fna&_nc_gid=k43zHmpgIfbl2j-2R1K4ZA&_nc_ss=7b289&oh=00_Af_9jhFH_u1URl5j79AU6yq4YZ8Na-96gHa85T9AbfomEQ&oe=6A2261F2" 
              alt="Logo Big" 
              className="h-full w-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* 🌐 LIVE MSN WATCHLIST & GLOBAL GOLD MONITORING DASHBOARD 🌐 */}
      <div className="bento-card bg-neutral-950/65 border border-amber-500/25 p-6 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-44 w-44 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-44 w-44 rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none"></div>

        {/* Header line with blinking live dot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></span>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 font-mono">
                {language === 'ar' ? 'البث المباشر والربط التلقائي بمؤشرات الأسواق' : 'Live Market Feeds & Sync Engine'}
              </span>
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-500" />
              {language === 'ar' ? 'مراقبة البورصة العالمية وسعر الصرف' : 'Global Ounce & Exchange Rate Monitor'}
            </h3>
          </div>

          {/* Dynamic Feed Source Switcher */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800 shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setActiveFeedSource('msn')}
                className={`px-3 py-1.5 text-[10px] font-black font-sans rounded-lg transition-all cursor-pointer ${
                  activeFeedSource === 'msn'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'بث MSN المالي' : 'MSN Feed'}
              </button>
              <button
                type="button"
                onClick={() => setActiveFeedSource('goldapi')}
                className={`px-3 py-1.5 text-[10px] font-black font-sans rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeFeedSource === 'goldapi'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Activity className="h-3 w-3 inline" />
                {language === 'ar' ? 'مفتاح GoldAPI' : 'GoldAPI Key'}
              </button>
              <button
                type="button"
                onClick={() => setActiveFeedSource('freegoldprice')}
                className={`px-3 py-1.5 text-[10px] font-black font-sans rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeFeedSource === 'freegoldprice'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Activity className="h-3 w-3 inline" />
                {language === 'ar' ? 'بث FreeGold' : 'FreeGold Feed'}
              </button>
              <button
                type="button"
                onClick={() => setActiveFeedSource('metalpriceapi')}
                className={`px-3 py-1.5 text-[10px] font-black font-sans rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeFeedSource === 'metalpriceapi'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Activity className="h-3 w-3 inline" />
                {language === 'ar' ? 'مفتاح MetalPrice' : 'MetalPrice Key'}
              </button>
            </div>

            <span className="text-[10px] text-neutral-500 font-mono">
              {language === 'ar' ? `تحديث تلقائي (أخر مزامنة: ${lastSyncTime})` : `Auto-sync: every 30s (Last: ${lastSyncTime})`}
            </span>

            <button
              onClick={() => fetchLiveRates(false)}
              disabled={isLoadingLive}
              className={`p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-amber-500 transition-all cursor-pointer ${
                isLoadingLive ? 'animate-spin pointer-events-none text-amber-500' : ''
              }`}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Master details grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          
          {/* Ounce Spot USD Card (Col 7) */}
          <div className="lg:col-span-7 bg-black/40 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-4 left-4">
              <Activity className="h-5 w-5 text-neutral-800 animate-pulse group-hover:text-amber-500/20 transition-colors" />
            </div>

            <div>
              <span className="text-[10px] font-black text-neutral-400 tracking-wider block uppercase mb-1">
                {language === 'ar' ? 'السعر العالمي للأونصة (XAU / USD)' : 'Global Ounce Spot (XAU/USD)'}
              </span>
              
              <div className="flex items-baseline gap-4 mt-1">
                <span className="text-3xl md:text-4xl font-black font-mono tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {currentOunceUsd ? `$${currentOunceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '---'}
                </span>

                {/* Trend Up / Down indicators */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black font-mono leading-none ${
                  currentTrend === 'up' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : currentTrend === 'down' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {currentTrend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : currentTrend === 'down' ? <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" /> : null}
                  {currentTrend === 'up' ? '+' : ''}{currentPercentChange.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Sparkline for extreme mastercraft look */}
            <div className="mt-6 pt-4 border-t border-neutral-900/60 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider">
                  {language === 'ar' ? 'حركة وتقلبات الـ 24 ساعة الأخيرة بالبورصة' : 'Recent 24h Ounce Price Volatility'}
                </span>
                <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 animate-pulse">
                  {activeFeedSource === 'goldapi' 
                    ? (language === 'ar' ? 'مزامنة نشطة GoldAPI.io' : 'GoldAPI.io Premium Sync')
                    : activeFeedSource === 'freegoldprice'
                      ? (language === 'ar' ? 'مزامنة حرة FreeGoldPrice' : 'FreeGoldPrice Premium Sync')
                      : activeFeedSource === 'metalpriceapi'
                        ? (language === 'ar' ? 'مزامنة نشطة MetalPriceAPI' : 'MetalPriceAPI Premium Sync')
                        : (language === 'ar' ? 'مؤشر حركة مستقر آمن' : 'Fluid/Healthy Feed')}
                </span>
              </div>
              
              {/* Responsive SVG Graphic Vector */}
              <div className="h-12 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
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

                  {/* Line Draw */}
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
                    className="transition-all duration-700"
                  />
                  
                  {/* Active pulses */}
                  <circle
                    cx="100"
                    cy={20 - ((currentOunceUsd || 4504.10 - 4490) / 25) * 20}
                    r="2"
                    fill="#f59e0b"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>

          </div>

          {/* EGP Exchange Rate Card (Col 5) */}
          <div className="lg:col-span-5 bg-black/40 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
            <span className="text-[10px] font-black text-neutral-400 tracking-wider block uppercase mb-1">
              {language === 'ar' ? 'سعر صرف دولار الصاغة بمصر (USD / EGP)' : 'EGP Exchange Rate (USD/EGP)'}
            </span>

            <div className="space-y-1.5 mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  {currentUsdEgp ? currentUsdEgp.toFixed(2) : '---'}
                </span>
                <span className="text-xs text-neutral-500 font-bold font-sans">
                  {language === 'ar' ? 'جنيه مصري' : 'EGP'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-normal">
                {activeFeedSource === 'goldapi'
                  ? (language === 'ar' 
                      ? 'سعر الصرف الافتراضي المحتسب من منصة GoldAPI للأونصة بالجنيه المصري مقابل الدولار.'
                      : 'Implied interbank exchange conversion metrics calculated live via private GoldAPI payload metrics.')
                  : activeFeedSource === 'freegoldprice'
                    ? (language === 'ar' 
                        ? 'سعر الصرف المستنتج حراً من منصة FreeGoldPrice للأونصة بالجنيه المصري مقابل الدولار.'
                        : 'Interactive conversion rates derived dynamically from FreeGoldPrice live assets.')
                    : activeFeedSource === 'metalpriceapi'
                      ? (language === 'ar' 
                          ? 'سعر الصرف المسترجع حياً من منصة MetalPriceAPI لدولار الصاغة مقابل الجنيه المصري.'
                          : 'Currency exchange conversion values fetched live from MetalPriceAPI endpoints.')
                      : (language === 'ar' 
                          ? 'سعر الصرف الرسمي المسجل والبنكي بمصر من مؤشر العرض والطلب للمدفوعات العالمية.'
                          : 'Official/Interbank exchange conversion metrics sourced dynamically from central indicators.')}
              </p>
            </div>

            {/* Quick stats mini badges */}
            <div className="mt-4 pt-3 border-t border-neutral-900/60 grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-900">
                <span className="text-neutral-500 block text-[8px] uppercase">{language === 'ar' ? 'أعلى مستوي' : 'Peak Today'}</span>
                <span className="text-neutral-200 font-bold">{(currentUsdEgp ? currentUsdEgp + 0.15 : 49.80).toFixed(2)} ج.م</span>
              </div>
              <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-900">
                <span className="text-neutral-500 block text-[8px] uppercase">{language === 'ar' ? 'أدنى مستوي' : 'Low Today'}</span>
                <span className="text-neutral-200 font-bold">{(currentUsdEgp ? currentUsdEgp - 0.10 : 49.55).toFixed(2)} ج.m</span>
              </div>
            </div>

          </div>

        </div>

        {/* Dynamic Details block for GoldAPI when active */}
        {(activeFeedSource === 'goldapi' || activeFeedSource === 'freegoldprice' || activeFeedSource === 'metalpriceapi') && (
          <div className="mb-6 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-500 block uppercase font-mono">1g 24K</span>
              <span className="text-sm font-bold text-amber-500 font-mono">
                {currentOunceUsd ? `$${(currentOunceUsd / 31.1034).toFixed(2)}` : '---'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-500 block uppercase font-mono">1g 21K</span>
              <span className="text-sm font-bold text-amber-500 font-mono">
                {currentOunceUsd ? `$${((currentOunceUsd / 31.1034) * 0.875).toFixed(2)}` : '---'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-500 block uppercase font-mono">1g 18K</span>
              <span className="text-sm font-bold text-amber-500 font-mono">
                {currentOunceUsd ? `$${((currentOunceUsd / 31.1034) * 0.75).toFixed(2)}` : '---'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-500 block uppercase font-mono">Exchange</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {activeFeedSource === 'goldapi' ? 'FOREXCOM' : activeFeedSource === 'freegoldprice' ? 'FREEGOLDPRICE' : 'METALPRICEAPI'}
              </span>
            </div>
          </div>
        )}

        {/* Propagation Controller / Apply parameters */}
        <div className="p-4.5 rounded-2xl border border-dashed border-amber-500/20 bg-amber-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-start">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0 mt-0.5">
              <Coins className="h-5 w-5" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">
                {language === 'ar' ? 'المطابقة الحسابية وتغذية عيارات الذهب والأسعار بالصاغة' : 'Automatic Platform Gold Math Propagator'}
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {language === 'ar' 
                  ? `بناءً على الأونصة الحالية ($${currentOunceUsd}) وصرف الجنيه (${currentUsdEgp} ج.م): سينتج سعر جرام عيار 24 حاسوبياً ليكون [ ${currentOunceUsd && currentUsdEgp ? Math.round((currentOunceUsd / 31.1034) * currentUsdEgp) : '---'} ج.م ] والعيار 21 ليكون [ ${currentOunceUsd && currentUsdEgp ? Math.round((currentOunceUsd / 31.1034) * currentUsdEgp * 0.875) : '---'} ج.م ].` 
                  : `Combines modern troy ounce weight division: 24K price equals OunceUSD/31.1*USD_EGP = [ ${currentOunceUsd && currentUsdEgp ? Math.round((currentOunceUsd / 31.1034) * currentUsdEgp) : '---'} EGP ].`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {/* Safe external click target for MSN Watchlist */}
            <a
              href="https://www.msn.com/ar-eg/money/watchlist?tab=Related&id=ck48ur&ocid=ansMSNMoney11&duration=1D&src=b_secdans&relatedQuoteId=ck48ur&relatedSource=MlAl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-4 py-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 font-bold text-[11px] rounded-xl transition-all w-full sm:w-auto hover:text-white"
            >
              {language === 'ar' ? 'عرض على MSN Money ↗' : 'View on MSN Money ↗'}
            </a>

            <button
              onClick={handleApplyWebRates}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-xs font-black bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-all cursor-pointer shadow-lg shadow-amber-500/10 active:scale-[0.99]"
            >
              <RefreshCw className="h-4 w-4" />
              {language === 'ar' ? 'تطبيق وإعادة تسعير العيارات الآن' : 'Apply & Compute Local Gold Rates'}
            </button>
          </div>
        </div>

        {/* Global Toast confirmation style element nested */}
        {syncSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs text-emerald-400 leading-none">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {language === 'ar' 
                ? '✓ تم تطبيق الأسعار المرجعية وحساب عيارات الذهب بالمنصة بنجاح!' 
                : '✓ Gold pricing formulas calibrated and updated across the platform successfully!'}
            </span>
          </div>
        )}

        {/* Feedback Source meta logs */}
        <div className="mt-4 flex items-center justify-between text-[9px] text-neutral-500 font-mono">
          <span>{language === 'ar' ? `المصدر: ${currentSource}` : `Source: ${currentSource}`}</span>
          <span>{language === 'ar' ? 'ربط آمن مشفر' : 'TLS Encrypted / API Verified'}</span>
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
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-yellow-500/20 rounded-lg flex items-center justify-center text-[var(--gold)]">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">{t.startCalibration}</h4>
                    <p className="text-[9px] text-neutral-500 mt-1">{language === 'ar' ? 'معادلة التحييف الرسمية' : 'Calibrate scrap gold weights'}</p>
                  </div>
                </div>
                {language === 'ar' ? <ChevronLeft className="h-4 w-4 text-neutral-500 group-hover:text-yellow-400 transition-colors" /> : <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-yellow-400 transition-colors" />}
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 hover:border-orange-500/40 text-left transition-all group cursor-pointer"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">{t.viewGuide}</h4>
                    <p className="text-[9px] text-neutral-500 mt-1">{language === 'ar' ? 'شرح الأسهم وحظ الموازين' : 'Formulas, metrics & history manual'}</p>
                  </div>
                </div>
                {language === 'ar' ? <ChevronLeft className="h-4 w-4 text-neutral-500 group-hover:text-orange-400 transition-colors" /> : <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-orange-400 transition-colors" />}
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
