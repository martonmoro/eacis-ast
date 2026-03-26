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
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI Classroom Insight System
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered scene analysis from webcam or uploaded video
            </p>
          </div>
          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className="flex items-center gap-2 px-4 py-2"
          >
            {isConnected ? (
              <>
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

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
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
            <div className="flex items-center justify-center bg-white rounded-lg border p-6">
              <p className="text-gray-500 text-center">
                Waiting for AI scene analysis...
                <br />
                <span className="text-sm">
                  Start the camera and ensure the classroom is visible.
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Engagement Chart - Full Width */}
        <EngagementChart data={engagementData} maxDataPoints={50} />
      </div>
    </div>
  );
};
