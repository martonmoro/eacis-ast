# 🏗️ EACIS Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                              │
│                     Browser (http://localhost:3000)                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      Dashboard.tsx                           │   │
│  │  - WebSocket Management                                      │   │
│  │  - State Management                                          │   │
│  │  - Component Orchestration                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                    │                    │                  │
│         ▼                    ▼                    ▼                  │
│  ┌──────────┐      ┌───────────────┐    ┌──────────────┐          │
│  │ Webcam   │      │   Emotion     │    │  Engagement  │          │
│  │  Feed    │      │   Display     │    │    Chart     │          │
│  │          │      │               │    │              │          │
│  │ - WebRTC │      │ - Current     │    │ - Recharts   │          │
│  │ - Capture│      │   Emotion     │    │ - Timeline   │          │
│  │ - Stream │      │ - Confidence  │    │ - Stats      │          │
│  └──────────┘      └───────────────┘    └──────────────┘          │
│         │                                                            │
│         │ Base64 Frame                                              │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              WebSocket Client (websocket.ts)                 │   │
│  │  - Connection Management                                     │   │
│  │  - Frame Sending                                             │   │
│  │  - Response Handling                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ WebSocket
                                  │ ws://localhost:8000/ws/emotion
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        main.py                               │   │
│  │  - FastAPI App                                               │   │
│  │  - CORS Middleware                                           │   │
│  │  - WebSocket Endpoint                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                  │                                   │
│                                  ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           WebSocket Handler (emotion_ws.py)                  │   │
│  │  - Accept Connections                                        │   │
│  │  - Receive Frames                                            │   │
│  │  - Process & Respond                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │            Frame Utils (frame_utils.py)                      │   │
│  │  - Decode Base64                                             │   │
│  │  - Resize Frame                                              │   │
│  │  - Validate Frame                                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │       Emotion Service (emotion_service.py)                   │   │
│  │  ┌───────────────────────────────────────────────────────┐  │   │
│  │  │      Image Preprocessing (Histogram Equalization)     │  │   │
│  │  └───────────────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────────────┐  │   │
│  │  │      MTCNN Face Detection                             │  │   │
│  │  │  - Multi-task cascaded CNN                            │  │   │
│  │  │  - Works well with diverse skin tones                 │  │   │
│  │  └───────────────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────────────┐  │   │
│  │  │      DeepFace Emotion Recognition                     │  │   │
│  │  │  - 7 emotion classification                           │  │   │
│  │  │  - Confidence scores                                  │  │   │
│  │  │  - 35% minimum threshold                              │  │   │
│  │  └───────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │        Emotion Mapping (emotion_mapping.py)                  │   │
│  │  - Map Emotion → Engagement Score                           │   │
│  │  - Normalize Emotion Names                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         │ JSON Response                                             │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Response: {emotion, confidence, engagement, timestamp}      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ WebSocket
                                  │
                                  ▼
                            Back to Frontend
```

## Data Flow Sequence

```
1. USER clicks "Start Camera"
   │
2. WebcamFeed captures video via WebRTC
   │
3. Canvas captures frame every 500ms
   │
4. Frame converted to Base64 JPEG
   │
5. WebSocket sends frame to backend
   │
6. Backend decodes Base64 → OpenCV image
   │
7. Frame resized to max 640px width
   │
8. DeepFace analyzes face for emotion
   │
9. Emotion mapped to engagement score
   │
10. JSON response sent via WebSocket
    │
11. Frontend receives response
    │
12. State updated (emotion, engagement)
    │
13. UI components re-render
    │
14. Chart updated with new data point
    │
    └─> Loop back to step 3
```

## Component Interaction Map

```
Frontend Components:
┌──────────────┐
│  Dashboard   │ ◄─── Main orchestrator
└──────┬───────┘
       │
       ├─────► WebcamFeed ──────► Captures video
       │                          Sends frames via WS
       │
       ├─────► EmotionDisplay ──► Shows current emotion
       │                          Confidence & engagement
       │
       └─────► EngagementChart ─► Visualizes data over time
                                  Statistics

Backend Modules:
┌──────────────┐
│    main.py   │ ◄─── FastAPI app entry
└──────┬───────┘
       │
       ├─────► emotion_ws.py ────► WebSocket handler
       │             │
       │             ├─────► frame_utils.py ───► Frame processing
       │             │
       │             ├─────► emotion_service.py ► DeepFace integration
       │             │
       │             └─────► emotion_mapping.py ► Engagement logic
       │
       └─────► CORS, Health endpoints
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  React Components + TailwindCSS + shadcn/ui                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  React Hooks + State Management + WebSocket Client          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   COMMUNICATION LAYER                        │
│  WebSocket (bidirectional, real-time)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│  FastAPI + Pydantic + WebSocket Handler                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│  Emotion Service + Frame Utils + Mapping Logic              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        AI/ML LAYER                           │
│  DeepFace + TensorFlow + OpenCV                             │
└─────────────────────────────────────────────────────────────┘
```

## Message Flow

### Client → Server

```json
{
  "frame": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Server → Client (Success)

```json
{
  "emotion": "happy",
  "confidence": 0.92,
  "engagement": 1.0,
  "timestamp": 1730707200
}
```

### Server → Client (Error)

```json
{
  "error": "No face detected",
  "timestamp": 1730707200
}
```

## Emotion Processing Pipeline

```
Raw Frame (Base64)
       │
       ▼
Decode to Binary
       │
       ▼
Convert to NumPy Array (OpenCV)
       │
       ▼
Resize (max 640px width)
       │
       ▼
Validate Frame
       │
       ▼
Preprocess Frame (Histogram Equalization)
       │
       ▼
MTCNN Face Detection
       │
       ▼
DeepFace Emotion Analysis
       │
       ├─── Face Detection (MTCNN)
       │
       └─── Emotion Recognition (DeepFace/TensorFlow)
              │
              ▼
Emotion Probabilities
       │
       ▼
Dominant Emotion + Confidence
       │
       ▼
Normalize Emotion Name
       │
       ▼
Map to Engagement Score
       │
       ▼
Filter by Confidence (>35%)
       │
       ▼
JSON Response
```

## Deployment Architecture

### Local Development (Current MVP)

```
┌──────────────────┐          ┌──────────────────┐
│   Frontend       │          │    Backend       │
│   localhost:3000 │ ◄─────► │  localhost:8000  │
│   (Vite Dev)     │  WS/HTTP │  (Uvicorn)       │
└──────────────────┘          └──────────────────┘
```

### Future Production (Suggested)

```
                    ┌──────────────┐
                    │  CDN/Static  │
                    │   Frontend   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
    ┌──────────────┐              ┌──────────────┐
    │  Backend #1  │              │  Backend #2  │
    │  (FastAPI)   │              │  (FastAPI)   │
    └──────────────┘              └──────────────┘
           │                               │
           └───────────────┬───────────────┘
                           ▼
                    ┌──────────────┐
                    │   Redis      │
                    │  (Session)   │
                    └──────────────┘
```

## Security Boundaries

```
┌─────────────────────────────────────────────────┐
│              BROWSER SECURITY                    │
│  - HTTPS enforcement                             │
│  - CSP headers                                   │
│  - Camera permissions                            │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│           NETWORK SECURITY                       │
│  - WebSocket wss:// (TLS)                       │
│  - CORS policy                                   │
│  - Rate limiting                                 │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│           APPLICATION SECURITY                   │
│  - Input validation                              │
│  - Error handling                                │
│  - No data persistence                           │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│              DATA SECURITY                       │
│  - In-memory only                                │
│  - No logging of frames                          │
│  - Privacy-first design                          │
└─────────────────────────────────────────────────┘
```

## Performance Optimization Points

1. **Frame Resizing** (640px max) - Reduces processing time
2. **Frame Rate** (2 FPS) - Balances responsiveness and CPU
3. **Histogram Equalization** - Improves detection accuracy
4. **MTCNN Detection** - Better accuracy for diverse skin tones
5. **Confidence Threshold** (35%) - Filters unreliable predictions
6. **Async/Await** - Non-blocking operations
7. **Model Caching** - DeepFace and MTCNN models loaded once
8. **WebSocket** - Persistent connection, no HTTP overhead
9. **Selective Re-renders** - React optimization

---

This architecture ensures:
- ✅ Real-time performance
- ✅ Privacy preservation
- ✅ Scalable design
- ✅ Error resilience
- ✅ Maintainable code
