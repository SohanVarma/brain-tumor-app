from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Brain Tumor MRI Classifier API",
    description="API for classifying brain tumor types from MRI images",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
model = None
class_labels = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

@app.on_event("startup")
async def load_model():
    """Load the CNN model on startup"""
    global model
    try:
        model = tf.keras.models.load_model("../tumour_cnn_model.h5")
        logger.info("✅ Model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise e

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Brain Tumor MRI Classifier API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "supported_formats": ["jpg", "jpeg", "png"],
        "classes": class_labels
    }

def preprocess_image(image_file: UploadFile) -> np.ndarray:
    """Preprocess uploaded image for model prediction"""
    try:
        # Read image
        image_data = image_file.file.read()
        image_pil = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image_pil.mode != 'RGB':
            image_pil = image_pil.convert('RGB')
        
        # Resize to model input size
        image_pil = image_pil.resize((224, 224))
        
        # Convert to numpy array and normalize
        img_array = np.array(image_pil)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array.astype('float32') / 255.0
        
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

@app.post("/predict")
async def predict_tumor(file: UploadFile = File(...)):
    """Predict brain tumor type from uploaded MRI image"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/jpg", "image/png"]:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Please upload JPEG or PNG images only."
        )
    
    try:
        # Preprocess image
        img_array = preprocess_image(file)
        
        # Make prediction
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction, axis=1)[0]
        confidence = float(np.max(prediction))
        
        # Prepare response
        result = {
            "predicted_class": class_labels[predicted_class],
            "confidence": round(confidence * 100, 2),
            "all_predictions": {
                class_labels[i]: round(float(prediction[0][i]) * 100, 2) 
                for i in range(len(class_labels))
            }
        }
        
        logger.info(f"Prediction made: {result['predicted_class']} with {result['confidence']}% confidence")
        return result
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)