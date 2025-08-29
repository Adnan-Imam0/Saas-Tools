import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const messages = [
  "Warming up the AI's creative circuits...",
  "Gathering digital paint and brushes...",
  "Teaching the AI about 'sunset moods'...",
  "Trying different compositions...",
  "Blending the subjects into the scene...",
  "Adding a touch of magic...",
  "Finalizing the details, almost there!",
];

const shimmerStyle = {
  background: 'linear-gradient(to right, #2d3748 0%, #4a5568 20%, #2d3748 40%)',
  backgroundSize: '1000px 100%',
};

const ShimmerPlaceholder: React.FC<{ children?: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-slate-700/50 rounded-md relative overflow-hidden ${className}`}>
      <div className="w-full h-full absolute top-0 left-0 animate-shimmer" style={shimmerStyle}></div>
      {children}
  </div>
);


export const Generating: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setCurrentMessage(messages[messageIndex]);
    }, 2500);

    const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 95 ? prev + 1 : prev));
    }, 150);


    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      {/* Shimmering Image Placeholder Grid */}
      <div className="w-full h-full flex-grow grid grid-cols-3 grid-rows-3 gap-2">
        <ShimmerPlaceholder className="col-span-2 row-span-3">
          <div className="absolute inset-0 flex items-center justify-center">
            <SparklesIcon className="w-12 h-12 text-slate-500 opacity-50 animate-pulse" />
          </div>
        </ShimmerPlaceholder>
        <ShimmerPlaceholder className="col-span-1 row-span-1" />
        <ShimmerPlaceholder className="col-span-1 row-span-1" />
        <ShimmerPlaceholder className="col-span-1 row-span-1" />
      </div>

      {/* Progress Bar and Status */}
      <div className="w-full pt-6">
        <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
            <div
                className="bg-violet-500 h-2.5 rounded-full transition-all duration-500 ease-linear"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
        <p className="text-slate-400 transition-opacity duration-500 h-5">{currentMessage}</p>
      </div>
    </div>
  );
};
