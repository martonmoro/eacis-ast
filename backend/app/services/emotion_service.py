"""
Emotion detection service using DeepFace.
Handles emotion detection from frames and provides fallback mechanisms.
"""

import cv2
import numpy as np
from typing import Dict, Optional, Tuple
from deepface import DeepFace


class EmotionDetectionService:
    """
    Service for detecting emotions from facial images.
    Uses DeepFace with fallback error handling.
    """
    
    def __init__(self):
        """Initialize the emotion detection service."""
        self.model_name = "emotion"
        self.default_emotion = "neutral"
        self.default_confidence = 0.5
        
    def _preprocess_frame(self, frame: np.ndarray) -> np.ndarray:
        """
        Pre-process frame to improve detection for all skin tones.
        Applies histogram equalization to improve contrast.
        
        Args:
            frame: OpenCV image array (BGR format)
            
        Returns:
            np.ndarray: Processed frame
        """
        # Convert to YUV color space
        yuv = cv2.cvtColor(frame, cv2.COLOR_BGR2YUV)
        
        # Apply histogram equalization to Y channel (luminance)
        yuv[:,:,0] = cv2.equalizeHist(yuv[:,:,0])
        
        # Convert back to BGR
        processed = cv2.cvtColor(yuv, cv2.COLOR_YUV2BGR)
        
        return processed
        
    def detect_emotion(self, frame: np.ndarray) -> Tuple[str, float]:
        """
        Detects emotion from a frame.
        
        Args:
            frame: OpenCV image array (BGR format)
            
        Returns:
            Tuple[str, float]: (emotion_name, confidence_score)
        """
        try:
            # Pre-process frame to improve detection for darker skin tones
            # Apply histogram equalization to improve contrast
            processed_frame = self._preprocess_frame(frame)
            
            # Use DeepFace to analyze the frame
            # Using 'mtcnn' detector which is reliable and works well with diverse skin tones
            # enforce_detection=False to handle cases when face temporarily not visible
            result = DeepFace.analyze(
                img_path=processed_frame,
                actions=['emotion'],
                enforce_detection=False,
                detector_backend='mtcnn',  # Good balance of accuracy and reliability
                silent=True
            )
            
            # Handle list or dict response
            if isinstance(result, list):
                result = result[0]

            # print(f"DeepFace result: {result}")
            
            # Extract emotion data
            emotions = result.get('emotion', {})
            
            if not emotions:
                print("No emotions detected in the frame.")
                return self.default_emotion, self.default_confidence
            
            # Get dominant emotion
            dominant_emotion = result.get('dominant_emotion', self.default_emotion)
            confidence = emotions.get(dominant_emotion, 0.0) / 100.0  # Convert percentage to 0-1

            # Only return if confidence is above threshold
            if confidence < 0.35:  # Minimum confidence threshold (lowered slightly)
                print(f"Confidence too low ({confidence:.2f}), using default")
                return self.default_emotion, self.default_confidence

            print(f"Detected emotion: {dominant_emotion} with confidence {confidence:.2f}")
            
            return dominant_emotion.lower(), confidence
            
        except ValueError as e:
            # No face detected - this is common, not an error
            print(f"No face detected in frame")
            return self.default_emotion, 0.3
        except Exception as e:
            print(f"Error in emotion detection: {str(e)[:100]}")
            return self.default_emotion, self.default_confidence
    
    def get_emotion_details(self, frame: np.ndarray) -> Optional[Dict]:
        """
        Gets detailed emotion analysis including all emotion probabilities.
        
        Args:
            frame: OpenCV image array (BGR format)
            
        Returns:
            Dict: Detailed emotion analysis or None if detection fails
        """
        try:
            result = DeepFace.analyze(
                img_path=frame,
                actions=['emotion'],
                enforce_detection=False,
                detector_backend='opencv',
                silent=True
            )
            
            if isinstance(result, list):
                result = result[0]
            
            return result
            
        except Exception as e:
            print(f"Error in detailed emotion detection: {e}")
            return None


# Singleton instance
_emotion_service = None


def get_emotion_service() -> EmotionDetectionService:
    """
    Returns a singleton instance of the emotion detection service.
    
    Returns:
        EmotionDetectionService: Singleton service instance
    """
    global _emotion_service
    if _emotion_service is None:
        _emotion_service = EmotionDetectionService()
    return _emotion_service
