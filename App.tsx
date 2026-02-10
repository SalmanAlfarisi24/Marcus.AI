import React, { useState, useEffect } from 'react';
import { AppRoute, StoicAnalysis, LanguageCode } from './types';
import { UI_TEXT, SUPPORTED_LANGUAGES } from './constants';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import AnalysisResult from './components/AnalysisResult';
import LoadingScreen from './components/LoadingScreen';
import DebateSession from './components/DebateSession';
import { analyzeSituation } from './services/geminiService';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.SPLASH);
  const [userName, setUserName] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<StoicAnalysis | null>(null);
  const [userContext, setUserContext] = useState<string>("");
  
  // State for Language
  const [language, setLanguage] = useState<LanguageCode>('ID');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Translations object
  const t = UI_TEXT[language];

  useEffect(() => {
    // Check local storage for user and language
    const savedName = localStorage.getItem('marcus_username');
    const savedLang = localStorage.getItem('marcus_language') as LanguageCode;
    
    if (savedLang && UI_TEXT[savedLang]) {
      setLanguage(savedLang);
    }
    
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
    localStorage.setItem('marcus_language', code);
    setIsMenuOpen(false);
    
    // Reset app state completely
    setAnalysisData(null);
    setUserContext("");
    setCurrentRoute(AppRoute.SPLASH);
  };

  const handleSplashFinish = () => {
    if (userName) {
      setCurrentRoute(AppRoute.DASHBOARD);
    } else {
      setCurrentRoute(AppRoute.ONBOARDING);
    }
  };

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem('marcus_username', name);
    setUserName(name);
    setCurrentRoute(AppRoute.DASHBOARD);
  };

  const handleAnalyze = async (text: string, imageBase64?: string, isWorstCase: boolean = false) => {
    if (!userName) return;
    
    const ctx = `Input User: ${text} \nAnalysis Type: ${isWorstCase ? "Worst Case" : "Normal"}`;
    setUserContext(ctx);

    setCurrentRoute(AppRoute.LOADING);
    
    try {
      const result = await analyzeSituation(text, userName, language, imageBase64, isWorstCase);
      setAnalysisData(result);
      setCurrentRoute(AppRoute.RESULT);
    } catch (error) {
      console.error("Analysis failed", error);
      alert(t.error);
      setCurrentRoute(AppRoute.DASHBOARD);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setCurrentRoute(AppRoute.DASHBOARD);
  };

  const handleStartDebate = () => {
    setCurrentRoute(AppRoute.DEBATE);
  };

  const constructDebateContext = () => {
    if (!analysisData) return "";
    return `
    ${userContext}
    
    PREVIOUS ANALYSIS:
    Facts: ${analysisData.facts.join(", ")}
    Opinions: ${analysisData.opinions.join(", ")}
    In Control: ${analysisData.inControl.join(", ")}
    Out of Control: ${analysisData.outOfControl.join(", ")}
    Verdict: ${analysisData.verdict}
    `;
  };

  return (
    <div className="bg-stone-900 min-h-screen text-stone-200 font-sans selection:bg-stone-700 selection:text-white relative overflow-hidden">
      
      {/* Global Menu Button */}
      <div className="fixed top-4 right-4 z-[100]">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-stone-800/80 backdrop-blur-sm p-3 rounded-full border border-stone-600 text-stone-300 hover:text-white hover:bg-stone-700 transition-all shadow-lg"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-md flex items-center justify-center fade-in">
          <div className="bg-stone-900 border border-stone-700 rounded-xl p-6 w-80 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-4">
              <h2 className="text-xl font-serif text-white">Language / Bahasa</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-stone-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors text-left group ${
                    language === lang.code 
                      ? 'bg-stone-200 text-stone-900' 
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-wide">{lang.name}</span>
                    <span className="text-xs opacity-70 group-hover:opacity-100">{lang.code}</span>
                  </div>
                  {language === lang.code && (
                    <div className="ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <p className="mt-6 text-xs text-center text-stone-600">
              Changing language will reset the session.
            </p>
          </div>
        </div>
      )}

      {currentRoute === AppRoute.SPLASH && (
        <SplashScreen onFinish={handleSplashFinish} t={t} />
      )}

      {currentRoute === AppRoute.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} t={t} />
      )}

      {currentRoute === AppRoute.DASHBOARD && userName && (
        <Dashboard 
          userName={userName} 
          onAnalyze={handleAnalyze}
          t={t}
        />
      )}

      {currentRoute === AppRoute.LOADING && (
        <LoadingScreen lang={language} t={t} />
      )}

      {currentRoute === AppRoute.RESULT && analysisData && (
        <AnalysisResult 
          data={analysisData} 
          onReset={handleReset} 
          onDebate={handleStartDebate}
          t={t}
        />
      )}

      {currentRoute === AppRoute.DEBATE && userName && analysisData && (
        <DebateSession 
          userName={userName}
          contextData={constructDebateContext()}
          language={language}
          onEndDebate={handleReset}
          t={t}
        />
      )}
    </div>
  );
};

export default App;
