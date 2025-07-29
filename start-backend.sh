#!/bin/bash

echo "🧠 Starting Brain Tumor Classifier Backend..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if model file exists
if [ ! -f "tumour_cnn_model.h5" ]; then
    echo "❌ Model file 'tumour_cnn_model.h5' not found in the root directory."
    echo "Please ensure the model file is present and try again."
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found in backend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check the error above."
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo "📊 API documentation will be available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
python main.py