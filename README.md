# 🧠 Brain Tumor MRI Classifier

A modern web application that uses deep learning to classify brain tumor types from MRI images. The application features a FastAPI backend with a trained CNN model and a React TypeScript frontend with a sleek, medical-grade UI.

## 🎯 Features

- **AI-Powered Classification**: Uses a pre-trained CNN model to classify brain tumors
- **Modern UI**: Clean, responsive React frontend with drag-and-drop functionality
- **Real-time Analysis**: Fast prediction with confidence scores
- **Medical Grade Design**: Professional interface suitable for medical applications
- **Multiple Tumor Types**: Classifies Glioma, Meningioma, No Tumor, and Pituitary tumors
- **File Validation**: Supports JPEG/PNG with file size limits
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

```
├── backend/                 # FastAPI server
│   ├── main.py             # Main FastAPI application
│   └── requirements.txt    # Python dependencies
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main app component
│   └── package.json        # Node.js dependencies
├── tumour_cnn_model.h5     # Pre-trained CNN model
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ with pip
- Node.js 16+ with npm
- The trained model file `tumour_cnn_model.h5`

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server**:
   ```bash
   python main.py
   ```
   
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   The frontend will be available at `http://localhost:3000`

## 📋 API Documentation

### Health Check
- **GET** `/health`
- Returns server status and model information

### Prediction
- **POST** `/predict`
- Upload an MRI image for classification
- Accepts: JPEG, PNG files (max 10MB)
- Returns: Predicted class, confidence score, and all predictions

### Example Response
```json
{
  "predicted_class": "Glioma",
  "confidence": 94.5,
  "all_predictions": {
    "Glioma": 94.5,
    "Meningioma": 3.2,
    "No Tumor": 1.8,
    "Pituitary": 0.5
  }
}
```

## 🛠️ Development

### Backend Development

The FastAPI backend (`backend/main.py`) provides:
- Model loading and inference
- Image preprocessing
- CORS configuration for frontend integration
- Comprehensive error handling
- Logging for debugging

### Frontend Development

The React frontend features:
- **TypeScript** for type safety
- **React Dropzone** for file uploads
- **Axios** for API communication
- **Lucide React** for icons
- **CSS3** for modern styling

Key components:
- `BrainTumorClassifier.tsx` - Main application component
- `api.ts` - API service layer

### Model Information

The CNN model is trained to classify four types:
1. **Glioma** - A type of brain tumor
2. **Meningioma** - A tumor in the brain/spinal cord
3. **No Tumor** - Normal brain tissue
4. **Pituitary** - Tumor in the pituitary gland

Model specifications:
- Input size: 224x224 RGB images
- Framework: TensorFlow/Keras
- Format: .h5 file

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

#### Backend
No environment variables required for basic setup.

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- `http://127.0.0.1:3000` (alternative localhost)

## 📦 Production Deployment

### Backend Deployment

1. **Install production server**:
   ```bash
   pip install gunicorn
   ```

2. **Run with Gunicorn**:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

### Frontend Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Serve static files** using your preferred method (nginx, Apache, etc.)

### Docker Deployment (Optional)

Create `Dockerfile` for each service and use Docker Compose for orchestration.

## 🐛 Troubleshooting

### Common Issues

1. **Model not found**: Ensure `tumour_cnn_model.h5` is in the root directory
2. **CORS errors**: Check that backend CORS settings include your frontend URL
3. **Connection refused**: Ensure backend is running on port 8000
4. **Large file uploads**: Check file size limits (default: 10MB)

### Logs

Backend logs are available in the console where you started the server.

## 🔐 Security Considerations

- File size validation (10MB limit)
- File type validation (JPEG/PNG only)
- Input sanitization
- Error message sanitization

## 📊 Performance

- Typical prediction time: 1-3 seconds
- Supported concurrent users: 50+ (depends on hardware)
- Memory usage: ~2GB (model loading)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- TensorFlow team for the deep learning framework
- React team for the frontend framework
- FastAPI team for the backend framework
- Medical imaging community for datasets and research

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This application is for educational and research purposes. It should not be used for actual medical diagnosis without proper validation and medical supervision.