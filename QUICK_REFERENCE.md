# 🎯 EACIS Quick Reference

## Start Application

### Terminal 1 - Backend
```bash
cd ~/Desktop/ELTE/msc/SOFT\ TECH\ 1/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend
```bash
cd ~/Desktop/ELTE/msc/SOFT\ TECH\ 1/frontend
npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Stop Application
- Press `Ctrl + C` in both terminals

## Project Structure
```
SOFT TECH 1/
├── frontend/          # React + TypeScript UI
├── backend/           # FastAPI + DeepFace
├── README.md          # Full documentation
└── SETUP_INSTRUCTIONS.md  # Detailed setup guide
```

## Key Files

### Backend
- `backend/app/main.py` - FastAPI app
- `backend/app/ws/emotion_ws.py` - WebSocket handler
- `backend/app/services/emotion_service.py` - DeepFace integration
- `backend/requirements.txt` - Python dependencies

### Frontend
- `frontend/src/pages/Dashboard.tsx` - Main page
- `frontend/src/components/WebcamFeed.tsx` - Camera
- `frontend/src/components/EmotionDisplay.tsx` - Emotion UI
- `frontend/src/lib/websocket.ts` - WebSocket client
- `frontend/package.json` - Node dependencies

## Common Commands

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload

# Run on different port
uvicorn app.main:app --reload --port 8001
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Emotion Scores
- **happy**: 1.0 (highly engaged)
- **surprise**: 0.85 (engaged and curious)
- **neutral**: 0.6 (moderately engaged)
- **sad**: 0.4 (low engagement)
- **angry**: 0.3 (frustrated but trying)
- **fear**: 0.25 (anxious/confused)
- **disgust**: 0.2 (disengaged)

## Troubleshooting

### Backend not starting
```bash
# Check if port is in use
lsof -ti:8000

# Kill process on port
kill -9 $(lsof -ti:8000)
```

### Frontend not starting
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Camera not working
- Check browser permissions
- Try Chrome browser
- Ensure HTTPS or localhost

### Poor emotion detection
- Improve lighting (most important!)
- Center face in frame
- Hold expressions 1-2 seconds
- See EMOTION_DETECTION_OPTIMIZATION.md

## Tech Stack

**Frontend**
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Recharts
- WebRTC

**Backend**
- Python 3.11+
- FastAPI
- DeepFace
- MTCNN (face detection)
- OpenCV (with histogram equalization)
- WebSocket
- TensorFlow

## Ports
- Frontend: `3000`
- Backend: `8000`
- WebSocket: `ws://localhost:8000/ws/emotion`

## Documentation
- [Full README](./README.md)
- [Setup Guide](./SETUP_INSTRUCTIONS.md)
- [Optimization Guide](./EMOTION_DETECTION_OPTIMIZATION.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
