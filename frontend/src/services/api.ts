import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for predictions
});

export interface PredictionResult {
  predicted_class: string;
  confidence: number;
  all_predictions: Record<string, number>;
}

export interface HealthCheck {
  status: string;
  model_loaded: boolean;
  supported_formats: string[];
  classes: string[];
}

/**
 * Check if the API is healthy and model is loaded
 */
export const checkHealth = async (): Promise<HealthCheck> => {
  try {
    const response = await api.get<HealthCheck>('/health');
    return response.data;
  } catch (error) {
    throw new Error('Failed to connect to the API server');
  }
};

/**
 * Send image to backend for tumor classification
 */
export const predictImage = async (file: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<PredictionResult>('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid image file');
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred during prediction');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - the image processing took too long');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to the AI server. Please ensure the backend is running.');
      }
    }
    throw new Error('Failed to analyze the image. Please try again.');
  }
};

export default api;