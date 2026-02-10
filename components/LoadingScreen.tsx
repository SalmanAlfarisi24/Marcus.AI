import React, { useEffect, useState } from 'react';
import { STOIC_QUOTES } from '../constants';
import { LanguageCode } from '../types';

interface LoadingScreenProps {
  lang: LanguageCode;
  t: any;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ lang, t }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = STOIC_QUOTES[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <div className="fixed inset-0 bg-stone-900 z-40 flex flex-col items-center justify-center p-8 text-center fade-in">
      <div className="w-16 h-16 border-4 border-stone-700 border-t-stone-300 rounded-full animate-spin mb-8"></div>
      
      <p className="text-stone-400 text-xs tracking-widest uppercase mb-6">
        {t.loading}
      </p>

      <div className="max-w-lg h-32 flex items-center justify-center">
        <p key={quoteIndex} className="text-xl font-serif text-stone-200 italic fade-in transition-all duration-500">
          "{quotes[quoteIndex]}"
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
