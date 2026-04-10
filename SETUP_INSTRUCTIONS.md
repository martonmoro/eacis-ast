# 🚀 EACIS MVP - Quick Start Guide

Complete setup instructions for the Emotional AI Classroom Insight System.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Python 3.11+** installed (`python3 --version`)
- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **npm 9+** installed (`npm --version`)
- [ ] **Webcam** connected and functional
- [ ] **Internet connection** (for first-time model downloads)

## 🎯 Step-by-Step Setup

### Part 1: Backend Setup (5-10 minutes)

1. **Open Terminal and navigate to the project**:
   ```bash
   cd ~/Desktop/ELTE/msc/SOFT\ TECH\ 1
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Create Python virtual environment**:
   ```bash
   python3 -m venv venv
   ```

4. **Activate the virtual environment**:
   ```bash
   source venv/bin/activate
   ```
   
   You should see `(venv)` in your terminal prompt.

5. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   
   ⏳ This will take 2-5 minutes. It installs FastAPI, DeepFace, MTCNN, OpenCV, and other dependencies.

6. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   ✅ **Success indicators**:
   - You should see: `Application startup complete`
   - Server running at: `http://0.0.0.0:8000`
   - No error messages

   📝 **Note**: On first run, the system will download AI models depending on your provider:
   - **BLIP-2 Local** (default): ~15GB model download (one-time)
   - **GPT-4 Vision**: No download, requires API key
   
   This is normal and happens only once. Models are cached for future use.

7. **Configure AI Provider** (optional):
   ```bash
   # For GPT-4 Vision (requires API key)
   export OPENAI_API_KEY="your-api-key-here"
   export SCENE_PROVIDER="gpt4_vision"
   
   # For GPT-4o-mini (cheaper)
   export SCENE_PROVIDER="gpt4o_mini"
   
   # For BLIP-2 Local (default, free)
   export SCENE_PROVIDER="blip2_local"
   ```

8. **Verify backend is running**:
   
   Open a browser and visit: `http://localhost:8000`
   
   You should see:
   ```json
   {
     "status": "online",
     "service": "EACIS Backend",
     "version": "1.0.0"
   }
   ```

✅ **Backend is ready!** Keep this terminal window open.

---

### Part 2: Frontend Setup (3-5 minutes)

1. **Open a NEW terminal window** (keep backend running in the first one)

2. **Navigate to the project**:
   ```bash
   cd ~/Desktop/ELTE/msc/SOFT\ TECH\ 1
   ```

3. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

4. **Install Node.js dependencies**:
   ```bash
   npm install
   ```
   
   ⏳ This will take 1-3 minutes. It installs React, Vite, TailwindCSS, and other dependencies.

5. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

   ✅ **Success indicators**:
   - You should see: `VITE v5.x.x ready`
   - Local: `http://localhost:3000`
   - Press `h` for help

✅ **Frontend is ready!**

---

### Part 3: Using the Application

1. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

2. **You should see**:
   - The EACIS dashboard
   - "Start Camera" button
   - Connection status badge showing "Connected" (green)

3. **Start emotion detection**:
   - Click the **"Start Camera"** button
   - Grant camera permissions when prompted
   - Position your face in front of the camera
   - Ensure good lighting

4. **Watch the magic happen** ✨:
   - Your webcam feed appears in real-time
   - AI analyzes the scene every few frames
   - Natural language description of activity is displayed
   - Engagement score is calculated and shown
   - Behavioral insights are provided
   - Live chart tracks your engagement over time

## 🔍 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
**Solution**: Make sure virtual environment is activated:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Problem**: `Port 8000 already in use`
**Solution**: Stop any other process using port 8000, or change the port:
```bash
uvicorn app.main:app --reload --port 8001
```
Then update frontend WebSocket URL in `frontend/src/pages/Dashboard.tsx`.

**Problem**: Model downloads fail
**Solution**: 
- Check internet connection
- For BLIP-2: Ensure ~15GB free disk space
- For GPT-4 Vision: Verify OPENAI_API_KEY is set
- Try switching providers:
  ```bash
  export SCENE_PROVIDER="gpt4o_mini"  # Requires API key but no download
  ```
- Models stored in `~/.cache/huggingface/` (BLIP-2)

