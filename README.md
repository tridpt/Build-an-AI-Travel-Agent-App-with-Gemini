🌍 AI Travel Agent - Powered by Google Gemini

A smart, multilingual travel planning assistant that creates personalized travel itineraries using Google Gemini AI. Plan your perfect trip with AI-powered recommendations for destinations, hotels, restaurants, and activities.

## ✨ Features

### 🤖 AI-Powered Planning
- **Smart Itinerary Generation**: Create detailed day-by-day travel plans with specific times and activities
- **Personalized Recommendations**: Get suggestions based on your budget, interests, and travel style
- **Hotel & Restaurant Suggestions**: Receive curated recommendations with direct booking links

### 🌐 Multilingual Support
- **Vietnamese & English**: Full support for both languages
- **Automatic Translation**: Switch languages seamlessly with preserved functionality
- **Localized Currency**: Automatic currency conversion (VNĐ/USD)

### 💬 Interactive Chat
- **Free Chat Mode**: Ask any travel-related questions
- **Real-time Responses**: Get instant AI-powered answers
- **Context-Aware**: Understands follow-up questions

### 📥 Export Options
- **PDF Export**: Print-ready travel itineraries
- **HTML Export**: Beautifully formatted standalone web pages
- **Markdown Export**: Developer-friendly format
- **Text Export**: Simple, readable plain text

### 🔗 Booking Integration
- **Direct Booking Links**: Quick access to Booking.com and Agoda
- **Google Maps Integration**: Find locations instantly
- **Restaurant Search**: Links to Google Maps and Google Search

## 🛠️ Technologies

### Backend
- **Node.js** with **Express** - Fast, minimalist web framework
- **TypeScript** - Type-safe development
- **Google Gemini 2.5 Flash** - Latest AI model for travel recommendations

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Responsive CSS** - Mobile-friendly design
- **Modern HTML5** - Semantic markup

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key ([Get it here](https://aistudio.google.com/app/apikey))

### Setup Steps

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/ai-travel-agent-gemini.git
cd ai-travel-agent-gemini/ai-travel-agent
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

4. **Edit `.env` file:**
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

5. **Run in development mode:**
```bash
npm run dev
```

6. **Open your browser:**
```
http://localhost:3000
```

## 🚀 Usage

### Planning a Trip

1. **Select "📋 Lên Kế Hoạch" tab**
2. **Fill in your travel details:**
   - Destination (optional - AI can suggest)
   - Start and end dates
   - Budget
   - Number of travelers
   - Travel style (Budget/Comfort/Luxury/Adventure/etc.)
   - Interests (Beach, Mountain, Food, etc.)
   - Transportation preferences
   - Additional requirements

3. **Click "✨ Tạo Lịch Trình Du Lịch"**
4. **Review your personalized itinerary**
5. **Export in your preferred format**

### Free Chat Mode

1. **Select "💬 Chat Tự Do" tab**
2. **Ask questions like:**
   - "Recommend 3-star hotels in Hanoi under 1,000,000 VNĐ"
   - "What should I eat in Da Nang?"
   - "Best time to visit Sapa?"
   - "I want a 5-day beach vacation in Vietnam"

### Switching Languages

Click the language buttons in the top-right corner:
- 🇻🇳 **VI** - Vietnamese
- 🇬🇧 **EN** - English

## 📁 Project Structure

```
ai-travel-agent/
├── src/
│   ├── app.ts                    # Express server & API routes
│   └── services/
│       └── geminiService.ts      # Gemini AI integration
├── public/
│   ├── index.html                # Main UI
│   ├── css/
│   │   └── style.css             # Responsive styling
│   └── js/
│       ├── main.js               # Tab switching & markdown rendering
│       ├── formHandler.js        # Form validation & API calls
│       ├── translations.js       # i18n support
│       └── exportHandler.js      # Export functionality
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
└── README.md                     # Documentation
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server with auto-reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production server
npm run clean    # Remove build artifacts
```

## 🌟 Key Features Explained

### Smart Itinerary Generation

The AI creates detailed plans including:
- **Daily schedules** with specific times
- **Budget breakdowns** (transport, accommodation, food, activities)
- **Hotel recommendations** with addresses and price ranges
- **Restaurant suggestions** with specialties
- **Activity suggestions** with entrance fees
- **Money-saving tips**
- **Weather information** and packing advice

### Booking Link Enhancement

Automatically adds booking links for:
- Hotels → Booking.com, Agoda, Google Maps
- Restaurants → Google Maps, Google Search
- All recommendations are clickable with `target="_blank"`

### Export Formats

#### 📄 PDF
- Print-ready format
- Professional styling
- Includes all links

#### 🌐 HTML
- Standalone web page
- Embedded CSS styling
- Beautiful gradient design
- Fully responsive

#### 📝 Markdown
- GitHub-friendly format
- Easy to edit
- Version control ready

#### 📃 Text
- Plain text format
- Universal compatibility
- Easy to share via email/SMS

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Install dependencies
npm install

# Check Node version (18+ required)
node --version
```

### API Key Issues
```bash
# Verify API key is set
cat .env | grep GEMINI_API_KEY

# Test API key at:
# https://aistudio.google.com/app/apikey
```

### 404 Not Found Error
- Ensure you're using `gemini-2.5-flash` model
- Check API key is valid and has quota
- Verify network connection

### CORS Errors
- Make sure backend is running on port 3000
- Check frontend is loading from same origin
- Verify `cors` middleware is enabled in `app.ts`

## 🔒 Security Notes

- Never commit `.env` file to Git
- Keep your `GEMINI_API_KEY` private
- Use environment variables for all secrets
- Enable rate limiting for production use

## 🎨 Customization

### Changing Colors
Edit style.css:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Adding New Languages
Edit translations.js:
```javascript
const translations = {
    vi: { /* Vietnamese */ },
    en: { /* English */ },
    fr: { /* Add French */ }
};
```

### Customizing AI Prompts
Edit formHandler.js in the `buildPrompt()` method.

## 📊 API Endpoints

### POST `/api/chat`
**Request:**
```json
{
  "message": "I want to visit Paris for 5 days with a budget of $2000"
}
```

**Response:**
```json
{
  "response": "Here's your personalized Paris itinerary..."
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 👤 Author

**Tran Duc Tri**
- GitHub: [@tranductri](https://github.com/tranductri)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for powering the recommendations
- [Booking.com](https://www.booking.com) & [Agoda](https://www.agoda.com) for hotel search integration
- [Express.js](https://expressjs.com/) for the web framework
- All contributors and users of this project

## 🔮 Future Enhancements

- [ ] Flight search integration
- [ ] Price comparison across multiple booking sites
- [ ] User authentication and saved trips
- [ ] Social sharing features
- [ ] Trip collaboration (shared planning)
- [ ] Mobile app (React Native)
- [x] Weather API integration
- [ ] Currency conversion API
- [ ] Map view of itinerary
- [ ] Calendar export (iCal format)

## 📞 Support

If you encounter any issues or have questions:

1. Check the Troubleshooting section
2. Search existing [GitHub Issues](https://github.com/tridpt/ai-travel-agent-gemini/issues)
3. Create a new issue with detailed information

---

**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ and ☕ by Tran Duc Tri