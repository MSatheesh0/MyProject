
import { GoogleGenAI, type Chat, type GenerateContentResponse } from '@google/genai';
import { type ContextData } from '../types';
import { MASTER_PROMPT } from '../constants';

// Securely use the API key from the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function buildContextString(context: ContextData): string {
  let contextString = "--- CANDIDATE'S PROFILE CONTEXT ---\n\n";
  
  if (context.resume) {
    contextString += `[RESUME CONTENT]:\n${context.resume}\n\n`;
  }
  if (context.linkedIn) {
    contextString += `[LINKEDIN 'ABOUT' SECTION]:\n${context.linkedIn}\n\n`;
  }
  if (context.githubUrl) {
    contextString += `[GITHUB PROFILE URL]:\n${context.githubUrl}\n\n`;
  }

  contextString += "--- END OF CONTEXT ---";
  return contextString;
}

export const initializeChat = (context: ContextData): Chat => {
  const contextString = buildContextString(context);

  const modelConfig = {
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: MASTER_PROMPT,
      temperature: 0.3,
    },
  };

  const chat = ai.chats.create({
    ...modelConfig,
    history: [
      {
        role: 'user',
        parts: [{ text: `Here is the context for the candidate's portfolio. Please analyze it thoroughly. I will ask you questions about it.\n\n${contextString}` }],
      },
      {
        role: 'model',
        parts: [{ text: "Understood. I have reviewed the context provided for the candidate's portfolio. I am ready to answer your questions." }],
      }
    ]
  });
  return chat;
};


export const sendMessageStream = (chat: Chat, userQuestion: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    
    const enrichedQuestion = `(Today's date is ${currentDate})\n\n${userQuestion}`;

    return chat.sendMessageStream({ message: enrichedQuestion });
  } catch (error) {
    console.error("Error starting stream with Gemini API:", error);
    throw new Error("Failed to create a stream with the AI service. Please try again later.");
  }
};

