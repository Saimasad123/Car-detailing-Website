# AI Chatbot Implementation Guide

## Overview
Your Luxe Shine salon project now has a fully functional AI chatbot integrated! The chatbot helps customers with:
- Service inquiries
- Booking assistance
- Pricing information
- General salon questions

## Features

### ✨ Core Features
- **Real-time chat interface**: Floating chat window in bottom-right corner
- **Multiple AI backends**: Local AI, OpenAI, or Hugging Face
- **Conversation memory**: Maintains context across messages
- **Typing indicators**: Visual feedback while processing
- **Responsive design**: Works on mobile and desktop
- **Persistent user sessions**: Remembers conversation per user

### 🤖 AI Service Options

#### 1. **Local AI (Default - No API Key Needed)**
- Works immediately without any setup
- Service-specific knowledge built-in
- Perfect for development and testing
- Responses based on predefined salon knowledge

#### 2. **OpenAI (Optional)**
- More natural, conversational responses
- Requires API key from OpenAI
- Better understanding of complex queries

#### 3. **Hugging Face (Optional)**
- Free AI service with token
- Various models available
- Good for experimentation

## Getting Started

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure AI Service
Edit `backend/.env`:

**Option A: Use Local AI (Recommended for Quick Start)**
```
USE_AI_SERVICE=local
PORT=5000
```

**Option B: Use OpenAI**
```
USE_AI_SERVICE=openai
OPENAI_API_KEY=sk-your-api-key-here
PORT=5000
```

**Option C: Use Hugging Face**
```
USE_AI_SERVICE=huggingface
HF_TOKEN=your-token-here
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.1
PORT=5000
```

### Step 3: Start the Backend Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Step 4: Open the Website
1. Navigate to `http://localhost:5000` in your browser
2. Click the chat button (💬) in the bottom-right corner
3. Start chatting!

## File Structure

```
project/
├── backend/
│   ├── routes/
│   │   └── chat.js          # AI chat handler
│   ├── .env                 # Configuration (USE_AI_SERVICE, API keys)
│   ├── .env.example         # Example configuration
│   └── server.js            # Express server
├── js/
│   └── chatbot.js           # Frontend chat logic
├── css/
│   └── style.css            # Chat styling + animations
└── index.html               # Chat UI elements
```

## Implementation Details

### Backend: `backend/routes/chat.js`
- POST endpoint: `/api/chat`
- Accepts: `{ message: string, userId: string }`
- Returns: `{ reply: string }`
- Features:
  - Conversation memory per user
  - Fallback chain: OpenAI → Hugging Face → Local AI
  - Service-specific knowledge base
  - Error handling

### Frontend: `js/chatbot.js`
- Manages chat UI interactions
- Sends/receives messages
- Shows typing indicators
- Maintains user session ID
- Handles errors gracefully

### Styling: `css/style.css`
- Floating chat button with animations
- Modern chat window design
- Responsive layout
- Typing indicator animation
- Mobile-friendly

## API Endpoints

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

Request:
{
  "message": "What services do you offer?",
  "userId": "user_1234567890"
}

Response:
{
  "reply": "We offer Hair Styling, Coloring, Manicure, Pedicure, Facials, and Threading..."
}
```

## Local AI Responses

The chatbot includes built-in knowledge about your salon:

### Recognized Topics
- **Services**: Hair Styling, Coloring, Manicure, Pedicure, Facials, Threading
- **Booking**: Appointment scheduling
- **Pricing**: Service costs
- **Hours**: Operating hours and availability
- **General**: Greetings, thank yous

### Example Conversations
```
User: "What do you offer?"
Bot: "We offer a comprehensive range of beauty services..."

User: "How can I book?"
Bot: "You can book an appointment by clicking the 'Booking' section..."

User: "What are your hours?"
Bot: "We're open Monday to Saturday, 9 AM to 7 PM..."
```

## Customization

### Add Service Knowledge
Edit `backend/routes/chat.js`:
```javascript
const serviceKnowledge = {
  services: [
    { name: "Your Service", description: "Description..." },
    // Add more services
  ]
};
```

### Add Custom Responses
Update the `generateLocalResponse()` function:
```javascript
if (lowerMsg.includes("your-keyword")) {
  return "Your custom response";
}
```

### Styling
Modify `css/style.css`:
- `.ai-chat-btn`: Chat button styles
- `.ai-chat-window`: Chat window styles
- `.ai-msg.user`: User message styles
- `.ai-msg.bot`: Bot message styles

## Troubleshooting

### Chat Not Working?
1. **Check backend is running**: http://localhost:5000 should show "Luxe Shine Backend API is running 🚀"
2. **Check browser console**: Press F12 and look for errors
3. **Check network tab**: Verify `/api/chat` requests are being sent
4. **Verify .env file**: Make sure `USE_AI_SERVICE` is set

### Get JSON Error?
- Update `backend/routes/chat.js` to use a different AI service
- Check that HF_TOKEN or OPENAI_API_KEY is valid
- Try switching to `USE_AI_SERVICE=local`

### API Key Issues?
- OpenAI: Get from https://platform.openai.com/api-keys
- Hugging Face: Get from https://huggingface.co/settings/tokens

## Testing

### Manual Testing
1. Open http://localhost:5000
2. Click chat button
3. Test these queries:
   - "What services do you offer?"
   - "How can I book an appointment?"
   - "What are your prices?"
   - "Hello!"

### Browser Console
Press F12 and check for:
- `✓ Chatbot loaded successfully`
- No errors in console
- Successful API responses

## Production Deployment

1. **Security**: Never commit `.env` file with real API keys
2. **CORS**: Update allowed origins in `server.js`
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Logging**: Implement proper logging for production
5. **Authentication**: Consider user authentication for conversation history

## Performance Tips

- **Conversation Memory**: Limited to 5 messages per user (configurable)
- **Response Time**: Local AI is fastest, external APIs add ~1-2 seconds
- **Concurrent Users**: Each user gets their own conversation context
- **Memory Usage**: Scales with active users and conversation length

## Support & Customization

For more features:
- Add emotion detection
- Implement FAQ system
- Add appointment integration
- Multi-language support
- Voice chat
- Analytics and tracking

## Version
- **Created**: January 30, 2026
- **Status**: Production Ready
- **AI Backends**: Local, OpenAI, Hugging Face