### Frontend Issues

**Problem**: `npm install` fails
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Camera permission denied
**Solution**:
- Check browser settings
- Enable camera access for localhost
- Try a different browser (Chrome recommended)

**Problem**: "Disconnected from server"
**Solution**:
- Ensure backend is running on port 8000
- Check WebSocket URL in `Dashboard.tsx`
- Look for CORS errors in browser console

### General Issues

**Problem**: Nothing happens when I start camera
**Solution**:
1. Check browser console for errors (F12)
2. Ensure backend shows incoming connections
3. Verify WebSocket is connected (green badge)
4. Check AI provider is configured
5. Look for AI processing messages in backend logs

**Problem**: Slow scene analysis
**Solution**:
- **BLIP-2**: Expected (~5-10 seconds per analysis)
  - Solution: Reduce analysis frequency or switch to GPT-4
- **GPT-4 Vision**: Should be fast (~2-3 seconds)
  - Check API key and internet connection
- Adjust analysis interval:
  ```bash
  export AI_SCENE_INTERVAL="10"  # Analyze every 10 frames instead of 5
  ```

## 📊 Expected Behavior

### Normal Operation

1. **Camera starts**: Black screen → Your video feed appears
2. **WebSocket connects**: Badge shows "Connected" (green)
3. **First analysis**: Takes 2-10 seconds (depending on AI provider)
4. **Scene descriptions**: Natural language descriptions appear
5. **Activity updates**: Classification shown (note_taking, discussion, etc.)
6. **Engagement tracking**: Score and insights update
7. **Chart grows**: New data points added continuously

### Performance

- **Frame processing**: Every 5 frames (configurable)
- **BLIP-2 analysis**: ~5-10 seconds per scene
- **GPT-4 Vision**: ~2-3 seconds per scene
- **UI updates**: Real-time (no lag)
- **Memory usage**: ~500MB-1GB (backend), ~100-200MB (frontend)
- **CPU usage**: Moderate during active analysis

## 🛑 Stopping the Application

### Stop Frontend
In the frontend terminal:
- Press `Ctrl + C`

### Stop Backend
In the backend terminal:
- Press `Ctrl + C`
- Deactivate virtual environment: `deactivate`

## 🔄 Restarting

### Backend
```bash
cd ~/Desktop/ELTE/msc/SOFT\ TECH\ 1/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd ~/Desktop/ELTE/msc/SOFT\ TECH\ 1/frontend
npm run dev
```

## 📈 Testing the System

### Basic Test Sequence

1. **Sit normally** → Should detect activity like "lecture_listening" or "neutral"
2. **Pretend to write** → Should detect "note_taking" with engaged description
3. **Look away from camera** → May detect "distracted" with lower engagement
4. **Lean forward attentively** → Should increase engagement score

### What to Look For

✅ **Good signs**:
- Scene descriptions change when you change activity
- Activity classification is accurate
- Engagement scores make sense
- Behavioral insights are relevant
- No connection errors

⚠️ **Warning signs**:
- No scene descriptions appearing → AI provider issue
- Very slow analysis → Check AI provider configuration
- Frequent disconnections → Backend/network issue
- Generic/fallback responses → API key or model loading issue

## 🎓 Next Steps

Now that your MVP is running:

1. **Test different lighting conditions**
2. **Try different facial expressions**
3. **Monitor engagement scores over time**
4. **Export or screenshot results**
5. **Review the code structure**

## 📞 Support

If you encounter issues:

1. Check the main README.md for detailed documentation
2. Review troubleshooting section above
3. Check browser console for frontend errors
4. Check terminal output for backend errors
5. Ensure all prerequisites are installed

## ✅ Success Checklist

Your system is working correctly if:

- [ ] Backend responds at `http://localhost:8000`
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Camera permission granted
- [ ] Webcam feed visible
- [ ] "Connected" badge is green
- [ ] Scene descriptions appear (may take 5-10 seconds)
- [ ] Activity classification updates
- [ ] Engagement score changes appropriately
- [ ] Behavioral insights are relevant
- [ ] Chart shows growing data points
- [ ] No errors in console or terminal

---

**Congratulations! Your EACIS MVP is now running! 🎉**

For detailed documentation, see the main [README.md](./README.md)
