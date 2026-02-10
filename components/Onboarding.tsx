import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: (name: string) => void;
  t: any;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, t }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center px-6 text-stone-200 fade-in pt-16">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h2 className="text-2xl font-serif text-stone-100 mb-4 leading-relaxed">
            {t.onboardingTitle}
          </h2>
          <p className="text-stone-400 text-sm">
            {t.onboardingDesc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-stone-100 bg-transparent rounded-lg border-1 border-stone-600 appearance-none focus:outline-none focus:ring-0 focus:border-stone-400 peer border-b-2"
              required
            />
            <label className="absolute text-sm text-stone-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-stone-900 px-2 peer-focus:px-2 peer-focus:text-stone-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              {t.nameLabel}
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 text-sm tracking-wider font-bold text-stone-900 bg-stone-300 hover:bg-stone-100 rounded-sm transition-colors duration-300 uppercase"
          >
            {t.startBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
