# Emotional AI Classroom Insight System (EACIS) - MVP

A real-time emotion detection and engagement tracking system for classroom environments.

## 🎯 Overview

EACIS uses AI-powered facial emotion recognition to monitor student engagement in real-time. The system captures webcam video, analyzes facial expressions, and provides live engagement metrics through an intuitive dashboard.

## ✨ Features

- **Real-time Emotion Detection**: Uses DeepFace AI with MTCNN face detection to detect 7 emotions (happy, sad, angry, surprise, fear, disgust, neutral)
- **Advanced Image Processing**: Histogram equalization for better detection across all skin tones
- **Engagement Scoring**: Automatically maps emotions to engagement levels with nuanced scoring
- **Live Dashboard**: Beautiful, responsive UI built with React and shadcn/ui
- **WebRTC Video Capture**: Direct browser-to-server video streaming
- **Privacy-First**: No images stored, all processing done in memory
- **Real-time Updates**: WebSocket connection for instant feedback
- **Confidence Filtering**: Only displays high-confidence predictions (>35%)

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + TailwindCSS
- **Charts**: Recharts
- **Video**: WebRTC API
- **Communication**: WebSocket

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **AI Model**: DeepFace (with TensorFlow)
- **Face Detection**: MTCNN (Multi-task Cascaded Convolutional Networks)
- **Computer Vision**: OpenCV with histogram equalization
- **Communication**: WebSocket
- **Async**: Python asyncio

## 📁 Project Structure

```
SOFT TECH 1/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── WebcamFeed.tsx   # Webcam capture component
│   │   │   ├── EmotionDisplay.tsx
│   │   │   └── EngagementChart.tsx
│   │   ├── pages/
│   │   │   └── Dashboard.tsx     # Main dashboard
│   │   ├── lib/
│   │   │   └── websocket.ts      # WebSocket client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── backend/
    ├── app/
    │   ├── main.py               # FastAPI application
    │   ├── ws/
    │   │   └── emotion_ws.py     # WebSocket handler
    │   ├── services/
    │   │   └── emotion_service.py # DeepFace integration
    │   └── utils/
    │       ├── frame_utils.py
    │       └── emotion_mapping.py
    └── requirements.txt
```

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **npm**: 9 or higher
- **Webcam**: Required for video capture

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd "backend"
   ```

2. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   ```

3. **Activate virtual environment**:
   ```bash
   # macOS/Linux
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the backend server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will start at `http://localhost:8000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory**:
   ```bash
   cd "frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:3000`

### Accessing the Application

1. Open your browser and go to `http://localhost:3000`
2. Click "Start Camera" to begin video capture
3. Position yourself in front of the camera
4. Watch real-time emotion detection and engagement tracking

## 📊 Emotion-to-Engagement Mapping

| Emotion  | Engagement Score | Interpretation |
|----------|------------------|----------------|
| Happy    | 1.0              | Highly engaged and positive |
| Surprise | 0.85             | Engaged and curious |
| Neutral  | 0.6              | Moderately engaged |
| Sad      | 0.4              | Low engagement |
| Angry    | 0.3              | Frustrated but trying |
| Fear     | 0.25             | Anxious or confused |
| Disgust  | 0.2              | Disengaged |

## 🔧 Configuration

### Backend Configuration

- **Host**: `0.0.0.0` (change in `app/main.py`)
- **Port**: `8000` (change in `app/main.py`)
- **Frame Size**: Max 640px width (change in `utils/frame_utils.py`)

### Frontend Configuration

- **WebSocket URL**: `ws://localhost:8000/ws/emotion` (change in `pages/Dashboard.tsx`)
- **Port**: `3000` (change in `vite.config.ts`)
- **Frame Capture Rate**: 500ms / 2 FPS (change in `components/WebcamFeed.tsx`)

## 🛠️ Development

### Running Tests

Backend:
```bash
cd backend
pytest
```

Frontend:
```bash
cd frontend
npm run test
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

## 🔒 Privacy & Security

- ✅ No images are stored on disk
- ✅ All processing happens in memory
- ✅ Raw frames are never logged
- ✅ CORS configured for local development
- ⚠️ For production, update CORS settings in `backend/app/main.py`

## 🐛 Troubleshooting

### Backend Issues

**AI model downloads**:
- First run will download AI models (~100-150MB total)
  - DeepFace emotion model (~100MB)
  - MTCNN face detection model (~5MB)
- Requires internet connection
- Models cached in `~/.deepface/` and `~/.mtcnn/`

**No face detected or low accuracy**:
- Ensure good lighting (front-facing light source)
- Face should be clearly visible and centered
- Check webcam angle (eye level is best)
- For darker skin tones: improve lighting, avoid dark backgrounds
- Try adjusting confidence threshold in `emotion_service.py`
- See `EMOTION_DETECTION_OPTIMIZATION.md` for detailed tips

### Frontend Issues

**Camera permission denied**:
- Check browser permissions
- Allow camera access when prompted
- Refresh page after granting permission

**WebSocket connection failed**:
- Ensure backend is running on port 8000
- Check firewall settings
- Verify WebSocket URL in Dashboard.tsx

## 📝 API Documentation

### WebSocket Endpoint

**URL**: `ws://localhost:8000/ws/emotion`

**Client sends**:
```json
{
  "frame": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Server responds**:
```json
{
  "emotion": "happy",
  "confidence": 0.92,
  "engagement": 1.0,
  "timestamp": 1730707200
}
```

### REST Endpoints

- `GET /` - Health check
- `GET /health` - Service health status

## 🤝 Contributing

This is an MVP project. Recent improvements:
- ✅ MTCNN face detection for better accuracy
- ✅ Histogram equalization for diverse skin tones
- ✅ Confidence threshold filtering
- ✅ Refined engagement scoring

Future enhancements could include:
- Multi-face detection (classroom mode)
- Session analytics and reports
- Historical data storage
- Real-time engagement alerts
- Teacher dashboard
- Mobile app

## 📄 License

This project is for educational purposes as part of MSc Software Technology coursework.

## 👥 Authors

Built for ELTE MSc Software Technology 1

---

**Note**: This MVP is designed for local development and testing. Additional security measures and optimizations are required for production deployment.
