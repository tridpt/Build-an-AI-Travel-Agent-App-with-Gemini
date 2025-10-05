# 🌍 AI Travel Agent - Powered by Google Gemini

An intelligent travel assistant that provides personalized travel recommendations using Google Gemini AI.

## ✨ Features

- 🤖 AI-powered travel recommendations
- 🌐 Supports Vietnamese and English
- 💬 Real-time chat interface
- 🎯 Personalized suggestions for destinations, hotels, and activities
- 🚀 Fast responses using Google Gemini API

## 🛠️ Technologies

- **Backend**: Node.js, Express, TypeScript
- **AI**: Google Gemini API
- **Frontend**: HTML, CSS, JavaScript

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/ai-travel-agent-gemini.git
cd ai-travel-agent-gemini
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

5. Get your Gemini API key from: https://aistudio.google.com/app/apikey

6. Run the application:
```bash
npm run dev
```

7. Open browser and visit: `http://localhost:3000`

## 🚀 Usage

Simply type your travel questions in the chat interface, such as:
- "I want to visit Paris for 5 days"
- "Recommend hotels in Tokyo under $100/night"
- "What activities should I do in Bali?"
- "Tôi muốn đi du lịch Đà Nẵng"

## 📁 Project Structure

```
ai-travel-agent/
├── src/
│   ├── app.ts              # Main Express server
│   └── services/
│       └── geminiService.ts # Gemini API integration
├── public/
│   ├── index.html          # Chat interface
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── .env                    # Environment variables (not in git)
├── .env.example            # Example environment file
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🐛 Troubleshooting

### API 404 Error
- Make sure you're using the correct model name: `gemini-1.0-pro`
- Check your API key is valid

### Server not starting
- Run `npm install` to ensure all dependencies are installed
- Check that port 3000 is not in use

## 📝 License

MIT

## 👤 Author

Your Name
Tran Duc Tri