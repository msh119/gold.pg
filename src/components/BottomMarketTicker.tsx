import React, { useState, useEffect } from 'react';
import { GoldPrices, Language, TickerSettings } from '../types';
import { Sparkles, TrendingUp, DollarSign, Building2, Globe, Flame, Clock } from 'lucide-react';

interface BottomMarketTickerProps {
  prices: GoldPrices;
  language: Language;
  tickerSettings: TickerSettings;
}

export const BottomMarketTicker: React.FC<BottomMarketTickerProps> = ({ prices, language, tickerSettings }) => {
  const isAr = language === 'ar';

  const [financialNews, setFinancialNews] = useState<string[]>([]);
  const [politicalNews, setPoliticalNews] = useState<string[]>([]);
  const [liveTime, setLiveTime] = useState<string>('');
  const [loadingNews, setLoadingNews] = useState<boolean>(true);

  // Digital countdown watch & news pull logic
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);

    const loadLiveNews = async () => {
      try {
        const response = await fetch('/api/live-news');
        if (response.ok) {
          const data = await response.json();
          if (data.financial && data.financial.length > 0) {
            setFinancialNews(data.financial);
          }
          if (data.political && data.political.length > 0) {
            setPoliticalNews(data.political);
          }
        }
      } catch (err) {
        console.warn('Silent bypass live internet news fetching (using static defaults):', err);
      } finally {
        setLoadingNews(false);
      }
    };

    loadLiveNews();
    const newsTimer = setInterval(loadLiveNews, 90000); // Poll news every 90 seconds

    return () => {
      clearInterval(clockTimer);
      clearInterval(newsTimer);
    };
  }, [isAr]);

  // Static Local Premium fallback lists in case internet RSS feed is offline/unreachable
  const defaultFinancial = [
    isAr ? "الذهب يسجل مستويات قياسية في صاغة مصر والطلب يرتفع للاستثمار والادخار" : "Gold prices hit record peaks in Egypt's markets amid secure investment and savings demand",
    isAr ? "عقود الذهب الآجلة تستقر في التعاملات الدولية ترقباً لمصير الفائدة الاقتصادية" : "Global gold futures trade stable as international markets monitor policy interest rates",
    isAr ? "توقعات بانفراجة كبرى وتدفقات دولارية تسهم في تعزيز مرونة الجنيه وسعر الصرف" : "Analysts project major USD inflows favoring Egyptian Pound resiliency and exchange bounds",
    isAr ? "الاستثمارات الصناعية تنمو بقوة وتحول المستثمرين نحو أصول الذهب والملاذات الآمنة" : "Industrial investments surge as smart traders shift towards gold bullion assets",
    isAr ? "البنك المركزي يواصل مساعيه للتصدي لمعدلات التضخم وضبط السيولة النقدية" : "The Central Bank scales measures to Moderate monetary liquidity and anchor local inflation",
    isAr ? "ارتفاع ملحوظ لمؤشرات أسهم القطاع المالي واللوجستي في البورصة المصرية اليوم" : "Notable upward momentum for financial sector stock indices in the Egyptian Exchange",
  ];

  const defaultPolitical = [
    isAr ? "دبلوماسية مصرية رفيعة المستوى لتعزيز التهدئة وتأمين ممرات التجارة بالشرق الأوسط" : "High-level Egyptian diplomacy leads dialogue to stabilize maritime and local trade paths",
    isAr ? "القمة الإقليمية تدعو لتوثيق التكامل السياسي وتنمية البنى الاقتصادية لدول الجوار" : "Regional Arab Summit urges stronger economic integration and joint policy cooperation",
    isAr ? "الحكومة المصرية تؤكد مواصلة وتيرة تطوير الموانئ الاستراتيجية وصناعات الدواء والصلب" : "Egyptian Cabinet emphasizes persistent expansion of strategic ports, steel, and pharma",
    isAr ? "إشادات صحية دولية بمستويات نجاح المبادرات الرئاسية لتعزيز جودة رعاية المسنين والأطفال" : "World health organizations acclaim Egypt's robust primary care initiatives and medical aids",
    isAr ? "محادثات استراتيجية مع الشركاء بالخليج والأوربيين لضخ تجمعات استثمارية كبرى" : "Strategic talks with European and Gulf allies yield prospective multi-billion enterprise agreements",
  ];

  const activeFinancialNews = financialNews.length > 0 ? financialNews : defaultFinancial;
  const activePoliticalNews = politicalNews.length > 0 ? politicalNews : defaultPolitical;

  // Currency exchange variables from Ticker settings config
  const currencyRates = [
    {
      label: isAr ? '🇺🇸 الدولار (USD)' : '🇺🇸 Dollar (USD)',
      buy: tickerSettings.usdRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
      sell: tickerSettings.usdRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
    },
    {
      label: isAr ? '🇪🇺 اليورو (EUR)' : '🇪🇺 Euro (EUR)',
      buy: tickerSettings.eurRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
      sell: tickerSettings.eurRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
    },
    {
      label: isAr ? '🇸🇦 الريال (SAR)' : '🇸🇦 Riyal (SAR)',
      buy: tickerSettings.sarRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
      sell: tickerSettings.sarRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
    },
    {
      label: isAr ? '🇦🇪 الدرهم (AED)' : '🇦🇪 Dirham (AED)',
      buy: tickerSettings.aedRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
      sell: tickerSettings.aedRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
    },
    {
      label: isAr ? '🇰🇼 الدينار (KWD)' : '🇰🇼 Dinar (KWD)',
      buy: tickerSettings.kwdRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
      sell: tickerSettings.kwdRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }),
    },
  ];

  const formatPrice = (val: number) => {
    return val.toLocaleString(isAr ? 'ar-EG' : 'en-US') + ' ' + (isAr ? 'ج.م' : 'EGP');
  };

  const goldItems = [
    { label: isAr ? '🟨 عيار 24' : '🟨 Gold 24K', price: formatPrice(prices.g24) },
    { label: isAr ? '🟡 عيار 21' : '🟡 Gold 21K', price: formatPrice(prices.g21) },
    { label: isAr ? '🟠 عيار 18' : '🟠 Gold 18K', price: formatPrice(prices.g18) },
    { label: isAr ? '🪙 جنيه الذهب' : '🪙 Gold Pound', price: formatPrice(prices.g21 * 8) },
    { label: isAr ? '🌍 أوقية عالمية' : '🌍 Global Ounce', price: `$${tickerSettings.globalGoldOunce.toLocaleString(isAr ? 'ar-EG' : 'en-US')} USD` },
  ];

  return (
    <div 
      id="pyramids-broadcast-console"
      className="fixed bottom-[74px] sm:bottom-[82px] left-0 right-0 z-40 bg-[#070707]/95 backdrop-blur-md border-y border-amber-500/25 select-none overflow-hidden shadow-[0_-12px_36px_rgba(0,0,0,0.9)] flex flex-col"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      
      {/* =========================================================
          TIER 1 TAPE: GOLD PRICES & EXCHANGE RATES (Existing Marquee)
          ========================================================= */}
      <div className="hover-pause relative flex items-center w-full border-b border-neutral-900 bg-black/40 py-1 text-[10.5px] font-mono">
        <div className={`flex whitespace-nowrap items-center gap-10 ${isAr ? 'animate-marquee-fast-rtl' : 'animate-marquee-fast'}`}>
          
          {/* Ticker Loop Chunk 1 */}
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-1 font-sans font-black text-amber-400 text-[10px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
              <Sparkles className="h-3 w-3 animate-pulse text-amber-400" />
              <span>{isAr ? 'أسعار الصاغة مباشر' : 'GOLD RATES LIVE'}</span>
            </span>

            {goldItems.map((item, idx) => (
              <div key={`g1-${idx}`} className="flex items-center gap-1.5 shrink-0">
                <span className="text-neutral-400 font-bold">{item.label}:</span>
                <span className="text-amber-400 font-black tracking-tight">{item.price}</span>
                <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
              </div>
            ))}

            <div className="h-3.5 w-px bg-neutral-800 shrink-0"></div>

            <span className="flex items-center gap-1 font-sans font-black text-[#00ffcc] text-[10px] bg-[#00ffcc]/10 px-2 py-0.5 rounded border border-[#00ffcc]/20 shrink-0">
              <DollarSign className="h-3 w-3 text-[#00ffcc]" />
              <span>{isAr ? 'صرف العملات' : 'CURRENCIES TODAY'}</span>
            </span>

            {currencyRates.map((curr, idx) => (
              <div key={`c1-${idx}`} className="flex items-center gap-1.5 shrink-0">
                <span className="text-neutral-400 font-bold">{curr.label}:</span>
                <span className="text-[#00ffcc] font-black tracking-tight">
                  {isAr ? `شراء ${curr.buy} | بيع ${curr.sell}` : `Buy ${curr.buy} | Sell ${curr.sell}`}
                </span>
              </div>
            ))}
          </div>

          <div className="h-3.5 w-px bg-neutral-700/60 shrink-0"></div>

          {/* Ticker Loop Chunk 2 - Infinite clone */}
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-1 font-sans font-black text-amber-400 text-[10px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
              <Sparkles className="h-3 w-3 animate-pulse text-amber-400" />
              <span>{isAr ? 'أسعار الصاغة مباشر' : 'GOLD RATES LIVE'}</span>
            </span>

            {goldItems.map((item, idx) => (
              <div key={`g2-${idx}`} className="flex items-center gap-1.5 shrink-0">
                <span className="text-neutral-400 font-bold">{item.label}:</span>
                <span className="text-amber-400 font-black tracking-tight">{item.price}</span>
                <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
              </div>
            ))}

            <div className="h-3.5 w-px bg-neutral-800 shrink-0"></div>

            <span className="flex items-center gap-1 font-sans font-black text-[#00ffcc] text-[10px] bg-[#00ffcc]/10 px-2 py-0.5 rounded border border-[#00ffcc]/20 shrink-0">
              <DollarSign className="h-3 w-3 text-[#00ffcc]" />
              <span>{isAr ? 'صرف العملات' : 'CURRENCIES TODAY'}</span>
            </span>

            {currencyRates.map((curr, idx) => (
              <div key={`c2-${idx}`} className="flex items-center gap-1.5 shrink-0">
                <span className="text-neutral-400 font-bold">{curr.label}:</span>
                <span className="text-[#00ffcc] font-black tracking-tight">
                  {isAr ? `شراء ${curr.buy} | بيع ${curr.sell}` : `Buy ${curr.buy} | Sell ${curr.sell}`}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* =========================================================
          TIER 2 TAPE: CNBC ARABIA BUSINESS / FINANCIAL NEWS (أخبار المال)
          ========================================================= */}
      <div className="hover-pause relative flex items-center w-full border-b border-neutral-900 bg-[#090b0d] py-1 text-[10.5px]">
        
        {/* News label badge */}
        <div className={`absolute top-0 bottom-0 z-20 flex items-center gap-1 bg-gradient-to-r from-emerald-950 to-emerald-900 px-3 text-[10px] font-black text-emerald-400 uppercase tracking-wider border-amber-500/10 shrink-0 shadow-lg ${isAr ? 'right-0 border-l' : 'left-0 border-r'}`}>
          <Building2 className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
          <span>{isAr ? 'مال وأعمال' : 'FINANCIAL NEWS'}</span>
        </div>

        <div className={`flex whitespace-nowrap items-center gap-12 ${isAr ? 'animate-marquee-slow-rtl pr-24 sm:pr-28' : 'animate-marquee-slow pl-24 sm:pl-28'}`}>
          
          <div className="flex items-center gap-12">
            {activeFinancialNews.map((news, idx) => (
              <div key={`fn1-${idx}`} className="flex items-center gap-2 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-200 font-medium hover:text-emerald-300 transition-colors cursor-default">{news}</span>
              </div>
            ))}
          </div>

          <div className="h-3 w-px bg-neutral-800 shrink-0"></div>

          {/* Infinite Clone */}
          <div className="flex items-center gap-12">
            {activeFinancialNews.map((news, idx) => (
              <div key={`fn2-${idx}`} className="flex items-center gap-2 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-200 font-medium hover:text-emerald-300 transition-colors cursor-default">{news}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* =========================================================
          TIER 3 TAPE: LOCAL & GLOBAL POLITICS (أخبار السياسة والتنمية)
          ========================================================= */}
      <div className="hover-pause relative flex items-center w-full bg-[#0d0707] py-1 text-[10.5px]">
        
        {/* Breaking News label badge */}
        <div className={`absolute top-0 bottom-0 z-20 flex items-center gap-1 bg-gradient-to-r from-red-950 to-red-900 px-3 text-[10px] font-black text-red-400 uppercase tracking-wider shrink-0 shadow-lg ${isAr ? 'right-0 border-l border-red-500/10' : 'left-0 border-r border-red-500/10'}`}>
          <Globe className="h-3.5 w-3.5 animate-bounce text-red-500" />
          <span>{isAr ? 'السياسة والعالم' : 'POLITICAL DECK'}</span>
        </div>

        <div className={`flex whitespace-nowrap items-center gap-12 ${isAr ? 'animate-marquee-slow-rtl pr-24 sm:pr-28' : 'animate-marquee-slow pl-24 sm:pl-28'}`}>
          
          <div className="flex items-center gap-12">
            {activePoliticalNews.map((news, idx) => (
              <div key={`pn1-${idx}`} className="flex items-center gap-2 shrink-0">
                <span className="font-extrabold text-[#ff4c4c]">{isAr ? 'عاجل •' : 'BREAKING •'}</span>
                <span className="text-slate-200 font-medium hover:text-red-300 transition-colors cursor-default">{news}</span>
              </div>
            ))}
          </div>

          <div className="h-3 w-px bg-neutral-800 shrink-0"></div>

          {/* Infinite Clone */}
          <div className="flex items-center gap-12">
            {activePoliticalNews.map((news, idx) => (
              <div key={`pn2-${idx}`} className="flex items-center gap-2 shrink-0">
                <span className="font-extrabold text-[#ff4c4c]">{isAr ? 'عاجل •' : 'BREAKING •'}</span>
                <span className="text-slate-200 font-medium hover:text-red-300 transition-colors cursor-default">{news}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* =========================================================
          STUNNING TV BROADCAST BRANDING PANEL (CNBC / AL-ARABIYA SIDEBAR)
          ========================================================= */}
      <div 
        className={`absolute top-0 bottom-0 z-30 flex items-center justify-between gap-2.5 px-3 bg-gradient-to-b from-[#111111] via-[#09090a] to-[#141416] border-neutral-800 select-none shadow-2xl shrink-0 w-[115px] sm:w-[155px] md:w-[170px]
          ${isAr ? 'left-0 border-r-2 border-amber-500' : 'right-0 border-l-2 border-amber-500'}`}
      >
        {/* Brand Circular Logo Avatar */}
        <div className="relative h-7 w-7 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] shrink-0 bg-neutral-900">
          <img 
            src="https://scontent.fcai19-6.fna.fbcdn.net/v/t39.30808-6/555918514_1376236214503912_7142926422343815940_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-Ee25hTmxCsQ7kNvwFuTPVH&_nc_oc=AdqlyaoAk5d0Tbidf0BDTv33gNOoATPHt8IsqnLkEr8D8HCTA-Lghj9jSqN9Q02pH08&_nc_zt=23&_nc_ht=scontent.fcai19-6.fna&_nc_gid=k43zHmpgIfbl2j-2R1K4ZA&_nc_ss=7b289&oh=00_Af_9jhFH_u1URl5j79AU6yq4YZ8Na-96gHa85T9AbfomEQ&oe=6A2261F2" 
            alt="Pyramids Gold News Logo" 
            className="h-full w-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Live Channel details */}
        <div className="flex flex-col text-right justify-center font-sans tracking-tight leading-none overflow-hidden select-none">
          <span className="text-[9px] sm:text-[11px] font-black text-amber-400 tracking-tight leading-none truncate">
            {isAr ? 'بيراميدز مالي' : 'PYRAMIDS FINANCIAL'}
          </span>
          
          <div className="flex items-center gap-1.5 mt-1">
            {/* Live pulsating red indicator lamp */}
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
            </span>
            <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest shrink-0">
              {isAr ? 'عاجل مباشر' : 'LIVE ACCORD'}
            </span>
          </div>
        </div>

        {/* Dynamic ticking digital watch on edge */}
        <div className="hidden sm:flex flex-col border-l border-amber-500/15 pl-2 text-right justify-center shrink-0">
          <Clock className="h-3 w-3 text-amber-500/70 mb-0.5 mx-auto" />
          <span className="text-[9px] font-mono font-bold tracking-wider text-amber-400">
            {liveTime || '00:00:00'}
          </span>
        </div>

      </div>

    </div>
  );
};
