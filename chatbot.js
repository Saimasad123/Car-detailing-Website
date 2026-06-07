// Get DOM elements
const aiChatBtn = document.getElementById('aiChatBtn');
const aiChatWindow = document.getElementById('aiChatWindow');
const aiChatBody = document.getElementById('aiChatBody');
const aiChatInput = document.getElementById('aiChatInput');

// Generate or get unique user ID
function getUserId() {
  let userId = localStorage.getItem('chatUserId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatUserId', userId);
  }
  return userId;
}

// Show typing indicator
function showTypingIndicator() {
  const typingMsg = document.createElement('div');
  typingMsg.classList.add('ai-msg', 'bot', 'typing');
  typingMsg.innerHTML = '<span></span><span></span><span></span>';
  typingMsg.id = 'typingIndicator';
  aiChatBody.appendChild(typingMsg);
  aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingMsg = document.getElementById('typingIndicator');
  if (typingMsg) {
    typingMsg.remove();
  }
}

// Toggle chat window
aiChatBtn.addEventListener('click', () => {
  if (aiChatWindow.style.display === 'flex') {
    aiChatWindow.style.display = 'none';
  } else {
    aiChatWindow.style.display = 'flex';
    aiChatInput.focus();
    
    // Show welcome message if chat is empty
    if (aiChatBody.children.length === 0) {
      const welcomeMsg = document.createElement('div');
      welcomeMsg.classList.add('ai-msg', 'bot');
      welcomeMsg.textContent = "👋 Welcome to Luxe Shine! How can I help you today? Ask me about our services, pricing, or how to book an appointment.";
      aiChatBody.appendChild(welcomeMsg);
    }
  }
});

// Send message function
async function sendAIMessage() {
  const msg = aiChatInput.value.trim();
  if (!msg) return;

  // Add user message to chat
  const userMsg = document.createElement('div');
  userMsg.classList.add('ai-msg', 'user');
  userMsg.textContent = msg;
  aiChatBody.appendChild(userMsg);
  aiChatInput.value = "";
  aiChatBody.scrollTop = aiChatBody.scrollHeight;

  // Show typing indicator
  showTypingIndicator();

  try {
    // Send message to backend
    const userId = getUserId();
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: msg,
        userId: userId 
      })
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    
    // Remove typing indicator
    removeTypingIndicator();

    // Add bot message
    const botMsg = document.createElement('div');
    botMsg.classList.add('ai-msg', 'bot');
    botMsg.textContent = data.reply || "I'm having trouble processing your request. Please try again.";
    aiChatBody.appendChild(botMsg);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;

  } catch (err) {
    removeTypingIndicator();
    
    console.error('Chat error:', err);
    const errorMsg = document.createElement('div');
    errorMsg.classList.add('ai-msg', 'bot');
    errorMsg.textContent = "⚠️ Error: Could not connect to server. Please make sure the backend is running on http://localhost:5000";
    aiChatBody.appendChild(errorMsg);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
  }
}

// Send message on Enter key
aiChatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendAIMessage();
  }
});

// Send message on button click (if there's a send button)
const sendBtn = document.querySelector('.ai-chat-input button');
if (sendBtn) {
  sendBtn.addEventListener('click', sendAIMessage);
}

// Optional: Add quick suggestion buttons
function addQuickSuggestion(text) {
  aiChatInput.value = text;
  sendAIMessage();
}

// Log that chatbot is loaded
console.log('✓ Chatbot loaded successfully');
