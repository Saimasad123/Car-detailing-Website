@echo off
REM Quick Start Script for Luxe Shine Salon with AI Chatbot (Windows)

echo.
echo ========================================
echo 🚀 Starting Luxe Shine Salon Backend...
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version

REM Navigate to backend directory
cd backend

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo.
    echo 📦 Installing dependencies...
    call npm install
) else (
    echo ✓ Dependencies already installed
)

echo.
echo ========================================
echo 🤖 AI Chatbot Configuration
echo ========================================
echo.
echo Current configuration in .env:
echo.

if exist ".env" (
    type .env | findstr "USE_AI_SERVICE OPENAI_API_KEY HF_TOKEN"
) else (
    echo   No .env file found. Creating default...
    copy .env.example .env
)

echo.
echo To change AI service:
echo   1. Edit backend\.env
echo   2. Change USE_AI_SERVICE to: local, openai, or huggingface
echo   3. Add API keys if using external services
echo.
echo ========================================
echo.
echo 🟢 Starting server...
echo    Backend will run on: http://localhost:5000
echo    Open http://localhost:5000 in your browser
echo.
echo 💬 The AI chatbot will be available in the bottom-right corner
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
pause
