import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { GeminiService, generateFreeChat } from './services/geminiService';
import { WeatherService } from './services/weatherService';
import { Content, Part } from '@google/generative-ai'; // Quan trọng: import thêm Part
import { CurrencyService } from './services/currencyService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const geminiService = new GeminiService();
const weatherService = new WeatherService();
const currencyService = new CurrencyService();

// Lưu trữ lịch sử chat (sẽ reset khi server khởi động lại)
let chatHistory: Content[] = [];

// Định nghĩa kiểu cho body của request chat
interface ChatRequestBody {
  message?: string;
}

app.post('/api/chat', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { message } = req.body as ChatRequestBody;
    const image = req.file;

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const userMessage = message || '';

    // Gọi service và truyền vào lịch sử chat hiện tại
    const responseText = await generateFreeChat(userMessage, chatHistory, image);

    // --- BẮT ĐẦU PHẦN SỬA LỖI ---
    // Xây dựng các "parts" cho lượt nói của người dùng, bao gồm cả text và image
    const userParts: Part[] = [];
    if (userMessage) {
        userParts.push({ text: userMessage });
    }
    if (image) {
        userParts.push({
            inlineData: {
                mimeType: image.mimetype,
                data: image.buffer.toString('base64'),
            },
        });
    }

    // Chỉ thêm vào lịch sử nếu có nội dung từ người dùng
    if (userParts.length > 0) {
        chatHistory.push({ role: 'user', parts: userParts });
        chatHistory.push({ role: 'model', parts: [{ text: responseText }] });
    }
    // --- KẾT THÚC PHẦN SỬA LỖI ---

    res.json({ response: responseText });

  } catch (error: any)
    {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message
    });
  }
});


// Các endpoints của Weather giữ nguyên...
app.get('/api/weather/current/:city', async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    const lang = req.query.lang as string || 'vi';
    const weather = await weatherService.getCurrentWeather(city, lang);
    if (!weather) {
      return res.status(503).json({
        error: 'Weather service unavailable',
        message: 'Please configure OPENWEATHER_API_KEY in .env file'
      });
    }
    res.json(weather);
  } catch (error: any) {
    console.error('Weather API error:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      details: error.message
    });
  }
});

app.get('/api/weather/forecast/:city', async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    const lang = req.query.lang as string || 'vi';
    const forecast = await weatherService.getForecast(city, lang);
    res.json({ forecast });
  } catch (error: any) {
    console.error('Forecast API error:', error);
    res.status(500).json({
      error: 'Failed to fetch forecast data',
      details: error.message
    });
  }
});

app.get('/api/currency/exchange', async (req: Request, res: Response) => {
  try {
    const { source, target } = req.query;

    if (!source || !target) {
      return res.status(400).json({ error: 'Source and target currencies are required' });
    }

    const rate = await currencyService.getConversionRate(source as string, target as string);

    if (rate === null) {
      return res.status(503).json({
        error: 'Currency conversion service unavailable',
        message: 'Could not fetch the conversion rate. Please check your API key.'
      });
    }

    res.json({ rate });

  } catch (error: any) {
    console.error('Currency API error:', error);
    res.status(500).json({
      error: 'Failed to fetch currency conversion data',
      details: error.message
    });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

