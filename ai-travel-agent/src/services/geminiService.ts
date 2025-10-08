import { GoogleGenerativeAI, Part, Content, StartChatParams } from '@google/generative-ai';

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

    // --- BẮT ĐẦU PHẦN SỬA LỖI ---

    // 1. Định nghĩa Hướng dẫn Hệ thống (System Instruction) một cách rõ ràng
    const systemInstruction = {
        role: "system",
        parts: [{ text: `You are a helpful and friendly travel assistant named Gemini. Your sole purpose is to answer questions related to travel, tourism, destinations, flights, hotels, and trip planning. 

        **Strict Rule:** If a user asks a question that is NOT related to travel (e.g., about math, politics, general knowledge, etc.), you MUST politely decline. Respond in the user's language (Vietnamese or English).
        - Vietnamese response for off-topic questions: "Xin lỗi, tôi là trợ lý du lịch và chỉ có thể trả lời các câu hỏi về du lịch. Bạn có cần tôi giúp gì cho chuyến đi của mình không?"
        - English response for off-topic questions: "I'm sorry, as a travel assistant, I can only answer questions about travel. Is there anything I can help you with for your trip?"

        **Formatting Rule:** For any list, you must use bullet points (* or -). Do not use numbered lists.` 
        }]
    };

    // 2. Khởi tạo model với Hướng dẫn Hệ thống
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-pro',
        systemInstruction: systemInstruction.parts[0].text,
    });

    // 3. Bắt đầu phiên chat và nạp vào toàn bộ lịch sử trước đó
    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 20000,
        },
    });

    // 4. Chuẩn bị tin nhắn mới của người dùng (văn bản và hình ảnh)
    const userParts: Part[] = [];
    if (message) {
        userParts.push({ text: message });
    }
    if (image) {
      userParts.push({
        inlineData: {
          mimeType: image.mimetype,
          data: image.buffer.toString('base64'),
        },
      });
    }
    
    // 5. Gửi tin nhắn mới bằng hàm chat.sendMessage() để duy trì cuộc hội thoại
    const result = await chat.sendMessage(userParts);
    const response = await result.response;
    
    // --- KẾT THÚC PHẦN SỬA LỖI ---

    return response.text();
    
  } catch (error) {
    console.error('Error in free chat:', error);
    throw new Error('Failed to generate response');
  }
}