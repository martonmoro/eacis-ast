"""
Emotion to Engagement Score Mapping
Maps detected emotions to engagement scores based on educational psychology principles.
"""

from typing import Dict

# Emotion to engagement score mapping
# Adjusted for more nuanced interpretation
EMOTION_ENGAGEMENT_MAP: Dict[str, float] = {
    "happy": 1.0,        # Highly engaged and positive
    "surprise": 0.85,    # Engaged and curious (slightly lowered)
    "neutral": 0.6,      # Moderately engaged (lowered - neutral can mean bored)
    "sad": 0.4,          # Low engagement (increased - not completely disengaged)
    "angry": 0.3,        # Very low engagement (increased - frustration can indicate trying)
    "fear": 0.25,        # Anxious/confused (increased - still attempting)
    "disgust": 0.2       # Disengaged (increased - stronger negative than fear)
}


def get_engagement_score(emotion: str) -> float:
    """
    Returns the engagement score for a given emotion.
    
    Args:
        emotion: The detected emotion string (lowercase)
        
    Returns:
        float: Engagement score between 0.0 and 1.0
    """
    emotion_lower = emotion.lower()
    return EMOTION_ENGAGEMENT_MAP.get(emotion_lower, 0.5)


def normalize_emotion_name(emotion: str) -> str:
    """
    Normalizes emotion names from different models.
    
    Args:
        emotion: Raw emotion string from detection model
        
    Returns:
        str: Normalized emotion name
    """
    emotion_lower = emotion.lower().strip()
    
    # Handle common variations
    emotion_map = {
        "happiness": "happy",
        "joy": "happy",
        "surprised": "surprise",
        "sadness": "sad",
        "anger": "angry",
        "scared": "fear",
        "fearful": "fear"
    }
    
    return emotion_map.get(emotion_lower, emotion_lower)
