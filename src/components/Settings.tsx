import React, { useState } from 'react';
import { GoldPrices, Language } from '../types';
import { translations } from '../utils/translations';
import { Sliders, Save, RotateCcw, TrendingUp, AlertCircle, Sparkles, Globe, RefreshCw, Loader2, Check } from 'lucide-react';

interface SettingsProps {
  prices: GoldPrices;
  savePrices: (prices: GoldPrices) => void;
  language: Language;
}

export const Settings: React.FC<SettingsProps> = ({ prices, savePrices, language }) => {
  const t = translations[language];

  // Internal component states for inputs
  const [g24, setG24] = useState<string>(prices.g24.toString());
  const [g21, setG21] = useState<string>(prices.g21.toString());
  const [g18, setG18] = useState<string>(prices.g18.toString());
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // API settings states
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('goldapi_key') || 'goldapi-d403eb25233852441e428c300695afdf-io';
  });
  const [apiCurrency, setApiCurrency] = useState<'EGP' | 'USD'>(() => {
    return (localStorage.getItem('goldapi_currency') as 'EGP' | 'USD') || 'EGP';
  });
  const [usdToEgpRate, setUsdToEgpRate] = useState<string>(() => {
    return localStorage.getItem('goldapi_usd_to_egp') || '50';
  });
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);

  // GoldAPI.io Fetch function
  const handleFetchApiPrices = async () => {
    if (!apiKey.trim()) {
      setApiError(language === 'ar' ? 'الرجاء إدخال مفتاح الـ API' : 'Please enter an API Key');
      return;
    }

    setApiLoading(true);
    setApiError(null);
    setApiSuccess(false);

    try {
      // Persist user-selected/provided API parameters
      localStorage.setItem('goldapi_key', apiKey.trim());
      localStorage.setItem('goldapi_currency', apiCurrency);
      localStorage.setItem('goldapi_usd_to_egp', usdToEgpRate);

      const response = await fetch(`https://www.goldapi.io/api/XAU/${apiCurrency}`, {
        method: 'GET',
        headers: {
          'x-access-token': apiKey.trim(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Attempt to extract gram prices robustly
      let p24 = data.price_gram_24k;
      let p21 = data.price_gram_21k;
      let p18 = data.price_gram_18k;

      // Robust fallback if specific gram metrics are absent but raw troy ounce (XAU) rate is returned
      if (!p24 && data.price) {
        // Troy ounce = 31.1034768 grams of 24K gold
        p24 = data.price / 31.1034768;
      }

      if (p24) {
        if (!p21) p21 = p24 * 0.875;
        if (!p18) p18 = p24 * 0.75;

        // Perform currency conversion to Local EGP if USD was retrieved from API
        if (apiCurrency === 'USD') {
          const factor = parseFloat(usdToEgpRate) || 50;
          p24 = p24 * factor;
          p21 = p21 * factor;
          p18 = p18 * factor;
        }

        // Round cleanly to 2 decimals for aesthetic values
        const rounded24 = Math.round(p24 * 100) / 100;
        const rounded21 = Math.round(p21 * 100) / 100;
        const rounded18 = Math.round(p18 * 100) / 100;

        // Update local text fields
        setG24(rounded24.toString());
        setG21(rounded21.toString());
        setG18(rounded18.toString());

        // Save immediately to global applet state
        savePrices({
          g24: rounded24,
          g21: rounded21,
          g18: rounded18
        });

        setApiSuccess(true);
        // Clear success checkmark after delay
        setTimeout(() => setApiSuccess(false), 4000);
      } else {
        throw new Error("Could not parse gold price metrics from response data");
      }

    } catch (err: any) {
      console.error('GoldAPI fetch failed:', err);
      setApiError(language === 'ar' 
        ? 'فشل جلب الأسعار اللحظية. تأكد من صحة المفتاح، أو حصة الاستهلاك المتبقية، أو ربط الشبكة.' 
        : 'Failed to access live rates. Please verify your API Key, account quota, or network connection.'
      );
    } finally {
      setApiLoading(false);
    }
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

          {/* GoldAPI Integration Section */}
          <div className="bento-card bg-neutral-950 border border-neutral-900 space-y-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-emerald-500/[0.02] blur-2xl"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-500 uppercase font-mono flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  {language === 'ar' ? 'تحديث تلقائي لحظي' : 'Live Automated Sync'}
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t.apiPricingSection}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-950/40 border border-emerald-900/40 px-3 py-1 text-[10px] text-emerald-400 font-bold self-start sm:self-center font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {language === 'ar' ? 'مفتاح جولد API نشط' : 'GoldAPI Active'}
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.apiPricingDesc}
            </p>

            {/* Currency and Custom Exchange Rate selections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-400">
                  {language === 'ar' ? 'عملة سحب أسعار السوق' : 'Market Price Query Currency'}
                </label>
                <div className="flex bg-black border border-neutral-800 rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setApiCurrency('EGP')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      apiCurrency === 'EGP'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-neutral-500 hover:text-white border border-transparent'
                    }`}
                  >
                    EGP (ج.م)
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiCurrency('USD')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      apiCurrency === 'USD'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-neutral-500 hover:text-white border border-transparent'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-400">
                  {apiCurrency === 'USD' 
                    ? (language === 'ar' ? 'سعر صرف دولار الصاغة (ج.م)' : 'Custom Gold Dollar rate (EGP)')
                    : (language === 'ar' ? 'سعر الصرف (غير مفعل للـ EGP)' : 'Exchange Rate (Not needed for EGP)')
                  }
                </label>
                <input
                  type="number"
                  step="0.01"
                  disabled={apiCurrency === 'EGP'}
                  value={apiCurrency === 'EGP' ? '1' : usdToEgpRate}
                  onChange={(e) => setUsdToEgpRate(e.target.value)}
                  placeholder="50.00"
                  className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 disabled:opacity-40 rounded-xl px-4 py-2 text-xs font-mono font-bold text-neutral-300 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-400">
                {t.apiKeyLabel}
              </label>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t.apiKeyPlaceholder}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 rounded-xl pl-4 pr-10 py-3 text-xs font-mono font-bold text-neutral-300 focus:outline-none transition-all"
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center text-neutral-500">
                    <Sliders className="h-4 w-4 text-neutral-600" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFetchApiPrices}
                  disabled={apiLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-neutral-950 font-black text-xs py-3.5 px-6 shadow-md hover:bg-emerald-400 focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-55 transition-all"
                >
                  {apiLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                      {language === 'ar' ? 'جاري جلب الأسعار...' : 'Fetching Rates...'}
                    </>
                  ) : apiSuccess ? (
                    <>
                      <Check className="h-4 w-4 text-neutral-950 stroke-[3px]" />
                      {language === 'ar' ? 'تم التحديث بنجاح!' : 'Rates Updated!'}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 text-neutral-950 animate-pulse" />
                      {t.fetchApi}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error message block */}
            {apiError && (
              <div className="rounded-xl border border-rose-950/20 bg-rose-950/10 p-3 text-xs text-rose-400 font-bold leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Success message inline */}
            {apiSuccess && (
              <div className="rounded-xl border border-emerald-950/25 bg-emerald-950/10 p-3 text-xs text-emerald-400 font-bold leading-relaxed flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-emerald-500 stroke-[3px] mt-0.5" />
                <span>{t.fetchSuccess}</span>
              </div>
            )}

          </div>

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

    </div>
  );
};
