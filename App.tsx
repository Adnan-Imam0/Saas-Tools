
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptInput from './components/PromptInput';
import GeneratedImage from './components/GeneratedImage';
import { editImage, enhanceImage } from './services/geminiService';
import AspectRatioSelector from './components/AspectRatioSelector';
import EnhancementControl from './components/EnhancementControl';

export type AspectRatio = 'square' | 'portrait' | 'landscape';

export interface UploadedImage {
  id: string;
  data: string;
  mimeType: string;
}

const App: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('square');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [subjectsAreEnhanced, setSubjectsAreEnhanced] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(5);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('aiPhotoshootSession');
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        if (sessionData.uploadedImages && Array.isArray(sessionData.uploadedImages)) {
          setUploadedImages(sessionData.uploadedImages);
        }
        if (sessionData.prompt) {
          setPrompt(sessionData.prompt);
        }
        if (sessionData.aspectRatio) {
          setAspectRatio(sessionData.aspectRatio);
        }
      }
    } catch (e) {
      console.error("Failed to load saved session:", e);
      localStorage.removeItem('aiPhotoshootSession'); // Clear corrupted data
    }
  }, []);

  const handleImageUpload = async (files: FileList): Promise<void> => {
    if (!files || files.length === 0) return;

    setGeneratedImage(null); // Clear previous generation
    setGeneratedText(null);
    setError(null);
    setSubjectsAreEnhanced(false); // New images require re-enhancement

    const readFileAsBase64 = (file: File): Promise<UploadedImage> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve({
            id: `${file.name}-${Date.now()}`,
            data: base64String,
            mimeType: file.type,
          });
        };
        reader.onerror = () => {
          reject(new Error(`Failed to read ${file.name}.`));
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const fileArray = Array.from(files);
      const newImages = await Promise.all(fileArray.map(readFileAsBase64));
      setUploadedImages(prev => [...prev, ...newImages]);
    } catch (e: any) {
      setError(e.message || "An error occurred while reading files.");
    }
  };


  const handleRemoveImage = (id: string) => {
    setUploadedImages(prev => {
        const newImages = prev.filter(image => image.id !== id);
        if (newImages.length === 0) {
            setSubjectsAreEnhanced(false);
        }
        return newImages;
    });
  };

  const handleEnhanceSubjects = async () => {
    if (uploadedImages.length === 0) {
      setError('Upload images before enhancing.');
      return;
    }
    if (credits < 1) {
        setError('You need at least 1 credit to enhance subjects.');
        return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
        const enhancementPromises = uploadedImages.map(img => enhanceImage({ data: img.data, mimeType: img.mimeType }));
        const enhancedImageParts = await Promise.all(enhancementPromises);

        const newUploadedImages = uploadedImages.map((originalImg, index) => ({
            ...originalImg,
            data: enhancedImageParts[index].data,
            mimeType: enhancedImageParts[index].mimeType,
        }));

        setUploadedImages(newUploadedImages);
        setCredits(prev => prev - 1);
        setSubjectsAreEnhanced(true);
    } catch (e: any) {
        setError(e.message || "An error occurred during subject enhancement.");
    } finally {
        setIsEnhancing(false);
    }
  };


  const handleGenerate = useCallback(async () => {
    if (uploadedImages.length === 0 || !prompt) {
      setError('Please upload at least one image and enter a prompt.');
      return;
    }
    if (credits <= 0) {
      setError('You have no credits left. Please buy more.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      const imageParts = uploadedImages.map(({ data, mimeType }) => ({ data, mimeType }));
      const result = await editImage(imageParts, prompt);
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        setGeneratedText(result.text);
        setCredits(prev => prev - 1);
      } else {
        setError(result.text || 'Image generation failed. The model may not have returned an image.');
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImages, prompt, credits]);

  const handleSaveForLater = () => {
    if (uploadedImages.length > 0 && prompt) {
      const sessionData = {
        uploadedImages,
        prompt,
        aspectRatio,
      };
      localStorage.setItem('aiPhotoshootSession', JSON.stringify(sessionData));
      return true; // Indicate success
    }
    return false; // Indicate failure
  };

  const addCredits = () => {
    setCredits(5);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header credits={credits} onAddCredits={addCredits} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg">
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              uploadedImages={uploadedImages}
              onRemoveImage={handleRemoveImage}
              isEnhancing={isEnhancing}
            />
            <EnhancementControl
              onEnhance={handleEnhanceSubjects}
              isEnhancing={isEnhancing}
              isDisabled={uploadedImages.length === 0 || subjectsAreEnhanced}
              credits={credits}
            />
            <AspectRatioSelector selectedRatio={aspectRatio} onRatioChange={setAspectRatio} />
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              onSaveForLater={handleSaveForLater}
              isLoading={isLoading}
              disabled={uploadedImages.length === 0}
            />
            {error && <div className="text-red-400 bg-red-900/50 border border-red-700 p-3 rounded-lg text-center whitespace-pre-line">{error}</div>}
          </div>

          {/* Right Column: Output */}
          <div className="flex items-center justify-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 min-h-[400px] lg:min-h-0">
            <GeneratedImage image={generatedImage} text={generatedText} isLoading={isLoading} aspectRatio={aspectRatio} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
