import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { SaveIcon } from './icons/SaveIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  onSaveForLater: () => boolean;
  isLoading: boolean;
  disabled: boolean;
}

const examplePrompts = {
  "Lifestyle": [
    "On a balcony in Santorini at sunset, wearing a white linen dress.",
    "Skateboarding through the neon-lit streets of Tokyo at night.",
    "Having a cozy picnic in a field of sunflowers.",
    "Reading a book in a cozy, sunlit cafe window.",
    "Hiking on a mountain trail with a stunning view at sunrise.",
  ],
  "Product Shot": [
    "On a rustic wooden table next to a cup of tea and an open book.",
    "On a clean, minimalist white background with soft, natural shadows.",
    "Displayed on a marble countertop surrounded by fresh ingredients.",
    "Floating in zero gravity against a backdrop of stars.",
    "Resting on a bed of fresh rose petals with soft morning light.",
  ],
  "Fantasy & Sci-Fi": [
    "In a magical forest with glowing mushrooms and fireflies.",
    "Sitting on a crescent moon in a starry galaxy.",
    "In a futuristic cyberpunk city with flying cars and neon signs.",
    "Standing before a colossal, ancient alien artifact.",
    "As a knight in shining armor facing a fire-breathing dragon.",
  ]
};


const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, onSaveForLater, isLoading, disabled }) => {
  const [showExamples, setShowExamples] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState('Save for Later');

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setShowExamples(false); // Hide examples after selection
  };
  
  const handleSaveClick = () => {
    if (onSaveForLater()) {
      setSaveButtonText('Saved!');
      setTimeout(() => setSaveButtonText('Save for Later'), 2000);
    }
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-violet-300">4. Describe The Scene</h2>
          <button 
            onClick={() => setShowExamples(!showExamples)}
            className="text-xs text-slate-400 hover:text-violet-300 transition-colors underline"
            aria-expanded={showExamples}
            >
              {showExamples ? 'Hide Examples' : 'Need inspiration?'}
          </button>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={disabled ? "Upload an image first..." : "e.g., On a balcony in Santorini at sunset..."}
        rows={4}
        disabled={disabled}
        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
      
      {/* Example Prompts Section */}
      {showExamples && (
        <div className="mt-3 p-4 bg-slate-800/60 border border-slate-700 rounded-lg">
          <div className="space-y-4">
            {Object.entries(examplePrompts).map(([category, prompts]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-slate-300 mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {prompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-left text-xs bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-600 hover:text-white transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
         <button
          onClick={handleSaveClick}
          disabled={isLoading || disabled || !prompt}
          className="flex-shrink-0 flex items-center justify-center gap-2 bg-slate-700 text-slate-300 px-4 py-3 rounded-lg font-semibold hover:bg-slate-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          <SaveIcon className="h-5 w-5" />
          {saveButtonText}
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading || disabled || !prompt}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5" />
              Generate Photoshoot (1 Credit)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;