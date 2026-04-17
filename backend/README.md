# EACIS Backend

FastAPI backend for the Emotional AI Classroom Insight System with AI-powered scene understanding.

## Features

- AI-powered classroom scene understanding
- Support for multiple AI providers (GPT-4 Vision, GPT-4o-mini, BLIP-2)
- Natural language activity descriptions
- WebSocket support for live streaming
- Optimized frame processing with OpenCV
- AI-driven engagement score calculation
- Privacy-first design (no image storage)

## Installation

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure AI provider (optional):
```bash
# For GPT-4 Vision
export OPENAI_API_KEY="your-api-key"
export SCENE_PROVIDER="gpt4_vision"  # or "gpt4o_mini"

# For BLIP-2 (default, free)
export SCENE_PROVIDER="blip2_local"
```

## Running

Start the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
app/
├── main.py                 # FastAPI app and endpoints
├── ws/
│   └── emotion_ws.py      # WebSocket handler
├── services/
│   └── scene_service.py   # AI scene understanding
└── utils/
    └── frame_utils.py     # Frame processing utilities
```

## Configuration

Edit `app/main.py` to change:
- Host/Port settings
- CORS origins
- WebSocket settings

Set environment variables:
- `OPENAI_API_KEY`: Required for GPT-4 Vision
- `SCENE_PROVIDER`: Choose AI provider (gpt4_vision, gpt4o_mini, blip2_local)
- `AI_SCENE_INTERVAL`: Analysis frequency (default: 5 frames)

## Notes

- First run with BLIP-2 will download model (~15GB)
- GPT-4 Vision requires API key and internet connection
- Models are cached appropriately per provider
- Requires Python 3.11+
