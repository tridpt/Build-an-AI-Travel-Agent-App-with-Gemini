import { GoogleGenerativeAI, Part, Content } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // SỬA Ở ĐÂY: Dùng tên model chính xác và mạnh mẽ
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

export async function generateFreeChat(
  message: string,
  history: Content[],
  image?: Express.Multer.File
): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // SỬA Ở ĐÂY: Dùng tên model chính xác và mạnh mẽ
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 100000, // Tăng giới hạn để có câu trả lời chi tiết hơn
        },
    });

    // --- BẮT ĐẦU PHẦN SỬA LỖI ---
    // Xây dựng prompt một cách rõ ràng và đúng chuẩn
    const promptParts: Part[] = [];

   const systemInstruction = {
        role: "system",
        parts: [{ text: "You are a helpful travel assistant. IMPORTANT FORMATTING RULE: For any list, you must use bullet points (* or -). Do not use numbered lists." }]
    };
    
    // Thêm tin nhắn của người dùng
    if (message) {
        promptParts.push({ text: message });
    }

    // Thêm hình ảnh nếu có
    if (image) {
      promptParts.push({
        inlineData: {
          mimeType: image.mimetype,
          data: image.buffer.toString('base64'),
        },
      });
    }
    
    // Gửi yêu cầu với cả chỉ dẫn hệ thống và prompt của người dùng
    const result = await model.generateContent([systemInstruction.parts[0].text, ...promptParts]);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error in free chat:', error);
    throw new Error('Failed to generate response');
  }
}