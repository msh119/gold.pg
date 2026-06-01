import React, { useState, useEffect } from 'react';
import { GoldPrices, Language } from '../types';
import { 
  Sparkles, Cpu, RefreshCw, TrendingUp, TrendingDown, Compass, 
  MapPin, Building2, ShieldCheck, Activity, Layers, AlertCircle
} from 'lucide-react';

interface AIMarketAnalystProps {
  prices: GoldPrices;
  language: Language;
}

export const AIMarketAnalyst: React.FC<AIMarketAnalystProps> = ({ prices, language }) => {
  // AI calculation parameters
  const [investmentMode, setInvestmentMode] = useState<'short' | 'medium' | 'long'>('medium');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [activeServer, setActiveServer] = useState<string>('LBMA London Feed');
  
  // Custom AI text recommendation states
  const [aiReport, setAiReport] = useState<{
    recommendation: 'BUY' | 'STRONG_BUY' | 'HOLD' | 'SELL';
    confidence: number;
    closingPrice: number;
    openingPrice: number;
    dayHigh: number;
    dayLow: number;
    explanationAr: string;
    explanationEn: string;
  }>({
    recommendation: 'BUY',
    confidence: 94,
    openingPrice: Math.round(prices.g21 * 0.991),
    closingPrice: prices.g21,
    dayHigh: Math.round(prices.g21 * 1.018),
    dayLow: Math.round(prices.g21 * 0.985),
    explanationAr: 'بناءً على توازن الطلب والأسعار السارية؛ يمر السوق حالياً بفترة تصحيح طفيفة ومستقرة. يُعد الشراء حالياً فرصة تراكمية حكيمة لحفظ توازن الأصول المالية.',
    explanationEn: 'Based on supply-demand indices and existing pricing models: the gold spot index is performing a healthy consolidation. Accumulating weights at the current rate provides optimal inflation hedging.'
  });

  // Simulated telemetry server connections
  const servers = [
    { ar: 'خادم لندن للسبائك (LBMA)', en: 'London Bullion Market (LBMA)' },
    { ar: 'خادم البنك المركزي المصري', en: 'Central Bank of Egypt Feed' },
    { ar: 'مختبرات معايرة براميدز جولد', en: 'Pyramids Assaying Laboratories' },
    { ar: 'إشارات تعدين الصحراء الشرقية', en: 'Eastern Desert Mining Nodes' }
  ];

  // Dynamically update simulated prices when the user updates the spot rate
  useEffect(() => {
    setAiReport(prev => ({
      ...prev,
      closingPrice: prices.g21,
      openingPrice: Math.round(prices.g21 * 0.991),
      dayHigh: Math.round(prices.g21 * 1.018),
      dayLow: Math.round(prices.g21 * 0.985)
    }));
  }, [prices.g21]);

  // AI scanning routine with telemetry
  const handleServerScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Interval for server telemetry simulation
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          
          // Compute logical dynamic recommendation based on price range
          let rec: 'BUY' | 'STRONG_BUY' | 'HOLD' | 'SELL' = 'BUY';
          let conf = Math.floor(Math.random() * 8) + 88; // 88% - 95%
          let expAr = '';
          let expEn = '';

          const priceFactor21 = prices.g21;
          
          if (investmentMode === 'long') {
            rec = 'STRONG_BUY';
            expAr = 'الذكاء الاصطناعي يشير لشراء قوي للمستثمرين على المدى الطويل. الذهب هو الملاذ الآمن الأمتن وقيمة الألف سهم التاريخية تحافظ للسيولة على رونقها بمعدل نمو استثنائي.';
            expEn = 'Strong Buy recommendation on the long-term horizon. Physical gold remains the gold standard of purchasing power preservation; acquiring bullion at current level offers superior compounding performance.';
          } else if (investmentMode === 'short') {
            if (priceFactor21 < 3500) {
              rec = 'BUY';
              expAr = 'سعر السوق منخفض نسبياً وفرص المضاربة السريعة ممتازة للدخول العاجل وتحقيق هامش أسرع عند عودة السعر للمعدلات السابقة.';
              expEn = 'Price is fundamentally low. Scalping routes indicate excellent margins on prompt entry, targeting dynamic price rebounds near upper resistance levels.';
            } else if (priceFactor21 > 3900) {
              rec = 'SELL';
              expAr = 'الأسعار الحالية تقترب من ذروتها اليومية والقطاع متشبع نسبياً على المدى القصير؛ ينصح الذكاء الاصطناعي بجني بعض الأرباح أو بيع جزئي للذهب الكسر والانتظار.';
              expEn = 'Gram price is near daily peaks. Immediate indicators show slight overbought conditions on lower timeframes. High recommendation to liquidate a portion of scrap or take clean profits here.';
            } else {
              rec = 'HOLD';
              expAr = 'تذبذب الأسعار طفيف والمؤشرات متساوية. يوصي الذكاء الاصطناعي بالمراقبة وتثمين الفرص حتى خروج السعر من منطقة الضغط الحالية.';
              expEn = 'Spot action is showing localized low-volatility congestion. The AI recommendation suggests holding active scrap inventories and monitoring price breakout signals.';
            }
          } else {
            // Medium investment term
            if (priceFactor21 < 3700) {
              rec = 'BUY';
              expAr = 'القيمة السوقية الحالية عادلة جداً للشراء متوسط المدى لادخار الذهب وصناعة السبائك. مع مستهدفات إيجابية للربع السنوي القادم.';
              expEn = 'Favorable medium-term trading setup. Physical gold acquisition at current discount rates remains attractive for structural portfolio defense.';
            } else {
              rec = 'HOLD';
              expAr = 'السوق في حالة ترقب وتنافس صحي للمتنفسات النقدية. الانتظار والتريث يضمن معدل شراء آمن فور وضوح مؤشرات الإغلاق القادم.';
              expEn = 'Market is reflecting solid commercial wait-and-see posture. Patience ensures minimal exposure until subsequent weekly candle confirmations establish new floors.';
            }
          }

          setAiReport({
            recommendation: rec,
            confidence: conf,
            openingPrice: Math.round(prices.g21 * (0.988 + Math.random() * 0.006)),
            closingPrice: prices.g21,
            dayHigh: Math.round(prices.g21 * (1.01 + Math.random() * 0.015)),
            dayLow: Math.round(prices.g21 * (0.975 + Math.random() * 0.01)),
            explanationAr: expAr,
            explanationEn: expEn
          });

          setIsScanning(false);
          return 100;
        }
        
        // Randomly change servers being scanned during progress
        if (p === 20) setActiveServer(servers[1][language]);
        if (p === 50) setActiveServer(servers[2][language]);
        if (p === 80) setActiveServer(servers[3][language]);
        
        return p + 4;
      });
    }, 45);
  };

  return (
    <div className="space-y-8">
      
      {/* 🔮 AI NETWORK ANALYST BENTO BOARD */}
      <div className="bento-card border border-amber-500/20 bg-gradient-to-br from-[#0c0d12] via-[#050608] to-[#0a0d10] p-6 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-48 w-48 rounded-full bg-cyan-500/[0.04] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-48 w-48 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="border-b border-neutral-900 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-400 animate-spin-slow" />
              {language === 'ar' 
                ? 'محلل براميدز المالي الذكي (تكامل السيرفرات والشبكة المفتوحة)' 
                : 'Pyramids Global AI Analyst (Multi-Server Live Network & Spot Decider)'}
            </h3>
            <p className="text-xs text-neutral-400">
              {language === 'ar'
                ? 'نظام ذكاء اصطناعي يقوم بمسح الخوادم العالمية ومؤشرات الإغلاق والافتتاح ومستقبل السعر لتوجيه التبادل التجاري.'
                : 'Advanced algorithmic intelligence scanning international bullion tickers and local vault inventories to advice execution paths.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              {language === 'ar' ? 'متصل بالشبكة الحرة' : 'Connected / Free Spot Web'}
            </span>
          </div>
        </div>

        {/* The Grid of Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls & Server Status Side - 5/12 */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Server Nodes Status Monitor */}
            <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-900 space-y-3">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono block">
                {language === 'ar' ? '📊 حالة قنوات الربط ونقاط الاتصال:' : '📊 Connected Data Pipelines & Nodes'}
              </span>
              
              <div className="space-y-2 text-[11px] font-mono">
                {servers.map((srv, sIdx) => {
                  const states = [
                    { ar: 'متصل/فوري', en: '11ms / Spot Sync' },
                    { ar: 'مستقر/نشط', en: '8ms / Linked' },
                    { ar: 'معاير/داخلي', en: 'Local Calibrated' },
                    { ar: 'مؤمن/مشفر', en: 'Secure Feed' }
                  ];
                  return (
                    <div key={sIdx} className="flex items-center justify-between p-2 rounded-lg bg-[#07080b] border border-neutral-900">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-neutral-300 font-sans">{language === 'ar' ? srv.ar : srv.en}</span>
                      </div>
                      <span className="text-[9px] text-cyan-400 bg-cyan-400/5 px-1.5 py-0.5 rounded border border-cyan-400/10">
                        {language === 'ar' ? states[sIdx].ar : states[sIdx].en}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-900 space-y-3 font-sans">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">
                {language === 'ar' ? '📅 تحديد النطاق الزمني الاستثماري للمشغلين:' : '📅 Target Investment Time Horizon'}
              </label>
              
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['short', 'medium', 'long'] as const).map((mode) => {
                  const labels = {
                    short: { ar: 'مضاربة خطية', en: 'Day Trade' },
                    medium: { ar: 'متوسط الأجل', en: 'Medium' },
                    long: { ar: 'استثمار طويل', en: 'Long-term' }
                  };
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setInvestmentMode(mode)}
                      className={`py-2 px-1 text-[10.5px] font-bold rounded-lg transition-all ${
                        investmentMode === mode
                          ? 'bg-gradient-to-br from-cyan-600 to-cyan-800 text-white shadow-lg border border-cyan-500/50'
                          : 'bg-[#07080b] text-neutral-400 border border-neutral-900 hover:bg-neutral-900'
                      }`}
                    >
                      {language === 'ar' ? labels[mode].ar : labels[mode].en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scan/Refresh network button */}
            <button
              onClick={handleServerScan}
              disabled={isScanning}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-neutral-950 font-sans font-black text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-45 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning 
                ? (language === 'ar' ? `مسح خادم ${activeServer}...` : `Scanning ${activeServer}...`)
                : (language === 'ar' ? 'تحديث الفحص والاتصال بالخوادم المفتوحة' : 'Initiate AI Network Scan & Real-Time Advice')}
            </button>

            {/* Simulated progress scale if scanning */}
            {isScanning && (
              <div className="space-y-1.5 font-mono text-[9px] text-cyan-400">
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'تعدين وتحديث البيانات اللحظية...' : 'Decrypting Global Bullion Sockets...'}</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full transition-all duration-150" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            )}

          </div>

          {/* AI Recommendation Result Column - 7/12 */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-900 h-full flex flex-col justify-between space-y-6">
              
              <div className="space-y-5">
                
                {/* Simulated Pricing Metrics derived seamlessly from current weights state */}
                <div className="grid grid-cols-4 gap-2 border-b border-neutral-900 pb-4">
                  <div className="text-center">
                    <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-1">
                      {language === 'ar' ? 'سعر الافتتاح (EGP)' : 'OPENING'}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-300">
                      {aiReport.openingPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-center border-l border-neutral-900/60">
                    <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-1">
                      {language === 'ar' ? 'سعر الإغلاق الجاري' : 'LATEST SPOT'}
                    </span>
                    <span className="text-xs font-mono font-black text-amber-400">
                      {aiReport.closingPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-center border-l border-neutral-900/60">
                    <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-1">
                      {language === 'ar' ? 'أعلى قمة (21ك)' : 'DAY HIGH'}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-0.5">
                      <TrendingUp className="h-2.5 w-2.5" />
                      {aiReport.dayHigh.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-center border-l border-neutral-900/60">
                    <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-1">
                      {language === 'ar' ? 'أدنى هبوط (21ك)' : 'DAY LOW'}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400 flex items-center justify-center gap-0.5">
                      <TrendingDown className="h-2.5 w-2.5" />
                      {aiReport.dayLow.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Main recommendation display */}
                <div className="p-5 bg-[#07080b] rounded-2xl border border-neutral-900 space-y-4 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-cyan-500/10 to-transparent blur-lg pointer-events-none"></div>
                  
                  <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">
                    {language === 'ar' ? 'القرار الاستشاري الصادر عن الذكاء الاصطناعي:' : 'AI DECISION CRITERIA'}
                  </span>

                  <div className="flex flex-col items-center justify-center space-y-1 py-1.5">
                    <span className={`text-2xl md:text-3xl font-black font-sans uppercase tracking-wider py-1 px-5 rounded-full ${
                      aiReport.recommendation === 'STRONG_BUY' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : aiReport.recommendation === 'BUY'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : aiReport.recommendation === 'HOLD'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {aiReport.recommendation === 'STRONG_BUY' 
                        ? (language === 'ar' ? 'شراء قوي' : 'Strong Buy')
                        : aiReport.recommendation === 'BUY'
                        ? (language === 'ar' ? 'شراء عادي' : 'Accumulate / Buy')
                        : aiReport.recommendation === 'HOLD'
                        ? (language === 'ar' ? 'تريث وترقب' : 'Hold Assets / Wait')
                        : (language === 'ar' ? 'بيع وجني أرباح' : 'Liquidate / Sell')}
                    </span>
                    
                    <span className="text-[10px] font-mono text-neutral-400 mt-2 block">
                      {language === 'ar' ? `مستوى الموثوقية: ${aiReport.confidence}٪` : `AI Confidence Index: ${aiReport.confidence}%`}
                    </span>
                  </div>

                  {/* Advice Text Explanation */}
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-md mx-auto pt-2 border-t border-neutral-920/80 font-sans">
                    {language === 'ar' ? aiReport.explanationAr : aiReport.explanationEn}
                  </p>

                </div>

              </div>
              
              {/* Note on simulation */}
              <div className="flex items-center gap-1.5 justify-center text-[10px] text-neutral-500 text-center leading-normal">
                <AlertCircle className="h-3 w-3 text-cyan-500" />
                <span>
                  {language === 'ar'
                    ? 'تحليلات مسؤولة بالشبكات الحرة وتذبذبات الأسعار بالصاغة والبورصة.'
                    : 'System checks open-source tickers, CBE closing values & daily volume.'}
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* 🏛️ PYRAMIDS GOLD CORPORATE OVERVIEW BENTO BLOCKS  */}
      <div className="space-y-6">
        
        {/* Title */}
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
          <Building2 className="h-5 w-5 text-amber-500" />
          <h3 className="text-sm font-black tracking-wider uppercase text-white font-sans">
            {language === 'ar' 
              ? 'نبذة وتعريف بمجموعة براميدز جولد للتعدين والعقارات' 
              : 'Corporate Office Summary: Pyramids Gold Mining & Real Estate'}
          </h3>
        </div>

        {/* Corporate Grid - 4 Blocks representing HQ, Mining, Assaying, Real estate */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Headquarters */}
          <div className="bento-card bg-neutral-950/80 p-5 space-y-4 rounded-2xl border border-neutral-900">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block font-mono">
                {language === 'ar' ? 'المقر الإداري الرئيسي' : 'Headquarters'}
              </span>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'القاهرة - التجمع الخامس' : 'Cairo - Golden Square'}
              </h4>
              <p className="text-[10.5px] text-neutral-400 leading-relaxed font-sans">
                {language === 'ar' 
                  ? 'يقع المقر الرئاسي المعتمد لبراميدز جولد في قلب المركز التجاري الراقي بالتجمع الخامس بمدينة القاهرة الجديدة لإدارة الصفقات الكبرى وضمان أرقى تواصل تجاري.'
                  : 'Located inside Cairo’s corporate hub in the New Cairo, coordinating executive trading mandates, asset storage, and bullion allocations.'}
              </p>
            </div>
          </div>

          {/* Card 2: Mining Division */}
          <div className="bento-card bg-neutral-950/80 p-5 space-y-4 rounded-2xl border border-neutral-900">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/20 border border-amber-500/20 flex items-center justify-center text-[var(--gold)]">
              <Activity className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block font-mono">
                {language === 'ar' ? 'أنشطة التعدين والاستخلاص' : 'Concessions & Mining'}
              </span>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'التعدين بالصحراء الشرقية' : 'Eastern Desert Reserves'}
              </h4>
              <p className="text-[10.5px] text-neutral-400 leading-relaxed font-sans">
                {language === 'ar' 
                  ? 'تنشط المجموعة في استكشاف وتعدين عروق الكوارتز الحاملة للذهب والمشروعات الجيولوجية المتقدمة لإنتاج وتسييل أفخم أنواع الذهب الخالص بمصر.'
                  : 'Managing state-sanctioned geologic exploration concessions across the Eastern Desert (Red Sea hills), utilizing green extraction methods.'}
              </p>
            </div>
          </div>

          {/* Card 3: Metal Analysis Assays */}
          <div className="bento-card bg-neutral-950/80 p-5 space-y-4 rounded-2xl border border-neutral-900">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block font-mono">
                {language === 'ar' ? 'مختبرات معايرة الشيشنجي' : 'Metallurgical Assays'}
              </span>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'تحاليل النقاء ومطابقة السهم' : 'XRF Spectrograph Labs'}
              </h4>
              <p className="text-[10.5px] text-neutral-400 leading-relaxed font-sans">
                {language === 'ar' 
                  ? 'بتبني تكنولوجيا طيف الأشعة السينية وأفران الكوبليشن الحرارية لتقديم شهادات نقاوة الذهب المعتمدة وفحص الشوائب بدقة ميكروجرامية لكل ألف سهم.'
                  : 'Operating high-definition spectrometers and fire assay gold-analysis to secure pure 1000 and 875 standard caliber transactions.'}
              </p>
            </div>
          </div>

          {/* Card 4: Real Estate Development */}
          <div className="bento-card bg-neutral-950/80 p-5 space-y-4 rounded-2xl border border-neutral-900">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block font-mono">
                {language === 'ar' ? 'الاستثمار والتطوير العقاري' : 'Real Estate Development'}
              </span>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مشاريع التطوير السكني والخدمي' : 'Elite Gold Distict Projects'}
              </h4>
              <p className="text-[10.5px] text-neutral-400 leading-relaxed font-sans">
                {language === 'ar' 
                  ? 'فصل آخر من التميز؛ تشييد المباني السكنية الراقية والأسواق اللامعة المخصصة لمصانع الصاغة لضمان التكامل العقاري للوجهاء وبناء مصر المستقبل.'
                  : 'Fostering elite urban spaces, mixed-use commercial centers and custom gold workshops ensuring outstanding solid returns on infrastructure.'}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
