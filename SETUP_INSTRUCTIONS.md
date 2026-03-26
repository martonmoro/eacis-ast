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

   📝 **Note**: On first run, the system will download AI models (~100-150MB total):
   - DeepFace emotion model (~100MB)
   - MTCNN face detection model (~5MB)
   
   This is normal and happens only once. Models are cached for future use.

7. **Verify backend is running**:
   
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
   - Detected emotion is displayed with confidence score
   - Engagement score is calculated and shown
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
- Try again (downloads can be flaky)
- Manual download:
  ```bash
  python3 -c "from deepface import DeepFace; DeepFace.build_model('Emotion')"
  python3 -c "from mtcnn import MTCNN; MTCNN()"
  ```
- Models stored in `~/.deepface/` and `~/.mtcnn/`

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
4. Check if face is visible in camera

**Problem**: Low confidence scores or poor detection
**Solution**:
- **Lighting** (most important): Add front-facing light, avoid backlighting
- Face camera directly and center yourself in frame
- Remove obstructions (hair, hands, masks)
- Adjust camera to eye level
- For darker skin tones: Improve lighting, avoid dark backgrounds
- Hold expressions for 1-2 seconds
- See **EMOTION_DETECTION_OPTIMIZATION.md** for detailed guidance

## 📊 Expected Behavior

### Normal Operation

1. **Camera starts**: Black screen → Your video feed appears
2. **WebSocket connects**: Badge shows "Connected" (green)
3. **First detection**: Takes 2-3 seconds
4. **Continuous updates**: Every 500ms (2 times per second)
5. **Emotion changes**: Updates reflect in real-time
6. **Chart grows**: New data points added continuously

### Performance

- **Frame processing**: ~500ms per frame
- **UI updates**: Real-time (no lag)
- **Memory usage**: ~300-500MB (backend), ~100-200MB (frontend)
- **CPU usage**: Moderate during active detection

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

1. **Start with neutral face** → Should detect "neutral" (0.7 engagement)
2. **Smile widely** → Should detect "happy" (1.0 engagement)
3. **Look surprised** → Should detect "surprise" (0.9 engagement)
4. **Frown** → Should detect "sad" (0.3 engagement)

### What to Look For

✅ **Good signs**:
- Emotion changes when you change expression
- Confidence scores > 0.6
- Engagement chart shows variation
- No connection errors

⚠️ **Warning signs**:
- Always showing "neutral" → Lighting issue
- Very low confidence (< 0.3) → Face not detected properly
- Frequent disconnections → Backend/network issue

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
- [ ] Emotion detection updates in real-time
- [ ] Engagement score changes with expressions
- [ ] Chart shows growing data points
- [ ] No errors in console or terminal

---

**Congratulations! Your EACIS MVP is now running! 🎉**

For detailed documentation, see the main [README.md](./README.md)
