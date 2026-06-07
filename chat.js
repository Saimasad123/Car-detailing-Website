const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// Load configuration from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = process.env.HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.1";
const USE_AI_SERVICE = process.env.USE_AI_SERVICE || "local"; // local, openai, huggingface

// Simple context memory for conversations
const conversationMemory = new Map();
const MAX_MEMORY_MESSAGES = 5;

// Knowledge base for service-specific questions
const serviceKnowledge = {
  services: [
    { name: "Exterior Wash", description: "High-quality exterior cleaning to restore your car's shine", price: "$30" },
    { name: "Interior Cleaning", description: "Deep cleaning for interiors, carpets, and seats", price: "$50" },
    { name: "Full Detail", description: "Complete interior and exterior detailing for ultimate shine", price: "$90" }
  ]
};

// Build context-aware responses for car detailing queries
function buildCarDetailingContext(message) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes("service") || lowerMsg.includes("what do you offer") || lowerMsg.includes("menu")) {
    return `The user asked about our services. Here are our car detailing offerings: ${serviceKnowledge.services.map(s => `${s.name} (${s.price}) - ${s.description}`).join(", ")}`;
  }
  
  if (lowerMsg.includes("book") || lowerMsg.includes("appointment") || lowerMsg.includes("schedule")) {
    return "The user wants to book a car detailing appointment. Direct them to the booking section to schedule their service.";
  }
  
  if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("fee")) {
    return "The user is asking about pricing. We offer Exterior Wash for $30, Interior Cleaning for $50, and Full Detail for $90.";
  }
  
  if (lowerMsg.includes("hour") || lowerMsg.includes("time") || lowerMsg.includes("open")) {
    return "Our car detailing service operates during business hours. Please check the website for specific timings.";
  }
  
  return "";
}

// Simple AI response generator (local fallback)
function generateLocalResponse(message) {
  const context = buildCarDetailingContext(message);
  const lowerMsg = message.toLowerCase();
  
  // Service inquiries
  if (lowerMsg.includes("service") || lowerMsg.includes("offer")) {
    return "We offer three professional car detailing services: Exterior Wash ($30), Interior Cleaning ($50), and Full Detail ($90). Which service interests you?";
  }
  
  if (lowerMsg.includes("book") || lowerMsg.includes("appointment")) {
    return "You can book a car detailing appointment by clicking the 'Book Now' section on our website. Choose your preferred service (Exterior, Interior, or Full Detail), date, and time. Our team will confirm your booking!";
  }
  
  if (lowerMsg.includes("price") || lowerMsg.includes("cost")) {
    return "Our car detailing pricing: Exterior Wash - $30 (exterior cleaning), Interior Cleaning - $50 (deep interior cleaning), Full Detail - $90 (complete interior and exterior). Would you like to book one of these services?";
  }
  
  if (lowerMsg.includes("exterior")) {
    return "Our Exterior Wash service ($30) includes high-quality exterior cleaning to restore your car's shine. It's perfect for keeping your car looking clean and well-maintained.";
  }
  
  if (lowerMsg.includes("interior")) {
    return "Our Interior Cleaning service ($50) provides deep cleaning for interiors, carpets, and seats. Your car's interior will look fresh and clean!";
  }
  
  if (lowerMsg.includes("full detail") || lowerMsg.includes("full detailing")) {
    return "Our Full Detail service ($90) is the complete package - both interior and exterior detailing for the ultimate shine. Perfect for a comprehensive car refresh!";
  }
  
  if (lowerMsg.includes("hour") || lowerMsg.includes("open") || lowerMsg.includes("time")) {
    return "We're open during business hours for car detailing services. Please check the website for our specific operating hours or contact us for availability.";
  }
  
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
    return "Hello! Welcome to Luxe Shine car detailing. How can I help you today? You can ask about our services, book a detailing appointment, check pricing, or anything else!";
  }
  
  if (lowerMsg.includes("thank")) {
    return "You're welcome! If you need anything else, feel free to ask. We're here to keep your car looking great!";
  }
  
  // Default response
  return `I'm here to help with car detailing! You asked: "${message}". I can assist you with service information, booking, pricing, and more. What would you like to know about our detailing services?`;
}

// Call OpenAI API
async function callOpenAI(message, conversationHistory) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for Luxe Shine, a professional car detailing service. Help users with questions about car detailing services, bookings, pricing, and general inquiries. Be friendly and professional. Our services are: Exterior Wash ($30), Interior Cleaning ($50), and Full Detail ($90)."
          },
          ...conversationHistory,
          { role: "user", content: message }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    return null;
  }
}

// Call Hugging Face API
async function callHuggingFace(message) {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: message,
        parameters: { max_length: 100 }
      })
    });

    if (!response.ok) {
      console.error("Hugging Face API error:", response.status);
      return null;
    }

    const data = await response.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    return null;
  } catch (error) {
    console.error("Hugging Face API error:", error.message);
    return null;
  }
}

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    console.log("Chat received:", message);

    // Get or create conversation history
    if (!conversationMemory.has(userId)) {
      conversationMemory.set(userId, []);
    }
    const history = conversationMemory.get(userId);

    let reply = null;

    // Try different AI services
    if (USE_AI_SERVICE === "openai" && OPENAI_API_KEY) {
      console.log("Using OpenAI API...");
      const conversationHistory = history.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }));
      reply = await callOpenAI(message, conversationHistory);
    } 
    else if (USE_AI_SERVICE === "huggingface" && HF_TOKEN) {
      console.log("Using Hugging Face API...");
      reply = await callHuggingFace(message);
    }
    
    // Fallback to local AI
    if (!reply) {
      console.log("Using local AI response...");
      reply = generateLocalResponse(message);
    }

    // Store in memory
    history.push({ sender: "user", text: message });
    history.push({ sender: "bot", text: reply });
    
    // Keep only recent messages
    if (history.length > MAX_MEMORY_MESSAGES * 2) {
      conversationMemory.set(userId, history.slice(-MAX_MEMORY_MESSAGES * 2));
    }

    console.log("AI Reply:", reply);
    res.json({ reply });

  } catch (error) {
    console.error("Chat API error:", error.message);
    res.json({
      reply: "I'm having trouble processing your request. Please try again later."
    });
  }
});

module.exports = router;
