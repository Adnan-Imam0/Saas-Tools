
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CloseIcon } from './icons/CloseIcon';
import { UploadedImage } from '../App';

interface ImageUploaderProps {
  onImageUpload: (files: FileList) => Promise<void>;
  uploadedImages: UploadedImage[];
  onRemoveImage: (id: string) => void;
  isEnhancing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImages, onRemoveImage, isEnhancing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingDrop, setIsProcessingDrop] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsProcessingDrop(true);
      await onImageUpload(files);
      setIsProcessingDrop(false);
    }
    // Clear the input value to allow re-uploading the same file(s)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setIsProcessingDrop(true);
      await onImageUpload(files);
      setIsProcessingDrop(false);
    }
  };

  const dropzoneClasses = `relative flex justify-center items-center w-full min-h-[10rem] bg-slate-700/50 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-700/80 hover:border-violet-500 transition-all duration-300 ${isDragging ? 'border-violet-500 bg-slate-700/80' : 'border-slate-600'}`;
  
  const renderDropzoneContent = () => {
    if (isProcessingDrop) {
      return (
        <>
          <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 font-semibold">Processing images...</p>
        </>
      );
    }
    if (isDragging) {
        return (
            <>
                <UploadIcon className="mx-auto h-10 w-10 text-violet-400" />
                <p className="mt-2 font-semibold">Drop to upload</p>
            </>
        );
    }
    return (
        <>
            <UploadIcon className="mx-auto h-10 w-10" />
            <p className="mt-2 font-semibold">
                {uploadedImages.length > 0 ? 'Click or drop to add more images' : 'Click to upload or drop images here'}
            </p>
            <p className="text-xs">(PNG or JPG)</p>
        </>
    );
  };


  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-violet-300">1. Upload Your Subject(s)</h2>
      
      {/* Thumbnails Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
          {uploadedImages.map((image) => (
            <div key={image.id} className="relative group aspect-square">
              <img 
                src={`data:${image.mimeType};base64,${image.data}`} 
                alt="Uploaded thumbnail" 
                className="w-full h-full object-cover rounded-md" 
              />
              {isEnhancing && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-md transition-opacity duration-300">
                  <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              <button
                onClick={() => onRemoveImage(image.id)}
                disabled={isEnhancing}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-0"
                aria-label="Remove image"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={dropzoneClasses}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
          multiple
        />
        <div className="text-center text-slate-400 p-4 pointer-events-none">
          {renderDropzoneContent()}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
