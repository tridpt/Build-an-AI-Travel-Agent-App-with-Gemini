import { GoogleGenerativeAI, Part } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // SỬA Ở ĐÂY: Đổi thành model 'gemini-pro' ổn định hơn
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate response from Gemini API');
    }
  }
}

export async function generateFreeChat(message: string, image?: Express.Multer.File): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // SỬA Ở ĐÂY: Sử dụng model 'gemini-pro-vision' để xử lý ảnh
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const promptParts: (string | Part)[] = [];

    // Prompt cho AI biết vai trò của nó
    const systemPrompt = "You are a helpful travel assistant. Analyze the user's text and image to provide relevant travel information.";
    
    // Thêm message của người dùng vào trước
    promptParts.push(message);

    if (image) {
      promptParts.push({
        inlineData: {
          mimeType: image.mimetype,
          data: image.buffer.toString('base64'),
        },
      });
    }

    // Kết hợp system prompt và user prompt
    const finalPrompt = [systemPrompt, ...promptParts];
    
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error in free chat:', error);
    throw new Error('Failed to generate response');
  }
}