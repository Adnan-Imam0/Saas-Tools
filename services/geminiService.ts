
import { GoogleGenAI, Modality } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface EditImageResult {
  imageUrl: string | null;
  text: string | null;
}

interface ImagePart {
  data: string;
  mimeType: string;
}

export async function enhanceImage(
  image: ImagePart
): Promise<ImagePart> {
  try {
    const instructionalPrompt = "Professionally enhance this photograph. Improve lighting, clarity, color balance, and sharpness. Do not add, remove, or change any subjects or elements in the image. Respond with only the enhanced image.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.data,
              mimeType: image.mimeType,
            },
          },
          {
            text: instructionalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
        }
      }
    }
    
    throw new Error("Enhancement failed. The model did not return an enhanced image.");

  } catch (error) {
    console.error("Error calling Gemini API for enhancement:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error (Enhancement): ${error.message}`);
    }
    throw new Error("An unknown error occurred during image enhancement.");
  }
}

export async function editImage(
  images: ImagePart[],
  prompt: string
): Promise<EditImageResult> {
  if (images.length === 0) {
    throw new Error("At least one image must be provided.");
  }

  try {
    const imageParts = images.map(image => ({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType,
      },
    }));

    // Prepend instructions to the user's prompt to guide the model.
    const instructionalPrompt = `Create a single, cohesive image that incorporates all of the subjects from the images provided. The scene should be: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          ...imageParts,
          {
            text: instructionalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text = (text ? text + " " : "") + part.text;
        } else if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
      }
    }
    
    if (!imageUrl && !text) {
        throw new Error("API returned no content. Please try a different prompt or image.");
    }

    return { imageUrl, text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}
