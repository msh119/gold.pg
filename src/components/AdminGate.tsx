import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../utils/translations';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Unlock, ArrowRight, Eye, EyeOff, Globe2, Sparkles } from 'lucide-react';

interface AdminGateProps {
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onUnlock: () => void;
}

export function AdminGate({ language, onSetLanguage, onUnlock }: AdminGateProps) {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  // Auto focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleVerify = (codeToVerify: string) => {
    if (codeToVerify === 'mas2026') {
      setIsVerifying(true);
      setErrorStatus(false);
      // Soft transition play
      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      setErrorStatus(true);
      // Shake animation trigger then empty passcode
      setTimeout(() => {
        setErrorStatus(false);
        setPasscode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 700);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(passcode);
  };

  const handleKeyPress = (char: string) => {
    if (passcode.length < 15) {
      const nextCode = passcode + char;
      setPasscode(nextCode);
      // Instantly verify if they typed the correct one
      if (nextCode === 'mas2026') {
        handleVerify(nextCode);
      }
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPasscode('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden select-none">
      
      {/* Background Watermark/Aesthetic Glows */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-600/20 via-amber-700/10 to-transparent blur-3xl" />
      </div>

      {/* TOP HEADER STATUS BAR */}
      <div className="w-full max-w-md flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900/80 border border-neutral-800 rounded-full text-xs text-neutral-400">
          <Globe2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>{isAr ? 'الاتصال مؤمّن ومشفّر' : 'Connection Secured'}</span>
        </div>

        {/* Quick Language Toggle */}
        <button
          onClick={() => onSetLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-amber-400 text-xs transition-all duration-300 cursor-pointer"
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-md flex flex-col justify-center items-center my-auto z-10 relative">
        
        {/* Animated Brand Logo Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mb-8"
        >
          {/* Logo Frame */}
          <div className="relative p-2.5 bg-neutral-950/90 rounded-full border-2 border-amber-600/40 shadow-xl shadow-amber-950/20 mb-4 scale-100 hover:scale-105 transition-transform duration-300">
            <img 
              src="https://scontent.fcai19-6.fna.fbcdn.net/v/t39.30808-6/555918514_1376236214503912_7142926422343815940_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-Ee25hTmxCsQ7kNvwFuTPVH&_nc_oc=AdqlyaoAk5d0Tbidf0BDTv33gNOoATPHt8IsqnLkEr8D8HCTA-Lghj9jSqN9Q02pH08&_nc_zt=23&_nc_ht=scontent.fcai19-6.fna&_nc_gid=k43zHmpgIfbl2j-2R1K4ZA&_nc_ss=7b289&oh=00_Af_9jhFH_u1URl5j79AU6yq4YZ8Na-96gHa85T9AbfomEQ&oe=6A2261F2" 
              alt="Pyramids Gold Studio Unified" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 border border-black shadow">
              <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-neutral-100 font-sans tracking-tight">
            {t.appName}
          </h1>
          <p className="text-xs text-amber-500/80 font-mono tracking-wider uppercase mt-1">
            {isAr ? 'شاشات البث الموحدة المباشرة' : 'Unified Direct Broadcast Screens'}
          </p>
        </motion.div>

        {/* Lock State Card */}
        <motion.div
          animate={errorStatus ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative"
        >
          {errorStatus && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-950/90 border border-red-700/60 rounded-full text-red-400 text-xs font-medium flex items-center gap-1.5 shadow-lg animate-bounce">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.passcodeError}</span>
            </div>
          )}

          <div className="text-center mb-6">
            <h2 className="text-sm font-semibold text-neutral-300">
              {t.adminPasscodeRequired}
            </h2>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              {t.enterPasscode}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Overlay Container */}
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (e.target.value === 'mas2026') {
                    handleVerify(e.target.value);
                  }
                }}
                placeholder={t.passcodePlaceholder}
                className={`w-full bg-neutral-950/80 hover:bg-neutral-950 border text-center font-mono text-lg py-3 rounded-xl focus:outline-none transition-all duration-300 tracking-[0.2em] sm:tracking-[0.3em] font-bold ${
                  errorStatus 
                    ? 'border-red-500 focus:border-red-500 text-red-400' 
                    : passcode.length > 0 
                      ? 'border-amber-500/80 focus:border-amber-500 text-amber-400 shadow-lg shadow-amber-950/20' 
                      : 'border-neutral-800 focus:border-neutral-700 text-white'
                }`}
                disabled={isVerifying}
              />
              
              {/* Show Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1.5 text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Custom Interactive Click Keypad */}
            <div className="grid grid-cols-3 gap-2 px-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="bg-neutral-950 hover:bg-neutral-800 active:bg-neutral-900 border border-neutral-800/60 active:border-amber-500/40 text-neutral-300 font-sans text-lg font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="bg-neutral-950/30 hover:bg-neutral-900 border border-neutral-900 text-neutral-500 hover:text-neutral-300 text-xs font-medium py-2.5 rounded-lg cursor-pointer"
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-800/60 text-neutral-300 font-sans text-lg font-semibold py-2.5 rounded-lg cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="bg-neutral-950/30 hover:bg-neutral-900 border border-neutral-900 text-neutral-500 hover:text-neutral-300 text-xs font-semibold py-2.5 rounded-lg cursor-pointer"
              >
                ←
              </button>
            </div>

            {/* Action Submit Indicator Button */}
            <button
              type="submit"
              disabled={isVerifying || passcode.length === 0}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 mt-4 flex items-center justify-center gap-2 cursor-pointer ${
                isVerifying
                  ? 'bg-amber-600 text-neutral-950'
                  : passcode.length > 0
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/10 active:scale-98'
                    : 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                  <span>{isAr ? 'جاري التحقق والدول...' : 'Verifying...'}</span>
                </div>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>{t.loginButton}</span>
                </>
              )}
            </button>
          </form>

          {/* Secure Hint */}
          <div className="text-center mt-6">
            <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
              Pyramids Gold Studio v2.4.0 • Enterprise
            </span>
          </div>

        </motion.div>

      </div>

      {/* FOOTER METRIC BRAND */}
      <div className="w-full max-w-sm text-center z-10 relative">
        <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
          {isAr 
            ? 'منصة الصهر والمعايرة الفورية المدمجة. للاستخدام الداخلي المصرح به فقط.' 
            : 'Instant Melt & Calculation Integrated Platform. For authorized corporate use only.'}
        </p>
      </div>

    </div>
  );
}
