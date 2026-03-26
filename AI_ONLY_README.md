# 🤖 AI Classroom Insight System

**AI-powered classroom scene understanding with natural language insights**

---

## 🎯 What Changed

This system has been **completely refactored** to use AI-only analysis:

- ❌ **Removed**: Manual pose detection, emotion rules, activity mapping
- ✅ **Added**: Pure AI scene understanding with BLIP-2 or GPT-4 Vision
- 🎨 **Simplified**: Clean, modern UI focused on AI insights

---

## 🚀 Quick Start

### 1. Start Backend

```bash
cd backend
./start_ai.sh
```

**First time**: BLIP-2 model will download (~15GB, one-time)

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Open Browser

Visit: http://localhost:3000

---

## 🤖 AI Providers

### Option 1: BLIP-2 Local (Default, Free)

```bash
cd backend
./start_ai.sh
```

**Pros**:
- 100% free
- No API keys needed
- Runs locally

**Cons**:
- Slower (~5-10 seconds per frame)
- Less detailed insights
- Large model download (15GB)

### Option 2: GPT-4 Vision (Paid, Better)

```bash
export OPENAI_API_KEY="your-api-key-here"
export SCENE_PROVIDER="gpt4_vision"
cd backend
./start_ai.sh
```

**Pros**:
- Fast (~2-3 seconds)
- Detailed, accurate insights
- Small footprint

**Cons**:
- Requires OpenAI API key
- Costs ~$0.01 per frame

---

## 📊 What You Get

Every 5 frames, the AI analyzes the scene and provides:

1. **Scene Description**: Natural language description
   - "Student is actively taking notes during lecture, showing focused attention"
   
2. **Activity Classification**:
   - group_discussion, lecture_listening, note_taking, raising_hand, distracted, etc.

3. **Engagement Level**:
   - very_high, high, medium, low, very_low (0.0-1.0 score)

4. **Behavioral Insights**:
   - List of 2-3 specific observations
   - "Active learning behavior"
   - "Good attention management"

5. **Teacher Recommendation**:
   - "No intervention needed" or specific suggestions
   - "Low engagement detected. Intervention recommended."

---

## ⚙️ Configuration

### Change Analysis Frequency

```bash
export AI_SCENE_INTERVAL=10  # Analyze every 10 frames (default: 5)
```

### Switch Provider

```bash
export SCENE_PROVIDER="gpt4_vision"  # or "blip2_local"
```

---

## 🗂️ What Was Removed

These files are **no longer used**:

- `backend/app/services/emotion_service.py` - DeepFace emotion detection
- `backend/app/services/pose_service.py` - MediaPipe pose estimation
- `backend/app/utils/emotion_mapping.py` - Manual emotion rules
- `backend/app/utils/activity_mapping.py` - Manual activity rules
- `frontend/src/components/EmotionDisplay.tsx` - Old UI component

**You can safely delete these if you want.**

---

## 📁 New Architecture

### Backend

```
backend/
├── app/
│   ├── services/
│   │   └── scene_service.py       # AI scene analysis (BLIP-2/GPT-4)
│   ├── ws/
│   │   └── emotion_ws.py          # WebSocket handler (AI-only)
│   └── utils/
│       └── frame_utils.py         # Frame processing
└── start_ai.sh                    # Startup script
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   │   └── SceneAnalysisDisplay.tsx  # AI insights UI
│   ├── lib/
│   │   └── websocket.ts              # WebSocket client
│   └── pages/
│       └── Dashboard.tsx             # Main page
```

---

## 🔧 Troubleshooting

### Backend won't start

```bash
# Kill old processes
lsof -ti:8000 | xargs kill -9

# Restart
cd backend
./start_ai.sh
```

### BLIP-2 model won't load

**Issue**: Not enough disk space for 15GB model

**Solution**: Use GPT-4 Vision instead

```bash
export SCENE_PROVIDER="gpt4_vision"
export OPENAI_API_KEY="sk-..."
```

### Frontend shows "Waiting for AI scene analysis..."

1. Check backend is running: http://localhost:8000/health
2. Check WebSocket connection in browser console
3. Make sure camera is enabled

### AI analysis is too slow

**Option 1**: Increase interval

```bash
export AI_SCENE_INTERVAL=10  # Analyze less frequently
```

**Option 2**: Switch to GPT-4 Vision (much faster)

---

## 📸 Example Output

```json
{
  "scene_description": "Student is actively taking notes during lecture, showing focused attention and engagement with the material. Effective note-taking strategy observed.",
  "activity": "note_taking",
  "engagement_level": "high",
  "engagement": 0.85,
  "student_count": 1,
  "behavioral_insights": [
    "Active learning behavior",
    "Good attention management",
    "Sustained focus on task"
  ],
  "teacher_recommendation": "No intervention needed. Student is well engaged."
}
```

---

## 💡 Benefits of AI-Only

1. **Natural Language**: AI describes what it sees in human language
2. **Context-Aware**: Understands classroom context, not just poses
3. **Flexible**: Works with any classroom setup
4. **Maintainable**: No manual rule tuning needed
5. **Scalable**: Easy to add new providers

---

## 🎓 Next Steps

1. **Try both providers**: See which works better for your use case
2. **Adjust interval**: Find the right balance between speed and insight
3. **Customize prompts**: Edit `scene_service.py` to change what AI looks for
4. **Add more providers**: Implement Gemini Vision or Claude Vision

---

**Questions?** Check the code comments or run with debug logging.
