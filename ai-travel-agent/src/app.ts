import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { GeminiService } from './services/geminiService';
import { WeatherService } from './services/weatherService'; // ← THÊM DÒNG NÀY

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize services
const geminiService = new GeminiService();
const weatherService = new WeatherService(); // ← THÊM DÒNG NÀY

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await geminiService.generateResponse(message);
    res.json({ response });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// ← THÊM WEATHER ENDPOINTS BÊN DƯỚI ĐÂY

// Weather endpoints - Current weather
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

// Weather forecast endpoint
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

// ← KẾT THÚC WEATHER ENDPOINTS

// Serve index.html for root path
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});