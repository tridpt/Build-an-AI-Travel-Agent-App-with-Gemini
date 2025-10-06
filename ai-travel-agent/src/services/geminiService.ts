import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
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

export async function generateFreeChat(message: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Bước 1: Kiểm tra xem câu hỏi có liên quan đến du lịch không
    const checkPrompt = `Phân tích câu hỏi sau và trả lời CHỈ MỘT từ: "YES" nếu câu hỏi liên quan đến du lịch (điểm đến, khách sạn, vé máy bay, địa điểm tham quan, ẩm thực du lịch, văn hóa địa phương, mẹo du lịch, lịch trình), hoặc "NO" nếu không liên quan (toán học, lập trình, khoa học, chính trị, y tế...).

Câu hỏi: "${message}"

Trả lời (CHỈ YES hoặc NO):`;

    const checkResult = await model.generateContent(checkPrompt);
    const checkResponse = await checkResult.response;
    const isTravel = checkResponse.text().trim().toUpperCase().includes('YES');

    // Bước 2: Nếu không liên quan đến du lịch, từ chối
    if (!isTravel) {
      return "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến du lịch như: điểm đến, khách sạn, phương tiện di chuyển, địa điểm tham quan, ẩm thực, hoặc mẹo du lịch. Bạn có câu hỏi nào về du lịch không? 🌍✈️";
    }

    // Bước 3: Nếu liên quan đến du lịch, trả lời tự nhiên
    const answerPrompt = `Bạn là trợ lý du lịch chuyên nghiệp và thân thiện. Hãy trả lời câu hỏi sau một cách chi tiết và hữu ích.

QUAN TRỌNG về định dạng:
- Trả lời một cách tự nhiên, dễ hiểu
- Sử dụng dấu đầu dòng (•) thay vì đánh số
- KHÔNG tạo danh sách đánh số như "1. 1. 1."
- Viết các câu hỏi gợi ý dưới dạng câu hỏi trực tiếp

Câu hỏi: "${message}"

Hãy trả lời một cách chi tiết và hữu ích:`;

    const result = await model.generateContent(answerPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in free chat:', error);
    throw new Error('Failed to generate response');
  }
}