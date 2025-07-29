#!/bin/bash

echo "🧠 Starting Brain Tumor Classifier (Full Stack)"
echo "================================================"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping all servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Check if model file exists
if [ ! -f "tumour_cnn_model.h5" ]; then
    echo "❌ Model file 'tumour_cnn_model.h5' not found in the root directory."
    echo "Please ensure the model file is present and try again."
    exit 1
fi

# Start backend in background
echo "🚀 Starting backend server..."
./start-backend.sh > backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Check if backend is still running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Check backend.log for details."
    exit 1
fi

echo "✅ Backend started successfully (PID: $BACKEND_PID)"

# Start frontend in background
echo "🚀 Starting frontend server..."
./start-frontend.sh > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 10

# Check if frontend is still running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend failed to start. Check frontend.log for details."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend started successfully (PID: $FRONTEND_PID)"
echo ""
echo "🎉 Both servers are running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "📋 Logs are being written to:"
echo "   - Backend: backend.log"
echo "   - Frontend: frontend.log"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to interrupt
while true; do
    sleep 1
done