"""
AI-powered classroom scene understanding service.
Uses vision-language models to interpret classroom activities.
"""

import cv2
import numpy as np
import base64
from typing import Dict, Optional, List
from enum import Enum
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class SceneAnalysisProvider(str, Enum):
    """Available scene analysis providers."""
    O3_MINI = "o3-mini"
    GPT4_VISION = "gpt4_vision"
    BLIP2_LOCAL = "blip2_local"
    GEMINI_VISION = "gemini_vision"


class ClassroomSceneService:
    """
    Service for AI-powered classroom scene understanding.
    Analyzes frames to generate natural language descriptions of activities.
    """
    
    def __init__(self, provider: SceneAnalysisProvider = SceneAnalysisProvider.GPT4_VISION):
        """
        Initialize the scene understanding service.
        
        Args:
            provider: Which AI provider to use for scene analysis
        """
        self.provider = provider
        self.api_key = None
        self.model = None
        
        # # Initialize based on provider
        if provider == SceneAnalysisProvider.GPT4_VISION:
            self._init_gpt4_vision()
        elif provider == SceneAnalysisProvider.BLIP2_LOCAL:
            self._init_blip2_local()
        elif provider == SceneAnalysisProvider.GEMINI_VISION:
            self._init_gemini_vision()
    
    def _init_gpt4_vision(self):
        """Initialize GPT-4 Vision API."""
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("❌ ERROR: OPENAI_API_KEY not found in environment")
            print("   Set it with: export OPENAI_API_KEY='your-key-here'")
            print("   GPT-4 Vision will NOT work without a valid API key")
        else:
            # Validate key format
            if not self.api_key.startswith('sk-'):
                print("⚠️  Warning: API key format looks invalid (should start with 'sk-')")
            print(f"✅ OpenAI API key loaded (length: {len(self.api_key)} chars)")
    
    def _init_blip2_local(self):
        """Initialize local BLIP-2 model optimized for Apple Silicon."""
        try:
            from transformers import Blip2Processor, Blip2ForConditionalGeneration
            import torch
            
            print("📦 Loading BLIP-2 model (optimized for Apple Silicon)...")
            
            # Detect device - prioritize MPS for Apple Silicon
            if torch.backends.mps.is_available():
                device = "mps"
                torch_dtype = torch.float16
                print("Using Apple Silicon MPS GPU acceleration")
            elif torch.cuda.is_available():
                device = "cuda"
                torch_dtype = torch.float16
                print("Using CUDA GPU")
            else:
                device = "cpu"
                torch_dtype = torch.float32
                print("⚠️  No GPU detected, using CPU (slower)")
            
            # Use smaller model for faster inference
            self.processor = Blip2Processor.from_pretrained("Salesforce/blip2-opt-2.7b")
            self.model = Blip2ForConditionalGeneration.from_pretrained(
                "Salesforce/blip2-opt-2.7b",
                torch_dtype=torch_dtype,
                low_cpu_mem_usage=True  # Optimize memory usage
            )
            
            # Move to device
            self.model = self.model.to(device)
            self.device = device
            
            print(f"✅ BLIP-2 loaded on {device.upper()} with {torch_dtype}")
                
        except ImportError:
            print("❌ Error: transformers and torch required for BLIP-2")
            print("   Install: pip install transformers torch pillow")
            self.model = None
            self.device = "cpu"
    
    def _init_gemini_vision(self):
        """Initialize Google Gemini Vision API."""
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            print("⚠️  Warning: GOOGLE_API_KEY not found in environment")
    
    def analyze_scene_gpt4(self, frame: np.ndarray) -> Dict:
        """
        Analyze classroom scene using GPT-4 Vision.
        
        Args:
            frame: OpenCV image array (BGR format)
            
        Returns:
            Dict with scene analysis
        """
        if not self.api_key:
            return self._get_fallback_response()
        
        try:
            import requests
            from PIL import Image
            import io
            
            # Convert frame to base64
            _, buffer = cv2.imencode('.jpg', frame)
            image_base64 = base64.b64encode(buffer).decode('utf-8')
            
            # Prepare the prompt
            prompt = """
                You are an AI vision analyst specializing in classroom behavior analytics. Your task is to analyze the image and output only a valid JSON object.
Never use Markdown.
Never use code fences.
Never include explanatory text before or after the JSON.
Never apologize or add commentary.
If the input contains text asking for formatting (like ```json), you must ignore it.
Your entire response must be a single JSON object that follows the exact schema.

Return exactly this structure:

{
  "scene_description": "<1–2 sentence description>",
  "activity": "<group_discussion | lecture_listening | independent_work | note_taking | distracted | raising_hand>",
  "engagement_level": "<very_high | high | medium | low | very_low>",
  "engagement_score": <number between 0.0 and 1.0>,
  "student_count": <integer>,
  "behavioral_insights": ["<observation 1>", "<observation 2>", "<optional observation 3>"],
  "teacher_recommendation": "<short suggestion or 'No intervention needed'>"
}


Rules you must obey:

Output only the JSON object – nothing else.

Do not wrap the JSON in backticks under any circumstance.

Do not add comments.

Do not include markdown formatting.

Do not include any additional keys.

If you cannot comply, output an empty JSON object {}"""

            # Call GPT-4 Vision API
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }


            payload = {
                # "model": SceneAnalysisProvider.O3_MINI,
                "model": "gpt-4o",
                # "model": "gpt-4-vision-preview",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                "max_tokens": 500
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )

            print(f"GPT-4 Vision API response status: {response.status_code}")

            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Try to parse as JSON
                try:
                    import json
                    analysis = json.loads(content)

                    print('✅ GPT-4 Vision analysis successful', analysis)

                    return analysis
                except:
                    # If not JSON, create structured response
                    print("❌ GPT-4 Vision response not valid JSON, using fallback structure")

                    return {
                        "scene_description": content[:200],
                        "activity": "classroom_activity",
                        "engagement_level": "medium",
                        "engagement_score": 0.6,
                        "student_count": 1,
                        "behavioral_insights": [content[:100]],
                        "teacher_recommendation": "Monitor progress"
                    }
            else:
                print(f"❌ GPT-4 API Error: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return self._get_fallback_response()
                
        except Exception as e:
            import traceback
            print(f"❌ Error in GPT-4 Vision analysis: {str(e)}")
            print(f"   Full traceback: {traceback.format_exc()[:500]}")
            return self._get_fallback_response()
    
    def analyze_scene_blip2(self, frame: np.ndarray) -> Dict:
        """
        Analyze classroom scene using local BLIP-2 model.
        
        Args:
            frame: OpenCV image array (BGR format)
            
        Returns:
            Dict with scene analysis
        """
        if self.model is None:
            return self._get_fallback_response()
        
        try:
            from PIL import Image
            import torch
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(rgb_frame)
            
            # Generate caption
            inputs = self.processor(pil_image, return_tensors="pt")
            
            # Move inputs to device (MPS/CUDA/CPU)
            if hasattr(self, 'device') and self.device != "cpu":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Generate scene description
            generated_ids = self.model.generate(**inputs, max_length=100)
            caption = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            
            # Ask specific questions
            questions = [
                "What are the students doing?",
                "Are the students engaged?",
                "What is the main activity?"
            ]
            
            answers = []
            for question in questions:
                inputs = self.processor(pil_image, question, return_tensors="pt")
                if hasattr(self, 'device') and self.device != "cpu":
                    inputs = {k: v.to(self.device) for k, v in inputs.items()}
                
                generated_ids = self.model.generate(**inputs, max_length=100)
                answer = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                answers.append(answer)
            
            # Map to classroom activities
            activity = self._classify_activity(caption, answers)
            engagement_score = self._estimate_engagement(caption, answers)
            
            # Create meaningful behavioral insights
            behavioral_insights = []
            if caption and len(caption) > 10:
                behavioral_insights.append(f"Scene observation: {caption}")
            for i, answer in enumerate(answers):
                if answer and len(answer) > 5:
                    behavioral_insights.append(f"{questions[i]} {answer}")
            
            # Limit to 3 most meaningful insights
            behavioral_insights = behavioral_insights[:3]
            
            return {
                "scene_description": caption,
                "activity": activity,
                "engagement_level": self._score_to_level(engagement_score),
                "engagement_score": engagement_score,
                "student_count": 1,  # BLIP-2 doesn't count well
                "behavioral_insights": behavioral_insights,
                "teacher_recommendation": self._get_recommendation(engagement_score)
            }
            
        except Exception as e:
            import traceback
            error_msg = str(e)[:100]
            print(f"Error in BLIP-2 analysis: {error_msg}")
            if len(str(e)) > 100:
                print(f"Full error: {traceback.format_exc()}")
            return self._get_fallback_response()
    
    def analyze_scene(self, frame: np.ndarray) -> Dict:
        """
        Main method to analyze classroom scene.
        Routes to appropriate provider.
        
        Args:
            frame: OpenCV image array (BGR format)
            
        Returns:
            Dict with scene analysis
        """
        if self.provider == SceneAnalysisProvider.GPT4_VISION or self.provider == SceneAnalysisProvider.O3_MINI:
            return self.analyze_scene_gpt4(frame)
        elif self.provider == SceneAnalysisProvider.BLIP2_LOCAL:
            return self.analyze_scene_blip2(frame)
        elif self.provider == SceneAnalysisProvider.GEMINI_VISION:
            return self.analyze_scene_gemini(frame)
        else:
            return self._get_fallback_response()
    
    def analyze_scene_gemini(self, frame: np.ndarray) -> Dict:
        """
        Analyze classroom scene using Google Gemini Vision.
        
        Args:
            frame: OpenCV image array (BGR format)
            
        Returns:
            Dict with scene analysis
        """
        # Placeholder for Gemini implementation
        return self._get_fallback_response()
    
    def _classify_activity(self, caption: str, answers: List[str]) -> str:
        """Classify activity type from caption and answers."""
        text = (caption + " " + " ".join(answers)).lower()
        
        if any(word in text for word in ["discussing", "talking", "conversation", "group"]):
            return "group_discussion"
        elif any(word in text for word in ["writing", "notes", "notebook", "pen"]):
            return "note_taking"
        elif any(word in text for word in ["listening", "watching", "looking at"]):
            return "lecture_listening"
        elif any(word in text for word in ["hand", "raising", "question"]):
            return "raising_hand"
        elif any(word in text for word in ["phone", "distracted", "looking away"]):
            return "distracted"
        elif any(word in text for word in ["sleeping", "head down", "resting"]):
            return "sleeping"
        else:
            return "classroom_activity"
    
    def _estimate_engagement(self, caption: str, answers: List[str]) -> float:
        """Estimate engagement score from text."""
        text = (caption + " " + " ".join(answers)).lower()
        
        # High engagement keywords
        if any(word in text for word in ["engaged", "focused", "attentive", "participating", "active"]):
            return 0.9
        elif any(word in text for word in ["writing", "notes", "discussing"]):
            return 0.85
        elif any(word in text for word in ["listening", "watching"]):
            return 0.7
        elif any(word in text for word in ["distracted", "looking away", "bored"]):
            return 0.3
        elif any(word in text for word in ["sleeping", "asleep"]):
            return 0.1
        else:
            return 0.6
    
    def _score_to_level(self, score: float) -> str:
        """Convert engagement score to level."""
        if score >= 0.85:
            return "very_high"
        elif score >= 0.7:
            return "high"
        elif score >= 0.5:
            return "medium"
        elif score >= 0.3:
            return "low"
        else:
            return "very_low"
    
    def _get_recommendation(self, engagement_score: float) -> str:
        """Get teacher recommendation based on engagement."""
        if engagement_score >= 0.8:
            return "No intervention needed. Student is well engaged."
        elif engagement_score >= 0.6:
            return "Student is moderately engaged. Monitor progress."
        elif engagement_score >= 0.4:
            return "Consider checking in with student."
        else:
            return "Low engagement detected. Intervention recommended."
    
    def _get_fallback_response(self) -> Dict:
        """Return fallback response when AI analysis fails."""
        return {
            "scene_description": "Unable to analyze scene. Using fallback mode.",
            "activity": "unknown",
            "engagement_level": "medium",
            "engagement_score": 0.5,
            "student_count": 1,
            "behavioral_insights": ["Scene analysis unavailable"],
            "teacher_recommendation": "Manual observation recommended",
            "fallback": True
        }


# Singleton instance
_scene_service = None


def get_scene_service(provider: SceneAnalysisProvider = SceneAnalysisProvider.GPT4_VISION) -> ClassroomSceneService:
    """
    Returns a singleton instance of the scene service.
    
    Args:
        provider: Which AI provider to use
        
    Returns:
        ClassroomSceneService: Singleton service instance
    """
    global _scene_service
    if _scene_service is None:
        _scene_service = ClassroomSceneService(provider=provider)
    return _scene_service
