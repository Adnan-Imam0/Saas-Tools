
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { Generating } from './Generating';
import { DownloadIcon } from './icons/DownloadIcon';
import { AspectRatio } from '../App';

interface GeneratedImageProps {
  image: string | null;
  text: string | null;
  isLoading: boolean;
  aspectRatio: AspectRatio;
}

const ratioClasses: { [key in AspectRatio]: string } = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
};


const InitialPlaceholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
      <SparklesIcon className="mx-auto h-16 w-16 opacity-30" />
      <h3 className="mt-4 text-lg font-semibold text-slate-400">Your AI Photoshoot appears here</h3>
      <p className="mt-1 text-sm">Upload an image and write a prompt to get started.</p>
    </div>
  );
};


const GeneratedImage: React.FC<GeneratedImageProps> = ({ image, text, isLoading, aspectRatio }) => {
  const containerClass = `relative w-full max-w-lg bg-slate-900/50 rounded-lg flex items-center justify-center ${ratioClasses[aspectRatio]}`;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className={containerClass}>
        {isLoading ? (
          <Generating />
        ) : !image ? (
          <InitialPlaceholder />
        ) : (
          <img src={image} alt="Generated photoshoot" className="w-full h-full object-contain rounded-lg" />
        )}
      </div>

      {image && !isLoading && (
        <>
        {text && (
            <p className="text-center text-slate-400 bg-slate-800 p-3 rounded-lg border border-slate-700 text-sm w-full max-w-lg">
              <strong>AI Note:</strong> {text}
            </p>
        )}
        <a
          href={image}
          download="ai-photoshoot.png"
          className="mt-2 inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-violet-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
        >
          <DownloadIcon className="h-5 w-5" />
          Download Image
        </a>
        </>
      )}
    </div>
  );
};

export default GeneratedImage;
