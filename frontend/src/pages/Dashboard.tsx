/**
 * Dashboard Page
 * Main page for AI-powered classroom scene analysis
 */

import { useState, useEffect, useCallback } from 'react';
import { VideoSource } from '@/components/VideoSource';
import { SceneAnalysisDisplay } from '@/components/SceneAnalysisDisplay';
import { EngagementChart } from '@/components/EngagementChart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  createEmotionWebSocket,
  EmotionWebSocket,
  SceneAnalysisResponse,
} from '@/lib/websocket';
import { AlertCircle, Wifi, WifiOff, Activity } from 'lucide-react';

interface DataPoint {
  timestamp: number;
  engagement: number;
  label: string;
}

export const Dashboard = () => {
  const [wsClient] = useState<EmotionWebSocket>(() =>
    createEmotionWebSocket('ws://localhost:8000/ws/emotion')
  );
  const [isConnected, setIsConnected] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<SceneAnalysisResponse | null>(
    null
  );
  const [engagementData, setEngagementData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Handle incoming scene analysis from WebSocket
   */
  const handleSceneData = useCallback((data: SceneAnalysisResponse) => {
    if (data.error) {
      setError(data.error);
      return;
    }

    console.log('Received Scene Analysis:', data);

    setError(null);
    setCurrentAnalysis(data);
    setLastUpdated(new Date());

    // Add to engagement data history (only for full analyses, not processing status)
    if (data.status !== 'processing') {
      setEngagementData((prev) => [
        ...prev,
        {
          timestamp: data.timestamp,
          engagement: data.engagement,
          label: data.engagement_level,
        },
      ]);
    }
  }, []);

  /**
   * Handle WebSocket errors
   */
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  /**
   * Handle connection status changes
   */
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    if (!connected) {
      setError('Disconnected from server. Attempting to reconnect...');
    } else {
      setError(null);
    }
  }, []);

  /**
   * Send captured frame to backend
   */
  const handleFrameCapture = useCallback(
    (frameData: string) => {
      wsClient.sendFrame(frameData);
    },
    [wsClient]
  );

  /**
   * Initialize WebSocket connection
   */
  useEffect(() => {
    // Register event handlers
    wsClient.onMessage(handleSceneData);
    wsClient.onError(handleError);
    wsClient.onConnectionChange(handleConnectionChange);

    // Connect to WebSocket
    wsClient.connect().catch((err) => {
      console.error('Failed to connect:', err);
      setError('Failed to connect to server. Please ensure the backend is running.');
    });

    // Cleanup on unmount
    return () => {
      wsClient.disconnect();
    };
  }, [wsClient, handleSceneData, handleError, handleConnectionChange]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                AI Classroom Insight System
              </h1>
              <p className="text-xs text-gray-500">
                {lastUpdated
                  ? `Last updated ${lastUpdated.toLocaleTimeString()}`
                  : 'AI-powered scene analysis from webcam or uploaded video'}
              </p>
            </div>
          </div>
          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-all duration-300 ${
              isConnected ? 'bg-emerald-500 hover:bg-emerald-600' : ''
            }`}
          >
            {isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <Wifi className="w-4 h-4" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Source */}
          <VideoSource
            onFrameCapture={handleFrameCapture}
            isConnected={isConnected}
          />

          {/* Scene Analysis Display */}
          {currentAnalysis && !currentAnalysis.error ? (
            <SceneAnalysisDisplay
              sceneDescription={currentAnalysis.scene_description}
              activity={currentAnalysis.activity}
              engagementLevel={currentAnalysis.engagement_level}
              engagement={currentAnalysis.engagement}
              studentCount={currentAnalysis.student_count}
              behavioralInsights={currentAnalysis.behavioral_insights}
              teacherRecommendation={currentAnalysis.teacher_recommendation}
              frameCount={currentAnalysis.frame_count}
              provider={currentAnalysis.provider}
              fallback={currentAnalysis.fallback}
              status={currentAnalysis.status}
              nextAnalysisIn={currentAnalysis.next_analysis_in}
            />
          ) : (
            <div className="flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-300 p-12 min-h-[300px]">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mb-2">
                  <Activity className="w-7 h-7 text-purple-400" />
                </div>
                <p className="text-gray-600 font-medium">Awaiting AI scene analysis</p>
                <p className="text-sm text-gray-400">
                  Start the camera and ensure the classroom is visible.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Engagement Chart - Full Width */}
        <EngagementChart data={engagementData} maxDataPoints={50} />
      </main>
    </div>
  );
};
