
import React from 'react';
import { AspectRatio } from '../App';
import { SquareIcon } from './icons/SquareIcon';
import { PortraitIcon } from './icons/PortraitIcon';
import { LandscapeIcon } from './icons/LandscapeIcon';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
}

const options: { value: AspectRatio; label: string; icon: React.ReactNode }[] = [
  { value: 'square', label: 'Square (1:1)', icon: <SquareIcon className="h-5 w-5" /> },
  { value: 'portrait', label: 'Portrait (3:4)', icon: <PortraitIcon className="h-5 w-5" /> },
  { value: 'landscape', label: 'Landscape (4:3)', icon: <LandscapeIcon className="h-5 w-5" /> },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-violet-300">3. Choose Aspect Ratio</h2>
      <div className="grid grid-cols-3 gap-3">
        {options.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => onRatioChange(value)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedRatio === value
                ? 'bg-violet-500/20 border-violet-500 text-white'
                : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
            aria-pressed={selectedRatio === value}
            aria-label={label}
          >
            {icon}
            <span className="text-xs font-semibold">{label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
