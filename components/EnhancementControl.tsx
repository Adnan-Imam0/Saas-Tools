
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface EnhancementControlProps {
  onEnhance: () => void;
  isEnhancing: boolean;
  isDisabled: boolean;
  credits: number;
}

const EnhancementControl: React.FC<EnhancementControlProps> = ({ onEnhance, isEnhancing, isDisabled, credits }) => {
  // Button is disabled if no images, already enhanced, enhancing, or not enough credits.
  const disabled = isDisabled || isEnhancing || credits < 1;
  
  const getButtonText = () => {
    if (isEnhancing) return "Enhancing...";
    if (isDisabled && !isEnhancing && credits >= 1) return "Subjects Enhanced";
    return "Enhance Subjects (1 Credit)";
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-violet-300">2. Enhance Subjects (Optional)</h2>
      <p className="text-sm text-slate-400 mb-3">Improve the quality and lighting of your uploaded images before generating the final scene. This costs 1 credit.</p>
      <button
        onClick={onEnhance}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
      >
        {isEnhancing ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <SparklesIcon className="h-5 w-5" />
        )}
        {getButtonText()}
      </button>
    </div>
  );
};

export default EnhancementControl;
