import React from 'react';
import { StoicAnalysis } from '../types';

interface AnalysisResultProps {
  data: StoicAnalysis;
  onReset: () => void;
  onDebate: () => void;
  t: any;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset, onDebate, t }) => {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-6 flex flex-col fade-in pb-24 pt-16">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-white mb-2">{t.resultTitle}</h2>
          <div className="h-1 w-24 bg-stone-700 mx-auto"></div>
        </div>

        {/* Card 1: The Filter (Facts vs Opinions) */}
        <div className="bg-stone-800 rounded-lg p-6 shadow-lg border border-stone-700">
          <h3 className="text-xl font-serif text-stone-300 mb-4 border-b border-stone-700 pb-2">
            {t.filterTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-green-500 text-sm font-bold uppercase tracking-wider mb-2">{t.facts}</h4>
              <ul className="list-disc pl-4 space-y-1 text-stone-400 text-sm">
                {data.facts.map((fact, i) => <li key={i}>{fact}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-red-500 text-sm font-bold uppercase tracking-wider mb-2">{t.opinions}</h4>
              <ul className="list-disc pl-4 space-y-1 text-stone-400 text-sm">
                {data.opinions.map((op, i) => <li key={i}>{op}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Card 2: The Dichotomy (Control) */}
        <div className="bg-stone-800 rounded-lg p-6 shadow-lg border border-stone-700">
          <h3 className="text-xl font-serif text-stone-300 mb-4 border-b border-stone-700 pb-2">
            {t.dichotomyTitle}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-stone-900/50 p-4 rounded border-l-4 border-blue-500">
              <h4 className="text-blue-400 text-sm font-bold uppercase mb-2">{t.inControl}</h4>
              <ul className="space-y-2">
                {data.inControl.map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-stone-300">
                    <span className="mr-2">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-stone-900/50 p-4 rounded border-l-4 border-orange-700">
              <h4 className="text-orange-700 text-sm font-bold uppercase mb-2">{t.outControl}</h4>
              <ul className="space-y-2">
                {data.outOfControl.map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-stone-500">
                    <span className="mr-2">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Card 3: The Verdict */}
        <div className="bg-stone-100 text-stone-900 rounded-lg p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.756a49.106 49.106 0 019.152 1 .75.75 0 01-.152 1.485h-1.918l2.478 13.626a2.25 2.25 0 01-2.214 2.633H3.904a2.25 2.25 0 01-2.214-2.633L4.168 6.241H2.25a.75.75 0 01-.152-1.485 49.105 49.105 0 019.152-1V3a.75.75 0 01.75-.75zm4.878 13.5l-1.727-9.501H8.85l-1.727 9.501h9.755z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-bold mb-4 uppercase tracking-wider relative z-10">{t.verdictTitle}</h3>
          <p className="text-lg font-serif leading-relaxed relative z-10 italic">
            "{data.verdict}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-3 px-4 max-w-3xl mx-auto">
          <button 
            onClick={onDebate}
            className="flex-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 font-bold py-3 px-4 rounded-full shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.347-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
            {t.debateBtn}
          </button>
          
          <button 
            onClick={onReset}
            className="flex-1 bg-stone-200 hover:bg-white text-stone-900 font-bold py-3 px-4 rounded-full shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
