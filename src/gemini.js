import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// It will pick up the key from VITE_GEMINI_API_KEY env variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export const generateResponse = async (personaPrompt, messages) => {
  if (!genAI) {
    throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: personaPrompt
    });

    // Convert messages to Gemini history format
    const history = messages.filter(m => m.role !== 'system').map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: history.slice(0, -1), // All except the latest message
    });

    const latestMessage = history[history.length - 1].parts[0].text;
    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();
    
    return responseText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from the AI. Please try again.");
  }
};
