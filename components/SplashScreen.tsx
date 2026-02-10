import React, { useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  t: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, t }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-stone-900 flex flex-col items-center justify-center text-white z-50">
      <div className="animate-pulse flex flex-col items-center">
        {/* Simple SVG Logo */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-24 h-24 mb-6 text-stone-300"
        >
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.756a49.106 49.106 0 019.152 1 .75.75 0 01-.152 1.485h-1.918l2.478 13.626a2.25 2.25 0 01-2.214 2.633H3.904a2.25 2.25 0 01-2.214-2.633L4.168 6.241H2.25a.75.75 0 01-.152-1.485 49.105 49.105 0 019.152-1V3a.75.75 0 01.75-.75zm4.878 13.5l-1.727-9.501H8.85l-1.727 9.501h9.755z" clipRule="evenodd" />
        </svg>
        
        <h1 className="text-3xl font-serif tracking-widest uppercase mb-2">Marcus.AI</h1>
        <p className="text-stone-500 text-sm tracking-widest">{t.splashSub}</p>
      </div>
    </div>
  );
};

export default SplashScreen;
