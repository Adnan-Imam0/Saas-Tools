
import React from 'react';

interface HeaderProps {
  credits: number;
  onAddCredits: () => void;
}

const Header: React.FC<HeaderProps> = ({ credits, onAddCredits }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Photoshoot Simulator
          </h1>
          <p className="text-sm text-slate-400">
            Generate stunning lifestyle & product shots instantly.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-violet-400">{credits}</div>
            <div className="text-xs text-slate-400">Credits Left</div>
          </div>
          <button
            onClick={onAddCredits}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-500 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
          >
            Add Credits
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
