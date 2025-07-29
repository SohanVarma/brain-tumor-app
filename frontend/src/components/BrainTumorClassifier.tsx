import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Brain, Upload, X, Loader, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { predictImage } from '../services/api';

interface PredictionResult {
  predicted_class: string;
  confidence: number;
  all_predictions: Record<string, number>;
}

const BrainTumorClassifier: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictImage(selectedFile);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceClass = (confidence: number) => {
    if (confidence >= 80) return 'confidence-high';
    if (confidence >= 60) return 'confidence-medium';
    return 'confidence-low';
  };

  return (
    <div className="classifier-container">
      <div className="header">
        <h1>
          <Brain size={40} />
          Brain Tumor MRI Classifier
        </h1>
        <p>
          Upload an MRI brain scan image and our AI model will classify the tumor type.
          Supported formats: JPEG, PNG (max 10MB)
        </p>
      </div>

      {error && (
        <div className="error">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="upload-icon">
            <Upload size={48} />
          </div>
          <div className="upload-text">
            {isDragActive
              ? 'Drop the MRI image here...'
              : 'Drag & drop an MRI image here, or click to select'}
          </div>
          <div className="upload-hint">
            JPEG, PNG up to 10MB
          </div>
        </div>
      ) : (
        <div className="image-preview">
          <button className="remove-image" onClick={removeImage}>
            <X size={16} />
          </button>
          <img
            src={previewUrl}
            alt="MRI Preview"
            className="preview-image"
          />
        </div>
      )}

      {selectedFile && (
        <button
          className="predict-button"
          onClick={handlePredict}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Analyzing...
            </>
          ) : (
            <>
              <Activity size={20} />
              Analyze MRI Scan
            </>
          )}
        </button>
      )}

      {result && (
        <div className="results">
          <h3>
            <CheckCircle size={24} />
            Analysis Results
          </h3>
          
          <div className="main-prediction">
            <div className="prediction-label">
              {result.predicted_class}
            </div>
            <div className={`prediction-confidence ${getConfidenceClass(result.confidence)}`}>
              Confidence: {result.confidence.toFixed(1)}%
            </div>
          </div>

          <div className="all-predictions">
            <h4>All Classifications</h4>
            {Object.entries(result.all_predictions)
              .sort(([, a], [, b]) => b - a)
              .map(([className, confidence]) => (
                <div key={className} className="prediction-item">
                  <span className="prediction-name">{className}</span>
                  <span className={`prediction-value ${getConfidenceClass(confidence)}`}>
                    {confidence.toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainTumorClassifier;