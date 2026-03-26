"""
Frame processing utilities for handling webcam frames.
"""

import base64
import cv2
import numpy as np
from typing import Optional, Tuple


def decode_base64_frame(base64_string: str) -> Optional[np.ndarray]:
    """
    Decodes a base64-encoded image string to OpenCV format.
    
    Args:
        base64_string: Base64 encoded image string
        
    Returns:
        numpy.ndarray: OpenCV image array or None if decoding fails
    """
    try:
        # Remove data URL prefix if present
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        
        # Decode base64 to bytes
        img_bytes = base64.b64decode(base64_string)
        
        # Convert to numpy array
        nparr = np.frombuffer(img_bytes, np.uint8)
        
        # Decode to OpenCV image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        return img
    except Exception as e:
        print(f"Error decoding frame: {e}")
        return None


def resize_frame(frame: np.ndarray, max_width: int = 640) -> np.ndarray:
    """
    Resizes a frame while maintaining aspect ratio.
    
    Args:
        frame: OpenCV image array
        max_width: Maximum width for the resized frame
        
    Returns:
        numpy.ndarray: Resized frame
    """
    height, width = frame.shape[:2]
    
    if width > max_width:
        ratio = max_width / width
        new_width = max_width
        new_height = int(height * ratio)
        frame = cv2.resize(frame, (new_width, new_height))
    
    return frame


def validate_frame(frame: np.ndarray) -> bool:
    """
    Validates that a frame is suitable for processing.
    
    Args:
        frame: OpenCV image array
        
    Returns:
        bool: True if frame is valid, False otherwise
    """
    if frame is None:
        return False
    
    if frame.size == 0:
        return False
    
    # Check if frame has reasonable dimensions
    height, width = frame.shape[:2]
    if height < 50 or width < 50:
        return False
    
    return True
