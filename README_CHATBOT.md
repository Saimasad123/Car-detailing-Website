# 🤖 AI Chatbot Quick Start Guide

## What Was Created?

Your Luxe Shine salon now has a **fully functional AI chatbot** that:
- ✅ Works out of the box (no API key needed!)
- ✅ Answers questions about services, pricing, and bookings
- ✅ Has a beautiful floating chat interface
- ✅ Supports OpenAI and Hugging Face for advanced AI
- ✅ Maintains conversation context per user

## How to Start

### Option 1: Linux/Mac
```bash
cd /home/kali-attacker/Downloads/project
./start.sh
```

### Option 2: Windows
```bash
cd C:\path\to\project
start.bat
```

### Option 3: Manual
```bash
cd backend
npm install
npm start
```

**Then open:** http://localhost:5000

## Using the Chatbot

1. Click the **💬 Chat Button** (bottom-right corner)
2. Type your question
3. Press **Enter** or click **Send**
4. The AI assistant will respond

## Try These Questions

- "What services do you offer?"
- "How do I book an appointment?"
- "What are your prices?"
- "What are your hours?"
- "Hello, can you help me?"

## Configuration

### Using Local AI (Default - Recommended)
No setup needed! Already configured to work.

### Switch to OpenAI
1. Get API key from https://platform.openai.com/api-keys
2. Edit `backend/.env`:
   ```
   USE_AI_SERVICE=openai
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart server

### Switch to Hugging Face
1. Get token from https://huggingface.co/settings/tokens
2. Edit `backend/.env`:
   ```
   USE_AI_SERVICE=huggingface
   HF_TOKEN=your-token-here
   HF_MODEL=mistralai/Mistral-7B-Instruct-v0.1
   ```
3. Restart server

## File Locations

| File | Purpose |
|------|---------|
| `backend/routes/chat.js` | AI logic and integrations |
| `js/chatbot.js` | Chat interface code |
| `css/style.css` | Chat styling |
| `backend/.env` | Configuration (API keys) |
| `index.html` | Chat UI elements |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Chat not showing | Click the 💬 button in bottom-right |
| "Cannot connect to server" | Make sure backend is running on port 5000 |
| API errors | Check API key in `.env` is correct |
| Want different responses | Edit `backend/routes/chat.js` |

## Customization

### Add Custom Responses
Edit `backend/routes/chat.js`, find `generateLocalResponse()` function:
```javascript
if (lowerMsg.includes("your-keyword")) {
  return "Your custom response here";
}
```

### Change Chat Colors
Edit `css/style.css`:
- Change `#0d6efd` to your preferred color
- Colors in `.ai-chat-btn`, `.ai-msg.user`, etc.

### Add Service to Knowledge Base
Edit `backend/routes/chat.js`, update `serviceKnowledge`:
```javascript
const serviceKnowledge = {
  services: [
    { name: "Your Service", description: "What it does" },
    // ...
  ]
};
```

## Status

✅ **Frontend** - Complete with animations and responsive design
✅ **Backend** - Ready with multiple AI integrations  
✅ **Local AI** - Works without any API keys
✅ **Documentation** - Full guides included

## Next Steps

1. **Test It**: Click the chat button and ask questions
2. **Customize**: Edit responses in `backend/routes/chat.js`
3. **Deploy**: Follow deployment guide in `CHATBOT_SETUP.md`
4. **Enhance**: Add more services, FAQ, or voice support

## Support

For detailed information, see: `CHATBOT_SETUP.md`

---

**Ready to go!** 🚀 Start the server and enjoy your AI chatbot!
