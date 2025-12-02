import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Helper to validate API key existence
const checkApiKey = () => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }
};

/**
 * Generates an image using the high-quality Imagen model via Gemini API.
 */
export const generateImage = async (prompt: string, aspectRatio: string = "1:1"): Promise<string> => {
  checkApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // Using gemini-3-pro-image-preview for high quality generation
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { text: prompt },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: "1K"
      }
    },
  });

  // Extract image from response
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data returned from generation model.");
};

/**
 * Edits an existing image based on a text prompt using Gemini Flash Image.
 */
export const editImage = async (imageBase64: string, prompt: string): Promise<string> => {
  checkApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // Clean base64 string if it contains data URI header
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image', // Capable of multimodal input and output
    contents: {
      parts: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: 'image/png', // Assuming PNG for simplicity, API handles standard types
          },
        },
        {
          text: `Edit the provided image: ${prompt}. Return only the edited image.`
        },
      ],
    },
  });

   // Extract image from response
   for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No edited image returned. The model might have returned text instead.");
};

/**
 * Helper to convert file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};