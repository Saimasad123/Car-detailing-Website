#!/bin/bash
# AI Chatbot Testing Guide
# This guide helps you test and verify the chatbot installation

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║       🤖 AI CHATBOT - TESTING & VERIFICATION GUIDE               ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Verify Node.js Installation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js installed:$(node -v)${NC}"
else
    echo -e "${RED}✗ Node.js not found. Install from: https://nodejs.org/${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 2: Verify Backend Files${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

files_to_check=(
    "backend/server.js"
    "backend/routes/chat.js"
    "backend/.env"
    "backend/package.json"
    "js/chatbot.js"
    "css/style.css"
    "index.html"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file - NOT FOUND${NC}"
    fi
done
echo ""

echo -e "${BLUE}Step 3: Verify Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    echo ""
    echo "Current settings:"
    grep "^[^#]" backend/.env | sed 's/^/  /'
else
    echo -e "${RED}✗ .env file not found${NC}"
fi
echo ""

echo -e "${BLUE}Step 4: Check Dependencies${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${YELLOW}! Dependencies not installed${NC}"
    echo "  Run: cd backend && npm install"
fi
echo ""

echo -e "${BLUE}Step 5: Code Quality Checks${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for common patterns
echo "Checking for required functions..."

if grep -q "sendAIMessage" js/chatbot.js; then
    echo -e "${GREEN}✓ sendAIMessage function found${NC}"
else
    echo -e "${RED}✗ sendAIMessage function missing${NC}"
fi

if grep -q "generateLocalResponse" backend/routes/chat.js; then
    echo -e "${GREEN}✓ generateLocalResponse function found${NC}"
else
    echo -e "${RED}✗ generateLocalResponse function missing${NC}"
fi

if grep -q "router.post" backend/routes/chat.js; then
    echo -e "${GREEN}✓ Chat API endpoint found${NC}"
else
    echo -e "${RED}✗ Chat API endpoint missing${NC}"
fi

if grep -q "ai-chat-btn" css/style.css; then
    echo -e "${GREEN}✓ Chat button styling found${NC}"
else
    echo -e "${RED}✗ Chat button styling missing${NC}"
fi

if grep -q "aiChatWindow" index.html; then
    echo -e "${GREEN}✓ Chat window HTML found${NC}"
else
    echo -e "${RED}✗ Chat window HTML missing${NC}"
fi

echo ""

echo -e "${BLUE}Step 6: Manual Testing (Start Server)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To manually test the chatbot:"
echo "  1. Run: cd backend && npm start"
echo "  2. Open: http://localhost:5000"
echo "  3. Click the 💬 chat button (bottom-right)"
echo "  4. Try these messages:"
echo "     - 'What services do you offer?'"
echo "     - 'How can I book an appointment?'"
echo "     - 'What are your prices?'"
echo ""

echo -e "${BLUE}Step 7: Checklist for Successful Setup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Server should be ready if:"
echo "  ☐ npm start completes without errors"
echo "  ☐ http://localhost:5000 loads the website"
echo "  ☐ Chat button appears in bottom-right corner"
echo ""
echo "Chatbot should work if:"
echo "  ☐ Click chat button opens the window"
echo "  ☐ Welcome message appears"
echo "  ☐ Typing a message works"
echo "  ☐ Send button or Enter sends message"
echo "  ☐ Bot responds with relevant answer"
echo ""

echo -e "${BLUE}Step 8: Troubleshooting${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Problem: Chat button not visible"
echo "  Solution: Refresh page, check browser console for errors"
echo ""
echo "Problem: 'Cannot connect to server'"
echo "  Solution: Make sure 'npm start' is running in backend folder"
echo ""
echo "Problem: No response from chatbot"
echo "  Solution: Check USE_AI_SERVICE in .env is 'local'"
echo ""
echo "Problem: Dependencies missing"
echo "  Solution: Run: cd backend && npm install"
echo ""
echo "Problem: Port 5000 already in use"
echo "  Solution: Change PORT in .env file"
echo ""

echo -e "${BLUE}Step 9: Browser Developer Tools${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To debug, press F12 in your browser and:"
echo "  1. Check Console tab for errors"
echo "  2. Check Network tab for API calls to /api/chat"
echo "  3. Check Response of chat requests"
echo "  4. Look for '✓ Chatbot loaded successfully' message"
echo ""

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                     READY TO TEST! 🚀                             ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Run: ./start.sh (or start.bat on Windows)"
echo "Then open: http://localhost:5000"
echo ""
