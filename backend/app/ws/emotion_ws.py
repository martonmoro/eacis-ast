"""
WebSocket endpoint for AI-powered classroom scene analysis.
Receives frames from frontend, analyzes with AI, and streams insights back.
"""

from fastapi import WebSocket, WebSocketDisconnect
import json
import time
import os

from ..services.scene_service import get_scene_service, SceneAnalysisProvider
from ..utils.frame_utils import decode_base64_frame, resize_frame, validate_frame


class EmotionWebSocketHandler:
    """Handles WebSocket connections for AI-powered scene analysis."""
    
    def __init__(self):
        """Initialize AI scene service."""
        # Choose AI provider: blip2_local (default, free) or gpt4_vision (requires API key)
        provider_name = os.getenv("SCENE_PROVIDER", SceneAnalysisProvider.GPT4O_MINI)
        provider = SceneAnalysisProvider(provider_name)
        
        self.scene_service = get_scene_service(provider=provider)
        print(f"🎯 AI Scene Understanding initialized with {provider_name}")
        
        self.active_connections: list[WebSocket] = []
        self.frame_count = 0
        # How often to analyze frames (every N frames)
        self.analysis_interval = int(os.getenv("AI_SCENE_INTERVAL", "5"))
    
    async def connect(self, websocket: WebSocket):
        """Accept and store new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")
    
    async def handle_connection(self, websocket: WebSocket):
        """
        Main WebSocket connection handler.
        Receives frames, analyzes with AI, and sends insights back.
        """
        await self.connect(websocket)
        
        try:
            while True:
                # Receive frame data from client
                data = await websocket.receive_text()
                
                try:
                    # Parse incoming message
                    message = json.loads(data)
                    frame_data = message.get("frame")
                    
                    if not frame_data:
                        await self.send_error(websocket, "No frame data received")
                        continue
                    
                    # Decode and validate frame
                    frame = decode_base64_frame(frame_data)
                    if frame is None or not validate_frame(frame):
                        await self.send_error(websocket, "Invalid frame data")
                        continue
                    
                    # Resize for faster processing
                    frame = resize_frame(frame, max_width=640)
                    
                    # Increment frame counter
                    self.frame_count += 1
                    
                    # Only analyze every N frames (AI can be slow)
                    if self.frame_count % self.analysis_interval != 0:
                        # Skip this frame - don't send anything
                        continue
                    
                    # Run AI scene analysis
                    print(f"🎯 Analyzing frame {self.frame_count} with AI...")
                    scene_analysis = self.scene_service.analyze_scene(frame)
                    
                    # Prepare response
                    response = {
                        # AI Scene Understanding
                        "scene_description": scene_analysis.get("scene_description", ""),
                        "activity": scene_analysis.get("activity", "unknown"),
                        "engagement_level": scene_analysis.get("engagement_level", "medium"),
                        "engagement": scene_analysis.get("engagement_score", 0.5),
                        "student_count": scene_analysis.get("student_count", 1),
                        "behavioral_insights": scene_analysis.get("behavioral_insights", []),
                        "teacher_recommendation": scene_analysis.get("teacher_recommendation", ""),
                        
                        # Metadata
                        "frame_count": self.frame_count,
                        "timestamp": int(time.time()),
                        "provider": str(self.scene_service.provider.value),
                        "fallback": scene_analysis.get("fallback", False)
                    }

                    print("Receipt ", response)

                    # Send response
                    await websocket.send_json(response)
                    print(f"✅ Sent AI analysis for frame {self.frame_count}")
                    
                except json.JSONDecodeError:
                    await self.send_error(websocket, "Invalid JSON format")
                except Exception as e:
                    import traceback
                    error_details = traceback.format_exc()
                    print(f"❌ Error processing frame: {str(e)}")
                    print(f"Full traceback:\n{error_details}")
                    await self.send_error(websocket, f"Processing error: {str(e)}")
        
        except WebSocketDisconnect:
            self.disconnect(websocket)
            print("Client disconnected")
        except Exception as e:
            print(f"WebSocket error: {str(e)}")
            self.disconnect(websocket)
    
    async def send_error(self, websocket: WebSocket, error_message: str):
        """Send error message to client."""
        try:
            await websocket.send_json({
                "error": error_message,
                "timestamp": int(time.time())
            })
        except Exception as e:
            print(f"Error sending error message: {e}")


# Singleton handler instance
_ws_handler = None


def get_ws_handler() -> EmotionWebSocketHandler:
    """Returns singleton WebSocket handler instance."""
    global _ws_handler
    if _ws_handler is None:
        _ws_handler = EmotionWebSocketHandler()
    return _ws_handler
