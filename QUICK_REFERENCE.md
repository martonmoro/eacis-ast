# 🎯 EACIS Quick Reference

## Start Application

### Terminal 1 - Backend
```bash
cd ~/Desktop/ELTE/msc/SOFT\ TECH\ 1/backend
source venv/bin/activate
# Optional: Configure AI provider
export OPENAI_API_KEY="your-key"  # For GPT-4 Vision
export SCENE_PROVIDER="gpt4o_mini"  # or "gpt4_vision" or "blip2_local"
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
- `backend/app/services/scene_service.py` - AI scene understanding
- `backend/app/utils/frame_utils.py` - Frame processing
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

## AI Scene Analysis

### Activities Detected
- **note_taking**: Student writing/taking notes
- **group_discussion**: Collaborative discussion
- **lecture_listening**: Attentive listening
- **raising_hand**: Asking questions
- **distracted**: Off-task behavior
- **independent_work**: Solo work

### Engagement Levels
- **very_high**: 0.85-1.0 (Highly engaged)
- **high**: 0.7-0.84 (Well engaged)
- **medium**: 0.5-0.69 (Moderately engaged)
- **low**: 0.3-0.49 (Low engagement)
- **very_low**: 0.0-0.29 (Disengaged)

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

### AI scene analysis not working
- Check AI provider configuration
- Verify OPENAI_API_KEY if using GPT-4
- Ensure sufficient disk space for BLIP-2 (~15GB)
- Check backend logs for errors
- See AI_ONLY_README.md for details

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
- GPT-4 Vision / GPT-4o-mini / BLIP-2
- OpenCV
- WebSocket
- Transformers (for BLIP-2)
- PyTorch (for BLIP-2)

## Ports
- Frontend: `3000`
- Backend: `8000`
- WebSocket: `ws://localhost:8000/ws/emotion`

## Documentation
- [Full README](./README.md)
- [Setup Guide](./SETUP_INSTRUCTIONS.md)
- [AI Scene Understanding](./AI_ONLY_README.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
