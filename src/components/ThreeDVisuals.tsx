import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Gauge, Sparkles, TrendingUp, Cpu, Info, Shield, Scaling } from 'lucide-react';
import { Language } from '../types';

interface ThreeDBullionProps {
  language: Language;
  price24K: number;
  price21K: number;
}

export const ThreeDBullion: React.FC<ThreeDBullionProps> = ({ language, price24K, price21K }) => {
  // Tilt angles for the bento card
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Active trading metric ticks
  const [volume, setVolume] = useState<number>(842.35);
  const [priceChange, setPriceChange] = useState<number>(1.24);

  // Live fluctuating values for trade liveness
  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(prev => prev + (Math.random() - 0.49) * 2.5);
      setPriceChange(prev => {
        const change = prev + (Math.random() - 0.49) * 0.08;
        return Math.max(0.1, Math.min(3.5, change));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Relative coordinates from card center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate rotation angles (cap max tilt at 15 degrees)
    const factorX = 14;
    const factorY = 14;
    setRotateX(-(y / (rect.height / 2)) * factorX);
    setRotateY((x / (rect.width / 2)) * factorY);
  };

  const handlePointerLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  // Dimensions of gold bar (3D container width/height/depth)
  const barW = 80;
  const barH = 34;
  const barD = 180;

  return (
    <div 
      className="w-full select-none"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={() => setIsHovered(true)}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: isHovered ? 1.015 : 1
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="bento-card border border-blue-500/35 bg-gradient-to-br from-neutral-950 via-blue-950/15 to-neutral-900 shadow-[0_15px_45px_-10px_rgba(37,99,235,0.22)] p-6 relative flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing min-h-[440px]"
      >
        {/* Holographic grid overlay in background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-xl"></div>
        
        {/* Radial sheen light spot mimicking mouse glare */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle 220px at ${rotateY * 12 + 150}px ${-rotateX * 12 + 150}px, rgba(37,99,235,0.18), transparent 70%)`
          }}
        ></div>

        {/* 3D Header Indicators */}
        <div className="flex items-center justify-between z-10" style={{ transform: 'translateZ(30px)' }}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase font-mono flex items-center gap-1.5">
              <Cpu className="h-3 w-3 animate-pulse text-cyan-400" />
              {language === 'ar' ? 'منصة بورصة الذهب ثلاثية الأبعاد' : 'PRO 3D GOLD EXCHANGE'}
            </span>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              {language === 'ar' ? 'التسعير المجسم التفاعلي' : 'Interactive Bullion Ledger'}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="font-mono text-[10px] font-black text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/20">
              3D PERSPECTIVE
            </span>
          </div>
        </div>

        {/* Main Central 3D Container Section */}
        <div className="relative h-56 flex items-center justify-center my-4 overflow-visible">
          
          {/* Holographic floating price badge in background */}
          <div 
            className="absolute left-4 top-2 bg-black/60 border border-blue-500/35 rounded-xl p-3 z-2 overlay-3d flex flex-col justify-center transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            style={{ transform: 'translateZ(45px)' }}
          >
            <span className="text-[9px] font-bold text-neutral-500 uppercase font-mono block mb-0.5">XAU / USD</span>
            <span className="text-base font-black font-mono text-white tracking-tight flex items-center gap-1">
              $2,368.60 
              <span className="text-[10px] text-emerald-400 font-extrabold font-mono">+{priceChange.toFixed(2)}%</span>
            </span>
            <div className="h-1.5 w-16 bg-blue-950/60 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="h-full bg-blue-400 rounded-full"
                animate={{ width: `${60 + priceChange * 10}%` }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>

          <div 
            className="absolute right-4 bottom-2 bg-black/60 border border-yellow-500/25 rounded-xl p-3 z-2 overlay-3d flex flex-col justify-center transition-all shadow-[0_0_15px_rgba(234,179,8,0.1)]"
            style={{ transform: 'translateZ(55px)' }}
          >
            <span className="text-[9px] font-bold text-neutral-500 uppercase font-mono block mb-0.5">
              {language === 'ar' ? 'عيار ٢٤ محلي' : 'Local 24K Rate'}
            </span>
            <span className="text-base font-black font-mono text-yellow-500 tracking-tight">
              EGP {price24K.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 0 })}
            </span>
            <div className="flex items-center gap-1 mt-1 text-[9px] font-semibold text-neutral-500 font-mono">
              <TrendingUp className="h-3 w-3 text-yellow-400" />
              <span>{language === 'ar' ? 'أعلى دقة مستقرة' : 'High Precision Lock'}</span>
            </div>
          </div>

          {/* THE 100% PURE 3D CSS SPINNING GOLD BULLET BAR */}
          <div 
            className="relative scale-90 sm:scale-100"
            style={{ 
              perspective: '1000px', 
              transform: 'translateZ(10px)',
              width: `${barW}px`,
              height: `${barW}px`,
            }}
          >
            <motion.div
              animate={{ 
                rotateX: [12, 12, 12],
                rotateY: [0, 360],
                rotateZ: [-5, -5]
              }}
              transition={{ 
                duration: 22, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                width: `${barW}px`,
                height: `${barH}px`,
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: `-${barH/2}px`,
                marginLeft: `-${barW/2}px`
              }}
            >
              {/* Face 1: FRONT FACE OF GOLD BAR */}
              <div 
                className="absolute border border-yellow-300/30 font-mono"
                style={{
                  width: `${barW}px`,
                  height: `${barH}px`,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 35%, #d97706 70%, #fbbf24 100%)',
                  transform: `rotateY(0deg) translateZ(${barD/2}px)`,
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 'black',
                  color: '#92400e',
                  textShadow: '0 1px 0 rgba(255,255,255,0.4)',
                  borderRadius: '4px'
                }}
              >
                <span>FINE GOLD 999.9</span>
              </div>

              {/* Face 2: BACK FACE OF GOLD BAR */}
              <div 
                className="absolute border border-yellow-300/30"
                style={{
                  width: `${barW}px`,
                  height: `${barH}px`,
                  background: 'linear-gradient(135deg, #d97706 0%, #fbbf24 45%, #92400e 80%, #f59e0b 100%)',
                  transform: `rotateY(180deg) translateZ(${barD/2}px)`,
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
                  borderRadius: '4px'
                }}
              />

              {/* Face 3: LEFT SIDE */}
              <div 
                className="absolute border border-yellow-300/20"
                style={{
                  width: `${barD}px`,
                  height: `${barH}px`,
                  background: 'linear-gradient(to right, #b45309, #fbbf24, #d97706, #b45309)',
                  transform: `rotateY(-90deg) translateX(-${barD/2}px)`,
                  transformOrigin: 'left center',
                  boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
                  borderRadius: '2px'
                }}
              />

              {/* Face 4: RIGHT SIDE */}
              <div 
                className="absolute border border-yellow-300/20"
                style={{
                  width: `${barD}px`,
                  height: `${barH}px`,
                  background: 'linear-gradient(to left, #b45309, #fef08a, #d97706, #b45309)',
                  transform: `rotateY(90deg) translateX(-${barD/2}px) translateZ(-${barW}px)`,
                  transformOrigin: 'left center',
                  boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
                  borderRadius: '2px'
                }}
              />

              {/* Face 5: TOP PLATE (Beveled slant face of bullion) */}
              <div 
                className="absolute border border-yellow-300/40 p-2 flex flex-col justify-between"
                style={{
                  width: `${barW}px`,
                  height: `${barD}px`,
                  background: 'linear-gradient(to bottom, #fbbf24, #fef08a 25%, #f59e0b 75%, #b45309 100%)',
                  transform: `rotateX(90deg) translateZ(${barD/2}px)`,
                  transformOrigin: 'center center',
                  boxShadow: 'inset 0 0 15px rgba(255,255,255,0.4), 0 5px 15px rgba(0,0,0,0.5)',
                  fontSize: '8px',
                  fontWeight: 'black',
                  color: '#78350f',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderRadius: '3px'
                }}
              >
                <div className="flex justify-between items-center opacity-85">
                  <span>PG</span>
                  <span>999.9</span>
                </div>
                
                <div className="text-center font-bold tracking-widest text-[10px] my-auto border-y border-amber-900/10 py-1 bg-amber-500/5">
                  PYRAMIDS
                </div>

                <div className="flex justify-between items-center opacity-85 font-mono">
                  <span>NET WT</span>
                  <span>1000g</span>
                </div>
              </div>

              {/* Face 6: BOTTOM PLATE */}
              <div 
                className="absolute"
                style={{
                  width: `${barW}px`,
                  height: `${barD}px`,
                  background: '#78350f',
                  transform: `rotateX(-90deg) translateZ(${barH - barD/2}px)`,
                  transformOrigin: 'center center',
                  boxShadow: '0 10px 45px rgba(0,0,0,0.8)'
                }}
              />
            </motion.div>
          </div>

          {/* Holographic rings & particle orbit lines in perspective */}
          <div 
            className="absolute rounded-full border-1.5 border-dashed border-cyan-500/20 h-44 w-44 pointer-events-none animate-[spin_50s_linear_infinite]"
            style={{ transform: 'rotateX(75deg) translateZ(-10px)' }}
          ></div>
          <div 
            className="absolute rounded-full border border-blue-500/15 h-56 w-56 pointer-events-none animate-[spin_35s_linear_infinite_reverse]"
            style={{ transform: 'rotateX(75deg) translateZ(-25px)' }}
          ></div>
          {/* Virtual pedestal */}
          <div 
            className="absolute rounded-full bg-gradient-to-t from-blue-900/15 to-transparent h-16 w-16 pointer-events-none filter blur-sm"
            style={{ transform: 'rotateX(80deg) translateZ(-65px)' }}
          ></div>

        </div>

        {/* 3D Footer Live stats and transaction metrics */}
        <div 
          className="border-t border-neutral-800/60 pt-4 grid grid-cols-2 gap-4 z-10"
          style={{ transform: 'translateZ(25px)' }}
        >
          <div className="space-y-0.5">
            <span className="text-[9px] text-neutral-500 font-bold uppercase font-mono block">
              {language === 'ar' ? 'حجم التدفق العالمي' : 'Global Flow Vol'}
            </span>
            <span className="text-xs font-bold font-mono text-neutral-200">
              {volume.toFixed(2)} Kg/S
            </span>
          </div>

          <div className="space-y-0.5 text-right">
            <span className="text-[9px] text-neutral-500 font-bold uppercase font-mono block">
              {language === 'ar' ? 'ثبات شبكة التمكين' : 'Exchange Node Ping'}
            </span>
            <span className="text-xs font-bold font-mono text-cyan-400">
              12ms (Secure)
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};


// 3D ASSAYER BALANCE SCALE FOR CALCULATOR
interface ThreeDAssayerScaleProps {
  language: Language;
  rawWeight: number;
  purity: number;
  cleanWeight21K: number;
  currencyPrice21K: number;
}

export const ThreeDAssayerScale: React.FC<ThreeDAssayerScaleProps> = ({
  language,
  rawWeight,
  purity,
  cleanWeight21K,
  currencyPrice21K
}) => {
  // Rotate factor based on equivalent weight vs raw weight
  // If raw weight is weighted higher but purity is lower, or vice versa
  // Golden balance: purity 875 is straight balanced. 
  // Purity > 875 tilts right down. Purity < 875 tilts left down. If weight is 0, completely steady
  const relativeTilt = rawWeight > 0 ? ((purity - 875) / 500) * 20 : 0;
  const tiltedAngle = Math.max(-20, Math.min(20, relativeTilt)); // Cap at 20 degrees max tilt

  return (
    <div className="w-full flex flex-col gap-5 select-none" style={{ perspective: '1000px' }}>
      <div 
        className="bento-card border border-blue-500/25 bg-neutral-950 p-6 relative flex flex-col justify-between overflow-hidden min-h-[430px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Holographic matrix background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none rounded-xl"></div>
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-500/[0.03] blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase font-mono flex items-center gap-1.5">
              <Scaling className="h-3.5 w-3.5 text-blue-400" />
              {language === 'ar' ? 'محاكي ميزان الصاغة ثلاثي الأبعاد' : '3D ANALYTICAL BALANCE SIMULATOR'}
            </span>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
              {language === 'ar' ? 'مقايسة توازن الذهب الفني الكيميائية' : 'Visual Calibration Balance'}
            </h3>
          </div>
          
          <span className="rounded-full bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 text-[9px] text-cyan-400 font-mono font-black animate-pulse">
            {language === 'ar' ? 'معاير نشط' : 'SYSTEM CALIBRATED'}
          </span>
        </div>

        {/* 3D Physical Scale Drawing viewport with pure CSS and clean layouts */}
        <div className="relative h-64 flex items-center justify-center my-2 overflow-visible">
          
          {/* Left indicator bubble (Raw Weight) */}
          <div 
            className="absolute left-1 top-4 bg-black/60 border border-neutral-800 rounded-lg p-2 flex flex-col text-left z-10 transition-all font-mono"
            style={{ transform: 'translateZ(30px)' }}
          >
            <span className="text-[8px] font-extrabold text-neutral-500 uppercase">{language === 'ar' ? 'الخام المدخل' : 'RAW CRAP'}</span>
            <span className="text-xs font-black text-white">{rawWeight > 0 ? `${rawWeight.toFixed(2)}g` : '-'}</span>
            <span className="text-[7px] text-blue-400 font-bold mt-0.5">{purity > 0 ? `${purity} ${language === 'ar' ? 'سهم' : 'Shares'}` : '-'}</span>
          </div>

          {/* Right indicator bubble (Equivalent Net 21K Weight) */}
          <div 
            className="absolute right-1 top-4 bg-black/60 border border-blue-500/30 rounded-lg p-2 flex flex-col text-right z-10 transition-all font-mono"
            style={{ transform: 'translateZ(30px)' }}
          >
            <span className="text-[8px] font-extrabold text-blue-400 uppercase">{language === 'ar' ? 'عيار ٢١ المكافئ' : 'NET 21K WEIGHT'}</span>
            <span className="text-xs font-black text-blue-400">{cleanWeight21K > 0 ? `${cleanWeight21K.toFixed(3)}g` : '-'}</span>
            <span className="text-[7px] text-neutral-500 font-bold mt-0.5">{language === 'ar' ? 'نظام ليزر الكتروني' : 'Balanced Equivalent'}</span>
          </div>

          {/* 3D BALANCE SCALE MODEL STRUCTURE */}
          <div 
            className="relative w-full max-w-[260px] h-full flex flex-col items-center justify-center"
            style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
          >
            
            {/* 1. Main Base Pedestal Platform */}
            <div 
              className="absolute bottom-8 w-44 h-2.5 bg-gradient-to-t from-neutral-850 to-neutral-950 border border-neutral-800 rounded-sm"
              style={{ transform: 'rotateX(65deg) translateZ(-40px)', boxShadow: '0 8px 25px rgba(0,0,0,0.8), 0 0 10px rgba(59,130,246,0.05)' }}
            />

            {/* 2. Main Vertical Solid Pillars */}
            <div 
              className="absolute bottom-10 w-3 h-32 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-900 border-x border-neutral-700/50"
              style={{ transform: 'translateZ(-5px)' }}
            />
            {/* Central Dial indicator needle */}
            <motion.div 
              className="absolute bottom-32 w-1 h-14 bg-red-500 origin-bottom"
              animate={{ rotate: tiltedAngle }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              style={{ transform: 'translateZ(5px)' }}
            />
            {/* Center Golden pivot node */}
            <div 
              className="absolute top-18 h-4 w-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 border border-yellow-300 shadow shadow-amber-500/20 z-10"
              style={{ transform: 'translateZ(10px)' }}
            />

            {/* 3. Horizontal Tilted Beam */}
            <motion.div
              className="absolute top-19 w-48 h-2 bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-400 border-y border-neutral-500 rounded-full flex justify-between px-2 items-center"
              style={{ originX: '0.5', originY: '0.5' }}
              animate={{ rotate: tiltedAngle }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              {/* Left Beam Cap */}
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
              {/* Right Beam Cap */}
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>

              {/* DYNAMIC SWING TRYS ATTACHMENTS (Left Tray and Right Tray) */}
              
              {/* LEFT SCRAP GOLD TRAY */}
              <motion.div
                className="absolute left-[-2px] top-1.5 w-12 flex flex-col items-center"
                style={{ originX: '0.5', originY: '0' }}
                animate={{ rotate: -tiltedAngle }} // Opposite rotation so the trays dangle straight down! Very realistic!
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              >
                {/* Visual support wires (dangling lines) */}
                <svg className="w-10 h-20 text-neutral-600/60 overflow-visible" fill="none">
                  <path d="M 20 0 L 2 54 M 20 0 L 38 54" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" />
                </svg>

                {/* Left tray pan holding raw gold scrap */}
                <div 
                  className="w-12 h-1.5 bg-gradient-to-t from-neutral-800 to-neutral-900 border border-neutral-700/60 rounded-full mt-[-8px] flex items-center justify-center relative shadow-md"
                  style={{ transform: 'rotateX(75deg)' }}
                >
                  {/* Glowing sphere representing raw melting gold */}
                  {rawWeight > 0 && (
                    <motion.div 
                      key="raw-gold-3d"
                      initial={{ scale: 0 }}
                      animate={{ scale: Math.max(0.4, Math.min(1.2, rawWeight / 50)) }}
                      className="absolute bottom-1 h-5 w-5 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 filter blur-[1px] shadow-[0_0_12px_rgba(245,158,11,0.8)] border border-yellow-300/40"
                      style={{ transform: 'translateY(-8px) rotateX(-75deg)' }}
                    />
                  )}
                </div>
              </motion.div>

              {/* RIGHT EQUIVALENT 21K TRAY */}
              <motion.div
                className="absolute right-[-2px] top-1.5 w-12 flex flex-col items-center"
                style={{ originX: '0.5', originY: '0' }}
                animate={{ rotate: -tiltedAngle }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              >
                {/* Visual support wires (dangling lines) */}
                <svg className="w-10 h-20 text-neutral-600/60 overflow-visible" fill="none">
                  <path d="M 20 0 L 2 54 M 20 0 L 38 54" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" />
                </svg>

                {/* Right tray pan holding calibrated gold */}
                <div 
                  className="w-12 h-1.5 bg-gradient-to-t from-neutral-800 to-neutral-900 border border-neutral-700/60 rounded-full mt-[-8px] flex items-center justify-center relative shadow-md"
                  style={{ transform: 'rotateX(75deg)' }}
                >
                  {/* Flawless gold pyramid/cube representing 21K equivalent pristine output */}
                  {cleanWeight21K > 0 && (
                    <motion.div 
                      key="clean-gold-3d"
                      initial={{ scale: 0 }}
                      animate={{ scale: Math.max(0.4, Math.min(1.2, cleanWeight21K / 50)) }}
                      className="absolute bottom-1 h-4 w-4 bg-gradient-to-br from-cyan-400 to-blue-600 border border-cyan-300/40 shadow-[0_0_15px_rgba(37,99,235,0.8)] rounded-sm"
                      style={{ transform: 'translateY(-6px) rotateX(-75deg) rotateY(45deg)' }}
                    />
                  )}
                </div>
              </motion.div>

            </motion.div>

          </div>

        </div>

        {/* 3D Footer calibration telemetry */}
        <div className="border-t border-neutral-900 pt-4.5">
          <div className="flex items-center gap-2.5 text-[11px] text-neutral-500 bg-neutral-950/60 border border-neutral-900 p-3 rounded-xl">
            <Shield className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {language === 'ar' 
                ? 'الحساب الكيميائي للميزان: يحاكي استقرار المعايرة بناء على عيار الصاغة بالأسهم. عند زيادة الذهب عن عيار 875 تميل الكفة اليمنى لصالح الذهب الأكثر نقاوة.'
                : 'Purity ratio index balances dynamically. When input purity exceeds standard 875 (21K), the right balance tray drops proportionately.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};




