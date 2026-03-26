# EACIS Backend

FastAPI backend for the Emotional AI Classroom Insight System.

## Features

- Real-time emotion detection using DeepFace
- MTCNN face detection for better accuracy with diverse skin tones
- Image preprocessing with histogram equalization
- Confidence threshold filtering (35% minimum)
- WebSocket support for live streaming
- Optimized frame processing with OpenCV
- Nuanced engagement score calculation
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
│   └── emotion_service.py # DeepFace integration
└── utils/
    ├── frame_utils.py     # Frame processing utilities
    └── emotion_mapping.py # Emotion-to-engagement mapping
```

## Configuration

Edit `app/main.py` to change:
- Host/Port settings
- CORS origins
- WebSocket settings

## Notes

- First run will download AI models:
  - DeepFace emotion model (~100MB)
  - MTCNN face detection model (~5MB)
- Models are cached in `~/.deepface/` and `~/.mtcnn/`
- Requires Python 3.11+
- For optimization tips, see `../EMOTION_DETECTION_OPTIMIZATION.md`
