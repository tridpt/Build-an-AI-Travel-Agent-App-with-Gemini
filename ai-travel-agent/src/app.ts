import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { GeminiService, generateFreeChat } from './services/geminiService';
import { WeatherService } from './services/weatherService';

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

// Định nghĩa kiểu cho body của request chat
interface ChatRequestBody {
  message?: string;
}

app.post('/api/chat', upload.single('image'), async (req: Request, res: Response) => {
  try {
    // Ép kiểu cho req.body để TypeScript không báo lỗi
    const { message } = req.body as ChatRequestBody;
    const image = req.file;

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const response = await generateFreeChat(message || '', image);
    res.json({ response });

  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

// Weather endpoints
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

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});