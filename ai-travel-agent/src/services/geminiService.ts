import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getTravelRecommendations(userMessage: string): Promise<string> {
  try {
    console.log('Sending request to Gemini with message:', userMessage);
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    
    // Thử với gemini-1.0-pro (model cũ hơn, ổn định hơn)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    
    const prompt = `You are a helpful travel agent assistant. Provide detailed travel recommendations, including destinations, activities, accommodations, and budget estimates. You can respond in Vietnamese if the user asks in Vietnamese.

User question: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini Response received');
    return text || "Sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error('Gemini API Error Details:', {
      message: error.message,
      status: error.status,
      code: error.code
    });
    throw error;
  }
}