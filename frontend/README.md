# EACIS Frontend

React + TypeScript frontend for the Emotional AI Classroom Insight System.

## Features

- Real-time webcam capture with WebRTC
- Live emotion display with confidence scores
- Engagement tracking charts
- Beautiful UI with shadcn/ui and TailwindCSS
- WebSocket communication with backend
- Responsive design

## Installation

Install dependencies:
```bash
npm install
```

## Running

Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:3000`

## Building

Build for production:
```bash
npm run build
```

Output will be in `dist/` folder.

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── WebcamFeed.tsx       # Webcam capture
│   ├── EmotionDisplay.tsx   # Emotion visualization
│   └── EngagementChart.tsx  # Engagement chart
├── pages/
│   └── Dashboard.tsx        # Main dashboard
├── lib/
│   ├── websocket.ts         # WebSocket client
│   └── utils.ts             # Utility functions
├── App.tsx
└── main.tsx
```

## Configuration

Edit `src/pages/Dashboard.tsx` to change:
- WebSocket URL (default: `ws://localhost:8000/ws/emotion`)
- Frame capture rate
- Chart settings

## Notes

- Requires webcam access
- Backend must be running on port 8000
- Uses modern browser APIs (WebRTC, WebSocket)
