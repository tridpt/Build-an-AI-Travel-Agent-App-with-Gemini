import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { getTravelRecommendations } from './services/geminiService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log('Received message:', message);
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set!');
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    const response = await getTravelRecommendations(message);
    res.json({ response });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    
    let errorMessage = 'Failed to get travel recommendations';
    
    if (error.status === 401) {
      errorMessage = 'Invalid Gemini API key';
    } else if (error.status === 429) {
      errorMessage = 'Gemini API rate limit exceeded';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Cannot connect to Gemini servers';
    }
    
    res.status(500).json({ error: errorMessage, details: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
  console.log('Gemini API Key configured:', !!process.env.GEMINI_API_KEY);
});