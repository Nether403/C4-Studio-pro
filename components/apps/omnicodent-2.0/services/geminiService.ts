import { GoogleGenAI, Part } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini client
// Note: In a real production app, you might want to handle key checks more gracefully
const ai = new GoogleGenAI({ apiKey });

/**
 * Transcribes audio blob to text using Gemini 2.5 Flash
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Convert Blob to Base64
    const base64Audio = await blobToBase64(audioBlob);
    
    // We strip the data prefix for the API
    const data = base64Audio.split(',')[1];
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type || 'audio/webm',
              data: data
            }
          },
          {
            text: "Transcribe the following audio exactly as spoken. Do not add any commentary."
          }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Audio transcription failed:", error);
    throw new Error("Failed to transcribe audio.");
  }
};

/**
 * Generates code from an image and prompt using Gemini 3.0 Pro
 */
export const generateAppFromImage = async (
  imageBase64: string | null,
  userPrompt: string
): Promise<string> => {
  try {
    const parts: Part[] = [];

    // Add image if exists
    if (imageBase64) {
      // Ensure we have the raw base64 data without the prefix for the API if needed, 
      // but usually the inlineData expects just the data part.
      const mimeType = imageBase64.split(';')[0].split(':')[1];
      const data = imageBase64.split(',')[1];
      
      parts.push({
        inlineData: {
          mimeType,
          data
        }
      });
    }

    // System prompt + User prompt
    const systemInstruction = `
      You are Omnicodent, an expert Senior Frontend Engineer and UI/UX Designer.
      
      YOUR MISSION:
      Analyze the provided visual input (sketch, wireframe, or screenshot) and/or text instructions.
      Generate a SINGLE, SELF-CONTAINED HTML file that implements a fully functional, pixel-perfect web application or game based on the input.
      
      CRITICAL REQUIREMENTS:
      1.  **Single File**: The output MUST be a valid HTML file containing all CSS (in <style> tags) and JavaScript (in <script> tags). No external file references (except CDN libraries).
      2.  **Libraries**: You MAY use Tailwind CSS (via CDN: <script src="https://cdn.tailwindcss.com"></script>) and React/ReactDOM (via CDN) if complex state is needed, or Vanilla JS for games. Prefer Vanilla JS + Tailwind for visual apps, and Canvas + Vanilla JS for games.
      3.  **Functionality**: The app must WORK. Buttons must click, forms must submit (mocked), games must be playable with controls.
      4.  **Aesthetics**: Use the visual input as a strong reference for layout, but upgrade the visual quality to be modern, polished, and professional. Use Tailwind for rapid, beautiful styling.
      5.  **Responsiveness**: The app should look good on mobile and desktop.
      6.  **Icons**: You may use Lucide icons via a CDN or SVG strings if needed.
      7.  **Images**: Use 'https://picsum.photos/id/{id}/200/300' or similar placeholders if images are required but not provided.

      OUTPUT FORMAT:
      Return ONLY the HTML code. If you must wrap it in markdown, use \`\`\`html ... \`\`\`. 
      Do not explain the code. Just provide the artifact.
    `;

    const fullPrompt = userPrompt 
      ? `User Instructions: ${userPrompt}` 
      : "Turn this image into a functional application.";

    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using the powerful 3.0 model for coding
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for more precise code generation
      }
    });

    const text = response.text || "";
    
    // Extract code block if present
    const codeMatch = text.match(/```html([\s\S]*?)```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }
    
    // Fallback: assume the whole text is code if it starts with <
    if (text.trim().startsWith('<')) {
      return text.trim();
    }

    return text;

  } catch (error) {
    console.error("Code generation failed:", error);
    throw new Error("Failed to generate application. Please try again.");
  }
};

// Helper to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
