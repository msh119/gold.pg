import React, { useState, useEffect } from 'react';
import { GoldPrices, Language, HistoryItem } from '../types';
import { translations } from '../utils/translations';
import { 
  Scale, 
  Trash2, 
  Save, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Calculator as CalcIcon, 
  HelpCircle,
  TrendingUp,
  History,
  RotateCcw,
  Download,
  FileSpreadsheet,
  Coins,
  Cpu,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
interface CalculatorProps {
  prices: GoldPrices;
  language: Language;
  history: HistoryItem[];
  saveHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  prices,
  language,
  history,
  saveHistoryItem,
  clearHistory,
  deleteHistoryItem
}) => {
  const t = translations[language];

  // Mode selection:
  // 'shishangi' - original caliber weight and purity calculator
  // 'usd_ounce' - professional gold price in USD by entering the Ounce price
  // 'egp_exchange' - calculate gold price in EGP based on the USD exchange rate and local making charges
  const [calcMode, setCalcMode] = useState<'shishangi' | 'usd_ounce' | 'egp_exchange'>('shishangi');

  // Mode 1 State (Existing)
  const [weight, setWeight] = useState<string>('');
  const [purity, setPurity] = useState<string>('875'); // Default is 21K (875 shares)

  // Mode 2 State (USD gold price via international ounce price)
  const [usdOuncePrice, setUsdOuncePrice] = useState<string>('2935.80');
  const [usdGramWeight, setUsdGramWeight] = useState<string>('10');
  const [usdCarat, setUsdCarat] = useState<number>(21); // default to 21K

  // Mode 3 State (Local EGP price based on dollar exchange rate + making charges)
  const [egpOuncePrice, setEgpOuncePrice] = useState<string>('2935.80');
  const [egpExchangeRate, setEgpExchangeRate] = useState<string>('49.65');
  const [egpGramWeight, setEgpGramWeight] = useState<string>('10');
  const [egpCarat, setEgpCarat] = useState<number>(21);
  const [makingCharges, setMakingCharges] = useState<string>('150'); // standard handcraft + stamp charge per gram in EGP

  const [isFormulaExpanded, setIsFormulaExpanded] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // 🧮 Unified virtual keyboard focused field tracker
  const [activeKeypadField, setActiveKeypadField] = useState<string>('weight');

  // Synchronize on startup to load active metal price and exchange rate if possible
  useEffect(() => {
    fetch('/api/live-rates')
      .then(res => res.json())
      .then(data => {
        let ounce = 2935.80;
        let rate = 49.65;
        if (data.metalpriceapi?.success) {
          ounce = data.metalpriceapi.gold_ounce_usd;
          rate = data.metalpriceapi.usd_egp;
        } else if (data.goldapi?.success) {
          ounce = data.goldapi.gold_ounce_usd;
          rate = data.goldapi.usd_egp;
        } else if (data.freegoldprice?.success) {
          ounce = data.freegoldprice.gold_ounce_usd;
          rate = data.freegoldprice.usd_egp;
        } else if (data.msn?.success) {
          ounce = data.msn.gold_ounce_usd;
          rate = data.msn.usd_egp;
        } else if (data.gold_ounce_usd) {
          ounce = data.gold_ounce_usd;
          rate = data.usd_egp;
        }

        // Apply fallback standard if they look too low or high
        if (ounce > 500 && ounce < 10000) {
          setUsdOuncePrice(ounce.toFixed(2));
          setEgpOuncePrice(ounce.toFixed(2));
        }
        if (rate > 10 && rate < 150) {
          setEgpExchangeRate(rate.toFixed(2));
        }
      })
      .catch(err => console.log('Silent live-rates sync error in Calculator:', err));
  }, []);

  const handleKeypadPress = (key: string) => {
    const applyToState = (setter: React.Dispatch<React.SetStateAction<string>>, currentVal: string, isPurityCheck = false) => {
      if (key === '⌫') {
        setter(prev => prev ? prev.slice(0, -1) : '');
      } else if (key === 'C') {
        setter('');
      } else if (key === '.') {
        setter(prev => prev.includes('.') ? prev : (prev === '' ? '0.' : prev + '.'));
      } else {
        setter(prev => {
          const val = prev + key;
          if (isPurityCheck && parseFloat(val) > 1000) return prev;
          if (/^[0-9]*\.?[0-9]*$/.test(val)) {
            return val;
          }
          return prev;
        });
      }
    };

    if (activeKeypadField === 'weight') {
      applyToState(setWeight, weight);
    } else if (activeKeypadField === 'purity') {
      applyToState(setPurity, purity, true);
    } else if (activeKeypadField === 'usdOuncePrice') {
      applyToState(setUsdOuncePrice, usdOuncePrice);
    } else if (activeKeypadField === 'usdGramWeight') {
      applyToState(setUsdGramWeight, usdGramWeight);
    } else if (activeKeypadField === 'egpOuncePrice') {
      applyToState(setEgpOuncePrice, egpOuncePrice);
    } else if (activeKeypadField === 'egpExchangeRate') {
      applyToState(setEgpExchangeRate, egpExchangeRate);
    } else if (activeKeypadField === 'egpGramWeight') {
      applyToState(setEgpGramWeight, egpGramWeight);
    } else if (activeKeypadField === 'makingCharges') {
      applyToState(setMakingCharges, makingCharges);
    }
  };

  // Switch fields logically when switching tabs
  const handleSwitchTab = (mode: 'shishangi' | 'usd_ounce' | 'egp_exchange') => {
    setCalcMode(mode);
    if (mode === 'shishangi') {
      setActiveKeypadField('weight');
    } else if (mode === 'usd_ounce') {
      setActiveKeypadField('usdGramWeight');
    } else if (mode === 'egp_exchange') {
      setActiveKeypadField('egpGramWeight');
    }
  };

  // Math variables
  // Mode 1: Shishangi
  const parsedWeight = parseFloat(weight) || 0;
  const parsedPurity = parseFloat(purity) || 0;
  const equivalentWeight21K = parsedWeight > 0 && parsedPurity > 0 
    ? (parsedWeight * parsedPurity) / 875 
    : 0;
  const activeGramPrice = (parsedPurity / 875) * prices.g21;
  const netGoldValue = equivalentWeight21K * prices.g21;
  const grandTotal = netGoldValue;

  // Mode 2: USD Ounce
  const parsedUsdOunce = parseFloat(usdOuncePrice) || 0;
  const parsedUsdGramWeight = parseFloat(usdGramWeight) || 0;
  const ounceAlternativeGram = 31.1034768; // standard troy ounce weight
  const g24PriceUsd = parsedUsdOunce > 0 ? (parsedUsdOunce / ounceAlternativeGram) : 0;
  const activeCaratPriceUsd = g24PriceUsd * (usdCarat / 24);
  const usdTotalValue = activeCaratPriceUsd * parsedUsdGramWeight;

  // Mode 3: Local EGP exchange and making charges
  const parsedEgpOuncePrice = parseFloat(egpOuncePrice) || 0;
  const parsedEgpExchangeRate = parseFloat(egpExchangeRate) || 0;
  const parsedEgpGramWeight = parseFloat(egpGramWeight) || 0;
  const parsedMakingCharges = parseFloat(makingCharges) || 0;
  const g24PriceEgp = parsedEgpOuncePrice > 0 ? ((parsedEgpOuncePrice / ounceAlternativeGram) * parsedEgpExchangeRate) : 0;
  const activeCaratPriceEgpBeforePremium = g24PriceEgp * (egpCarat / 24);
  const totalBaseGoldValueEgp = activeCaratPriceEgpBeforePremium * parsedEgpGramWeight;
  const totalMakingChargesEgp = parsedMakingCharges * parsedEgpGramWeight;
  const egpGrandTotal = totalBaseGoldValueEgp + totalMakingChargesEgp;

  // Unified button validations
  const isMode1Valid = parsedWeight > 0 && parsedPurity > 0 && parsedPurity <= 1000;
  const isMode2Valid = parsedUsdOunce > 0 && parsedUsdGramWeight > 0;
  const isMode3Valid = parsedEgpOuncePrice > 0 && parsedEgpExchangeRate >= 0 && parsedEgpGramWeight > 0;

  const isValid = calcMode === 'shishangi' 
    ? isMode1Valid 
    : calcMode === 'usd_ounce' 
      ? isMode2Valid 
      : isMode3Valid;

  const handleExportToExcel = () => {
    if (history.length === 0) return;

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

    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pyramids_Gold_Calculations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToHistory = () => {
    if (!isValid) {
      setNotification(t.invalidInputs);
      return;
    }

    if (calcMode === 'shishangi') {
      saveHistoryItem({
        weight: parsedWeight,
        purity: parsedPurity,
        cleanWeight21k: equivalentWeight21K,
        pricePerGram21k: prices.g21,
        totalValue: grandTotal,
      });
    } else if (calcMode === 'usd_ounce') {
      const equiv21k = (parsedUsdGramWeight * usdCarat) / 21;
      const egpEquivalent = usdTotalValue * 49.65; // standard conversion helper for uniform EGP logs
      saveHistoryItem({
        weight: parsedUsdGramWeight,
        purity: (usdCarat / 24) * 1000,
        cleanWeight21k: equiv21k,
        pricePerGram21k: prices.g21,
        totalValue: egpEquivalent,
      });
    } else if (calcMode === 'egp_exchange') {
      const equiv21k = (parsedEgpGramWeight * egpCarat) / 21;
      saveHistoryItem({
        weight: parsedEgpGramWeight,
        purity: (egpCarat / 24) * 1000,
        cleanWeight21k: equiv21k,
        pricePerGram21k: prices.g21,
        totalValue: egpGrandTotal,
      });
    }

    setNotification(t.historySavedSuccess);
  };

  const handleClearFields = () => {
    if (calcMode === 'shishangi') {
      setWeight('');
      setPurity('875');
    } else if (calcMode === 'usd_ounce') {
      setUsdGramWeight('');
    } else if (calcMode === 'egp_exchange') {
      setEgpGramWeight('');
      setMakingCharges('150');
    }
  };

  // Dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const getFormattedDate = (isoString: string) => {
    const d = new Date(isoString);
    if (language === 'ar') {
      return d.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      
      {/* Upper Welcome Hero Card as a Premium Bento Cell */}
      <div className="bento-card bg-gradient-to-br from-[#251f12]/40 via-[#0d0d0d] to-[#161616] border border-amber-500/20 shadow-2xl shadow-amber-950/10">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-amber-500/[0.04] blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-3">
              <Scale className="h-5 w-5" />
              <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">{t.appName}</span>
            </div>
            <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2">
              {language === 'ar' ? 'حاسبة الذهب الذكية والمحترفة' : 'Smart & Professional Gold Calculator'}
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {language === 'ar' 
                ? 'مجموعة متكاملة من أدوات التسعير اليومي: حاسبة عيار الشيشنجي بالسهم، حاسبة الأونصة العالمية بالدولار، وحاسبة السعر بالجنيه شاملة المصنعية وفرق صرف العملة.' 
                : 'All-in-one professional gold suite: Shishangi shares calibration, dynamic USD Ounce spot converter, and instant localized EGP calculator with making charges.'}
            </p>
          </div>
          <div className="bg-black/60 px-5 py-3.5 rounded-2xl border border-neutral-800 text-center shrink-0">
            <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-wider mb-1">{language === 'ar' ? 'سعر جرام عيار 21 اليوم' : 'Today 21K Price'}</span>
            <span className="text-xl font-black text-amber-400 font-mono">{formatNumber(prices.g21, 0)} {t.currency}</span>
          </div>
        </div>
      </div>

      {/* Calculator Tab Switcher Bar */}
      <div className="grid grid-cols-3 bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800 gap-2">
        <button
          type="button"
          onClick={() => handleSwitchTab('shishangi')}
          className={`py-3 px-2 text-[10px] sm:text-xs font-black rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
            calcMode === 'shishangi'
              ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
          }`}
        >
          <Scale className="h-4 w-4 shrink-0" />
          <span>{language === 'ar' ? 'معاير الشيشنجي (سهم)' : 'Shishangi Carat'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('usd_ounce')}
          className={`py-3 px-2 text-[10px] sm:text-xs font-black rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
            calcMode === 'usd_ounce'
              ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
          }`}
        >
          <Coins className="h-4 w-4 shrink-0" />
          <span>{language === 'ar' ? 'حاسبة الذهب بالدولار ($)' : 'USD Price ($/Ounce)'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('egp_exchange')}
          className={`py-3 px-2 text-[10px] sm:text-xs font-black rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
            calcMode === 'egp_exchange'
              ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
          }`}
        >
          <Receipt className="h-4 w-4 shrink-0" />
          <span>{language === 'ar' ? 'حاسبة الجنيه وصرف الدولار' : 'Local EGP & Making'}</span>
        </button>
      </div>

      {/* Main Bento Grid: Left column for Inputs, Right column for dynamic calibration values */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Controls Cell - Column Span 7 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bento-card border border-neutral-800 bg-[#0e0f12] shadow-2xl relative overflow-hidden p-6 rounded-3xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/[0.015] rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 border-b border-neutral-900 pb-4 relative z-10">
              <h3 className="text-sm font-bold text-amber-500 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                {calcMode === 'shishangi' && (language === 'ar' ? 'عيار الشيشنجي والوزن' : 'Weight & Caliber Specifications')}
                {calcMode === 'usd_ounce' && (language === 'ar' ? 'سعر الأونصة والجرام بالدولار' : 'USD Ounce Price & Weight')}
                {calcMode === 'egp_exchange' && (language === 'ar' ? 'صرف مالي ومصنعية محددة' : 'Exchange Rate, Ounce & Making Cost')}
              </h3>
              <button 
                onClick={handleClearFields}
                className="text-xs text-neutral-500 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t.clear}
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              
              {/* === MODE 1: SHISHANGI INPUTS === */}
              {calcMode === 'shishangi' && (
                <>
                  {/* Weight Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {language === 'ar' ? 'الوزن الإجمالي بالجرام:' : 'Gross Weight (Grams):'} <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder={t.weightPlaceholder}
                        value={weight}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                            setWeight(val);
                          }
                        }}
                        className="w-full bg-black/60 border border-neutral-800 rounded-2xl px-5 py-4 text-2xl font-black text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      <div className={`absolute inset-y-0 flex items-center px-5 text-xs font-black text-neutral-500 ${language === 'ar' ? 'left-0 border-r border-neutral-850' : 'right-0 border-l border-neutral-850'}`}>
                        {language === 'ar' ? 'جرام [g]' : 'Gram [g]'}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {[0.1, 1, 5, 10, 50, 100].map((addAmount) => (
                        <button
                          key={addAmount}
                          type="button"
                          onClick={() => {
                            const currentVal = parseFloat(weight) || 0;
                            setWeight((currentVal + addAmount).toFixed(1).replace(/\.0$/, ''));
                          }}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                          +{addAmount}g
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Purity / Caliber Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        {language === 'ar' ? 'عيار الشيشنجي (بالأسهم):' : 'Shishangi Caliber (Shares):'} <span className="text-amber-500">*</span>
                      </label>
                      <span className="text-[10px] text-neutral-500 font-normal">{t.purityHelper}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder={t.purityPlaceholder}
                        value={purity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                            if (val === '' || parseFloat(val) <= 1000) {
                              setPurity(val);
                            }
                          }
                        }}
                        className="w-full bg-black/60 border border-neutral-800 rounded-2xl px-5 py-4 text-2xl font-black text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      <div className={`absolute inset-y-0 flex items-center px-4 text-xs font-bold text-neutral-500 ${language === 'ar' ? 'left-0 border-r border-neutral-850' : 'right-0 border-l border-neutral-850'}`}>
                        {t.shares}
                      </div>
                    </div>

                    {/* Caliber shares presets used widely in Egypt */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {[875, 750, 1000, 916, 583].map((sharePreset) => (
                        <button
                          key={sharePreset}
                          type="button"
                          onClick={() => setPurity(sharePreset.toString())}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black border transition-all cursor-pointer ${
                            purity === sharePreset.toString()
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                              : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          {sharePreset} {language === 'ar' ? 'سهم' : 'sh'} ({sharePreset === 875 ? '21K' : sharePreset === 750 ? '18K' : sharePreset === 1000 ? '24K' : sharePreset === 916 ? '22K' : '14K'})
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* === MODE 2: USD OUNCE INPUTS === */}
              {calcMode === 'usd_ounce' && (
                <>
                  {/* Ounce Price Input in USD */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {language === 'ar' ? 'سعر الأونصة العالمي بالدولار الأمريكي ($):' : 'International USD Ounce Price ($):'} <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={usdOuncePrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                            setUsdOuncePrice(val);
                          }
                        }}
                        className="w-full bg-black/60 border border-neutral-800 rounded-2xl px-5 py-4 text-2xl font-black text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
                        dir="ltr"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center px-5 text-xs font-black text-neutral-500 border-l border-neutral-850">
                        USD / $
                      </div>
                    </div>

                    {/* Quick Ounce Presets */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[2500, 2700, 2900, 3000, 3110, 3200, 4520].map((pricePreset) => (
                        <button
                          key={pricePreset}
                          type="button"
                          onClick={() => {
                            setUsdOuncePrice(pricePreset.toString());
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-black bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                          ${pricePreset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight in Grams Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {language === 'ar' ? 'الوزن المراد تسعيره بالجرام (g):' : 'Target Gold Weight (Grams):'} <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="أدخل الوزن بالجرام..."
                        value={usdGramWeight}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                            setUsdGramWeight(val);
                          }
                        }}
                        className="w-full bg-black/60 border border-neutral-800 rounded-2xl px-5 py-4 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      <div className={`absolute inset-y-0 flex items-center px-4 text-xs font-bold text-neutral-500 ${language === 'ar' ? 'left-0 border-r border-neutral-850' : 'right-0 border-l border-neutral-850'}`}>
                        {language === 'ar' ? 'جرام [g]' : 'Gram [g]'}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[1, 5, 10, 21, 50, 100].map((gAdd) => (
                        <button
                          key={gAdd}
                          type="button"
                          onClick={() => {
                            const cur = parseFloat(usdGramWeight) || 0;
                            setUsdGramWeight((cur + gAdd).toFixed(1).replace(/\.0$/, ''));
                          }}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-neutral-300 transition-all cursor-pointer"
                        >
                          +{gAdd}g
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Carat Picker Grade */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {language === 'ar' ? 'اختر عيار الذهب المطلوب:' : 'Select Gold Carat Grade:'}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[24, 22, 21, 18, 14, 10].map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setUsdCarat(k)}
                          className={`py-2.5 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                            usdCarat === k
                              ? 'bg-amber-500 border-amber-400 text-neutral-950 font-black shadow-lg shadow-amber-500/10'
                              : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          {k}K <span className="text-[9px] block opacity-80" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {k === 24 ? '1000س' : k === 22 ? '916س' : k === 21 ? '875س' : k === 18 ? '750س' : k === 14 ? '583س' : '416س'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* === MODE 3: LOCAL EGP EXCHANGE & PREMIUM INPUTS === */}
              {calcMode === 'egp_exchange' && (
                <>
                  {/* Row showing Ounce Price and Exchange rate side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Ounce Price Input in USD */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        {language === 'ar' ? 'سعر الأونصة بالدولار ($):' : 'USD Ounce Price ($):'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={egpOuncePrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                              setEgpOuncePrice(val);
                            }
                          }}
                          className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* USD/EGP Exchange Rate */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        {language === 'ar' ? 'سعر صرف الدولار (ج.م):' : 'USD/EGP Exchange Rate:'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={egpExchangeRate}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                              setEgpExchangeRate(val);
                            }
                          }}
                          className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-base font-bold text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Row showing Quick exchange presets */}
                  <div className="flex flex-wrap gap-1.5 bg-neutral-950 p-2.5 rounded-xl border border-neutral-900 items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {language === 'ar' ? 'صرف مالي سريع:' : 'Quick Rate:'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[48.00, 49.00, 49.65, 50.00, 51.00].map((ratePreset) => (
                        <button
                          key={ratePreset}
                          type="button"
                          onClick={() => {
                            setEgpExchangeRate(ratePreset.toFixed(2));
                          }}
                          className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                          {ratePreset.toFixed(2)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight in Grams Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {language === 'ar' ? 'الوزن بالجرام (g):' : 'Weight (Grams):'} <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={egpGramWeight}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                            setEgpGramWeight(val);
                          }
                        }}
                        className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all font-mono"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>

                  {/* Making charges per gram */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        {language === 'ar' ? 'المصنعية والدمغة والضريبة للجرام (ج.م):' : 'Making & Stamp Fees per Gram (EGP):'}
                      </label>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {(language === 'ar' ? 'تضاف لسعر الجرام' : 'Added to gram spot')}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={makingCharges}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*/.test(val)) {
                            setMakingCharges(val);
                          }
                        }}
                        className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-base font-bold text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all font-mono"
                        dir="ltr"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 text-xs font-bold text-neutral-500 border-l border-neutral-850">
                        {language === 'ar' ? 'ج.م / جرام' : 'L.E / g'}
                      </div>
                    </div>

                    {/* Quick premium presets widely used in Egyptian jewelry stores */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[50, 100, 150, 200, 250, 300].map((presetFee) => (
                        <button
                          key={presetFee}
                          type="button"
                          onClick={() => {
                            setMakingCharges(presetFee.toString());
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white transition-all cursor-pointer"
                        >
                          +{presetFee} ج.م
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Carat Selector for EGP Invoice */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {language === 'ar' ? 'اختر العيار للذهب المصري:' : 'Select Egyptian Gold Carat Grade:'}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[24, 22, 21, 18].map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setEgpCarat(k)}
                          className={`py-2.5 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                            egpCarat === k
                              ? 'bg-amber-500 border-amber-400 text-neutral-950 font-black'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {k}K
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Golden Collapsible Reference */}
          <div className="bento-card p-4">
            <button
              onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-neutral-400 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-500" />
                {t.explainFormula}
              </span>
              {isFormulaExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            <AnimatePresence>
              {isFormulaExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-neutral-900 mt-4 pt-4"
                >
                  <div className="text-xs text-neutral-400 space-y-3 leading-relaxed">
                    <p className="font-bold text-neutral-300">{t.formulaUsed}</p>
                    
                    {calcMode === 'shishangi' && (
                      <>
                        <div className="rounded-lg bg-black p-3.5 font-mono text-center text-amber-400 border border-neutral-900 block my-2" style={{ direction: 'ltr' }}>
                          21K Weight = (Weight * Purity Shares) / 875
                        </div>
                        <ul className="list-disc list-inside space-y-1 bg-neutral-950/30 p-3 rounded-lg border border-neutral-900/40">
                          <li>{language === 'ar' ? 'يتم تحويل أي عيار بالسهم أولاً ليعادل عيار 21 عن طريق النسبة لـ 875 سهم.' : 'All shares are standardized against baseline 21K grade (875 denominator).'}</li>
                          <li>{language === 'ar' ? 'إجمالي القيمة المالية بالعملة المحلية = الوزن المكافئ 21ك × سعر جرام عيار 21.' : 'Net financial output = Calibrated weight * Active 21K gram price.'}</li>
                        </ul>
                      </>
                    )}

                    {calcMode === 'usd_ounce' && (
                      <>
                        <div className="rounded-lg bg-black p-3.5 font-mono text-center text-amber-400 border border-neutral-900 block my-2" style={{ direction: 'ltr' }}>
                          Gram 24K USD = Ounce Price / 31.1034768
                          <br />
                          Gram SelectedK USD = Gram 24K * (Carat / 24)
                        </div>
                        <ul className="list-disc list-inside space-y-1 bg-neutral-950/30 p-3 rounded-lg border border-neutral-900/40">
                          <li>{language === 'ar' ? 'الأونصة أو الأوقية في أسواق الذهب تزن عالميا 31.1034768 جرام من الذهب عيار 24 الصافي.' : 'One standard Troy Ounce of gold weighs exactly 31.1034768 grams under 24 Karat purity.'}</li>
                          <li>{language === 'ar' ? 'يتم حساب ثمن جرام العيار المختار بخصم نسبة نقائه من ثمن عيار 24.' : 'Selected caliber price is factored proportionally by dividing the Karat value by 24.'}</li>
                        </ul>
                      </>
                    )}

                    {calcMode === 'egp_exchange' && (
                      <>
                        <div className="rounded-lg bg-black p-3.5 font-mono text-center text-amber-400 border border-neutral-900 block my-2" style={{ direction: 'ltr' }}>
                          Base Gram EGP = (Ounce USD / 31.1034768 * Exchange Rate) * (Carat / 24)
                          <br />
                          Total EGP = (Base Gram EGP + Making Charges) * Weight
                        </div>
                        <ul className="list-disc list-inside space-y-1 bg-neutral-950/30 p-3 rounded-lg border border-neutral-900/40">
                          <li>{language === 'ar' ? 'هذه هي المعادلة المعتمدة في أسواق الصاغة لوزن المشغولات مع احتساب التكاليف بالجنيه المصري.' : 'This mimics commercial boutique invoicing by applying raw weight multiplied by the composite gold spot plus handcraft premium.'}</li>
                          <li>{language === 'ar' ? 'المصنعية والدمج هما قيم ثابتة لكل جرام وتختلف بين الورش وتعتمد تماماً على فئة تشغيل الذهب.' : 'Making charges include stamping taxes and craft premiums varying depending on boutique workshops.'}</li>
                        </ul>
                      </>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Calibration Output - Column Span 5 */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          <div className="bento-card border border-amber-500/40 bg-[#06070a] bg-gradient-to-b from-[#0a0d14] via-[#050608] to-[#010204] flex flex-col justify-between h-full min-h-[500px] relative overflow-hidden p-6 rounded-3xl shadow-2xl transition-all duration-300 hover:border-amber-400/50">
            {/* Elegant luxury gold background glows */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-56 w-56 rounded-full bg-gradient-to-br from-amber-500/10 to-yellow-500/0 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-56 w-56 rounded-full bg-gradient-to-tr from-emerald-500/5 to-cyan-500/0 blur-3xl pointer-events-none"></div>
            
            {/* Subtle high-tech scanner grid line overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.2)_50%),_linear-gradient(90deg,_rgba(245,158,11,0.02),_rgba(16,185,129,0.01),_rgba(59,130,246,0.02))] bg-[size:100%_4px,_8px_100%] opacity-25 pointer-events-none" />

            <div>
              {/* Screen Top Status Interface & Chrono Badge */}
              <div className="flex items-center justify-between mb-5 border-b border-neutral-900 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-wider text-amber-400 font-mono uppercase leading-tight">
                      {language === 'ar' ? 'صاغة بيراميدز - بث حي الموازين' : 'PYRAMIDS REAL-TIME BULLION'}
                    </span>
                    <span className="text-[8px] text-neutral-500 font-mono tracking-widest uppercase">
                      {language === 'ar' ? 'معاير البورصة المصرية ومصلحة الموازين' : 'ASSAY DIRECTIVE EG/UK'}
                    </span>
                  </div>
                </div>
                {isValid ? (
                  <div className="flex items-center gap-1.5 font-mono text-[9px] font-black text-[#00ffcc] bg-[#00ffcc]/5 px-2.5 py-1 rounded-lg border border-[#00ffcc]/20 tracking-wide uppercase shadow-sm">
                    <span className="h-1 w-1 rounded-full bg-[#00ffcc] animate-pulse"></span>
                    {language === 'ar' ? 'ميزان معتمد' : 'VERIFIED STABLE'}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-amber-500/80 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/15 uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60 animate-ping"></span>
                    {language === 'ar' ? 'جاري الوزن...' : 'WEIGHING BASE'}
                  </div>
                )}
              </div>

              {/* PROFESSIONAL GOLD SCALE SCREEN DISPLAY */}
              <div className="bg-[#020304] border border-neutral-900 rounded-[22px] p-5 relative overflow-hidden shadow-2xl flex flex-col gap-6">
                {/* Embedded decorative grid coordinates and chassis line labels of high-end scales */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#c5a880]/5 to-transparent rounded-full border border-[#c5a880]/10 pointer-events-none" />
                <div className="absolute top-2 left-3 font-mono text-[8px] text-neutral-600 tracking-wider pointer-events-none uppercase">
                  PT-999 // SCALE ID: fce79bf4
                </div>
                <div className="absolute top-2 right-3 font-mono text-[8px] text-neutral-600 tracking-wider pointer-events-none uppercase">
                  TEMP: 24.1 °C
                </div>
                
                {/* 1. Scale Weights & Purity Grid (الوزن والميزان) */}
                <div className="grid grid-cols-2 gap-4 mt-1.5">
                  
                  {/* Gross Physical Weight */}
                  <div className="bg-gradient-to-b from-[#06080d] to-[#030406] p-4 rounded-xl border border-neutral-900 flex flex-col relative justify-between min-h-[105px] overflow-hidden group shadow-md">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-amber-600" />
                    <div>
                      <span className="text-[10px] font-semibold text-neutral-450 uppercase tracking-widest block font-mono">
                        {language === 'ar' ? 'الوزن القائم الكلي' : 'TOTAL GROSS WEIGHT'}
                      </span>
                      <span className="text-[8px] text-neutral-600 font-mono tracking-widest block -mt-0.5">
                        {language === 'ar' ? '[مؤشر الكتلة الفعلية]' : '[REALTIME BULK MASS]'}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-baseline gap-1.5 justify-between">
                      <span className="text-3xl font-black font-mono text-[#fcd34d] tracking-tight drop-shadow-[0_2px_12px_rgba(245,158,11,0.2)]">
                        {calcMode === 'shishangi' && formatNumber(parsedWeight, 2)}
                        {calcMode === 'usd_ounce' && formatNumber(parsedUsdGramWeight, 2)}
                        {calcMode === 'egp_exchange' && formatNumber(parsedEgpGramWeight, 2)}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono font-black uppercase tracking-wider bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-850">g</span>
                    </div>
                    
                    {/* Level LEDs */}
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-neutral-950/80 rounded-full overflow-hidden p-[2px] border border-neutral-900">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-700 ease-out"
                          style={{ 
                            width: `${Math.min(
                              ((calcMode === 'shishangi' ? parsedWeight : calcMode === 'usd_ounce' ? parsedUsdGramWeight : parsedEgpGramWeight) / 200) * 100, 
                              100
                            )}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[7px] font-mono text-neutral-500 mt-1 uppercase px-0.5">
                        <span>Min</span>
                        <div className="flex gap-1">
                          <span className={`w-1 h-1 rounded-full ${parsedWeight || parsedUsdGramWeight || parsedEgpGramWeight ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-800'}`}></span>
                          <span>{language === 'ar' ? 'نشط' : 'active'}</span>
                        </div>
                        <span>Max (200g)</span>
                      </div>
                    </div>
                  </div>

                  {/* Shishangi Purity Input / Carat */}
                  <div className="bg-gradient-to-b from-[#06080d] to-[#030406] p-4 rounded-xl border border-neutral-900 flex flex-col relative justify-between min-h-[105px] overflow-hidden group shadow-md">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                    <div>
                      <span className="text-[10px] font-semibold text-neutral-450 uppercase tracking-widest block font-mono">
                        {language === 'ar' ? 'العيار المستهدف والدمغة' : 'TARGET CARAT // CALIBER'}
                      </span>
                      <span className="text-[8px] text-neutral-600 font-mono tracking-widest block -mt-0.5">
                        {language === 'ar' ? '[درجة نقاوة السهم]' : '[SHARES STANDARD VALUE]'}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-baseline gap-1.5 justify-between">
                      <span className="text-3xl font-black font-mono text-[#60a5fa] tracking-tight drop-shadow-[0_2px_12px_rgba(59,130,246,0.2)]">
                        {calcMode === 'shishangi' && `${formatNumber(parsedPurity, 1).replace(/\.0$/, '')}`}
                        {calcMode === 'usd_ounce' && `${usdCarat}`}
                        {calcMode === 'egp_exchange' && `${egpCarat}`}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono font-black uppercase tracking-wider bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-850">
                        {calcMode === 'shishangi' ? 'س' : 'K'}
                      </span>
                    </div>

                    {/* Level LEDs */}
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-neutral-950/80 rounded-full overflow-hidden p-[2px] border border-neutral-900">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 via-sky-450 to-[#00ffcc] rounded-full transition-all duration-700 ease-out" 
                          style={{ 
                            width: `${
                              calcMode === 'shishangi' 
                                ? (parsedPurity / 1000) * 100 
                                : calcMode === 'usd_ounce' 
                                  ? (usdCarat / 24) * 100 
                                  : (egpCarat / 24) * 100
                            }%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[7px] font-mono text-neutral-500 mt-1 uppercase px-0.5">
                        <span>P-000</span>
                        <span>{language === 'ar' ? 'المعاير المستهدف' : 'caliber match'}</span>
                        <span>P-1000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* === MODE 1 OUTPUTS: SHISHANGI DETAILS === */}
                {calcMode === 'shishangi' && (
                  <>
                    {/* Simulated scale leveling bubble & holographic sensor widget */}
                    <div className="bg-[#050609] border border-neutral-850 p-4 rounded-xl flex flex-col gap-3 relative shadow-inner overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.015] rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-450 uppercase font-black tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          {language === 'ar' ? 'مؤشر توازن عيار الميزان وبؤرة المعايرة التناظرية:' : 'ANALOG SCALE BALANCE BEAM ASSAYER:'}
                        </span>
                        <span className={`${isValid ? 'text-[#00ffcc] font-black underline decoration-emerald-500/30' : 'text-neutral-600'}`}>
                          {isValid ? 'VERIFIED' : 'CAL_FLOW'}
                        </span>
                      </div>
                      
                      {/* Advanced dynamic balance beam interface */}
                      <div className="flex items-center justify-between gap-1.5 h-7 px-2 bg-neutral-950 rounded-lg border border-neutral-900 shadow-inner">
                        {/* Left Side (Under-valued Carat beam) */}
                        <div className="w-1/2 flex justify-end gap-[3px]">
                          {Array.from({ length: 11 }).map((_, i) => {
                            const active = isValid && parsedPurity < 875 && (10 - i) < Math.floor((1 - parsedPurity/875) * 11);
                            return (
                              <div 
                                key={`L-${i}`} 
                                className={`w-[4px] h-4 rounded-[1px] transition-all duration-300 ${
                                  active 
                                    ? 'bg-gradient-to-t from-red-600 to-amber-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                                    : 'bg-neutral-900/60'
                                }`}
                              />
                            );
                          })}
                        </div>
                        
                        {/* Level Target Reticle bubble */}
                        <div className={`h-5.5 w-5.5 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                          isValid ? 'border-[#00ffcc] bg-[#00ffcc]/10 shadow-[0_0_12px_rgba(0,255,204,0.3)]' : 'border-neutral-800 bg-neutral-900'
                        }`}>
                          <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 flex items-center justify-center ${
                            isValid ? 'bg-[#00ffcc]' : 'bg-neutral-700'
                          }`}>
                            <div className="h-1 w-1 rounded-full bg-white animate-ping" />
                          </div>
                        </div>
                        
                        {/* Right Side (Over-valued Carat beam) */}
                        <div className="w-1/2 flex justify-start gap-[3px]">
                          {Array.from({ length: 11 }).map((_, i) => {
                            const active = isValid && parsedPurity >= 875 && i < Math.floor(((parsedPurity - 875)/125) * 11);
                            return (
                              <div 
                                key={`R-${i}`} 
                                className={`w-[4px] h-4 rounded-[1px] transition-all duration-300 ${
                                  active 
                                    ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                                    : 'bg-neutral-900/60'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Diagnostic telemetry text footer */}
                      <div className="flex justify-between items-center text-[8px] font-mono text-neutral-500 uppercase px-0.5">
                        <span>Purity &lt; 21K baseline</span>
                        <span>[ center target 875 shares calibrated ]</span>
                        <span>Purity &gt;= 21K baseline</span>
                      </div>
                    </div>

                    {/* Gold Calibrated Equivalent Weight Card (الوزن بعد التحييف) */}
                    <div className="bg-[#0b0c10] bg-gradient-to-br from-[#0c0f15] to-[#04060a] p-4.5 rounded-xl border border-amber-500/25 flex items-center justify-between relative overflow-hidden shadow-inner group">
                      <div className="absolute top-0 right-0 w-16 h-1 w-full bg-gradient-to-r from-amber-500/20 to-yellow-300/10 pointer-events-none" />
                      <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-neutral-200 font-bold block uppercase tracking-wider">
                            {language === 'ar' ? 'الوزن المعادل لعيار 21 (الجرام الطبيعي):' : 'Equivalent 21K Weight (875 Shares):'}
                          </span>
                          {/* Miniature official stamp badge style */}
                          <span className="text-[7px] px-1 py-[1px] bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-black tracking-widest font-mono">
                            {language === 'ar' ? 'مصلحة الدمغة' : 'SA-875'}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 block leading-tight">
                          {language === 'ar' ? '* وزن عيار 21 الشرعي الصافي المكافئ للذهب الفعلي' : '* Normalized gram equivalence based at 21K gold standard'}
                        </span>
                      </div>
                      <div className="text-right relative z-10">
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className="text-3xl font-black font-mono text-[#f59e0b] tracking-tight drop-shadow-[0_2px_12px_rgba(245,158,11,0.25)]">
                            {formatNumber(equivalentWeight21K, 3)}
                          </span>
                          <span className="text-xs text-amber-500 font-black uppercase">g</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono tracking-wider">
                          {language === 'ar' ? `معدل التحييف والدمج: ${formatNumber(parsedPurity / 875, 4)}` : `Assay Multiply Factor: ${formatNumber(parsedPurity / 875, 4)}`}
                        </span>
                      </div>
                    </div>

                    {/* Telegram pricing specs */}
                    <div className="space-y-2 border-t border-neutral-900 pt-3 text-xs font-mono">
                      <div className="flex justify-between items-center text-neutral-450">
                        <span>{language === 'ar' ? 'سعر جرام 21 البورصة اليوم:' : 'Official 21K Spot Price:'}</span>
                        <span className="font-bold text-neutral-200">{formatNumber(prices.g21, 0)} {t.currency}</span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-450">
                        <span>{language === 'ar' ? 'سعر ثمن العيار المستهدف الفعلي للجرام:' : 'Target caliber price per gram:'}</span>
                        <span className="font-black text-[#00ffcc] text-sm">{formatNumber(activeGramPrice, 2)} {t.currency}/g</span>
                      </div>
                    </div>
                  </>
                )}

                {/* === MODE 2 OUTPUTS: USD OUNCE DETAILS === */}
                {calcMode === 'usd_ounce' && (
                  <>
                    <div className="bg-black/50 border border-neutral-900 p-3.5 rounded-xl flex flex-col gap-2.5 text-xs font-mono">
                      <div className="flex justify-between items-center text-[10px] text-neutral-450 font-black uppercase tracking-wider">
                        <span>{language === 'ar' ? 'ثمن جرام الذهب الصافي والعيارات بالدولار ($)' : 'USD GOLD RATE INDEX'}</span>
                        <span className="text-[8px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-1 py-[1.5px] rounded">
                          ▲ LIVE
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <div className="bg-[#050608] py-2.5 px-2 rounded-lg border border-neutral-850 flex flex-col items-center shadow-sm">
                          <span className="text-[9px] text-neutral-500 block font-bold uppercase tracking-wider">24K ($/g)</span>
                          <span className="text-xs font-black font-mono text-yellow-500 mt-1">${formatNumber(g24PriceUsd, 2)}</span>
                          <span className="text-[7px] text-neutral-600 font-mono mt-0.5">1 pure g</span>
                        </div>
                        <div className="bg-[#050608] py-2.5 px-2 rounded-lg border border-neutral-850 flex flex-col items-center shadow-sm">
                          <span className="text-[9px] text-neutral-500 block font-bold uppercase tracking-wider">21K ($/g)</span>
                          <span className="text-xs font-black font-mono text-amber-500 mt-1">${formatNumber(g24PriceUsd * 21/24, 2)}</span>
                          <span className="text-[7px] text-neutral-600 font-mono mt-0.5">21/24 standard</span>
                        </div>
                        <div className="bg-[#050608] py-2.5 px-2 rounded-lg border border-neutral-850 flex flex-col items-center shadow-sm">
                          <span className="text-[9px] text-neutral-500 block font-bold uppercase tracking-wider">18K ($/g)</span>
                          <span className="text-xs font-black font-mono text-amber-600 mt-1">${formatNumber(g24PriceUsd * 18/24, 2)}</span>
                          <span className="text-[7px] text-neutral-600 font-mono mt-0.5">18/24 boutique</span>
                        </div>
                      </div>
                    </div>

                    {/* Price structure per chosen grade */}
                    <div className="bg-[#0e0a05] bg-gradient-to-r from-[#0c0906] to-[#040302] p-4 rounded-xl border border-amber-500/20 flex items-center justify-between text-xs font-mono shadow-inner">
                      <div className="space-y-1">
                        <span className="text-[10px] text-amber-500 block font-black uppercase tracking-wider">{language === 'ar' ? 'سعر عيار الذهب المختار بالتفصيل:' : 'SELECTED CALIBER VALUE USD:'}</span>
                        <span className="text-xs text-neutral-450 font-bold block">{usdCarat} Karat Rate</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black font-mono text-[#00ffcc] drop-shadow-[0_2px_10px_rgba(0,255,204,0.2)]">${formatNumber(activeCaratPriceUsd, 2)}</span>
                        <span className="text-[10px] text-neutral-550 block font-mono">USD/g</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-neutral-900 pt-3 text-xs font-mono">
                      <div className="flex justify-between items-center text-neutral-450">
                        <span>{language === 'ar' ? 'قيمة الأوقية الحرة (الأونصة):' : 'Ounce Spot Rate:'}</span>
                        <span className="text-neutral-200 font-bold">${formatNumber(parsedUsdOunce, 2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-450">
                        <span>{language === 'ar' ? 'الوزن المعاير للقطعة بالجرام:' : 'Piece Gross Weight:'}</span>
                        <span className="text-neutral-200 font-bold font-mono">{formatNumber(parsedUsdGramWeight, 3)} g</span>
                      </div>
                    </div>
                  </>
                )}

                {/* === MODE 3 OUTPUTS: LOCAL EGP DETAILS === */}
                {calcMode === 'egp_exchange' && (
                  <>
                    <div className="bg-black/50 border border-neutral-900 p-3.5 rounded-xl flex flex-col gap-2.5 text-xs font-mono">
                      <span className="text-[10px] text-neutral-450 block font-black uppercase tracking-wider mb-1">{language === 'ar' ? 'مؤشر أسعار الصاغة الأساسي بالجنيه (ج.م):' : 'LOCAL EGP SPOT COMPARATOR'}</span>
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="bg-gradient-to-b from-[#080b0f] to-[#040608] p-3 rounded-xl border border-neutral-850 flex items-center justify-between shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-neutral-500 uppercase tracking-wider font-bold">{language === 'ar' ? 'عيار 24 صافي:' : '24K Spot/g:'}</span>
                            <span className="font-bold text-neutral-200 font-mono mt-0.5">{formatNumber(g24PriceEgp, 0)} ج.م</span>
                          </div>
                          <span className="text-[8px] px-1 py-[2px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/15 rounded">Ref</span>
                        </div>
                        <div className="bg-gradient-to-b from-[#080b0f] to-[#040608] p-3 rounded-xl border border-neutral-850 flex items-center justify-between shadow-sm">
                          <div className="flex flex-col flex-1">
                            <span className="text-[8px] text-neutral-500 uppercase tracking-wider font-bold">{language === 'ar' ? 'سعر الجرام خام:' : 'Karat base/g:'}</span>
                            <span className="font-bold text-amber-500 font-mono mt-0.5">{formatNumber(activeCaratPriceEgpBeforePremium, 0)} ج.م</span>
                          </div>
                          <span className="text-[8px] px-1 py-[2px] bg-amber-500/10 text-amber-500 border border-amber-500/15 rounded">Base</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Components Breakdown */}
                    <div className="space-y-2 bg-[#090b10] p-4.5 rounded-xl border border-neutral-850 text-xs font-mono divide-y divide-neutral-900/60 shadow-inner">
                      <div className="flex justify-between items-center pb-2.5 text-neutral-400">
                        <span>{language === 'ar' ? 'سعر جرام الذهب خالص قبل المصنعية:' : 'Raw Gold Price / g:'}</span>
                        <span className="font-mono">{formatNumber(activeCaratPriceEgpBeforePremium, 2)} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 text-neutral-400">
                        <span className="flex items-center gap-1">
                          {language === 'ar' ? 'تكاليف المصنعية والدمغة وهالك الفاقد:' : 'Stamp & Making charges / g:'}
                          <span className="text-[8px] px-1 py-[0.5px] bg-neutral-900 text-neutral-500 border border-neutral-800 rounded">FIXED</span>
                        </span>
                        <span className="text-amber-500 font-bold font-mono">+{formatNumber(parsedMakingCharges, 0)} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 text-[#00ffcc] font-black">
                        <span>{language === 'ar' ? 'سعر تشغيل الجرام الكلي بالمصنعية:' : 'Total retail price / g:'}</span>
                        <span className="text-sm font-mono drop-shadow-[0_2px_10px_rgba(0,255,204,0.15)]">{formatNumber(activeCaratPriceEgpBeforePremium + parsedMakingCharges, 2)} ج.م</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[10px] text-neutral-500 font-mono px-1">
                      <div className="flex justify-between items-center">
                        <span>{language === 'ar' ? 'قيمة خام الذهب الكلية بدون تصنيع:' : 'Raw metal subtotal:'}</span>
                        <span className="font-bold text-neutral-350">{formatNumber(totalBaseGoldValueEgp, 2)} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === 'ar' ? 'إجمالي رسوم ودمغات تشغيل الصاغة:' : 'Aggregate making fees:'}</span>
                        <span className="font-bold text-neutral-350">{formatNumber(totalMakingChargesEgp, 2)} ج.م</span>
                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* GRAND FINAL VALUE SCREEN (السعر الاجمالي الفاخر بوهج ذهبي ودمغة مصلحة الصاغة) */}
              <div className="mt-6 bg-gradient-to-r from-[#1b140a] via-[#0d0a06] to-[#040302] border border-amber-500/35 p-5 rounded-2xl relative shadow-xl overflow-hidden group transition-all duration-300 hover:border-amber-500/50">
                {/* Elegant geometric radial gold vector lines in background */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-24 h-24 border border-amber-500/10 rounded-full flex items-center justify-center rotate-45 pointer-events-none">
                  <div className="w-20 h-20 border border-amber-500/5 rounded-full" />
                </div>
                
                {/* Decorative secure seal details in top corner */}
                <div className="absolute top-3 right-4 flex items-center gap-1 font-mono text-[8px] text-[#00ffcc] bg-[#00ffcc]/5 border border-[#00ffcc]/15 px-2 py-0.5 rounded-full select-none uppercase tracking-widest font-bold">
                  <span className="w-1 h-1 rounded-full bg-[#00ffcc]"></span>
                  <span>ASSAY PASSED</span>
                </div>

                <span className="block text-xs font-black text-amber-500 mb-2.5 uppercase tracking-wider font-mono">
                  {calcMode === 'shishangi' && (language === 'ar' ? '◀ صافي القيمة الإجمالية للذهب :' : '◀ GRAND TOTAL GOLD VALUATION :')}
                  {calcMode === 'usd_ounce' && (language === 'ar' ? '◀ صافي القيمة العالمية بالدولار الأمريكي :' : '◀ CONVERTED USD VALUATION :')}
                  {calcMode === 'egp_exchange' && (language === 'ar' ? '◀ الفاتورة الإجمالية شاملة المصنعية والدمغة :' : '◀ GRAND EGP INVOICE TOTAL :')}
                </span>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-baseline gap-1.5 flex-wrap sm:flex-nowrap min-h-[45px]">
                    {calcMode === 'usd_ounce' && (
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#00ffcc] font-mono mr-1 drop-shadow-[0_2px_10px_rgba(0,255,204,0.25)]">$</span>
                    )}
                    <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#f59e0b] drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)] select-all selection:bg-amber-500/30">
                      {calcMode === 'shishangi' && formatNumber(grandTotal, 2)}
                      {calcMode === 'usd_ounce' && formatNumber(usdTotalValue, 2)}
                      {calcMode === 'egp_exchange' && formatNumber(egpGrandTotal, 2)}
                    </span>
                    <span className="text-xs font-black text-amber-500/90 uppercase tracking-widest font-mono ml-2 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 shadow-sm">
                      {calcMode === 'shishangi' && t.currency}
                      {calcMode === 'usd_ounce' && 'USD'}
                      {calcMode === 'egp_exchange' && t.currency}
                    </span>
                  </div>
                  
                  {/* Interactive weight/price info tag - perfectly proportioned */}
                  <div className="text-start sm:text-right flex flex-col font-mono text-neutral-400 bg-neutral-950/60 p-2 sm:px-3 sm:py-2 rounded-xl border border-neutral-900/80 shadow-md font-bold shrink-0">
                    <span className="text-[9px] uppercase font-black text-neutral-500 tracking-wider">
                      {calcMode === 'shishangi' ? (language === 'ar' ? 'مكافئ عيار 21' : '21K EQUIV') : (language === 'ar' ? 'إجمالي وزن الميزان' : 'NET GOLD WEIGHT')}
                    </span>
                    <span className="text-xs font-black text-amber-500 mt-0.5">
                      {calcMode === 'shishangi' && `${formatNumber(equivalentWeight21K, 2)}g × ${formatNumber(prices.g21, 0)}`}
                      {calcMode === 'usd_ounce' && `${formatNumber(parsedUsdGramWeight, 2)}g × $${formatNumber(activeCaratPriceUsd, 2)}`}
                      {calcMode === 'egp_exchange' && `${formatNumber(parsedEgpGramWeight, 2)}g × ${formatNumber(activeCaratPriceEgpBeforePremium + parsedMakingCharges, 0)}`}
                    </span>
                  </div>
                </div>

                {/* Secure Trading compliance tag */}
                <div className="mt-4.5 flex items-start gap-2.5 text-[10px] text-neutral-300 bg-black/85 p-3.5 rounded-xl border border-neutral-900/80 shadow-md">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {calcMode === 'shishangi' && (
                      language === 'ar' 
                        ? 'تم احتساب هذا الوزن بعد معادلة ومعايرة نسبة النقاوة (الشيشنة) إلى عيار ٢١ بسوق الصاغة بمعدل سهم ٨٧٥ والأسعار الحية.' 
                        : 'Computed in accordance with professional Pyramids Assay standardizing weight using 21K baseline at 875 denominators.'
                    )}
                    {calcMode === 'usd_ounce' && (
                      language === 'ar'
                        ? 'تحتوي أوقية الميزان (الأونصة) على 31.1035 جرام لعيار 24 صافي. الحساب لحظي بناء على العيار والأسعار العالمية.'
                        : 'Troy ounces standardized at 31.1035g for refined 24K pure gold. Pricing scales use real-time international spot rate.'
                    )}
                    {calcMode === 'egp_exchange' && (
                      language === 'ar'
                        ? 'المعادلة تعتمد على تسعير الصاغة اليوم بتحويل الأونصة بالدولار بسعر الصرف المالي، وتضمين تكاليف المصنعية والدمغة للجرام.'
                        : 'Calculated using today\'s gold boutique formula: Ounce USD converted via active exchange rate, adding standard making/stamp premiums.'
                    )}
                  </span>
                </div>
              </div>

            </div>

            {/* Commit Log Execution Controls */}
            <div className="mt-6 pt-4 border-t border-neutral-900 flex gap-3">
              <button
                onClick={handleSaveToHistory}
                disabled={!isValid}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black uppercase tracking-wider transition-all border ${
                  isValid
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-[#c5a880] text-[#0d0d0d] hover:from-amber-400 hover:to-amber-500 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] cursor-pointer font-black'
                    : 'bg-neutral-900/60 border-neutral-850 text-neutral-650 cursor-not-allowed font-bold'
                }`}
              >
                <Save className="h-4.5 w-4.5" />
                {t.saveToHistory}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Notifications overlay (Toast warning/success inside layout) */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className={`rounded-xl px-4 py-3.5 text-xs font-bold shadow-lg flex items-center gap-2 max-w-sm self-center text-center ${
              notification.includes('الرجاء') || notification.includes('valid')
                ? 'bg-rose-950/90 border border-rose-800 text-rose-200'
                : 'bg-emerald-950/90 border border-emerald-800 text-emerald-200'
            }`}
          >
            <Info className="h-4.5 w-4.5 shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calibration History Logs Section as a Bento card */}
      <div className="bento-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-blue-400 tracking-widest uppercase flex items-center gap-2">
            <span>◆</span>
            {t.historyTitle}
          </h3>
          {history.length > 0 && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportToExcel}
                className="text-xs text-emerald-500 hover:text-emerald-400 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {t.exportExcel}
              </button>
              <div className="h-3.5 w-px bg-neutral-800 hidden sm:block"></div>
              <button
                onClick={clearHistory}
                className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                {t.clearHistory}
              </button>
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl bg-black/20">
            <Scale className="h-10 w-10 text-neutral-800 mb-3 stroke-1" />
            <p className="text-xs font-medium">{t.historyEmpty}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-850 bg-black">
            <table className="w-full text-xs text-neutral-300 min-w-[620px] border-collapse" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-neutral-950 border-b border-neutral-900 text-neutral-400 text-right">
                  <th className="px-5 py-3.5 text-start font-semibold">{t.date}</th>
                  <th className="px-5 py-3.5 font-semibold text-center">{t.rawWeight}</th>
                  <th className="px-5 py-3.5 font-semibold text-center">{t.purity}</th>
                  <th className="px-5 py-3.5 text-center font-semibold">{t.equivalentWeight} (21k)</th>
                  <th className="px-5 py-3.5 font-semibold text-center">{t.pricePerGram} 21k</th>
                  <th className="px-5 py-3.5 text-end font-semibold">{t.financialValue}</th>
                  <th className="px-5 py-3.5 text-center font-semibold w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-950">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-900/10 transition-colors">
                    <td className="px-5 py-4 text-start font-medium text-neutral-400">{getFormattedDate(item.timestamp)}</td>
                    <td className="px-5 py-4 font-mono font-medium text-neutral-200 text-center">{formatNumber(item.weight, 2)}g</td>
                    <td className="px-5 py-4 font-mono text-neutral-400 text-center">{formatNumber(item.purity, 1)} {t.shares}</td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-[var(--gold)]">{formatNumber(item.cleanWeight21k, 3)}g</td>
                    <td className="px-5 py-4 font-mono text-neutral-400 text-center">{formatNumber(item.pricePerGram21k, 0)} {t.currency}</td>
                    <td className="px-5 py-4 text-end font-mono font-extrabold text-[var(--gold-light)]">{formatNumber(item.totalValue, 2)} {t.currency}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-neutral-600 hover:text-rose-500 transition-colors rounded p-1 hover:bg-neutral-900/60"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
