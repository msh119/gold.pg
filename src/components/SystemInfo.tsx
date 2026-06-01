import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Language, GoldPrices, HistoryItem } from '../types';
import { translations } from '../utils/translations';
import { 
  Info, HelpCircle, FileText, Sparkles, Compass, ShieldAlert,
  Globe, ExternalLink, Award, ChevronRight, AlertTriangle,
  Scale, Banknote, Tag, Calculator
} from 'lucide-react';

interface SystemInfoProps {
  language: Language;
  prices?: GoldPrices;
  history?: HistoryItem[];
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ language, prices, history }) => {
  const t = translations[language];
  const latestItem = history && history.length > 0 ? history[0] : null;

  // Local "Baladi" Calculator States (stored as strings to allow precise decimal typing)
  const [localWeight, setLocalWeight] = useState<string>('10');
  const [localGramPrice, setLocalGramPrice] = useState<string>('3500');
  const [localDiscountCash, setLocalDiscountCash] = useState<string>('50');

  // 🧮 Numeric Keypad Focused field state tracker for the Baladi calc
  const [activeLocalKeypadField, setActiveLocalKeypadField] = useState<'weight' | 'price' | 'discount'>('weight');

  const handleLocalKeypadPress = (key: string) => {
    if (activeLocalKeypadField === 'weight') {
      if (key === '⌫') {
        setLocalWeight(prev => prev ? prev.slice(0, -1) : '');
      } else if (key === 'C') {
        setLocalWeight('');
      } else if (key === '.') {
        setLocalWeight(prev => prev.includes('.') ? prev : (prev === '' ? '0.' : prev + '.'));
      } else {
        setLocalWeight(prev => {
          const val = prev + key;
          if (/^[0-9]*\.?[0-9]*$/.test(val)) {
            return val;
          }
          return prev;
        });
      }
    } else if (activeLocalKeypadField === 'price') {
      if (key === '⌫') {
        setLocalGramPrice(prev => prev ? prev.slice(0, -1) : '');
      } else if (key === 'C') {
        setLocalGramPrice('');
      } else if (key === '.') {
        setLocalGramPrice(prev => prev.includes('.') ? prev : (prev === '' ? '0.' : prev + '.'));
      } else {
        setLocalGramPrice(prev => {
          const val = prev + key;
          if (/^[0-9]*\.?[0-9]*$/.test(val)) {
            return val;
          }
          return prev;
        });
      }
    } else {
      if (key === '⌫') {
        setLocalDiscountCash(prev => prev ? prev.slice(0, -1) : '');
      } else if (key === 'C') {
        setLocalDiscountCash('');
      } else if (key === '.') {
        setLocalDiscountCash(prev => prev.includes('.') ? prev : (prev === '' ? '0.' : prev + '.'));
      } else {
        setLocalDiscountCash(prev => {
          const val = prev + key;
          if (/^[0-9]*\.?[0-9]*$/.test(val)) {
            return val;
          }
          return prev;
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      
      {/* Upper Welcome Header Section - Styled as a Premium Bento Cell */}
      <div className="bento-card bg-gradient-to-br from-[#161616] via-[#111111] to-[#161616] border border-amber-500/20 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-yellow-500/[0.03] blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[var(--gold)] mb-3">
            <Info className="h-5 w-5" />
            <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">{t.infoTab}</span>
          </div>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2">
            {t.guideTitle}
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {t.guideIntro}
          </p>
        </div>
      </div>

      {/* Main Educational Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Shishangi & Shares */}
        <div className="bento-card space-y-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/20 border border-amber-500/20 flex items-center justify-center text-[var(--gold)] shadow-md">
            <Compass className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {t.conceptTitle1}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.conceptDesc1}
          </p>
        </div>

        {/* Card 2: Math Calibration */}
        <div className="bento-card space-y-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/20 border border-yellow-500/20 flex items-center justify-center text-[var(--gold)] shadow-md">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {t.conceptTitle2}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.conceptDesc2}
          </p>
        </div>

        {/* Card 3: Valuation Model */}
        <div className="bento-card space-y-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-600/20 border border-orange-500/20 flex items-center justify-center text-[var(--gold-light)] shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {t.conceptTitle3}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.conceptDesc3}
          </p>
        </div>

      </div>

      {/* Calibration Reference List and Explanation */}
      <div className="bento-card">
        <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest font-mono mb-5 flex items-center gap-2 border-b border-neutral-900 pb-3">
          <ShieldAlert className="h-4.5 w-4.5" />
          {language === 'ar' ? 'معايير نقاوة الذهب ومكافئ السهم العربي' : 'Gold Purity Standard & Arabic Shares Equivalence'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-xs text-neutral-400">
          <div>
            <p className="mb-3.5">
              {language === 'ar' 
                ? 'تاريخياً، قست الصاغة العربية نقاوة الذهب عن طريق تقسيم السبيكة أو الحلية لـ 24 جزء يسمى "قيراط"، لكن عيب هذا النظام هو جموده؛ لذلك اعتمد الصاغة والمصانع نظام المليون أو الـ 1000 سهم لزيادة الحسابات دقة.'
                : 'Traditionally, Arab scales measured gold by dividing alloys into 24 fractions called "Karats". To maximize precision, state assayers and professional foundries migrated to the millesimal fineness index represented in "Shares" (out of 1000 points).'}
            </p>
            <p className="text-neutral-500">
              {language === 'ar' 
                ? 'عند استلام ذهب مجهول النقاوة أو ذهب كسر مكسر، يخضع لتحليل "الشيشنجي" الذي يسلم الزبون شهادة مدموغة بالأسهم، مثل: (882 سهم)، فيأتي دور هذه المنصة لتحويل هذا الوزن لنظيره المكافئ من عيار 21 مباشرة.'
                : 'When receiving raw scrap alloys of irregular purity, the metallurgical laboratory issues a certificate stating the fineness in shares (e.g. 882 shares). This platform converts that arbitrary alloy into standard 21K, which serves as the wholesale trading benchmark.'}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-850 bg-black p-4 space-y-3 font-mono">
            <span className="block text-xs font-bold text-neutral-300 mb-2 border-b border-neutral-900 pb-2">
              {language === 'ar' ? 'جدول المرجع التقني المعتمد:' : 'Certified conversion index:'}
            </span>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5 text-[11px]">
              <span className="text-neutral-500">{t.g24}</span>
              <span className="text-[var(--gold)] font-bold">1000 سهم [1.00 Fine]</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5 text-[11px]">
              <span className="text-neutral-500">عيار 22</span>
              <span className="text-[var(--gold)] font-bold">916.6 سهم [0.916 Fine]</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5 text-[11px]">
              <span className="text-neutral-500">{t.g21}</span>
              <span className="text-[var(--gold)] font-bold font-black">875 سهم [0.875 Fine]</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5 text-[11px]">
              <span className="text-neutral-500">{t.g18}</span>
              <span className="text-[var(--gold)] font-bold">750 سهم [0.75 Fine]</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-500">عيار 14</span>
              <span className="text-[var(--gold)] font-bold">583.3 سهم [0.58 Fine]</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔮 NEW SECTION: MY LOCAL CALCULATOR (حاسبة بلدي) */}
      {(() => {
        const weightVal = parseFloat(localWeight) || 0;
        const gramPriceVal = parseFloat(localGramPrice) || 0;
        const discountVal = parseFloat(localDiscountCash) || 0;
        const rawTotalVal = weightVal * gramPriceVal;
        const netValue = Math.max(0, rawTotalVal - discountVal);

        return (
          <div className="bento-card border border-amber-500/20 bg-gradient-to-b from-[#0a0c10] to-[#040507] p-6 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 -ml-20 -mt-20 h-44 w-44 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 h-44 w-44 rounded-full bg-yellow-500/[0.04] blur-3xl pointer-events-none"></div>

            <div className="border-b border-neutral-850 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-amber-500 animate-pulse" />
                  {language === 'ar' ? 'حاسبة بلدي (سعر الصافية والخصم المباشر)' : 'My Local Calculator (Net Price & Direct Cash Discount)'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'ar' 
                    ? 'احتسب السعر الإجمالي للذهب يدوياً وبسرعة: اضرب الوزن في سعر الجرام واخصم قيمة النقدية المباشرة للحصول على الصافي النهائي.'
                    : 'Instantly compute total gold purchase value: (Weight × Gram Price) minus cash discount.'}
                </p>
              </div>
              
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-500 font-bold self-start md:self-auto flex items-center gap-1.5">
                {language === 'ar' ? '🧮 حاسبة سريعة' : '🧮 Fast Cash Calculator'}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Inputs Column */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Input 1: Weight (الوزن) */}
                <div className={`p-4 bg-neutral-950 rounded-2xl border transition-all space-y-3 font-sans ${activeLocalKeypadField === 'weight' ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-neutral-900'}`}>
                  <div className="flex items-center justify-between">
                    <label htmlFor="localWeightInput" className="text-[11px] font-black text-neutral-300 flex items-center gap-1.5 uppercase tracking-wide">
                      <Scale className="h-4 w-4 text-amber-400" />
                      {language === 'ar' ? 'الوزن الإجمالي (جرام)' : 'Total Weight (Grams)'}
                    </label>
                    <span className="text-[10px] font-mono font-bold text-neutral-500">
                      {language === 'ar' ? 'جرام (g)' : 'Grams (g)'}
                    </span>
                  </div>
                  <div className="relative">
                    <input 
                      id="localWeightInput"
                      type="text"
                      inputMode="decimal"
                      value={localWeight}
                      onFocus={() => setActiveLocalKeypadField('weight')}
                      onClick={() => setActiveLocalKeypadField('weight')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                          setLocalWeight(val);
                        }
                      }}
                      placeholder="e.g. 2.30"
                      className={`w-full py-3 px-4 bg-[#0a0c10] text-amber-400 font-mono font-black text-sm rounded-xl border transition-all text-left focus:outline-none ${
                        activeLocalKeypadField === 'weight'
                          ? 'border-amber-500 ring-1 ring-amber-500/30'
                          : 'border-neutral-850'
                      }`}
                    />
                  </div>
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[1, 5, 10, 21, 31.1, 50, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setLocalWeight(val.toString());
                          setActiveLocalKeypadField('weight');
                        }}
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-colors ${
                          parseFloat(localWeight) === val 
                            ? 'bg-amber-500 text-neutral-950 font-black' 
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-850 hover:bg-neutral-800'
                        }`}
                      >
                        {val === 31.1 ? (language === 'ar' ? 'أونصة (31.1)' : 'Ounce (31.1)') : `${val}g`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input 2: Gram Price (سعر الجرام) */}
                <div className={`p-4 bg-neutral-950 rounded-2xl border transition-all space-y-3 font-sans ${activeLocalKeypadField === 'price' ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-neutral-900'}`}>
                  <div className="flex items-center justify-between">
                    <label htmlFor="localGramPriceInput" className="text-[11px] font-black text-neutral-300 flex items-center gap-1.5 uppercase tracking-wide">
                      <Banknote className="h-4 w-4 text-emerald-400" />
                      {language === 'ar' ? 'سعر الجرام الواحد (جنيه مصري)' : 'Gram Price (EGP)'}
                    </label>
                    <span className="text-[10px] font-mono font-bold text-neutral-500">
                      {language === 'ar' ? 'ج.م / جرام' : 'EGP / g'}
                    </span>
                  </div>
                  <div className="relative">
                    <input 
                      id="localGramPriceInput"
                      type="text"
                      inputMode="numeric"
                      value={localGramPrice}
                      onFocus={() => setActiveLocalKeypadField('price')}
                      onClick={() => setActiveLocalKeypadField('price')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^[0-9]*$/.test(val)) {
                          setLocalGramPrice(val);
                        }
                      }}
                      placeholder="e.g. 3500"
                      className={`w-full py-3 px-4 bg-[#0a0c10] text-emerald-400 font-mono font-black text-sm rounded-xl border transition-all text-left focus:outline-none ${
                        activeLocalKeypadField === 'price'
                          ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-500/[0.01]'
                          : 'border-neutral-850'
                      }`}
                    />
                  </div>
                  {/* Intelligent Presets from Real-Time Prices or Common Benchmarks */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[
                      ...(prices ? [Math.round(prices.g24), Math.round(prices.g21), Math.round(prices.g18)] : [4100, 3600, 3105])
                    ].map((val, idx) => {
                      const label = idx === 0 ? '٢٤ك' : idx === 1 ? '٢١ك' : '١٨ك';
                      const labelEn = idx === 0 ? '24K' : idx === 1 ? '21K' : '18K';
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setLocalGramPrice(val.toString());
                            setActiveLocalKeypadField('price');
                          }}
                          className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-colors ${
                            parseFloat(localGramPrice) === val 
                              ? 'bg-emerald-500 text-neutral-950 font-black' 
                              : 'bg-neutral-900 text-neutral-400 border border-neutral-850 hover:bg-neutral-800'
                          }`}
                        >
                          {language === 'ar' ? `${label} (${val.toLocaleString()})` : `${labelEn} (${val})`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input 3: Discount in Cash (نسبة الخصم فلوس) */}
                <div className={`p-4 bg-neutral-950 rounded-2xl border transition-all space-y-3 font-sans ${activeLocalKeypadField === 'discount' ? 'border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.05)]' : 'border-neutral-950'}`}>
                  <div className="flex items-center justify-between">
                    <label htmlFor="localDiscountCashInput" className="text-[11px] font-black text-neutral-300 flex items-center gap-1.5 uppercase tracking-wide">
                      <Tag className="h-4 w-4 text-red-400" />
                      {language === 'ar' ? 'قيمة الخصم المباشر (كاش بالجنيه)' : 'Cash Discount Amount (EGP)'}
                    </label>
                    <span className="text-[10px] font-mono font-bold text-neutral-500">
                      {language === 'ar' ? 'ج.م (خصم)' : 'EGP (Discount)'}
                    </span>
                  </div>
                  <div className="relative">
                    <input 
                      id="localDiscountCashInput"
                      type="text"
                      inputMode="numeric"
                      value={localDiscountCash}
                      onFocus={() => setActiveLocalKeypadField('discount')}
                      onClick={() => setActiveLocalKeypadField('discount')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^[0-9]*$/.test(val)) {
                          setLocalDiscountCash(val);
                        }
                      }}
                      placeholder="e.g. 50"
                      className={`w-full py-3 px-4 bg-[#0a0c10] text-rose-400 font-mono font-black text-sm rounded-xl border transition-all text-left focus:outline-none ${
                        activeLocalKeypadField === 'discount'
                          ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/[0.01]'
                          : 'border-neutral-850'
                      }`}
                    />
                  </div>
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[0, 50, 100, 200, 500, 1000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setLocalDiscountCash(val.toString());
                          setActiveLocalKeypadField('discount');
                        }}
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-colors ${
                          parseFloat(localDiscountCash) === val 
                            ? 'bg-rose-500 text-neutral-950 font-black' 
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-850 hover:bg-neutral-800'
                        }`}
                      >
                        {val === 0 ? (language === 'ar' ? 'بدون خصم' : 'No Discount') : `${val.toLocaleString()} EGP`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🧮 Interactive Tactile Virtual Keypad */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-3 mt-4">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {language === 'ar' ? 'لوحة أرقام الحاسبة السريعة' : 'Fast Calculator Keypad'}
                    </span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black font-sans uppercase">
                      {activeLocalKeypadField === 'weight' 
                        ? (language === 'ar' ? 'المدخل: الوزن' : 'Active: Weight') 
                        : activeLocalKeypadField === 'price'
                        ? (language === 'ar' ? 'المدخل: السعر' : 'Active: Price')
                        : (language === 'ar' ? 'المدخل: الخصم' : 'Active: Discount')}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', 'C', '4', '5', '6', '⌫', '7', '8', '9', '.', '0'].map((key) => {
                      let buttonStyle = "py-3 text-sm font-mono font-black rounded-xl transition-all cursor-pointer flex items-center justify-center ";
                      if (key === 'C') {
                        buttonStyle += "bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 border border-rose-900/30";
                      } else if (key === '⌫') {
                        buttonStyle += "bg-neutral-900 text-rose-400 hover:text-white hover:bg-neutral-800 border border-neutral-850";
                      } else if (key === '.') {
                        buttonStyle += "bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-850";
                      } else {
                        buttonStyle += "bg-neutral-900/60 text-white hover:bg-neutral-850 border border-neutral-900 hover:border-emerald-500/20";
                      }
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleLocalKeypadPress(key)}
                          className={`${buttonStyle} select-none active:scale-95`}
                        >
                          {key === '⌫' ? (language === 'ar' ? 'تراجع' : 'DEL') : key}
                        </button>
                      );
                    })}
                    <div className="col-span-3">
                      <div className="grid grid-cols-3 gap-1">
                        {(['weight', 'price', 'discount'] as const).map((f) => {
                          const labels = {
                            weight: { ar: 'الوزن', en: 'Weight' },
                            price: { ar: 'السعر', en: 'Price' },
                            discount: { ar: 'الخصم', en: 'Discount' }
                          };
                          const isActive = activeLocalKeypadField === f;
                          return (
                            <button
                              key={f}
                              type="button"
                              onClick={() => {
                                setActiveLocalKeypadField(f);
                              }}
                              className={`py-2 text-[10px] font-bold rounded-lg transition-all border ${
                                isActive 
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                  : 'bg-neutral-900/40 hover:bg-neutral-900 text-neutral-400 border-neutral-900'
                              }`}
                            >
                              {language === 'ar' ? labels[f].ar : labels[f].en}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Result Column */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div className="bg-neutral-950 rounded-3xl p-5 border border-neutral-900 h-full flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                        {language === 'ar' ? 'النتيجة وصافي القيمة المطلوبة' : 'NET CASH REQUIRED'}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-black border border-emerald-500/20">
                        {language === 'ar' ? 'حساب بلدي' : 'Baladi Calc'}
                      </span>
                    </div>

                    {/* Formula Display */}
                    <div className="p-3 bg-[#0a0c10] rounded-xl border border-neutral-900 text-center font-mono text-[10px] text-neutral-400 space-y-1">
                      <span className="text-neutral-500 uppercase block text-[8px] tracking-widest">
                        {language === 'ar' ? 'طريقة المعادلة الحسابية' : 'CALCULATION FORMULA'}
                      </span>
                      <p className="font-bold font-sans">
                        {language === 'ar' 
                          ? 'الصافي = (الوزن × سعر الجرام) - الخصم' 
                          : 'Net = (Weight × Gram Price) - Discount'}
                      </p>
                      <p className="text-neutral-500 text-[9px] mt-1 pt-1 border-t border-neutral-900">
                        ({localWeight}g × {gramPriceVal.toLocaleString()} EGP) - {discountVal.toLocaleString()} EGP
                      </p>
                    </div>

                    {/* Big Result Output - fully consistent layout and proportions */}
                    <div className="mt-4 bg-gradient-to-r from-[#1b140a] via-[#0d0a06] to-[#040302] border border-amber-500/35 p-5 rounded-2xl relative shadow-xl overflow-hidden group transition-all duration-300 hover:border-amber-500/50 text-center">
                      {/* Elegant geometric radial gold vector lines in background */}
                      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
                      
                      <span className="block text-xs font-black text-amber-500 mb-2.5 uppercase tracking-wider font-mono">
                        {language === 'ar' ? '◀ المبلغ الإجمالي المستحق بعد الخصم :' : '◀ FINAL TOTAL NET VALUE :'}
                      </span>
                      
                      <div className="py-2 flex flex-col sm:flex-row items-baseline justify-center gap-1.5 min-h-[45px] relative z-10">
                        <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#f59e0b] drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)] select-all selection:bg-amber-500/30 mx-auto sm:mx-0">
                          {netValue.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs font-black text-amber-500/90 uppercase tracking-widest font-mono mx-auto sm:mx-0 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 shadow-sm">
                          {language === 'ar' ? 'جنيه مصري' : 'EGP'}
                        </span>
                      </div>

                      <div className="pt-3.5 border-t border-neutral-900/80 flex justify-between text-[11px] font-mono text-neutral-400 relative z-10">
                        <span>
                          {language === 'ar' ? 'المبلغ الأصلي قبل الخصم:' : 'Before Discount:'}
                        </span>
                        <span className="font-bold text-neutral-200">
                          {rawTotalVal.toLocaleString()} EGP
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-neutral-400 mt-2 relative z-10">
                        <span>
                          {language === 'ar' ? 'قيمة الخصم المستقطع:' : 'Discount Deducted:'}
                        </span>
                        <span className="font-bold text-rose-400">
                          -{discountVal.toLocaleString()} EGP
                        </span>
                      </div>
                    </div>

                  </div>
                  
                  {/* Advisory note */}
                  <p className="text-[10px] text-neutral-500 text-center leading-normal">
                    {language === 'ar'
                      ? '* تنبيه: هذا الحساب يمثل السعر النقدي المباشر العرفي المتفق عليه فورياً بالصاغة المصرية بدون احتساب ضريبة الدمغة والمصنعية الإضافية بشكل منفصل.'
                      : '* Advisory: This represents traditional direct over-the-counter pricing before stamp taxation and custom retail premiums can be applied.'}
                  </p>

                </div>
              </div>

            </div>

          </div>
        );
      })()}

      {/* Elements Table Section */}
      <div className="bento-card border border-neutral-850 bg-[#060709] relative overflow-hidden">
        <div className="absolute top-0 left-0 -ml-16 -mt-16 h-36 w-36 rounded-full bg-amber-500/[0.02] blur-2xl pointer-events-none"></div>
        <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest font-mono mb-5 flex items-center gap-2 border-b border-neutral-900 pb-3">
          <Sparkles className="h-4 w-4 text-amber-500" />
          {language === 'ar' ? 'جدول الرموز والعناصر الكيميائية للمعادن' : 'CHEMICAL METAL ELEMENTS & SYMBOLS'}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-850 text-neutral-500 text-[10px] uppercase font-bold">
                <th className={`pb-3 text-neutral-500 font-bold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'العنصر بالعربية' : 'Element (Arabic)'}
                </th>
                <th className={`pb-3 text-neutral-500 font-bold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'العنصر بالإنجليزية' : 'Element (English)'}
                </th>
                <th className="pb-3 text-center text-neutral-500 font-bold">
                  {language === 'ar' ? 'الرمز الكيميائي' : 'Chemical Symbol'}
                </th>
                <th className={`pb-3 text-neutral-500 font-bold ${language === 'ar' ? 'text-left font-sans' : 'text-right font-sans'}`}>
                  {language === 'ar' ? 'الاستخدام بالصاغة والتبكير والشيشنة' : 'Primary Application'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60">
              {[
                { ar: 'الذهب', en: 'Gold', symbol: 'Au', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', useAr: 'المعدن الثمين الأساسي للتداول والادخار ومعيار التسعير اللحظي بالصاغة في مصر بمؤشر 875', useEn: 'Primary financial index base for trading & savings standard' },
                { ar: 'الفضة', en: 'Silver', symbol: 'Ag', color: 'text-slate-300 bg-slate-300/10 border-slate-300/20', useAr: 'معدن الخلط والمكمل للسبائك وخفض سهم الذهب للحصول للعيار المطلوب بدقة تامة', useEn: 'Pristine jewelry alloys, premium fineness calibration filler' },
                { ar: 'البلاتين', en: 'Platinum', symbol: 'Pt', color: 'text-teal-300 bg-teal-300/10 border-teal-300/20', useAr: 'صناعة محترفي المجوهرات الملكية والفاخرة شديدة النقاوة والصلابة والعمر المديد', useEn: 'High-end luxury jewelry, extreme durability' },
                { ar: 'البالاديوم', en: 'Palladium', symbol: 'Pd', color: 'text-indigo-300 bg-indigo-300/10 border-indigo-300/20', useAr: 'يدخل في صناعة سبائك الذهب الأبيض الفاخر وله رونق متين ومضاد للأكسدة والأحماض', useEn: 'White gold alloy manufacturing and hard coatings' },
                { ar: 'النحاس', en: 'Copper', symbol: 'Cu', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', useAr: 'المضاف الأقوى لتصليد عيار 21 وسهم 875 وصناعة الذهب الأحمر والوردي الفخم وسهم الخلط الناري', useEn: 'Primary hardening additive for yellow and rose gold alloys' },
                { ar: 'الرصاص', en: 'Lead', symbol: 'Pb', color: 'text-red-400 bg-red-500/10 border-red-500/20', useAr: 'عنصر مرسب ومجمع في تصفية المعادن الخام كيميائياً بالتثقيل وعزله تاماً لرفع جودة السهم ونقاء الذهب', useEn: 'Gathering agent in metallurgy crucible assaying' },
                { ar: 'الروديوم', en: 'Rhodium', symbol: 'Rh', color: 'text-cyan-300 bg-cyan-300/10 border-cyan-300/20', useAr: 'معدن ثمين نادر جداً لطلاء غلاف الذهب الأبيض لصد الخدوش وعكس اللمعان البلاتيني الفاخر', useEn: 'Ultra-rare platinum group metal used for premium alloy shielding' },
                { ar: 'التيتانيوم', en: 'Titanium', symbol: 'Ti', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', useAr: 'لصناعة المشغولات الطبية خفيفة الوزن وفائقة القوة والصمود ومقاومة التكلس والصدأ', useEn: 'Lightweight ultra-dense metal used in high-strength bespoke alloys' },
                { ar: 'الكادميوم', en: 'Cadmium', symbol: 'Cd', color: 'text-yellow-600 bg-yellow-600/10 border-yellow-600/15', useAr: 'كان مستخدماً كـلحام ناعم للذهب لخفض درجة الانزلاق والذوبان وتم حظره حالياً في ورش الصاغة لضرره الصحي', useEn: 'Traditional solder material, widely deprecated due to health standards' },
                { ar: 'الحديد', en: 'Iron', symbol: 'Fe', color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20', useAr: 'عنصر شائب وعارض يتم التخلص منه بعملية الشيشنة والتصفيح ومقاومة الأكسدة والفرز بالمركبات', useEn: 'Trace metal separated or refined in assaying processes' },
                { ar: 'الزنك', en: 'Zinc', symbol: 'Zn', color: 'text-blue-300 bg-blue-300/10 border-blue-300/10', useAr: 'يدخل بشكل أساسي لخفض درجة انصهار سبائك الذهب وعمل لحامات دقيقة ومصقولة', useEn: 'Solder agent, reducer of standard alloy melting point' },
                { ar: 'النيكل', en: 'Nickel', symbol: 'Ni', color: 'text-purple-300 bg-purple-300/10 border-purple-300/10', useAr: 'يستخدم للحصول على تدرج الذهب الأبيض الفضي الفاخر والتصفيح المقاوم للمشغولات السطحية', useEn: 'White gold alloy catalyst and custom silver plating' },
                { ar: 'الزئبق', en: 'Mercury', symbol: 'Hg', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', useAr: 'مستخلص ومذيب حراري في تعدين الذهب واستخلاص الذهب الخام بالملغمة ثم التبخير بالورش الحرفية', useEn: 'Traditional gold ore extraction catalyst and ancient hot mining solvent' },
                { ar: 'الألومنيوم', en: 'Aluminum', symbol: 'Al', color: 'text-stone-300 bg-stone-300/10 border-stone-300/20', useAr: 'عنصر واقي وخافض للوزن الكلي يدخل في سبك قوالب صب العيار وهياكل معدات صهر المعادن الثمينة', useEn: 'Deoxidization component and structural assay crucible accessory' },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                  <td className={`py-3.5 font-bold text-neutral-100 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {item.ar}
                  </td>
                  <td className={`py-3.5 font-semibold text-neutral-300 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {item.en}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-black border uppercase tracking-wider font-mono ${item.color}`}>
                      {item.symbol}
                    </span>
                  </td>
                  <td className={`py-3.5 text-[10px] text-neutral-500 font-sans ${language === 'ar' ? 'text-right leading-relaxed font-sans' : 'text-left leading-relaxed font-sans'}`}>
                    {language === 'ar' ? item.useAr : item.useEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
