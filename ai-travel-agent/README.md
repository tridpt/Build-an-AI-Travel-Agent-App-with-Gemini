# AI Travel Agent

## Overview
The AI Travel Agent is a web application that leverages OpenAI's capabilities to assist users in planning their travel. The application provides features such as destination suggestions, flight searches, hotel recommendations, and an interactive chat interface for user inquiries.

## Features
- **Travel Planning**: Users can search for destinations, flights, and hotels.
- **AI Chat Interface**: An interactive chat feature that allows users to ask questions and receive AI-generated responses.
- **User-Friendly Interface**: A clean and intuitive front-end design for easy navigation.

## Project Structure
```
ai-travel-agent
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── travelController.ts
│   │   └── chatController.ts
│   ├── services
│   │   ├── openaiService.ts
│   │   └── travelService.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── api.ts
│   ├── middleware
│   │   └── errorHandler.ts
│   ├── models
│   │   └── travel.ts
│   ├── utils
│   │   └── helpers.ts
│   └── types
│       └── index.ts
├── public
│   ├── index.html
│   ├── css
│   │   └── style.css
│   └── js
│       └── main.js
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd ai-travel-agent
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Set up your environment variables by copying `.env.example` to `.env` and filling in the required values.

## Usage
To start the application, run:
```
npm start
```
Visit `http://localhost:3000` in your web browser to access the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.