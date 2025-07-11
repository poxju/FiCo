#!/bin/bash

echo "🚀 FiCo Development Environment Starting..."

# Go to Backend directory and install dependencies
echo "📦 Checking backend dependencies..."
cd Backend

# Install node modules if not present
if [ ! -d "node_modules" ]; then
    echo "⬇️  Installing Node.js dependencies..."
    npm install
fi

# Start Backend
echo "🔧 Starting backend server..."
echo "📱 Frontend: http://localhost:3000/Frontend/"
echo "🔍 API Test: http://localhost:3000/api/search?query=iPhone"
echo ""
echo "🛑 Use Ctrl+C to stop"
echo ""

node index.js
