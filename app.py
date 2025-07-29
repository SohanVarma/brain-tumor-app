# ✅ Final Streamlit App
# ✅ Put this at the VERY TOP
import sys
import streamlit as st

st.write("Python version:", sys.version)

# ✅ Then your existing imports:
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# ... rest of your Streamlit code ...

import streamlit as st
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# -------------------------------
# ✅ Debug: Show working directory contents
# -------------------------------
st.write("📂 Files in current folder:", os.listdir())

# -------------------------------
# ✅ Load your saved model
# -------------------------------

MODEL_PATH = "tumour_cnn_model.h5"  # Make sure this matches your file

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    st.success(f"✅ Loaded model: {MODEL_PATH}")
except Exception as e:
    st.error(f"❌ Could not load model file! Error: {e}")
    st.stop()

# -------------------------------
# ✅ Streamlit UI
# -------------------------------

st.title("🧠 Brain Tumor MRI Classifier")
st.write("Upload an MRI image and let the model predict the tumor type.")

# File uploader
uploaded_file = st.file_uploader("Choose an MRI image...", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    # Show the uploaded image
    img = image.load_img(uploaded_file, target_size=(224, 224))
    st.image(img, caption="Uploaded Image", use_column_width=True)

    # Preprocess image
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    # Predict
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction, axis=1)

    # Show prediction
    class_labels = ["Tumor Type A", "Tumor Type B", "Tumor Type C"]  # Change to your actual classes
    predicted_label = class_labels[predicted_class[0]]

    st.write("### ✅ Prediction:")
    st.write(f"**Predicted Tumor Type:** {predicted_label}")
    st.write(f"**Confidence:** {np.max(prediction) * 100:.2f}%")
