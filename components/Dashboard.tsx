import React, { useState, useRef } from 'react';

interface DashboardProps {
  userName: string;
  onAnalyze: (text: string, imageBase64?: string, isWorstCase?: boolean) => void;
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, onAnalyze, t }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setSelectedImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-6 flex flex-col fade-in pt-16">
      
      {/* Header */}
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-serif text-white">{t.dashboardGreeting.replace('{name}', userName)}</h1>
        <p className="text-stone-500">{t.dashboardPrompt}</p>
      </header>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full space-y-6">
        
        {/* Text Input Card */}
        <div className="bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-700">
          <textarea
            className="w-full bg-transparent text-stone-200 placeholder-stone-600 resize-none focus:outline-none h-40"
            placeholder={t.inputPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {selectedImage && (
             <div className="mt-4 relative">
                <div className="text-xs text-stone-400 mb-2">{t.imgAttached}</div>
                <img 
                  src={`data:image/jpeg;base64,${selectedImage}`} 
                  alt="Preview" 
                  className="h-24 rounded border border-stone-600 object-cover" 
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-0 left-20 bg-red-900/80 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
             </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center gap-4">
           {/* Camera Button */}
           <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden" 
              />
              <button 
                onClick={handleCameraClick}
                className="w-14 h-14 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-400 transition-colors shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.122 2.122 0 00-1.796-1.047c-.8.005-1.51.46-1.805 1.169l-.822 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </button>
           </div>
           
           {/* Main Submit */}
           <button 
              onClick={() => onAnalyze(inputText, selectedImage || undefined, false)}
              disabled={!inputText && !selectedImage}
              className="flex-1 h-14 bg-stone-200 hover:bg-white text-stone-900 font-bold uppercase tracking-wider rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             {t.analyzeBtn}
           </button>
        </div>

        {/* Premeditatio Malorum (Worst Case) */}
        <div className="flex justify-end">
          <button 
            onClick={() => onAnalyze(inputText, selectedImage || undefined, true)}
            disabled={!inputText && !selectedImage}
            className="text-stone-500 text-xs uppercase tracking-widest hover:text-red-400 transition-colors flex items-center gap-1"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
             {t.worstCaseBtn}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
