import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
// The API_KEY is assumed to be pre-configured and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates text using the Gemini Flash model.
 * This function serves as an example of how to interact with the Gemini API.
 * For this specific chatbot, most responses are static as per the prompt's strict requirements.
 *
 * @param prompt The text prompt to send to the model.
 * @returns A promise that resolves to the generated text, or an empty string if an error occurs.
 */
export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using Gemini Flash for basic text tasks.
      contents: prompt,
    });
    return response.text ?? '';
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // In a real application, you might want more sophisticated error handling/retries.
    return '';
  }
}
