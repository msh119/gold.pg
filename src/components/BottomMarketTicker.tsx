import React from 'react';
import { GoldPrices, Language, TickerSettings } from '../types';
import { Sparkles, TrendingUp, DollarSign } from 'lucide-react';

interface BottomMarketTickerProps {
  prices: GoldPrices;
  language: Language;
  tickerSettings: TickerSettings;
}

export const BottomMarketTicker: React.FC<BottomMarketTickerProps> = ({ prices, language, tickerSettings }) => {
  const isAr = language === 'ar';
  
  // Dynamic currency rates relative to EGP loaded from tickerSettings (automatic synced or manually configured)
  const currencyRates = [
    { 
      label: isAr ? '🇺🇸 الدولار الأمريكي (USD)' : '🇺🇸 US Dollar (USD)', 
      buy: tickerSettings.usdRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }), 
      sell: tickerSettings.usdRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }) 
    },
    { 
      label: isAr ? '🇪🇺 اليورو الأوروبي (EUR)' : '🇪🇺 Euro (EUR)', 
      buy: tickerSettings.eurRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }), 
      sell: tickerSettings.eurRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }) 
    },
    { 
      label: isAr ? '🇸🇦 الريال السعودي (SAR)' : '🇸🇦 Saudi Riyal (SAR)', 
      buy: tickerSettings.sarRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }), 
      sell: tickerSettings.sarRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }) 
    },
    { 
      label: isAr ? '🇦🇪 الدرهم الإماراتي (AED)' : '🇦🇪 UAE Dirham (AED)', 
      buy: tickerSettings.aedRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }), 
      sell: tickerSettings.aedRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }) 
    },
    { 
      label: isAr ? '🇰🇼 الدينار الكويتي (KWD)' : '🇰🇼 Kuwaiti Dinar (KWD)', 
      buy: tickerSettings.kwdRateBuy.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }), 
      sell: tickerSettings.kwdRateSell.toLocaleString(isAr ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 }) 
    },
  ];

  const formatPrice = (val: number) => {
    return val.toLocaleString(isAr ? 'ar-EG' : 'en-US') + ' ' + (isAr ? 'ج.م' : 'EGP');
  };

  const goldItems = [
    { label: isAr ? '🟨 الذهب عيار 24' : '🟨 Gold 24K', price: formatPrice(prices.g24) },
    { label: isAr ? '🟡 الذهب عيار 21' : '🟡 Gold 21K', price: formatPrice(prices.g21) },
    { label: isAr ? '🟠 الذهب عيار 18' : '🟠 Gold 18K', price: formatPrice(prices.g18) },
    { label: isAr ? '🪙 جنيه الذهب (8 جرام 21K)' : '🪙 Gold Pound (8g 21K)', price: formatPrice(prices.g21 * 8) },
    { label: isAr ? '🌍 أوقية الذهب عالمياً' : '🌍 Gold Ounce Global', price: `$${tickerSettings.globalGoldOunce.toLocaleString(isAr ? 'ar-EG' : 'en-US')} USD` },
  ];


  return (
    <div className="fixed bottom-[74px] sm:bottom-[82px] left-0 right-0 z-40 bg-[#090909]/95 backdrop-blur-md border-y border-amber-500/15 py-2 text-[11px] font-mono select-none overflow-hidden shadow-[0_-8px_24px_rgba(0,0,0,0.8)]">
      <div className="hover-pause relative flex items-center w-full">
        
        {/* Continuous Marquee Ticker Track */}
        <div className={`flex whitespace-nowrap items-center gap-12 ${isAr ? 'animate-marquee-fast-rtl' : 'animate-marquee-fast'}`}>
          
          {/* Ticker Loop Chunk 1 */}
          <div className="flex items-center gap-10">
            {/* Gold Title Prefix */}
            <span className="flex items-center gap-1.5 font-sans font-black text-amber-400 text-[10px] bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <Sparkles className="h-3 w-3 animate-pulse text-amber-400" />
              <span>{isAr ? 'أسعار الذهب مباشر' : 'LIVE GOLD RATES'}</span>
            </span>

            {/* Gold Items details */}
            {goldItems.map((item, idx) => (
              <div key={`g1-${idx}`} className="flex items-center gap-2">
                <span className="text-neutral-400 font-bold">{item.label}:</span>
                <span className="text-amber-400 font-black tracking-tight">{item.price}</span>
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              </div>
            ))}

            <div className="h-4 w-px bg-neutral-800"></div>

            {/* Currency Title Prefix */}
            <span className="flex items-center gap-1.5 font-sans font-black text-[#00ffcc] text-[10px] bg-[#00ffcc]/10 px-2 py-0.5 rounded-full border border-[#00ffcc]/20">
              <DollarSign className="h-3 w-3 text-[#00ffcc]" />
              <span>{isAr ? 'صرف العملات اليوم' : 'EXCHANGE RATES TODAY'}</span>
            </span>

            {/* Currencies details */}
            {currencyRates.map((curr, idx) => (
              <div key={`c1-${idx}`} className="flex items-center gap-2">
                <span className="text-neutral-400 font-bold">{curr.label}:</span>
                <span className="text-[#00ffcc] font-black tracking-tight">
                  {isAr ? `شراء ${curr.buy} | بيع ${curr.sell}` : `Buy ${curr.buy} | Sell ${curr.sell}`}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-neutral-700/60"></div>

          {/* Ticker Loop Chunk 2 - Exact replica for infinite continuous scrolling */}
          <div className="flex items-center gap-10">
            {/* Gold Title Prefix */}
            <span className="flex items-center gap-1.5 font-sans font-black text-amber-400 text-[10px] bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <Sparkles className="h-3 w-3 animate-pulse text-amber-400" />
              <span>{isAr ? 'أسعار الذهب مباشر' : 'LIVE GOLD RATES'}</span>
            </span>

            {/* Gold Items details */}
            {goldItems.map((item, idx) => (
              <div key={`g2-${idx}`} className="flex items-center gap-2">
                <span className="text-neutral-400 font-bold">{item.label}:</span>
                <span className="text-amber-400 font-black tracking-tight">{item.price}</span>
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              </div>
            ))}

            <div className="h-4 w-px bg-neutral-800"></div>

            {/* Currency Title Prefix */}
            <span className="flex items-center gap-1.5 font-sans font-black text-[#00ffcc] text-[10px] bg-[#00ffcc]/10 px-2 py-0.5 rounded-full border border-[#00ffcc]/20">
              <DollarSign className="h-3 w-3 text-[#00ffcc]" />
              <span>{isAr ? 'صرف العملات اليوم' : 'EXCHANGE RATES TODAY'}</span>
            </span>

            {/* Currencies details */}
            {currencyRates.map((curr, idx) => (
              <div key={`c2-${idx}`} className="flex items-center gap-2">
                <span className="text-neutral-400 font-bold">{curr.label}:</span>
                <span className="text-[#00ffcc] font-black tracking-tight">
                  {isAr ? `شراء ${curr.buy} | بيع ${curr.sell}` : `Buy ${curr.buy} | Sell ${curr.sell}`}
                </span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};
