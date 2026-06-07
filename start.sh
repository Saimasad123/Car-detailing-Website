#!/bin/bash
# Quick Start Script for Luxe Shine Salon with AI Chatbot

echo "🚀 Starting Luxe Shine Salon Backend..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node -v)"

# Navigate to backend directory
cd backend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 AI Chatbot Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Current configuration in .env:"

if [ -f ".env" ]; then
    echo ""
    grep "USE_AI_SERVICE\|OPENAI_API_KEY\|HF_TOKEN" .env | sed 's/^/  /'
    echo ""
else
    echo "  No .env file found. Creating default..."
    cp .env.example .env
fi

echo ""
echo "To change AI service:"
echo "  1. Edit backend/.env"
echo "  2. Change USE_AI_SERVICE to: local, openai, or huggingface"
echo "  3. Add API keys if using external services"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🟢 Starting server..."
echo "   Backend will run on: http://localhost:5000"
echo "   Open http://localhost:5000 in your browser"
echo ""
echo "💬 The AI chatbot will be available in the bottom-right corner"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
